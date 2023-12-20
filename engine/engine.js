var world = [];
var ogn = new Mesh('objects/axiOrigin.obj',new V(-0.5,-0.2,-0.5), new V(-90,0,0), new V(0.01,0.01,0.01));
var bod = new Mesh('objects/body.obj',new V(-2,0,0), new V(0,0,0), new V(1,1,1));
var egg = new Mesh('objects/egg.obj',new V(0,0,0), new V(0,0,0), new V(1,1,1));
var cam = new Camera(0.25,new V(0,0,-10),new V(180,180,0));
var light = normalize(cam.P);

function tick() {
    ct.clearRect(0, 0, cw, ch);
    cam.R.y = fx(cam.R.y % 360);
    cam.R.x = Math.max( 90, Math.min( 270, cam.R.x));
    light = normalize(cam.P);
    render(world);
    keysCheck();
}

var id = setInterval(tick, 24);
window.addEventListener('beforeunload', function(e) { clearInterval(id); });