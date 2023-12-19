var near = 0.1, far = 1000, fov = 90, ratio = cw / ch, debug = false, prc = 0;

class V { constructor( x = 0, y = 0, z = 0, w = 1) { Object.assign( this, {x:x, y:y, z:z, w:w})}}
class F { constructor( a, b, c, r = 0, g = 150, bl = 255, o = 255) { Object.assign( this, {a:a, b:b, c:c, r:r, g:g, bl:bl, o:o})}}
class Face { constructor( a, b, c, d, rgba) { Object.assign( this, {a:a, b:b, c:c, d:d, rgba:rgba})}}

class Cube { constructor( P = new V, R = new V, S = V( 1, 1, 1)) { prc = 1;
    Object.assign( this, {/*Position*/P:P,/*Rotation*/R:R,/*Scale*/S:S, V:[ // Vertex Array
    new V(-1,-1,-1), new V(-1, 1,-1), new V( 1, 1,-1), new V( 1,-1,-1),
    new V( 1, 1, 1), new V( 1,-1, 1), new V(-1, 1, 1), new V(-1,-1, 1)], F:[  // Face Array
    new F( 0, 1, 2), new F( 0, 2, 3), /*SOUTH*/ new F( 4, 3, 2), new F( 3, 4, 5), /*EASTS*/
    new F( 5, 4, 6), new F( 5, 6, 7), /*NORTH*/ new F( 7, 6, 1), new F( 7, 1, 0), /*WESTS*/
    new F( 1, 6, 4), new F( 1, 4, 2), /*ABOVE*/ new F( 5, 7, 0), new F( 5, 0, 3)] /*BELOW*/
}); world.push(this)}}

class Mesh { constructor(path, P = new V, R = new V, S = new V( 1, 1, 1)) { prc = 3;
    Object.assign(this, {/*Position*/P:P,/*Rotation*/R:R,/*Scale*/S:S,/*Vector Array*/V:[],/*Faces*/F:[]});
    loadTexts(path).then( txt => { if (txt !== null) { var lines = txt.split("\n");
    for(var line of lines) { var s = line.split(" "); /*String*/
        if(s[0] == "f") this.F.push(new F((pf(s[1])-1), (pf(s[2])-1), (pf(s[3])-1))); /*Fill Face Array*/
        else if(s[0] == "v") this.V.push(new V(pf(s[1]), pf(s[2]), pf(s[3])));     /*Fill Vector Array*/
}}}); world.push(this)}}

class IcoSphere {constructor( P = new V, R = new V, S = new V(1,1,1), I = 0) { var t = (1 + sqrt(5)) / 2; prc = 2;
    Object.assign( this, {/*Position*/P:P,/*Rotation*/R:R,/*Scale*/S:S,/*Iterations*/I:I, /*Fill Vector Array*/
    V: [nrml(new V(-1, t, 0)), nrml(new V( 1, t, 0)), nrml(new V(-1,-t, 0)), nrml(new V( 1,-t, 0)),
        nrml(new V( 0,-1, t)), nrml(new V( 0, 1, t)), nrml(new V( 0,-1,-t)), nrml(new V( 0, 1,-t)),
        nrml(new V( t, 0,-1)), nrml(new V( t, 0, 1)), nrml(new V(-t, 0,-1)), nrml(new V(-t, 0, 1))],
    F: [new F( 0,11, 5), new F( 0, 5, 1), new F( 0, 1, 7), new F( 0, 7,10), new F( 0,10,11),/*Fill Face Array*/
        new F( 1, 5, 9), new F( 5,11, 4), new F(11,10, 2), new F(10, 7, 6), new F( 7, 1, 8),
        new F( 3, 9, 4), new F( 3, 4, 2), new F( 3, 2, 6), new F( 3, 6, 8), new F( 3, 8, 9),
        new F( 4, 9, 5), new F( 2, 4,11), new F( 6, 2,10), new F( 8, 6, 7), new F( 9, 8, 1)]});
    this.Tesselate(); world.push(this)}

    midFace(f) { return new F(this.middle(f.a, f.b), this.middle(f.b, f.c), this.middle(f.c, f.a)); }

    middle( v1, v2) {
        var v = middlePnt(this.V[v1], this.V[v2]);
        var i = this.V.findIndex(vertex => vertex.x == v.x && vertex.y == v.y && vertex.z == v.z);
        if (i == -1) return this.V.push(normalize(v)) - 1; else return i;
    }

    Tesselate() {
        for (var i = 0; i < this.I; i++) { var tempFace = [];
            for(let f of this.F) { // replace triangle by 4 triangles
                var t = this.midFace(f);
                tempFace.push(new F(f.a, t.a, t.c));
                tempFace.push(new F(f.b, t.b, t.a));
                tempFace.push(new F(f.c, t.c, t.b));
                tempFace.push(new F(t.a, t.b, t.c));
            }
            this.F = tempFace;
        }
    }
}

class Camera {constructor( M, P = new V, R = new V) { Object.assign(this, {/*Position*/P:P,/*Rotation*/R:R,/*Movement*/M:M,/*Direction*/D:new V(0,0,1),/*Plumb*/U:new V(0,1,0)}); }}

function rotate(v) { const [x,y,z] = [(v.x*dg), (v.y*dg), (v.z*dg)], m = new IM,
    [cx, cy, cz, sx, sy, sz] = [cos(x), cos(y), cos(z), sin(x), sin(y), sin(z)],
    [ cxz, ces, sec, szx] = [ cx * cz, sz * cx, cz * sx, sz * sx];
    m[0][0] = fx(cz*cy); m[0][1] = fx(sec*sy - ces); m[0][2] = fx(szx + cxz*sy);//m[0][3] = 0
    m[1][0] = fx(sz*cy); m[1][1] = fx(cxz + szx*sy); m[1][2] = fx(ces*sy - sec);//m[1][3] = 0
    m[2][0] = fx(-sy);   m[2][1] = fx(cy * sx);      m[2][2] = fx(cy * cx);     /*m[2][3] = 0
    m[3][0] = 0          m[3][1] = 0                 m[3][2] = 0                  m[3][3] = 1
    */ return m; }

function project() {
    const radians = 1 / tan((fov * dg) / (180 * pi)), m = new EM,
        pry = fx(radians*ratio*ch/100), prz = fx(far/(far - near)),
        nid = fx(-near * prz);
    m[0][0] = pry;/*m[0][1] = 0     m[0][2] = 0     m[0][3] = 0
    m[1][0] = 0   */m[1][1] = pry;/*m[1][2] = 0     m[1][3] = 0
    m[2][0] = 0     m[2][1] = 0   */m[2][2] = prz;  m[2][3] = 1;/*
    m[3][0] = 0     m[3][1] = 0   */m[3][2] = nid;/*m[3][3] = 0*/
    return m; }

function pointCamera( position, target, plumb) { const
    p = position, t = target, u = plumb, m = new IM,
    fd = normalize(vecSubVec( t, p)),                                // Forward dir
    ud = normalize(vecSubVec( u, mulVector( fd, inProduct( u, fd)))),// Upward dir
    rd = crossProd( ud, fd);                                         // Right dir
    m[0][0] = fx(rd.x); m[0][1] = fx(rd.y); m[0][2] = fx(rd.z); // m[0][3] = 0
    m[1][0] = fx(ud.x); m[1][1] = fx(ud.y); m[1][2] = fx(ud.z); // m[1][3] = 0
    m[2][0] = fx(fd.x); m[2][1] = fx(fd.y); m[2][2] = fx(fd.z); // m[2][3] = 0
    m[3][0] = fx( p.x); m[3][1] = fx( p.y); m[3][2] = fx( p.z); // m[3][3] = 1
    return m; }

function intersect( plane_p, plane_n, sttLine, endLine) {
    var pn = normalize(plane_n), pp = plane_p, pd = inProduct( pn, pp), // Plane normal, point, dist
        ad = inProduct( sttLine, pn), bd = inProduct( endLine, pn), // Directions
        t = (pd - ad) / (bd - ad);
        endLine = vecSubVec( endLine, sttLine);
    var lineSect = mulVector( endLine, t);
    return vecAddVec( sttLine, lineSect)}
const sect = intersect;

function clippings( plane_p, plane_n, a, b, c) {
    var pn = normalize(plane_n), pp = plane_p,
        result = { n:1, t1: new F(), t2: new F() };
    function dist(p) { return ((pn.x*p.x) + (pn.y*p.y) + (pn.z*p.z) - inProduct(pn, pp))}
    var ad = dist(a), bd = dist(b), cd = dist(c),
        iP = [], oP = [], iN = 0, oN = 0;
    if(ad >= 0) iP[iN++] = a; else oP[oN++] = a;
    if(bd >= 0) iP[iN++] = b; else oP[oN++] = b;
    if(cd >= 0) iP[iN++] = c; else oP[oN++] = c;
    if(iN == 1 && oN == 2) {
        result.t1 = new F( iP[0], sect( pp, pn, iP[0], oP[0]), sect( pp, pn, iP[0], oP[1])); return result}
    if(iN == 2 && oN == 1) { result.n = 2;
        result.t1 = new F( iP[0], iP[1], sect( pp, pn, iP[0], oP[0]));
        result.t2 = new F( iP[1], result.t1.c, sect( pp, pn, iP[1], oP[0])); return result}
    if(iN == 3) { result.t1 = new F(a,b,c); return result}
    if(iN == 0) { result.n = 0; return result}}

function quickInverse(m) { var r = new IM;
    for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) { r[i][j] = m[j][i]}}
    r[3][0] = fx(-((m[3][0]*r[0][0]) + (m[3][1]*r[1][0]) + (m[3][2]*r[2][0])));
    r[3][1] = fx(-((m[3][0]*r[0][1]) + (m[3][1]*r[1][1]) + (m[3][2]*r[2][1])));
    r[3][2] = fx(-((m[3][0]*r[0][2]) + (m[3][1]*r[1][2]) + (m[3][2]*r[2][2])));
    return r; }

function trigLines(f) {
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
    var cameraTarget = new V( 0, 0, 1),
        cameraMatrix = rotate(new V( 0, cam.R.y, 0));
        cam.D = matMulVec( cameraMatrix, cameraTarget);
        cameraTarget = vecAddVec( cam.P, cam.D);
    const cameraLocate = quickInverse(pointCamera( cam.P, cameraTarget, cam.U));
    const cameraRotate = rotate(new V( cam.R.x, 0, 0));
    const pane = project(), triangles = [];
    for(let obj of world) {
        const rotated = rotate(obj.R), vc = [];
        for(var vertex of obj.V) {
            var scaledVertex = vecMulVec( vertex, obj.S),
                rotateVertex = matMulVec( rotated, scaledVertex),
                translations = vecAddVec( rotateVertex, obj.P);
                vc.push(translations); }
        for(let face of obj.F) {
            let a = vc[face.a], b = vc[face.b], c = vc[face.c];
            let ad = vecSubVec( a, cam.P), bd = vecSubVec( b, cam.P), cd = vecSubVec( c, cam.P);
            let d = (sqrt(inProduct( ad, ad)) + sqrt(inProduct( bd, bd)) + sqrt(inProduct( cd, cd))) / 3;
            let normal = crossProd( vecSubVec( b, a), vecSubVec( c, a));
                normal = normalize(normal);
            let nl = inProduct( normal, ad);
            if(d < 100) prc=8; else prc=0;
            if(nl < 0) {
                a = matMulVec( cameraLocate, a), b = matMulVec( cameraLocate, b), c = matMulVec( cameraLocate, c);
                a = matMulVec( cameraRotate, a), b = matMulVec( cameraRotate, b), c = matMulVec( cameraRotate, c);
                let clip = [],
                result = clippings(new V( 0, 0, near),new V( 0, 0, 1), a, b, c);
                clip[0] = result.t1; clip[1] = result.t2;
                for(var i = 0; i < result.n; i++) {
                    var dp = fx(inProduct( normal, light)),
                        [rd,gn,bl,op] = [face.r,face.g,face.bl,face.o];
                    rd = fx(abs((rd - 20) * dp + 20), 0);
                    gn = fx(abs((gn - 50) * dp + 50), 0);
                    bl = fx(abs((bl - 50) * dp + 50), 0);
                    a = matMulVec(pane,clip[i].a),
                    b = matMulVec(pane,clip[i].b),
                    c = matMulVec(pane,clip[i].c);
                    if(a.w != 0) { a = divVector(a,a.w); }
                    if(b.w != 0) { b = divVector(b,b.w); }
                    if(c.w != 0) { c = divVector(c,c.w); }
                    triangles.push(new Face(a,b,c,d,`rgb(${rd}, ${gn}, ${bl}, ${op})`));
                }
            }
        }
    }
    triangles.sort((a, b) => b.d - a.d);
    const rasterTrig = [];
    for(let t of triangles) {
        for (var p = 0; p < 4; p++) { let result = {}, clip = [];
			switch(p) {
                case 0: result = clippings( new V( 0,   0, 0), new V( 0, 1, 0), t.a, t.b, t.c); break;
                case 1:	result = clippings( new V( 0,ch-1, 0), new V( 0,-1, 0), t.a, t.b, t.c); break;
                case 2:	result = clippings( new V( 0,   0, 0), new V( 1, 0, 0), t.a, t.b, t.c); break;
                case 3:	result = clippings( new V(cw-1, 0, 0), new V(-1, 0, 0), t.a, t.b, t.c); break;
            }
            clip[0] = result.t1; clip[0].d = t.d; clip[0].rgba = t.rgba;
            clip[1] = result.t2; clip[1].d = t.d; clip[1].rgba = t.rgba;
            for(let i = 0; i < result.n; i++) { rasterTrig.push(clip[i]); }
        }
    }
    for(let t of rasterTrig) { trigLines(t); }
}

var world = [];
var ogn = new Mesh('axiOrigin.obj',new V(-0.5,-0.2,-0.5), new V(-90,0,0), new V(0.01,0.01,0.01));
var bod = new Mesh('reduced.obj',new V(-1,-0.2,1), new V, new V(.5,.5,.5));
var orb = new IcoSphere( new V( 0, 0, -2), new V, new V( 0.1, 0.13, 0.1), 1);
var cam = new Camera(0.25,new V(0,0,-10),new V(180,180,0));
var light = normalize(cam.P);

function tick() {
    ct.clearRect(0, 0, cw, ch);
    cam.R.y = fx(cam.R.y % 360);
    cam.R.x = Math.max( 90, Math.min( 270, cam.R.x));
    orb.R.y++;
    light = normalize(cam.P);
    render(world);
    keysCheck();
}

var id = setInterval(tick, 24);
window.addEventListener('beforeunload', function(e) { clearInterval(id); });