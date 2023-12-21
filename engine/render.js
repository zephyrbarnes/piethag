var near = 1, far = 1000, fov = 120, ratio = cw / ch, debug = false, prc = 0;

class Camera {
    constructor( Movement, Position = new V, Rotation = new V) { Object.assign(this,
        {/*Position*/P:Position,/*Rotation*/R:Rotation,/*Movement*/M:Movement,
         /*Direction*/ Direction:new V(0,0,1), /*Plumb*/ U:new V(0,1,0)}); }}

function drawTrigonometry(f) {
    ct.fillStyle = f.rgba;
    if(debug) ct.strokeStyle = `rgba(255, 0, 255, 255)`; else ct.strokeStyle = f.rgba;
    ct.beginPath();
    ct.moveTo(((f.a.x + cw) / 2), ((f.a.y + ch) / 2));
    ct.lineTo(((f.b.x + cw) / 2), ((f.b.y + ch) / 2));
    ct.lineTo(((f.c.x + cw) / 2), ((f.c.y + ch) / 2));
    ct.lineTo(((f.a.x + cw) / 2), ((f.a.y + ch) / 2));
    ct.stroke(); ct.fill(); ct.closePath();}

function render(world) {
    var camT = new V(0, 0, 1),                                  // camT = Camera Target
        camM = rotate(new V(0, cam.R.y, 0));                    // camM = Camera Matrix
        cam.D = matMulVec( camM, camT);                         // cam.D = Camera Direction
        camT = vecAddVec(cam.P, cam.D);
    const camP = quickInverse(pointCamera(cam.P, camT, cam.U)); // camP = Camera Position
    const camR = rotate(new V(cam.R.x, 0, 0));                  // camR = Camera Rotation
    const pCam = project(), faces = [];                         // pCam = Project Camera

    function camera(p) { return matMulVec(pCam, p)}
    function checkW(p) { if(p.w != 0) { return divVector(p,p.w)}}
    function shades(c,s,d) { return abs((c - s) * d + s)}
    function objMat(v, o) { return vecAddVec(matMulVec(rotate(o.R), vecMulVec(v, o.S)), o.P)} // Scales, Rotates, and Positions
    function howFar(a,b,c) { return (sqrt(inProduct(a, a)) + sqrt(inProduct(b, b)) + sqrt(inProduct(c, c))) / 3}
    function adjust(a,b,c) { return {a:mMulV(camR, mMulV(camP, a)), b:mMulV(camR, mMulV(camP, b)), c:mMulV(camR, mMulV(camP, c))}}
    for(let obj of world) {
        const vectors = [];
        for(let vertex of obj.V) { vectors.push(objMat(vertex, obj))}
        for(let f of obj.F) {
            let a = vectors[f.a], b = vectors[f.b], c = vectors[f.c];
            let normal = crossProd(vecSubVec(b, a), vecSubVec(c, a)); normal = normalize(normal);
            let ad = vecSubVec(a, cam.P), bd = vecSubVec(b, cam.P), cd = vecSubVec(c, cam.P);
            if(inProduct(normal, ad) < 0) {
                ({a, b, c} = adjust(a, b, c));
                let d = howFar(ad, bd, cd);
                if(d < 100) prc = 8; else prc = 0;
                let cl = [], result = clip(new V(0,0, near),new V(0,0,1), new F(a,b,c));
                cl[0] = result.t1; cl[1] = result.t2;
                for(var n = 0; n < result.n; n++) {
                    var dp = inProduct(normal, light);
                    let [rd, gr, bl, ap] = f.rgba.slice(5, -1).split(',').map(Number);
                    faces.push(new F(
                        checkW(camera(cl[n].a)), checkW(camera(cl[n].b)), checkW(camera(cl[n].c)),
                        shades(rd, 0, dp), shades(gr, 0, dp), shades(bl, 0, dp), ap, d))}}}}
    faces.sort((a, b) => b.d - a.d);
    for(let f of faces) {
        const h = ch - 1, w = cw - 1;
        const rasterFace = f; var num = 1;
        const clips = [], rasterTrig = []; rasterTrig.push(rasterFace);
        for (var p = 0; p < 4; p++) {
            if(num > 0) { num--;
                var result = {};
                var test = rasterTrig[rasterTrig.length - 1];
                switch(p) {
                    case 0: result = clip(new V( 0,-h, 0), new V( 0, 1, 0), test); break;
                    case 1: result = clip(new V( 0, h, 0), new V( 0,-1, 0), test); break;
                    case 2: result = clip(new V(-w, 0, 0), new V( 1, 0, 0), test); break;
                    case 3: result = clip(new V( w, 0, 0), new V(-1, 0, 0), test); break;
                }
                clips[0] = result.t1; clips[1] = result.t2;
                for(let n = 0; n < result.n; n++) { rasterTrig.push(clips[n]); }
            }
            num = rasterTrig.length;
        }
        for(let f of rasterTrig) { drawTrigonometry(f); }}}