const cvs = document.getElementById('canvas'), ctx = cvs.getContext('2d'),
    cw = cvs.width = window.innerWidth, ch = cvs.height = window.innerHeight,
    cos = Math.cos, sin = Math.sin, tan = Math.tan, sqrt = Math.sqrt, pi = Math.PI,
    abs = Math.abs, min = Math.min, max = Math.max, pf = parseFloat, dg = pi / 180;
var near = 1, far = 1000, fov = 120, ratio = cw / ch, debug = false;

class F { constructor(i,j,k,t,tx, r = 0, g = 150, b = 255, a = 255, d){ Object.assign(this, {i:i, j:j, k:k, t:t || [new T,new T,new T], rgba:`rgba(${r},${g},${b},${a})`, d:d, tx:'null'})}}
class V { constructor(x = 0, y = 0, z = 0, w = 1) { Object.assign( this, {x:x, y:y, z:z, w:w})}}
class T { constructor(x = 0, y = 0, w = 1) { Object.assign( this, {x:x, y:y, w:w})}}

var EM = function() { return [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]}
var IM = function() { return [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]}
const dBugColor = 'rgba(95,2,31,255)';
function xO(x, n) { return x.indexOf(n)}
const mMulV = matMulVec;

async function loadTexts(f) {
    try { var r = await fetch(f), t;
        if(!r.ok) throw new Error();
        t = await r.text(); return t}
    catch(e) { console.error(e); return null}}

function matMulVec(m,v) {
    const [ x, y, z, w] = [ v.x, v.y, v.z, v.w]; return new V(
    (x * m[0][0] + y * m[1][0] + z * m[2][0] + w * m[3][0]),
    (x * m[0][1] + y * m[1][1] + z * m[2][1] + w * m[3][1]),
    (x * m[0][2] + y * m[1][2] + z * m[2][2] + w * m[3][2]),
    (x * m[0][3] + y * m[1][3] + z * m[2][3] + w * m[3][3]))}

function divVector(v, l) { return new V((v.x / l), (v.y / l), (v.z / l))}
function mulVector(v, l) { return new V((v.x * l), (v.y * l), (v.z * l))}
function vecMulVec(v1, v2) { return new V( (v1.x * v2.x), (v1.y * v2.y), (v1.z * v2.z))}
function vecDivVec(v1, v2) { return new V( (v1.x / v2.x), (v1.y / v2.y), (v1.z / v2.z))}
function vecAddVec(v1, v2) { return new V( (v1.x + v2.x), (v1.y + v2.y), (v1.z + v2.z))}
function vecSubVec(v1, v2) { return new V( (v1.x - v2.x), (v1.y - v2.y), (v1.z - v2.z))}
    
function normalize(v) { return divVector(v, (sqrt(inProduct(v, v))))}
function inProduct(v1, v2) { return ((v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z))}
function middlePnt(v1, v2) { return new V(((v1.x + v2.x) / 2), ((v1.y + v2.y) / 2), ((v1.z + v2.z) / 2))}
function crossProd(l1, l2) { return new V(((l1.y*l2.z) - (l1.z*l2.y)), ((l1.z*l2.x) - (l1.x*l2.z)), ((l1.x*l2.y) - (l1.y*l2.x)))}