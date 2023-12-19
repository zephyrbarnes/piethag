const EM = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
const IM = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];

class Camera {
    constructor( S, P = new V, R = new V) {
    Object.assign(this, {P:P,/*Position*/R:R,/*Rotation*/S:S,/*Speed*/D:new V(0,0,1),/*Direction*/U:new V(0,1,0)/*Up direction*/});
}}

function rotate(v, n = prc) {
    var  m = IM; // Rotation matrix
    const [x, y, z] = [v.x * dg, v.y * dg, v.z * dg]; // Rotation angles
    const [cx, cy, cz, sx, sy, sz] = [cos(x), cos(y), cos(z), sin(x), sin(y), sin(z)]; // Trig functions
    const [cxz, ces, sec, szx] = [cx * cz, sz * cx, cz * sx, sz * sx];  // Simplified trig results
    m[0][0] = fx(cz*cy, n); m[0][1] = fx( sec*sy - ces,n); m[0][2] = fx( szx + cxz*sy, n);//m[0][3] = 0
    m[1][0] = fx(sz*cy, n); m[1][1] = fx( cxz + szx*sy,n); m[1][2] = fx( ces*sy - sec, n);//m[1][3] = 0
    m[2][0] = fx( -sy, n);  m[2][1] = fx( cy * sx, n);     m[2][2] = fx( cy * cx, n);     //m[2][3] = 0
  //m[3][0] = 0             m[3][1] = 0                    m[3][2] = 0                    //m[3][3] = 1
    return m; // Return the rotation matrix
}

function project(n = prc) {
    const fovRadians =  1 / tan(fov * dg / 180 * pi);
    const prx = fx( fovRadians * ratio * ch / 100, n);  // Projected x
    const pry = fx( fovRadians * ratio * ch / 100, n);  // Projected y
    const prz = fx( far / (far - near), n);             // Projected z
    const nid = fx( -near * prz, n);
    var m = EM; // Projection matrix
        m[0][0] = prx;//m[0][1] = 0     m[0][2] = 0     m[0][3] = 0
    /*  m[1][0] = 0*/   m[1][1] = pry;//m[1][2] = 0     m[1][3] = 0
    /*  m[2][0] = 0     m[2][1] = 0*/   m[2][2] = prz;  m[2][3] = 1;
    /*  m[3][0] = 0     m[3][1] = 0*/   m[3][2] = nid;//m[3][3] = 0
    return m; // Return the projection matrix
}

function pointCamera( position, target, up, n = prc) {
    var m = IM, p = position, t = target;
    const fd = normal( vSubV( t, p));                               // Forward direction
    const ud = normal( vSubV( up, mulV( fd, inProduct( up, fd))));  // Upwards direction
    const rd = crossProd(ud, fd);                                   // Right direction
    m[0][0] = fx(rd.x, n); m[0][1] = fx(rd.y, n); m[0][2] = fx(rd.z, n);    //m[0][3] = 0
    m[1][0] = fx(ud.x, n); m[1][1] = fx(ud.y, n); m[1][2] = fx(ud.z, n);    //m[1][3] = 0
    m[2][0] = fx(fd.x, n); m[2][1] = fx(fd.y, n); m[2][2] = fx(fd.z, n);    //m[2][3] = 0
    m[3][0] = fx( p.x, n); m[3][1] = fx( p.y, n); m[3][2] = fx( p.z, n);    //m[3][3] = 1
    return m;
}

function intersect( plane_p, plane_n, sttLine, endLine) {
    var pn = normal(plane_n),       /* Plane normal */
        pp = plane_p,               /* Plane point */
        stt = sttLine,              /* Start line */
        end = endLine;              /* End line */
    var pd = inProduct( pn, pp),    /* Plane distance */
        ad = inProduct( stt, pn),
        bd = inProduct( end, pn),
        t = (pd - ad) / (bd - ad),
        endLine = vSubV( end, stt),
        sttLine = mulV( endLine, t);
    return vAddV( stt, sttLine);
} const sect = intersect;

function clippings( plane_p, plane_n, a, b, c) {
    var pn = normal(plane_n),   // Plane normal
        pp = plane_p;           // Plane point
    var result = { n:1, f1: new F, f2: new F }; // Result

    function dist(p) { // Calculate distance between points
        return ((pn.x * p.x) + (pn.y * p.y) + (pn.z * p.z) - inProduct( pn, pp)); }

    var ad = dist(a), bd = dist(b), cd = dist(c); // Distances
    var iP = [], oP = []; // In and out points
    var iN = 0,  oN = 0; // In and out point counters

    if(ad >= 0) iP[iN++] = a;  else oP[oN++] = a; // Add points to in and out depending on a distance
    if(bd >= 0) iP[iN++] = b;  else oP[oN++] = b; // Add points to in and out depending on b distance
    if(cd >= 0) iP[iN++] = c;  else oP[oN++] = c; // Add points to in and out depending on c distance

    if(iN == 0) { result.n = 0; return result; } // If no in points, return nothing

    if(iN == 1 && oN == 2) { // If one in point and two out points
        result.f1 = F([iP[0], sect( pp, pn, iP[0], oP[0]), sect( pp, pn, iP[0], oP[1])]);
        return result; }

    if(iN == 2 && oN == 1) { // If two in points and one out point
        result.n = 2;
        var tempC = sect( pp, pn, iP[0], oP[0]);
        result.f1 = F([iP[0], iP[1], tempC]);
        result.f2 = F([iP[1], tempC, sect( pp, pn, iP[1], oP[0])]);
        return result; }

    if(iN == 3) { // If three in points
        result.f1 = F([a, b, c]);
        return result; }
}

function quickInverse( m, n = prc) {
    var r = IM; // Result
    for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) {
            r[i][j] = m[j][i];
        }
    }
    r[3][0] = fx(-((m[3][0]*r[0][0]) + (m[3][1]*r[1][0]) + (m[3][2]*r[2][0])), n);
    r[3][1] = fx(-((m[3][0]*r[0][1]) + (m[3][1]*r[1][1]) + (m[3][2]*r[2][1])), n);
    r[3][2] = fx(-((m[3][0]*r[0][2]) + (m[3][1]*r[1][2]) + (m[3][2]*r[2][2])), n);
    return r;
}

function trigLines(f) {
    var rgba = `rgba(${f.r},${f.g},${f.b},${f.o})`;
    ct.fillStyle = rgba;
    if(dbug) ct.strokeStyle = 'pink'; else ct.strokeStyle = rgba;
    ct.beginPath();
    ct.moveTo( f.P[0].x + cw / 2, f.P[0].y + ch / 2);
    ct.lineTo( f.P[1].x + cw / 2, f.P[1].y + ch / 2);
    ct.lineTo( f.P[2].x + cw / 2, f.P[2].y + ch / 2);
    ct.moveTo( f.P[0].x + cw / 2, f.P[0].y + ch / 2);
    ct.stroke(); ct.fill(); ct.closePath();
}

function render(world) {
    var cameraTarget = V( 0, 0, 1),
        cameraMatrix = rotate(V( 0, cam.R.y, 0));
        cam.D = mtxMV( cameraMatrix, cameraTarget);
        cameraTarget = vAddV( cam.P, cam.D);

    var cameraLocate = quickInverse(pointCamera( cam.P, cameraTarget, cam.U)),
        cameraRotate = rotate(V(cam.R.x, 0, 0)), pane = project(), faces = [];

    for(let obj of world) {
        const vectors = [];
        const rotates = rotate(obj.R);
        for(let v of obj.V) {
            var scaleVector = vMulV( v, obj.S),
                rotateVector = mtxMV(rotates,scaleVector),
                translateVector = vAddV(rotateVector,obj.P);
            vectors.push(translateVector);
        }
        for(let f of obj.F) {
            var a = vectors[f.P[0]], b = vectors[f.P[1]], c = vectors[f.P[2]];
            var ad = vSubV( a, cam.P), bd = vSubV( b, cam.P), cd = vSubV( c, cam.P);
            var dist = (sqrt(inProduct( ad, ad)) + sqrt(inProduct( bd, bd)) + sqrt(inProduct( cd, cd))) / 3;
            var nrml = crossProd(vSubV( b, a),vSubV( c, a)),
                nrml = normal(nrml),
                nl = inProduct( nrml, ad);

            if(dist < 100) prc = 8; else if(dist < 200) prc = 2; else prc = 0; // Varied precision depending on distance from camera
            if(nl < 0) {
                a = mtxMV( cameraLocate, a), b = mtxMV( cameraLocate, b), c = mtxMV( cameraLocate, c);
                a = mtxMV( cameraRotate, a), b = mtxMV( cameraRotate, b), c = mtxMV( cameraRotate, c);

                var clip = [],
                    result = clippings(V( 0, 0, near), V( 0, 0, 1),a , b, c);
                    clip[0] = result.f1;
                    clip[1] = result.f2;
                for(var i = 0; i < result.n; i++) {
                    var dp = fx(inProduct( normal, light));
                    var [red, green, blue] = [f.r, f.g, f.b];
                    red = fx(abs(((red - 20) * dp) + 20),0);
                    blue = fx(abs(((blue - 50) * dp) + 50),0);
                    green = fx(abs(((green - 50) * dp) + 50),0);
                    a = mtxMV( pane, clip[i].P[0]);
                    b = mtxMV( pane, clip[i].P[1]);
                    c = mtxMV( pane, clip[i].P[2]);
                    if(a.w != 0) { a = divV( a, a.w); }
                    if(b.w != 0) { b = divV( b, b.w); }
                    if(c.w != 0) { c = divV( c, c.w); }
                    faces.push(F([ a, b, c], dist, red, green, blue, f.o));
                }
            }
        }
    }
    faces.sort((a, b) => b.D - a.D);
    const rasterTrig = [];
    for(let f of faces) {
        for (var p = 0; p < 4; p++) {
            var res = {},
                clip = [];
			switch(p) {
                case 0:
                    res = clippings( V( 0,   0, 0), V( 0, 1, 0), f.P[0], f.P[1], f.P[2]);
                    break;
                case 1:
                    res = clippings( V( 0,ch-1, 0), V( 0,-1, 0), f.P[0], f.P[1], f.P[2]);
                    break;
                case 2:
                    res = clippings( V( 0,   0, 0), V( 1, 0, 0), f.P[0], f.P[1], f.P[2]);
                    break;
                case 3:
                    res = clippings( V(cw-1, 0, 0), V(-1, 0, 0), f.P[0], f.P[1], f.P[2]);
                    break;
            }
            clip[0] = res.f1; clip[0].D = f.D; clip[0].r = f.r; clip[0].g = f.g; clip[0].b = f.b; clip[0].o = f.o;
            clip[1] = res.f2; clip[1].D = f.D; clip[1].r = f.r; clip[1].g = f.g; clip[1].b = f.b; clip[1].o = f.o;
            for(let i = 0; i < res.n; i++) { rasterTrig.push(clip[i]); }
        }
    }
    for(let f of rasterTrig) { trigLines(f); }
}