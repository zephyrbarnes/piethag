import * as o from './output.js';

export default function render(world, camera, light) {
    function drawTrigonometry(face) {
        if(face.I) {
            if(face.j.y < face.i.y) { swap(face.i, face.j); swap(face.t[0], face.t[1])}
            if(face.k.y < face.i.y) { swap(face.i, face.k); swap(face.t[0], face.t[2])}
            if(face.k.y < face.j.y) { swap(face.j, face.k); swap(face.t[1], face.t[2])}
        } else {
            ctx.fillStyle = face.rgba;
            if(debug) ctx.strokeStyle = `rgba(255,0,255,255)`;
            else ctx.strokeStyle = face.rgba;
            ctx.beginPath();
            ctx.moveTo(((face.i.x + cw) / 2), ((face.i.y + ch) / 2));
            ctx.lineTo(((face.j.x + cw) / 2), ((face.j.y + ch) / 2));
            ctx.lineTo(((face.k.x + cw) / 2), ((face.k.y + ch) / 2));
            ctx.lineTo(((face.i.x + cw) / 2), ((face.i.y + ch) / 2));
            ctx.stroke(); ctx.fill(); ctx.closePath()
        }
    }

    function swap(a, b) { var temp = a; a = b; b = temp; }

    var cameraTarget = new V(0, 0, 1);
    var cameraMatrix = o.rotate(new V(0, camera.R.y, 0));
    camera.Direction = matMulVec(cameraMatrix, cameraTarget); 
    cameraTarget = vecAddVec(camera.P, camera.Direction);

    const cameraPosition = o.quickInverse(o.pointCamera(camera.P, cameraTarget, camera.U));
    const cameraRotation = o.rotate(new V(camera.R.x, 0, 0));
    const cameraProjection = o.project();
    const faces = [];

    function project(p) { return matMulVec(cameraProjection, p) }
    function checkW(p) { if(p.w != 0) { return divVector(p,p.w)} }
    function shades(c,s,d) { return abs((c - s) * d + s) }
    function howFar(i,j,k) { return (sqrt(inProduct(i,i)) + sqrt(inProduct(j,j)) + sqrt(inProduct(k,k))) / 3 }
    function adjust(v) { return mMulV(cameraRotation, mMulV(cameraPosition,v))}
    for(let object of world) { const vertexes = [];
        for(let vertex of object.V) { vertexes.push(o.objMat(vertex, object))}
        for(let face of object.F) {
            let i = vertexes[face.i], j = vertexes[face.j], k = vertexes[face.k];
            let normal = crossProd(vecSubVec(j, i), vecSubVec(k, i)); normal = normalize(normal);
            let iDistance = vecSubVec(i, camera.P);
            if(inProduct(normal, iDistance) < 0) {
                var tempFace = Object.assign(new F(), {i:adjust(i), j:adjust(j), k:adjust(k), t:face.t});
                var distance = howFar(iDistance, vecSubVec(j,camera.P), vecSubVec(k,camera.P));
                var cl = [];
                var result = o.clip(new V(0, 0, near), new V(0, 0, 1), tempFace);
                cl[0] = result.t1;
                cl[1] = result.t2;
                ({i, j, k} = adjust(i, j, k));
                for(var n = 0; n < result.n; n++) {
                    var dp = inProduct(normal, light);
                    let [r,g,b,a] = face.rgba.slice(5, -1).split(',').map(Number);
                    cl[n] = Object.assign(cl[n],
                        { rgba:`rgba(${shades(r, 0, dp)}, ${shades(g, 0, dp)}, ${shades(b, 0, dp)},${a})`,
                        i:checkW(project(cl[n].i)),
                        j:checkW(project(cl[n].j)),
                        k:checkW(project(cl[n].k)),
                        image: object.I,
                        d:distance, tx:face.tx});
                    faces.push(cl[n])
                }
            }
        }
    }
    faces.sort((b, a) => a.d - b.d);
    for(let face of faces) {
        const rasterFace = face;
        var num = 1;
        const clips = [];
        const resterizing = []; resterizing.push(rasterFace);
        for (var p = 0; p < 4; p++) {
            if(num > 0) {
                num--;
                var result = {};
                var clipFace = resterizing[resterizing.length - 1];
                switch(p) {
                    case 0: result = o.clip(new V( 0,-(ch - 1), 0), new V( 0, 1, 0), clipFace); break;
                    case 1: result = o.clip(new V( 0, (ch - 1), 0), new V( 0,-1, 0), clipFace); break;
                    case 2: result = o.clip(new V(-(cw - 1), 0, 0), new V( 1, 0, 0), clipFace); break;
                    case 3: result = o.clip(new V( (cw - 1), 0, 0), new V(-1, 0, 0), clipFace); break;
                }
                clips[0] = result.t1;
                clips[1] = result.t2;
                for(let n = 0; n < result.n; n++) { resterizing.push(clips[n]); }
            }
            num = resterizing.length;
        }
        for(let face of resterizing) { drawTrigonometry(face) }
    }
}