const dgts = '0123456789↊↋';
var doz, dgt, tmp, prc;
function gP(n)   { return n.toString().split('.'); }
function fl(n)   { return Math.floor(n);}
function cl(n)   { return Math.ceil(n);}
function xO(x,n) { return x.indexOf(n);}
function num(n) { return Number(n);}

function doz2Dec(n) { let d = gP(n); tmp = 0;
    for (let i = 0; i < d[0].length; i++) { tmp = tmp * 12 + xO(dgts, d[0][i]); }
    if(d[1]) { prc = 0;
        for (let i = 0; i < d[1].length; i++) { prc += xO(dgts, d[1][i]) * Math.pow(12, -(i+1)); }
        tmp += prc;
    } return tmp;
}

function dec2Doz(n, p) { let d = fl(n), f = n - d; doz = '';
    do {
        doz = dgts[d % 12] + doz;
        d = fl(d / 12);
    } while (d > 0);
    if(f > 0) { doz += '.'; tmp = '';
        while (f > 0) {
            dgt = fl(f *= 12);
            tmp += dgts[dgt];
            f -= dgt;
        }
        d = '';
        if(xO(dgts, tmp[p]) > 5) f = 1; else f = 0;
        for (let i = p - 1; i >= 0; i--) {
            dgt = xO(dgts, tmp[i]) + f;
            if(dgt >= 12) f = 1; else f = 0;
            d = dgts[dgt %= 12] + d;
        }
        doz += d;
        if(f) { d = xO(doz,'.') - 1;
            while (f && d >= 0) {
                dgt = xO(dgts, doz[d]) + f;
                if(dgt >= 12) f = 1; else f = 0;
                doz = doz.slice(0, d) + dgts[dgt %= 12] + doz.slice(d + 1);
                d--;
            }
            if(f) doz = dgts[f] + doz;
        }
    } return doz;
}

function add(a, b) {
    let p = Math.max((gP(a)[1] || '').length, (gP(b)[1] || '').length);
    return dec2Doz(doz2Dec(a) + doz2Dec(b), p);
}

function sub(a, b) {
    let p = Math.max((gP(a)[1] || '').length, (gP(b)[1] || '').length);
    return dec2Doz(doz2Dec(a) - doz2Dec(b), p);
}

function mul(a, b) {
    let p = Math.min((gP(a)[1] || '').length, (gP(b)[1] || '').length);
    return dec2Doz(doz2Dec(a) * doz2Dec(b), p);
}

function div(a, b) {
    let p = Math.min((gP(a)[1] || '').length, (gP(b)[1] || '').length);
    return dec2Doz(doz2Dec(a) / doz2Dec(b), p);
}