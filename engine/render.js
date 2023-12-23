class Camera {
    constructor(Speed, Position = new V, Rotation = new V) { Object.assign(this,
        {/*Locate*/P:Position,/*Rotate*/R:Rotation,/*Speed*/S:Speed,/*Direct*/D:new V(0,0,1),/*Plumb*/U:new V(0,1,0)})}}

function drawTrigonometry(f) { ct.fillStyle = f.rgba;
    if(debug) ct.strokeStyle = `rgba(255,0,255,255)`;
    else { ct.strokeStyle = f.rgba } ct.beginPath();
    ct.moveTo(((f.i.x + cw) / 2), ((f.i.y + ch) / 2));
    ct.lineTo(((f.j.x + cw) / 2), ((f.j.y + ch) / 2));
    ct.lineTo(((f.k.x + cw) / 2), ((f.k.y + ch) / 2));
    ct.lineTo(((f.i.x + cw) / 2), ((f.i.y + ch) / 2));
    ct.stroke(); ct.fill(); ct.closePath()}

function render(world) {
    var camT = new V(0,0,1);                                    // camT = Camera Target
        camM = rotate(new V(0,cam.R.y,0));                    // camM = Camera Matrix
        cam.D = matMulVec( camM, camT);                         // cam.D = Camera Direc
        camT = vecAddVec(cam.P, cam.D);
    const camP = quickInverse(pointCamera(cam.P, camT, cam.U)); // camP = Camera Position
    const camR = rotate(new V(cam.R.x, 0, 0));                  // camR = Camera Rotation
    const pCam = project(), faces = [];                         // pCam = Project Camera

    function camera(p) { return matMulVec(pCam, p) }
    function checkW(p) { if(p.w != 0) { return divVector(p,p.w)} }
    function shades(c,s,d) { return abs((c - s) * d + s) }
    function howFar(i,j,k) { return (sqrt(inProduct(i,i)) + sqrt(inProduct(j,j)) + sqrt(inProduct(k,k))) / 3 }
    function adjust(v) { return mMulV(camR, mMulV(camP,v))} }
    for(let obj of world) { const vt = [];
        for(let v of obj.V) { vt.push(objMat(v, obj))}
        for(let f of obj.F) {
            let i = vt[f.i], j = vt[f.j], k = vt[f.k];
            let normal = crossProd(vecSubVec(j, i), vecSubVec(k, i)); normal = normalize(normal);
            let id = vecSubVec(i, cam.P);
            if(inProduct(normal, id) < 0) {
                var tempF = Object.assign(f, {i:adjust(i), j:adjust(j), k:adjust(k), t:f.t});
                var d = howFar(id, vecSubVec(j,cam.P), vecSubVec(k,cam.P));
                if(d < 100) prc = 8; else prc = 0;
                ({i,j,k} = adjust(i,j,k));
                let cl = [], rs = clip(new V(0,0,near),new V(0,0,1), tempF);
                cl[0] = rs.t1; cl[1] = rs.t2;
                for(var n = 0; n < rs.n; n++) {
                    var dp = inProduct(normal, light);
                    let [r,g,b,a] = f.rgba.slice(5, -1).split(',').map(Number);
                    cl[n] = Object.assign(cl[n], { rgba:`rgba(${shades(r,0,dp)},${shades(g,0,dp)},${shades(b,0,dp)},${a})`,
                        i:checkW(camera(cl[n].i)), j:checkW(camera(cl[n].j)), k:checkW(camera(cl[n].k)), d:d, t:f.t});
                    faces.push(cl[n])}}}}
    faces.sort((b, a) => a.d - b.d);
    for(let f of faces) {
        const h = ch - 1, w = cw - 1;
        const rasterFace = f; var num = 1;
        const clips = [], rasterTrig = []; rasterTrig.push(rasterFace);
        for (var p = 0; p < 4; p++) {
            if(num > 0) { num--; var rs = {};
                var test = rasterTrig[rasterTrig.length - 1];
                switch(p) {
                    case 0: rs = clip(new V( 0,-h, 0), new V( 0, 1, 0), test); break;
                    case 1: rs = clip(new V( 0, h, 0), new V( 0,-1, 0), test); break;
                    case 2: rs = clip(new V(-w, 0, 0), new V( 1, 0, 0), test); break;
                    case 3: rs = clip(new V( w, 0, 0), new V(-1, 0, 0), test); break;
                }
                clips[0] = rs.t1; clips[1] = rs.t2;
                for(let n = 0; n < rs.n; n++) { rasterTrig.push(clips[n]); }
            }
            num = rasterTrig.length;
        }
        for(let f of rasterTrig) { drawTrigonometry(f)}}