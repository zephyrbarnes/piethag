const cos = Math.cos;
const sin = Math.sin;
const tan = Math.tan;
const sqrt = Math.sqrt;
const pi = Math.PI, dg = pi / 180;
const pf = parseFloat;
const cv = document.getElementById('cv'), ct = cv.getContext('2d'),
cw = cv.width = window.innerWidth, ch = cv.height = window.innerHeight;
var nie=0.1, far=1000, fov=90, rt=cw/ch, dbug = false, lod = 0;

class V {constructor(x=0,y=0,z=0,w=1){Object.assign(this,{x:x,y:y,z:z,w:w})}}
class T {constructor(a,b,c,rgb='0,150,255'){Object.assign(this,{a:a,b:b,c:c,rgb:rgb})}}
class Trig {constructor(a,b,c,d,rgb) {Object.assign(this,{a:a,b:b,c:c,d:d,rgb:rgb});}}

var EM = function() { return [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]; }
var IM = function() { return [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]; }

class Cube {constructor(P=new V,R=new V,S=new V(1,1,1)){Object.assign(this,{P:P,R:R,S:S,V:[//⢀⢀⣠⣴⣾⣿⣷⣦⣄⡀
    new V(-1,-1,-1),new V(-1, 1,-1),new V( 1, 1,-1),new V( 1,-1,-1),//Vertex Collection      ⢈⠻⢿⣿⣿⣿⣿⡿⢋⣡
    new V( 1, 1, 1),new V( 1,-1, 1),new V(-1, 1, 1),new V(-1,-1, 1)],T:[//Trig Array         ⢸⣿⣶⣌⡙⢋⣥⣾⣿⣿
	new T(0,1,2),new T(0,3,2),/*SOUTH*/new T(4,3,2),new T(3,4,5),//EASTS                     ⢸⣿⣿⣿⣿⢸⣿⣿⣿⣿
    new T(5,4,6),new T(5,6,7),/*NORTH*/new T(7,6,1),new T(7,1,0),//WESTS                     ⠈⠙⠿⣿⣿⢸⣿⣿⠟⠋
    new T(1,6,4),new T(1,4,2),/*ABOVE*/new T(5,7,0),new T(5,0,3)]//BELOW                           ⠁⠉⠁
}); world.push(this); }}

class Mesh { constructor(p /*Mesh Path*/, P = new V, R = new V, S = new V||new V(1,1,1)) {
    Object.assign(this, {P:P, /*Position*/ R:R, /*Rotation*/ S:S, /*Scale*/ V:[],/*Vector Array*/T:[]/*Triangles*/});
    loadTexts(p).then( txt => { if (txt !== null) { let ln = txt.split("\n"); for(let l of ln) {let s = l.split(" ");
        if(s[0] == "v") { this.V.push(new V(pf(s[1]), pf(s[2]), pf(s[3]))); }else/*Fills Mesh Vector Array*/
        if(s[0] == "f") { this.T.push(new T(pf(s[1])-1, pf(s[2])-1, pf(s[3])-1)); } /*Fills Mesh Triangle Array*/
}}}); world.push(this); }}

class Camera {constructor(S,P=new V,R=new V) {
    Object.assign(this, {P:P,/*Position*/R:R,/*Rotation*/S:S,/*Speed*/D:new V(0,0,1),/*Direction*/U:new V(0,1,0)/*Up direction*/});
}}

function matMulVec(m,v) { return new V(
    fx(v.x*m[0][0] + v.y*m[1][0] +v.z*m[2][0] + v.w*m[3][0]),
    fx(v.x*m[0][1] + v.y*m[1][1] +v.z*m[2][1] + v.w*m[3][1]),
    fx(v.x*m[0][2] + v.y*m[1][2] +v.z*m[2][2] + v.w*m[3][2]),
    fx(v.x*m[0][3] + v.y*m[1][3] +v.z*m[2][3] + v.w*m[3][3]))
}

async function loadTexts(f) {
    try{ let r = await fetch(f),t;
    if(!r.ok) {throw new Error();}
    t = await r.text(); return t;}
catch(e){ console.error(e); return null; }}

function divVector(v,k) { return new V(fx(v.x/k),fx(v.y/k),fx(v.z/k)); }
function mulVector(v,k) { return new V(fx(v.x*k),fx(v.y*k),fx(v.z*k)); }

function vecMulVec(v1,v2) { return new V(fx(v1.x*v2.x),fx(v1.y*v2.y),fx(v1.z*v2.z)); }
function vecDivVec(v1,v2) { return new V(fx(v1.x/v2.x),fx(v1.y/v2.y),fx(v1.z/v2.z)); }

function vecAddVec(v1,v2) { return new V(fx(v1.x+v2.x),fx(v1.y+v2.y),fx(v1.z+v2.z)); }
function vecSubVec(v1,v2) { return new V(fx(v1.x-v2.x),fx(v1.y-v2.y),fx(v1.z-v2.z)); }

function inProduct(v1,v2) { return (v1.x*v2.x) + (v1.y*v2.y) + (v1.z*v2.z); }
function crossProd(l1,l2) { return new V(l1.y*l2.z - l1.z*l2.y, l1.z*l2.x - l1.x*l2.z, l1.x*l2.y - l1.y*l2.x); }
function normalize(v) { return divVector(v,fx(sqrt(inProduct(v,v)))); }

function fx(v,n) { if(!n) { n = lod; } return pf(v.toFixed(n)); }

function rotations(v) { const [x,y,z] = [v.x*dg,v.y*dg,v.z*dg], m = new IM;
    const [cx,cy,cz,sx,sy,sz] = [cos(x),cos(y),cos(z),sin(x),sin(y),sin(z)];
    const [cxz,ces,sec,szx] = [cx*cz,sz*cx,cz*sx,sz*sx];
    m[0][0] = fx(cz*cy); m[0][1] = fx(-ces + sec*sy); m[0][2] = fx( szx + cxz*sy);//m[0][3] = 0
    m[1][0] = fx(sz*cy); m[1][1] = fx( cxz + szx*sy); m[1][2] = fx(-sec + ces*sy);//m[1][3] = 0
    m[2][0] = fx( -sy ); m[2][1] = fx( cy * sx );     m[2][2] = fx( cy * cx );    //m[2][3] = 0
  //m[3][0] = 0          m[3][1] = 0                  m[3][2] = 0                 //m[3][3] = 1
return m; }

function projected() { const rad =  1 / tan( fov * dg / 180 * pi ), rex = fx(rad*rt*ch/100),
    ryd = fx(rad*rt*ch/100), zed = fx(far/(far-nie)), nid = fx(-nie*zed), m = new EM;
    m[0][0] = rex;//m[0][1] = 0     m[0][2] = 0     m[0][3] = 0
  /*m[1][0] = 0*/   m[1][1] = ryd;//m[1][2] = 0     m[1][3] = 0
  /*m[2][0] = 0     m[2][1] = 0*/   m[2][2] = zed;  m[2][3] = 1;
  /*m[3][0] = 0     m[3][1] = 0*/   m[3][2] = nid;//m[3][3] = 0
return m; }

function pointingC(p,t,u) { const
    fd = normalize(vecSubVec(t,p)),
    ud = normalize(vecSubVec(u,mulVector(fd,inProduct(u, fd)))),
    rd = crossProd(ud,fd), m = new IM;
    m[0][0] = fx(rd.x); m[0][1] = fx(rd.y); m[0][2] = fx(rd.z);//m[0][3] = 0
    m[1][0] = fx(ud.x); m[1][1] = fx(ud.y); m[1][2] = fx(ud.z);//m[1][3] = 0
    m[2][0] = fx(fd.x); m[2][1] = fx(fd.y); m[2][2] = fx(fd.z);//m[2][3] = 0
    m[3][0] = fx(p.x);  m[3][1] = fx(p.y);  m[3][2] = fx(p.z); //m[3][3] = 1
return m; }

function intersect(plane_p,plane_n,lineStart,lineEnd) {
    plane_n = normalize(plane_n); let plane_d = inProduct(plane_n,plane_p),
    a_dir = inProduct(lineStart,plane_n), b_dir = inProduct(lineEnd,plane_n),
    t = (plane_d - a_dir) / (b_dir - a_dir), lineStartEnd = vecSubVec(lineEnd,lineStart),
    lineToSect = mulVector(lineStartEnd,t);
return vecAddVec(lineStart,lineToSect); }

function clippings(plane_p,plane_n,a,b,c) { plane_n = normalize(plane_n); let res = { n:1, t1:Trig, t2:Trig };
    function dist(p) { let n = normalize(p); return (plane_n.x*p.x + plane_n.y*p.y + plane_n.z*p.z - inProduct(plane_n, plane_p)); };
    let ad = dist(a), bd = dist(b), cd = dist(c), inP = [], outP = [], inPNum = 0, outPNum = 0;
    if(ad >= 0) { inP[inPNum++] = a; }else{ outP[outPNum++] = a; }
    if(bd >= 0) { inP[inPNum++] = b; }else{ outP[outPNum++] = b; }
    if(cd >= 0) { inP[inPNum++] = c; }else{ outP[outPNum++] = c; }
    if(inPNum == 1 && outPNum == 2) {
        res.t1 = new Trig(inP[0],intersect(plane_p,plane_n,inP[0],outP[0]),intersect(plane_p,plane_n,inP[0],outP[1])); return res; }
    if(inPNum == 2 && outPNum == 1) { res.n = 2; res.t1 = new Trig(inP[0],inP[1],intersect(plane_p,plane_n,inP[0],outP[0]));
        res.t2 = new Trig(inP[1],res.t1.c,intersect(plane_p,plane_n,inP[1],outP[0])); return res; }
    if(inPNum == 3) { res.t1 = new Trig(a,b,c); return res; }
    if(inPNum == 0) { res.n = 0; return res; }
}

function qInversed(m) { let r = new IM;
    for(let i = 0; i < 3; i++) { for(let j = 0; j < 3; j++) { r[i][j] = m[j][i]; }}
    r[3][0] = fx(-((m[3][0]*r[0][0]) + (m[3][1]*r[1][0]) + (m[3][2]*r[2][0])));
    r[3][1] = fx(-((m[3][0]*r[0][1]) + (m[3][1]*r[1][1]) + (m[3][2]*r[2][1])));
    r[3][2] = fx(-((m[3][0]*r[0][2]) + (m[3][1]*r[1][2]) + (m[3][2]*r[2][2])));
return r; }

function trigLines(t) { ct.fillStyle = t.rgb;
    if(dbug) { ct.strokeStyle = 'pink'; }else{ ct.strokeStyle = t.rgb; }
    ct.beginPath(); ct.moveTo(t.a.x+cw/2,t.a.y+ch/2);
    ct.lineTo(t.b.x+cw/2,t.b.y+ch/2); ct.lineTo(t.c.x+cw/2,t.c.y+ch/2); ct.lineTo(t.a.x+cw/2,t.a.y+ch/2);
    ct.stroke(); ct.fill(); ct.closePath();
}

function render(world) {
    let camT = new V(0,0,1), camM = rotations(new V(0,cam.R.y,0));
        cam.D = matMulVec(camM,camT); camT = vecAddVec(cam.P,cam.D);
    const camP = qInversed(pointingC(cam.P,camT,cam.U)), camR = rotations(new V(cam.R.x,0,0)), pane = projected(), triangles = [];
    for(let obj of world) { const rotates = rotations(obj.R), vc = [];
        for(let v of obj.V) { let sv = vecMulVec(v,obj.S), rv = matMulVec(rotates,sv), tv = vecAddVec(rv,obj.P); vc.push(tv); }
        for(let f of obj.T) {
            let a = vc[f.a], b = vc[f.b], c = vc[f.c];
            let ad = vecSubVec(a,cam.P), bd = vecSubVec(b,cam.P), cd = vecSubVec(c,cam.P);
            let d = (sqrt(inProduct(ad,ad)) + sqrt(inProduct(bd,bd)) + sqrt(inProduct(cd,cd))) / 3;
            let normal = crossProd(vecSubVec(b,a),vecSubVec(c,a)); normal = divVector(normal,sqrt(inProduct(normal,normal)));
            let nl = inProduct(normal,ad); if(d < 100){lod=8;}else if(d < 200) {lod=2;}else{lod=0;}
            if(nl < 0) {
                a = matMulVec(camP,a), b = matMulVec(camP,b), c = matMulVec(camP,c);
                a = matMulVec(camR,a), b = matMulVec(camR,b), c = matMulVec(camR,c);
                let clip = [], res = clippings(new V(0,0,nie),new V(0,0,1),a,b,c); clip[0] = res.t1; clip[1] = res.t2;
                for(let i = 0; i < res.n; i++) {
                    let dp = fx(inProduct(normal,lt)), [rd,gn,bl] = f.rgb.split(",");
                    rd = fx(abs((rd-20)*dp + 20),0); gn = fx(abs((gn-50)*dp + 50),0); bl = fx(abs((bl-50)*dp + 50),0);
                    a = matMulVec(pane,clip[i].a), b = matMulVec(pane,clip[i].b), c = matMulVec(pane,clip[i].c);
                    if(a.w != 0) { a = divVector(a,a.w); } if(b.w != 0) { b = divVector(b,b.w); } if(c.w != 0) { c = divVector(c,c.w); }
                    triangles.push(new Trig(a,b,c,d,`rgb(${rd}, ${gn}, ${bl})`));
                }
            }
        }
    }
    triangles.sort((a, b) => b.d - a.d);
    const rasterTrig = [];
    for(let t of triangles) {
        for (p = 0; p < 4; p++) { let res = {}, clip = [];
			switch(p) {
                case 0: res = clippings(new V(0,0,0),new V(0,1,0),t.a,t.b,t.c); break;
                case 1:	res = clippings(new V(0,ch-1,0),new V(0,-1,0),t.a,t.b,t.c); break;
                case 2:	res = clippings(new V(0,0,0),new V(1,0,0),t.a,t.b,t.c); break;
                case 3:	res = clippings(new V(cw-1,0,0),new V(-1,0,0),t.a,t.b,t.c); break;
            }
            clip[0] = res.t1; clip[0].d = t.d; clip[0].rgb = t.rgb;
            clip[1] = res.t2; clip[1].d = t.d; clip[1].rgb = t.rgb;
            for(let i = 0; i < res.n; i++) { rasterTrig.push(clip[i]); }
        }
    }
    for(let t of rasterTrig) { trigLines(t); }
}
var world = [];
var ogn = new Mesh('axiOrigin.obj',new V, new V(-90,0,0), new V(0.25,0.25,0.25));
var bod = new Mesh('reduced.obj',new V(0,0,2), new V, new V(1,1,1));
var mountains = new Mesh('mountains.obj',new V(0,-30,0),new V(0,0,0),new V(1,1,1));
var cam = new Camera(0.25,new V(0,0,0),new V(180,180,0));
var lt = new V(0,0,-1); lt = divVector(lt,sqrt(inProduct(lt,lt)));

function tick() {
    ct.clearRect(0, 0, cw, ch);
    cam.R.y = fx(cam.R.y % 360);
    cam.R.x = Math.max( 90, Math.min( 270, cam.R.x));
    bod.R.x++; bod.R.y++;
    render(world);
    keysCheck();
}
var id = setInterval(tick, 120);
window.addEventListener('beforeunload', function(e) { clearInterval(id); });