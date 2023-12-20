var near = 0.1, far = 1000, fov = 90, ratio = cw / ch, debug = false, prc = 0;

class Camera {constructor( Movement, Position = new V, Rotation = new V) {
    Object.assign(this, {/*Position*/P:Position,/*Rotation*/R:Rotation,
    /*Movement*/M:Movement,/*Direction*/Direction:new V(0,0,1),/*Plumb*/U:new V(0,1,0)}); }}

function drawTrigonometry(f) {
    ct.fillStyle = f.rgba; ct.strokeStyle = f.rgba;
    if(debug) ct.strokeStyle = 'pink';
    ct.beginPath();
    ct.moveTo(((f.a.x + cw) / 2), ((f.a.y + ch) / 2));
    ct.lineTo(((f.b.x + cw) / 2), ((f.b.y + ch) / 2));
    ct.lineTo(((f.c.x + cw) / 2), ((f.c.y + ch) / 2));
    ct.lineTo(((f.a.x + cw) / 2), ((f.a.y + ch) / 2));
    ct.stroke(); ct.fill(); ct.closePath();
}

function render(world) {
    var cameraTarget = new V(0, 0, 1),
        cameraMatrix = rotate(new V(0, cam.R.y, 0));
        cam.D = matMulVec( cameraMatrix, cameraTarget);
        cameraTarget = vecAddVec(cam.P, cam.D);
    const cameraLocate = quickInverse(pointCamera( cam.P, cameraTarget, cam.U));
    const cameraRotate = rotate(new V(cam.R.x, 0, 0));
    const pane = project(), faces = [];
    for(let obj of world) {
        const vectors = [];
        const rotated = rotate(obj.R);
        for(let vertex of obj.V) {
            const scaledVertex = vecMulVec( vertex, obj.S);
            const rotateVertex = matMulVec( rotated, scaledVertex);
            const offsetVertex = vecAddVec( rotateVertex, obj.P);
            vectors.push(offsetVertex); }
        for(let face of obj.F) {
            let a = vectors[face.a], b = vectors[face.b], c = vectors[face.c];
            let ad = vecSubVec(a, cam.P), bd = vecSubVec(b, cam.P), cd = vecSubVec(c, cam.P);
            let d = (sqrt(inProduct(ad, ad)) + sqrt(inProduct(bd, bd)) + sqrt(inProduct(cd, cd))) / 3;
            let normal = crossProd( vecSubVec(b, a), vecSubVec(c, a));
                normal = normalize(normal);
            let nl = inProduct(normal, ad);
            if(d < 100) prc=8; else prc=0;
            if(nl < 0) {
                a = matMulVec( cameraLocate, a), b = matMulVec( cameraLocate, b), c = matMulVec( cameraLocate, c);
                a = matMulVec( cameraRotate, a), b = matMulVec( cameraRotate, b), c = matMulVec( cameraRotate, c);
                let cl = [],
                result = clip(new V( 0, 0, near),new V( 0, 0, 1), a, b, c);
                cl[0] = result.t1; cl[1] = result.t2;
                for(var i = 0; i < result.n; i++) {
                    var dp = fx(inProduct( normal, light));
                    var [red,grn,blu,opc] = [face.r,face.g,face.bl,face.o];
                    red = fx(abs((red - 20) * dp + 20), 0);
                    grn = fx(abs((grn - 50) * dp + 50), 0);
                    blu = fx(abs((blu - 50) * dp + 50), 0);
                    a = matMulVec(pane, cl[i].a),
                    b = matMulVec(pane, cl[i].b),
                    c = matMulVec(pane, cl[i].c);
                    if(a.w != 0) { a = divVector(a,a.w); }
                    if(b.w != 0) { b = divVector(b,b.w); }
                    if(c.w != 0) { c = divVector(c,c.w); }
                    faces.push(new Face(a,b,c,d,`rgb(${red}, ${grn}, ${blu}, ${opc})`));
                }
            }
        }
    }
    faces.sort((a, b) => b.d - a.d);
    const rasterTrig = [], h = ch - 1, w = cw - 1;
    for(let f of faces) {
        for (var p = 0; p < 4; p++) { let r = {}, c = [];
			switch(p) {
                case 0: r = clip(new V(), new V( 0, 1, 0), f.a, f.b, f.c); break;
                case 1:	r = clip(new V(), new V( 1, 0, 0), f.a, f.b, f.c); break;
                case 2:	r = clip(new V(0,h,0), new V( 0,-1, 0), f.a, f.b, f.c); break;
                case 3:	r = clip(new V(w,0,0), new V(-1, 0, 0), f.a, f.b, f.c); break;
            }
            c[0] = r.t1; c[0].d = f.d; c[0].rgba = f.rgba;
            c[1] = r.t2; c[1].d = f.d; c[1].rgba = f.rgba;
            for(let i = 0; i < r.n; i++) { rasterTrig.push(c[i]); }
        }
    }
    for(let f of rasterTrig) { drawTrigonometry(f); }
}