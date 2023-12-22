function scaled(v, o) { return vecMulVec(v, o.S)}
function mulRot(v, r) { return matMulVec(rotate(r),v)}
function locate(v, o) { return vecAddVec(v, o.P)}
function objMat(v, o) { return locate(mulRot(scaled(v, o), o.R), o)} // Scales, Rotates, and Positions

function rotate(v) { const [x,y,z] = [(v.x*dg), (v.y*dg), (v.z*dg)], m = new IM,
    [cx, cy, cz, sx, sy, sz] = [cos(x), cos(y), cos(z), sin(x), sin(y), sin(z)],
    [ cxz, ces, sec, szx] = [ cx * cz, sz * cx, cz * sx, sz * sx];
    m[0][0] = (cz*cy); m[0][1] = (sec*sy - ces); m[0][2] = (szx + cxz*sy);//m[0][3] = 0
    m[1][0] = (sz*cy); m[1][1] = (cxz + szx*sy); m[1][2] = (ces*sy - sec);//m[1][3] = 0
    m[2][0] = (-sy);   m[2][1] = (cy * sx);      m[2][2] = (cy * cx);     /*m[2][3] = 0
    m[3][0] = 0        m[3][1] = 0               m[3][2] = 0                m[3][3] = 1
    */ return m}

function project() {
    const radians = 1 / tan((fov * dg) / (180 * pi)), m = new EM,
        pry = (radians*ratio*ch/100), prz = (far/(far - near)),
        nid = (-near * prz);
    m[0][0] = pry;/*m[0][1] = 0     m[0][2] = 0     m[0][3] = 0
    m[1][0] = 0   */m[1][1] = pry;/*m[1][2] = 0     m[1][3] = 0
    m[2][0] = 0     m[2][1] = 0   */m[2][2] = prz;  m[2][3] = 1;/*
    m[3][0] = 0     m[3][1] = 0   */m[3][2] = nid;/*m[3][3] = 0*/
    return m}

function pointCamera( position, target, plumb) { const
    p = position, t = target, u = plumb, m = new IM,
    fd = normalize(vecSubVec(t, p)),                                // Forward dir
    ud = normalize(vecSubVec(u, mulVector(fd, inProduct( u, fd)))),// Upward dir
    rd = crossProd(ud, fd);                                       // Right dir
    m[0][0] = (rd.x); m[0][1] = (rd.y); m[0][2] = (rd.z); // m[0][3] = 0
    m[1][0] = (ud.x); m[1][1] = (ud.y); m[1][2] = (ud.z); // m[1][3] = 0
    m[2][0] = (fd.x); m[2][1] = (fd.y); m[2][2] = (fd.z); // m[2][3] = 0
    m[3][0] = ( p.x); m[3][1] = ( p.y); m[3][2] = ( p.z); // m[3][3] = 1
return m}

function intersect( plane_p, plane_n, sttLine, endLine) {
    var pn = normalize(plane_n), pp = plane_p, pd = inProduct( pn, pp), // Plane normal, point, dist
        ad = inProduct( sttLine, pn), bd = inProduct( endLine, pn), // Directions
        t = (pd - ad) / (bd - ad);
        endLine = vecSubVec( endLine, sttLine);
    var lineSect = mulVector( endLine, t);
    return vecAddVec( sttLine, lineSect)}
const sect = intersect;

function clip(plane_p, plane_n, f) {
    var pn = normalize(plane_n), pp = plane_p, result = {n:1, t1: new F(), t2: new F() };
    function dist(v) { return ((pn.x*v.x) + (pn.y*v.y) + (pn.z*v.z) - inProduct(pn, pp))}

    var ad = dist(f.i), bd = dist(f.j), cd = dist(f.k);
    var iP = [], oP = [], iN = 0, oN = 0;

    if(ad >= 0) iP[iN++] = f.i; else oP[oN++] = f.i;
    if(bd >= 0) iP[iN++] = f.j; else oP[oN++] = f.j;
    if(cd >= 0) iP[iN++] = f.k; else oP[oN++] = f.k;

    if(iN == 0) { result.n = 0; return result}
    if(iN == 3) { result.t1 = f; return result}
    if(iN == 1 && oN == 2) {
        result.t1 = new F(iP[0], sect(pp, pn, iP[0], oP[0]), sect(pp, pn, iP[0], oP[1]));
        if(debug) result.t1.rgba = dBugColor; else result.t1.rgba = f.rgba;
        result.t1.d = f.d; return result}
    if(iN == 2 && oN == 1) {
        result.t1 = new F(iP[0], iP[1], sect(pp, pn, iP[0], oP[0]));
        result.t2 = new F(iP[1], result.t1.k, sect(pp, pn, iP[1], oP[0]));
        if(debug) result.t1.rgba =  result.t2.rgba = dBugColor;
        else { result.t1.rgba = result.t2.rgba = f.rgba} result.n = 2;
        result.t1.d = result.t2.d = f.d; return result}}

function quickInverse(m) { var r = new IM;
    for(var n = 0; n < 3; n++) { for(var p = 0; p < 3; p++) { r[n][p] = m[p][n]}}
    r[3][0] = -((m[3][0]*r[0][0]) + (m[3][1]*r[1][0]) + (m[3][2]*r[2][0]));
    r[3][1] = -((m[3][0]*r[0][1]) + (m[3][1]*r[1][1]) + (m[3][2]*r[2][1]));
    r[3][2] = -((m[3][0]*r[0][2]) + (m[3][1]*r[1][2]) + (m[3][2]*r[2][2]));
return r}