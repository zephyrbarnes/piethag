var world = [];
// var ogn = new Mesh('engine/objects/origin.obj',new V(-0.5,-0.2,-0.5), new V(-90,0,0), new V(0.01,0.01,0.01));
// var bod = new Mesh('engine/objects/body.obj',new V(-2,0,0), new V(0,180,0), new V(1,1,1));
// var egg = new Mesh('engine/objects/egg.obj',new V(0,0,0), new V(0,0,0), new V(1,1,1));
// var orb = new IcoSphere(new V(2,0,0), new V(0,0,0), new V(1,1,1), 1);
var cube = new Cube(new V(0,0,0), new V(0,0,0), new V(1,1,1));
var cam = new Camera(0.05,new V(0,0,-10),new V(180,180,0));
var light;

function tick() {
    ct.clearRect(0,0, cw,ch);
    light = normalize(cam.P);
    var start = performance.now(); render(world);

    ct.font = '16px Arial'; ct.fillStyle = 'white';
    ct.fillText("Render time: " + (performance.now() - start).toFixed(2) + " ms", 10, 30);
    keysCheck();
}

var id = setInterval(tick, 24);
window.addEventListener('beforeunload', function(e) { clearInterval(id); });