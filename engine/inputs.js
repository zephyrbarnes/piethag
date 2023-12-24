const f = false;

export default class controller {
    keyState = {
        27: f, /*EXITS*/ 87: f, /*W KEY*/
        65: f, /*A KEY*/ 83: f, /*S KEY*/ 68: f, /*D KEY*/
        32: f, /*SPACE*/ 38: f, /*ABOVE*/
        37: f, /*LEFTS*/ 40: f, /*BELOW*/ 39: f, /*RIGHT*/
        13: f  /*ENTER*/
    };

    key = this.keyState;

    constructor(camera) {
        this.camera = camera;
        document.addEventListener('keydown', (e) => this.pass(e, true));
        document.addEventListener('keyup', (e) => this.pass(e, false));
        document.addEventListener("mousemove", (e) => this.cont(e));
        document.addEventListener("mousedown", function(e) { cvs.requestPointerLock(); });
    }
    pass(e, isPressed) { if(e.which in this.keyState) { this.keyState[e.which] = isPressed; e.preventDefault(); } }
    cont(e) {
        var dX = e.movementY, dY = e.movementX;
        this.camera.R.y += dY * this.camera.S;
        this.camera.R.x -= dX * this.camera.S;
        this.camera.R.y = this.camera.R.y % 360;
        this.camera.R.x = max(90, min( 270, this.camera.R.x));
    }
    key(keyCode) { return this.keyState[keyCode]; }
    keysCheck() {
        if(this.key[13]) debug = true; else debug = f;
    
        if (!this.key[87] && this.key[83] || this.key[87] && !this.key[83] ||
            !this.key[38] && this.key[40] || this.key[38] && !this.key[40]) {
            var cameraFacing = mulVector(this.camera.D,this.camera.S);
            if(this.key[87] || this.key[38]) this.camera.P = vecSubVec(this.camera.P, cameraFacing);
            if(this.key[83] || this.key[40]) this.camera.P = vecAddVec(this.camera.P, cameraFacing);
        }
        if (!this.key[65] && this.key[68] || this.key[65] && !this.key[68] ||
            !this.key[37] && this.key[39] || this.key[37] && !this.key[39]) {
            let cameraX = crossProd(this.camera.D,this.camera.U);
                cameraX = normalize(cameraX);
                cameraX = mulVector(cameraX,this.camera.S);
            if(this.key[65] || this.key[37]) this.camera.P = vecAddVec(this.camera.P, cameraX);
            if(this.key[68] || this.key[39]) this.camera.P = vecSubVec(this.camera.P, cameraX);
        }
        if(this.key[27]) document.exitPointerLock();
    }
}