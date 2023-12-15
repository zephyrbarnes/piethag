const bs = 12, dg = '0123456789↊↋'; // Dozenal digits
const flr = Math.floor; function xf(d,n) {return d.indexOf(n);}
var dx, dgt, cr, tp, rs, pd;

function doz(n) { return String(n); }

function dec(n) { rs = '';
    if (n == 0) return '0';
    while (n > 0) { dgt = n % 12; n = flr(n / 12);
        rs = dg[dgt] + rs;
    } return rs;
}

function add(n1,n2) { dx, cr = 0; rs = '';

    while (n1.length < n2.length) n1 = '0' + n1;
    while (n2.length < n1.length) n2 = '0' + n2;

    for (let i = n1.length - 1; i >= 0; i--) {
        dx = xf(dg,n1[i]) + xf(dg,n2[i]) + cr;
        cr = flr(dx / bs);
        rs = dg[dx % bs] + rs;
    }
    if (cr > 0) rs = dg[cr] + rs;
    return rs;
}

function mul(n1, n2) { rs = '0', n1l = n1.length, n2l = n2.length;
    for (let i = n1l - 1; i >= 0; i--) { cr = 0, tp = '';
        for (let j = n2l - 1; j >= 0; j--) {
            pd = xf(dg,n1[i]) * xf(dg,n2[j]) + cr;
            cr = flr(pd / bs); pd = pd % bs; tp = dg[pd] + tp;
        }
        if (cr > 0) tp = dg[cr] + tp;
        tp += '0'.repeat(n1l - 1 - i);
        rs = add(rs, tp);
    } return rs;
}

function div(n1, n2) {
    n1 = n1.replace('↊', 'a').replace('↋', 'b');
    n2 = n2.replace('↊', 'a').replace('↋', 'b');

    n1 = parseInt(n1, 12);
    n2 = parseInt(n2, 12);

    var qt = Math.floor(n1 / n2);
    var rm = n1 % n2;

    var dzQt = dec(qt).replace('a','↊').replace('b','↋');
    var dzRm = dec(rm).replace('a','↊').replace('b','↋');
    return [dzQt, dzRm];
}