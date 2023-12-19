const cos = Math.cos, sin = Math.sin, tan = Math.tan, sqrt = Math.sqrt, pf = parseFloat, abs = Math.abs;
var nie = 0.1, far = 1000, fov = 90, ratio = cw / ch, debug = false, prc = 0;
const pi = Math.PI, dg = pi / 180, sqConst = (1 + sqrt(5)) / 2;

function fx( v, n = prc) { return pf(v.toFixed(n))}
function V( x = 0, y = 0, z = 0) { return {x:x, y:y, z:z, w:1}}
function F( a, b, c, r = 0, g = 150, bl = 255, o = 255) { return {a:a, b:b, c:c, r:r, g:g, bl:bl, o:o}}
function Face( a, b, c, d, rgba) { return {a:a, b:b, c:c, d:d, rgba:rgba}}

const EM = [[ 0, 0, 0, 0],[ 0, 0, 0, 0],[ 0, 0, 0, 0],[ 0, 0, 0, 0]];
const IM = [[ 1, 0, 0, 0],[ 0, 1, 0, 0],[ 0, 0, 1, 0],[ 0, 0, 0, 1]];

class Cube { constructor( P = new V, R = new V, S = V( 1, 1, 1)) {
    Object.assign( this, {/*Position*/P:P,/*Rotation*/R:R,/*Scale*/S:S, V:[
    V(-1,-1,-1), V(-1, 1,-1), V( 1, 1,-1), V( 1,-1,-1),     // Vertex Array
    V( 1, 1, 1), V( 1,-1, 1), V(-1, 1, 1), V(-1,-1, 1)], F:[  // Face Array
    F( 0, 1, 2), F( 0, 3, 2), /*SOUTH*/ F( 4, 3, 2), F( 3, 4, 5), /*EASTS*/
    F( 5, 4, 6), F( 5, 6, 7), /*NORTH*/ F( 7, 6, 1), F( 7, 1, 0), /*WESTS*/
    F( 1, 6, 4), F( 1, 4, 2), /*ABOVE*/ F( 5, 7, 0), F( 5, 0, 3)] /*BELOW*/
}); world.push(this)}}

class Mesh { constructor(path, P = new V, R = new V, S = V( 1, 1, 1)) {
    Object.assign(this, {/*Position*/P:P,/*Rotation*/R:R,/*Scale*/S:S,/*Vector Array*/V:[],/*Triangles*/F:[]});
    loadTexts(path).then( txt => { if (txt !== null) { var lines = txt.split("\n");
    for(var line of lines) { var s = line.split(" "); /*String*/
        if(s[0] == "f") this.F.push(F((fx(s[1])-1), (fx(s[2])-1), (fx(s[3])-1))); /*Fills Mesh Triangle Array*/
        else if(s[0] == "v") this.V.push(V(fx(s[1]), fx(s[2]), fx(s[3])));          /*Fills Mesh Vector Array*/
}}}); world.push(this)}}

class IcoSphere {constructor( P = new V, R = new V, S = V(1,1,1), I = 0) { var t = sqConst;
    Object.assign( this, {/*Position*/P:P,/*Rotation*/R:R,/*Scale*/S:S,/*Iterations*/I:I,
    V: [V(-1,  t,  0), V( 1,  t,  0), V(-1, -t,  0), V( 1, -t,  0),/*Fill Vector Array*/
        V( 0, -1,  t), V( 0,  1,  t), V( 0, -1, -t), V( 0,  1, -t),
        V( t,  0, -1), V( t,  0,  1), V(-t,  0, -1), V(-t,  0,  1)],
    F: [F([ 0,11, 5]), F([ 0, 5, 1]), F([ 0, 1, 7]), F([ 0, 7,10]),/*Fills Faces Array*/
        F([ 0,10,11]), F([ 1, 5, 9]), F([ 5,11, 4]), F([11,10, 2]),
        F([10, 7, 6]), F([ 7, 1, 8]), F([ 3, 9, 4]), F([ 3, 4, 2]),
        F([ 3, 2, 6]), F([ 3, 6, 8]), F([ 3, 8, 9]), F([ 4, 9, 5]),
        F([ 2, 4,11]), F([ 6, 2,10]), F([ 8, 6, 7]), F([ 9, 8, 1])]});
    this.Tesselate(); world.push(this)}

    getMiddle( v1, v2) { // return index of point in the middle of v1 and v2
        var mid = middle( v1, v2);
        if(this.V.includes(mid)) return this.V.indexOf(mid);
        else this.V.push(mid);
    }

    Tesselate() {
        for (var i = 0; i < this.rcr; i++) {
            var tempFace = [];
            for(let f in this.F) { // replace triangle by 4 triangles
                var a = getMiddle(f.P[0], f.P[1]);
                var b = getMiddle(f.P[1], f.P[2]);
                var c = getMiddle(f.P[2], f.P[0]);

                tempFace.push(F([f.P[0], a, c]));
                tempFace.push(F([f.P[1], b, a]));
                tempFace.push(F([f.P[2], c, b]));
                tempFace.push(F([     a, b, c]));
            }
            this.F = tempFace;
        }
    }
}

class Camera {constructor( M, P = new V, R = new V) {
    Object.assign(this, {/*Position*/P:P,/*Rotation*/R:R,/*Movement*/M:M,/*Direction*/D:V(0,0,1),/*Plumb*/U:V(0,1,0)});
}}

function matMulVec(m,v) { return V(
    fx(v.x*m[0][0] + v.y*m[1][0] +v.z*m[2][0] + v.w*m[3][0]),
    fx(v.x*m[0][1] + v.y*m[1][1] +v.z*m[2][1] + v.w*m[3][1]),
    fx(v.x*m[0][2] + v.y*m[1][2] +v.z*m[2][2] + v.w*m[3][2]),
    fx(v.x*m[0][3] + v.y*m[1][3] +v.z*m[2][3] + v.w*m[3][3]))
}

async function loadTexts(f) {
    try { var r = await fetch(f);
    if(!r.ok) throw new Error();
    return await r.text() }
    catch(e){ return null}}

function vDiv( v, k) { return V(fx(v.x / k), fx(v.y / k), fx(v.z / k))}
function mulV( v, k) { return V(fx(v.x * k), fx(v.y * k), fx(v.z * k))}

function vMulV( v1, v2) { return V( fx(v1.x * v2.x), fx(v1.y * v2.y), fx(v1.z * v2.z))}
function vDivV( v1, v2) { return V( fx(v1.x / v2.x), fx(v1.y / v2.y), fx(v1.z / v2.z))}

function vAddV( v1, v2) { return V( fx(v1.x + v2.x), fx(v1.y + v2.y), fx(v1.z + v2.z))}
function vSubV( v1, v2) { return V( fx(v1.x - v2.x), fx(v1.y - v2.y), fx(v1.z - v2.z))}

function middle( v1, v2) { return V(((v1.x + v2.x) / 2), ((v1.y + v2.y) / 2), ((v1.z + v2.z) / 2)) }

function inProduct( v1, v2) { return (v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z)}
function crossProd( l1, l2) { return V(((l1.y * l2.z) - (l1.z * l2.y)), ((l1.z * l2.x) - (l1.x * l2.z)), ((l1.x * l2.y) - (l1.y * l2.x)))}
function normalize(v) { return vDiv( v, fx(sqrt(inProduct( v, v)))); }

function rotations(v) { const [ x, y, z] = [(v.x*dg), (v.y*dg), (v.z*dg)]; var m = IM;
    const [cx, cy, cz, sx, sy, sz] = [cos(x), cos(y), cos(z), sin(x), sin(y), sin(z)];
    const [cxz, ces, sec, szx] = [cx*cz, sz*cx, cz*sx, sz*sx];
    m[0][0] = fx(cz*cy); m[0][1] = fx(sec*sy - ces); m[0][2] = fx(szx + cxz*sy);//m[0][3] = 0
    m[1][0] = fx(sz*cy); m[1][1] = fx(cxz + szx*sy); m[1][2] = fx(ces*sy - sec);//m[1][3] = 0
    m[2][0] = fx(-sy);   m[2][1] = fx(cy * sx);      m[2][2] = fx(cy * cx);     /*m[2][3] = 0
    m[3][0] = 0          m[3][1] = 0                 m[3][2] = 0                  m[3][3] = 1*/
    return m}

function projected(ratio, ch) {
    var radians = 1 / tan((fov * dg) / (180 * pi)), m = EM,
        pry = fx(radians*ratio*ch/100), prz = fx(far/(far - nie)),
        nid = fx(-nie * prz);
    m[0][0] = pry;/*m[0][1] = 0     m[0][2] = 0     m[0][3] = 0
    m[1][0] = 0   */m[1][1] = pry;/*m[1][2] = 0     m[1][3] = 0
    m[2][0] = 0     m[2][1] = 0   */m[2][2] = prz;  m[2][3] = 1;/*
    m[3][0] = 0     m[3][1] = 0   */m[3][2] = nid;/*m[3][3] = 0*/
    return m; }

function pointCamera( position, target, plumb) {
    var p = position, t = target, u = plumb, m = IM;
    var fd = normalize(vSubV( t, p)),                           // Forward dir
        ud = normalize(vSubV( u, mulV( fd, inProduct( u, fd)))), // Upward dir
        rd = crossProd( ud, fd);                                  // Right dir
    m[0][0] = fx(rd.x); m[0][1] = fx(rd.y); m[0][2] = fx(rd.z); // m[0][3] = 0
    m[1][0] = fx(ud.x); m[1][1] = fx(ud.y); m[1][2] = fx(ud.z); // m[1][3] = 0
    m[2][0] = fx(fd.x); m[2][1] = fx(fd.y); m[2][2] = fx(fd.z); // m[2][3] = 0
    m[3][0] = fx( p.x); m[3][1] = fx( p.y); m[3][2] = fx( p.z); // m[3][3] = 1
    return m; }

function intersect( plane_p, plane_n, sttLine, endLine) {
    var pn = normalize(plane_n), pp = plane_p, pd = inProduct( pn, pp), // Plane normal, point, dist
        ad = inProduct( sttLine, pn), bd = inProduct( endLine, pn), // Directions
        t = (pd - ad) / (bd - ad);
        endLine = vSubV( endLine, sttLine), lineSect = mulV( endLine, t);
    return vAddV( sttLine, lineSect)}
const sect = intersect;

function clippings( plane_p, plane_n, a, b, c) {
    var pn = normalize(plane_n), pp = plane_p,
        result = { n:1, t1: new F, t2: new F };
    function dist(p) { return ((pn.x*p.x) + (pn.y*p.y) + (pn.z*p.z) - inProduct(pn, pp))}
    var ad = dist(a), bd = dist(b), cd = dist(c),
        iP = [], oP = [], iN = 0, oN = 0;
    if(ad >= 0) iP[iN++] = a; else oP[oN++] = a;
    if(bd >= 0) iP[iN++] = b; else oP[oN++] = b;
    if(cd >= 0) iP[iN++] = c; else oP[oN++] = c;
    if(iN == 1 && oN == 2) {
        result.t1 = F( iP[0], sect( pp, pn, iP[0], oP[0]), sect( pp, pn, iP[0], oP[1])); return result}
    if(iN == 2 && oN == 1) { result.n = 2;
        result.t1 = F( iP[0], iP[1], sect( pp, pn, iP[0], oP[0]));
        result.t2 = F( iP[1], result.t1.c, sect( pp, pn, iP[1], oP[0])); return result}
    if(iN == 3) { result.t1 = F(a,b,c); return result}
    if(iN == 0) { result.n = 0; return result}}

function quickInverse(m) {
    var r = IM; for(var i = 0; i < 3; i++) {
                    for(var j = 0; j < 3; j++) { r[i][j] = m[j][i]}}
    r[3][0] = fx(-((m[3][0]*r[0][0]) + (m[3][1]*r[1][0]) + (m[3][2]*r[2][0])));
    r[3][1] = fx(-((m[3][0]*r[0][1]) + (m[3][1]*r[1][1]) + (m[3][2]*r[2][1])));
    r[3][2] = fx(-((m[3][0]*r[0][2]) + (m[3][1]*r[1][2]) + (m[3][2]*r[2][2])));
    return r; }

function trigLines(f) {
    ct.fillStyle = f.rgba; ct.strokeStyle = f.rgba;
    if(debug) ct.strokeStyle = 'pink'; ct.beginPath();
    ct.moveTo(((f.a.x + cw) / 2), ((f.a.y + ch) / 2));
    ct.lineTo(((f.b.x + cw) / 2), ((f.b.y + ch) / 2));
    ct.lineTo(((f.c.x + cw) / 2), ((f.c.y + ch) / 2));
    ct.lineTo(((f.a.x + cw) / 2), ((f.a.y + ch) / 2));
    ct.stroke(); ct.fill(); ct.closePath();
}

function render(world) {
    var cameraTarget = V( 0, 0, 1),
        cameraMatrix = rotations(V( 0, cam.R.y, 0));
        cam.D = matMulVec( cameraMatrix, cameraTarget);
        cameraTarget = vAddV( cam.P, cam.D);
    var cameraLocate = quickInverse(pointCamera( cam.P, cameraTarget, cam.U)),
        cameraRotate = rotations(V( cam.R.x, 0, 0)),
        pane = projected(ratio, ch), triangles = [];
    for(let obj of world) { const rotated = rotations(obj.R), vc = [];
        for(var vertex of obj.V) {
            var scaledVertex = vMulV( vertex, obj.S),
                rotateVertex = matMulVec( rotated, scaledVertex),
                shiftsVertex = vAddV( rotateVertex, obj.P);
                vc.push(shiftsVertex); }
        for(let face of obj.F) {
            let a = vc[face.a], b = vc[face.b], c = vc[face.c];
            let ad = vSubV( a, cam.P), bd = vSubV( b, cam.P), cd = vSubV( c, cam.P);
            let d = sqrt(inProduct( ad, ad)) + sqrt(inProduct( bd, bd)) + sqrt(inProduct( cd, cd)) / 3;
            let normal = crossProd( vSubV( b, a), vSubV( c, a));
                normal = normalize(normal);
            let nl = inProduct( normal, ad);
            if(d < 100) prc=8; else if(d < 200) prc=2; else prc=0;
            if(nl < 0) {
                a = matMulVec( cameraLocate, a), b = matMulVec( cameraLocate, b), c = matMulVec( cameraLocate, c);
                a = matMulVec( cameraRotate, a), b = matMulVec( cameraRotate, b), c = matMulVec( cameraRotate, c);
                let clip = [],
                result = clippings(V( 0, 0, nie),V( 0, 0, 1), a, b, c);
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
                    if(a.w != 0) { a = vDiv(a,a.w); }
                    if(b.w != 0) { b = vDiv(b,b.w); }
                    if(c.w != 0) { c = vDiv(c,c.w); }
                    triangles.push(Face(a,b,c,d,`rgb(${rd}, ${gn}, ${bl}, ${op})`));
                }
            }
        }
    }
    triangles.sort((a, b) => b.d - a.d);
    const rasterTrig = [];
    for(let t of triangles) {
        for (p = 0; p < 4; p++) { let result = {}, clip = [];
			switch(p) {
                case 0: result = clippings( V( 0,   0, 0), V( 0, 1, 0), t.a, t.b, t.c); break;
                case 1:	result = clippings( V( 0,ch-1, 0), V( 0,-1, 0), t.a, t.b, t.c); break;
                case 2:	result = clippings( V( 0,   0, 0), V( 1, 0, 0), t.a, t.b, t.c); break;
                case 3:	result = clippings( V(cw-1, 0, 0), V(-1, 0, 0), t.a, t.b, t.c); break;
            }
            clip[0] = result.t1; clip[0].d = t.d; clip[0].rgba = t.rgba;
            clip[1] = result.t2; clip[1].d = t.d; clip[1].rgba = t.rgba;
            for(let i = 0; i < result.n; i++) { rasterTrig.push(clip[i]); }
        }
    }
    for(let t of rasterTrig) { trigLines(t); }
}

var world = [];
var cube = new Cube(V( 0, 0, 2), V(), V( 0.1, 0.1, 0.1));
var cam = new Camera(0.25, V( 0, 0, 0), V( 180, 180, 0));
var light = normalize(V( 0, 0,-1));

function tick() {
    ct.clearRect(0, 0, cw, ch);
    cam.R.y = fx(cam.R.y % 360);
    cam.R.x = Math.max( 90, Math.min( 270, cam.R.x));
    render(world);
    keysCheck();
}

var id = setInterval(tick, 120);
window.addEventListener('beforeunload', function(e) { clearInterval(id); });