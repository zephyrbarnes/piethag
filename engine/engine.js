import Cube from './objects/geometry/cube.js';
import Camera from './camera.js';
import Render from './render.js';
import controller from './inputs.js';
var world = [];
// var ogn = new Mesh('engine/objects/origin.obj',new V(-0.5,-0.2,-0.5), new V(-90,0,0), new V(0.01,0.01,0.01));
// var bod = new Mesh('engine/objects/body.obj',new V(-2,0,0), new V(0,180,0), new V(1,1,1));
// var egg = new Mesh('engine/objects/egg.obj',new V(0,0,0), new V(0,0,0), new V(1,1,1));
// var orb = new IcoSphere(new V(2,0,0), new V(0,0,0), new V(1,1,1), 1);
function New(obj) { world.push(obj); return obj }
var cube = New(new Cube(new V(0,0,0), new V(0,0,0), new V(1,1,1)));
var camera = new Camera(0.05,new V(0,0,-10),new V(180,180,0));
var light = normalize(camera.P);

var keyH = new controller(camera);

function tick() {
    ctx.clearRect(0,0, cw,ch);
    light = normalize(camera.P);
    var stt = performance.now(); Render(world, camera, light);
    ctx.font = '16px Arial'; ctx.fillStyle = 'white';
    ctx.fillText("Render time: " + (performance.now() - stt).toFixed(2) + " ms", 10, 30);
    keyH.keysCheck();
}

var id = setInterval(tick, 24);
window.addEventListener('beforeunload', function(e) { clearInterval(id); });