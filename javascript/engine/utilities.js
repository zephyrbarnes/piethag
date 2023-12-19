const cos = Math.cos, sin = Math.sin, tan = Math.tan, sqrt = Math.sqrt, pf = parseFloat, abs = Math.abs;
const pi = Math.PI, dg = pi / 180;

var prc = 0;

var near = 0.1, far = 1000, fov = 90, ratio = cw / ch, dbug = false;

function fx( v, n = prc) { return pf(v.toFixed(n)); }

async function loadTexts(f) {
    try {
        var r = await fetch(f), t;
        if(!r.ok) throw new Error();
        t = await r.text();
        return t;
    } catch(e) {
        console.error(e);
        return null;
    }
}

function mtxMV( m, v, n = prc) {
    const [x, y, z, w] = [v.x, v.y, v.z, v.w]; return V(
    fx((x * m[0][0]) + (y * m[1][0]) + (z * m[2][0]) + (w * m[3][0]), n),
    fx((x * m[0][1]) + (y * m[1][1]) + (z * m[2][1]) + (w * m[3][1]), n),
    fx((x * m[0][2]) + (y * m[1][2]) + (z * m[2][2]) + (w * m[3][2]), n),
    fx((x * m[0][3]) + (y * m[1][3]) + (z * m[2][3]) + (w * m[3][3]), n)) }

function divV( v, k, n = prc) { return V( fx((v.x / k), n), fx((v.y / k), n), fx((v.z / k), n)) }
function mulV( v, k, n = prc) { return V( fx((v.x * k), n), fx((v.y * k), n), fx((v.z * k), n)) }

function vAddV( v1, v2, n = prc) { return V( fx((v1.x + v2.x), n), fx((v1.y + v2.y), n), fx((v1.z + v2.z), n)) }
function vSubV( v1, v2, n = prc) { return V( fx((v1.x - v2.x), n), fx((v1.y - v2.y), n), fx((v1.z - v2.z), n)) }

function vMulV( v1, v2, n = prc) { return V( fx((v1.x * v2.x), n), fx((v1.y * v2.y), n), fx((v1.z * v2.z), n)) }
function vDivV( v1, v2, n = prc) { return V( fx((v1.x / v2.x), n), fx((v1.y / v2.y), n), fx((v1.z / v2.z), n)) }

function middle( v1, v2) { return V(((v1.x + v2.x) / 2), ((v1.y + v2.y) / 2), ((v1.z + v2.z) / 2)) }
function normal( v, n = prc) { return divV( v, fx( sqrt( inProduct( v, v)), n)) }
function inProduct( v1, v2) { return (v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z) }
function crossProd( l1, l2) { return V(((l1.y * l2.z) - (l1.z * l2.y)), ((l1.z * l2.x) - (l1.x * l2.z)), ((l1.x * l2.y) - (l1.y * l2.x))) }