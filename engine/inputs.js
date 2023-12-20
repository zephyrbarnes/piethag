const f = false, t = true;
class controller {
    keyState = {
        27: f, /*EXITS*/ 87: f, /*W KEY*/
        65: f, /*A KEY*/ 83: f, /*S KEY*/ 68: f, /*D KEY*/
        32: f, /*SPACE*/ 38: f, /*ABOVE*/
        37: f, /*LEFTS*/ 40: f, /*BELOW*/ 39: f, /*RIGHT*/
        13: f  /*ENTER*/
    };

    constructor() {
        document.addEventListener('keydown', (e) => this.pass(e, true));
        document.addEventListener('keyup', (e) => this.pass(e, false));
        document.addEventListener("mousemove", (e) => this.cont(e));
        //document.addEventListener("mousedown", function(e) { cv.requestPointerLock(); });
    }
    pass(e, isPressed) { if(e.which in this.keyState) { this.keyState[e.which] = isPressed; e.preventDefault(); } }
    cont(e) {
        var roteSp = 0.1;
        var deltaX = e.movementY;
        var deltaY = e.movementX;
    
        cam.R.x -= deltaX * roteSp;
        cam.R.y += deltaY * roteSp;
    }
    key(keyCode) { return this.keyState[keyCode]; }
}

var keyH = new controller(), key = keyH.keyState;

function keysCheck() {
    if(key[13]) debug = t; else debug = f;

    if(!key[87] && key[83] || key[87] && !key[83] || !key[38] && key[40] || key[38] && !key[40]) {
        camF = mulVector(cam.D,cam.M);
        if(key[87] || key[38]) cam.P = vecSubVec(cam.P,camF);
        if(key[83] || key[40]) cam.P = vecAddVec(cam.P,camF);
    }
    if(!key[65] && key[68] || key[65] && !key[68] || !key[37] && key[39] || key[37] && !key[39]) {
        let camX = crossProd(cam.D,cam.U);
            camX = divVector(camX,sqrt(inProduct(camX,camX)));
            camX = mulVector(camX,cam.M);
        if(key[65] || key[37]) cam.P = vecAddVec(cam.P,camX);
        if(key[68] || key[39]) cam.P = vecSubVec(cam.P,camX);
    }
    if(key[27]) document.exitPointerLock();
}