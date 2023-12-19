function V( x = 0, y = 0, z = 0) { return {x:x, y:y, z:z, w:1}}
function F( points = [], dist, red = 0, green = 0, blue = 0, opacity = 255) { return {P:points, D:dist, r:red, g:green, b:blue, o:opacity}}

class Cube {
    constructor( position = new V, rotation = new V, scale = V( 1, 1, 1)){
        Object.assign( this, { P:position, R:rotation, S:scale,
        V: [V(-1,-1,-1), V(-1, 1,-1), V( 1, 1,-1), V( 1,-1,-1),                       /*Fills Cube Vector Array*/
            V( 1, 1, 1), V( 1,-1, 1), V(-1, 1, 1), V(-1,-1, 1)],
        F: [F([0,1,2]),F([0,3,2]),/*SOUTH*/F([4,3,2]),F([3,4,5]),/*EASTS              Fills Cube F Array*/
            F([5,4,6]),F([5,6,7]),/*NORTH*/F([7,6,1]),F([7,1,0]),/*WESTS*/
            F([1,6,4]),F([1,4,2]),/*ABOVE*/F([5,7,0]),F([5,0,3])]/*BELOW*/
}); world.push(this);}}

class Mesh {
    constructor( path, position = new V, rotation = new V, scale = new V || new V( 1, 1, 1)) {
        Object.assign( this, { P:position, R:rotation, S:scale, /*Vector Array*/ V:[], /*Faces Array*/ F:[] });
        loadTexts(path).then( txt => {
            if (txt !== null) {
                var lines = txt.split("\n"); /*Split Text*/
                for(let line of lines) {
                    var s = line.split(" "); /*s = split String */
                    if(s[0] == "v") this.V.push( V( pf(s[1]), pf(s[2]), pf(s[3])));   /*Fills Mesh Vector Array*/
                    else if(s[0] == "f") {                                              /*Fills Mesh F Array*/
                        var Trig = [];
                        for(var i = 1; i < s.length; i++) { Trig.push( pf(s[i]) - 1); }
                        this.F.push(F(T));
}}}}); world.push(this);}}

class IcoSphere {
    constructor( position = new V, rcr = 0, rotation = new V, scale = new V || new V( 1, 1, 1)) {
        var t = (1 + sqrt(5)) / 2;
        Object.assign( this, { P:position, rcr:rcr, R:rotation, S:scale,
        V: [V(-1,  t,  0), V( 1,  t,  0), V(-1, -t,  0), V( 1, -t,  0),             /*Fills Sphere Vector Array*/
            V( 0, -1,  t), V( 0,  1,  t), V( 0, -1, -t), V( 0,  1, -t),
            V( t,  0, -1), V( t,  0,  1), V(-t,  0, -1), V(-t,  0,  1)],
        F: [F([ 0,11, 5]), F([ 0, 5, 1]), F([ 0, 1, 7]), F([ 0, 7,10]),   /*Fills Sphere F Array*/
            F([ 0,10,11]), F([ 1, 5, 9]), F([ 5,11, 4]), F([11,10, 2]),
            F([10, 7, 6]), F([ 7, 1, 8]), F([ 3, 9, 4]), F([ 3, 4, 2]),
            F([ 3, 2, 6]), F([ 3, 6, 8]), F([ 3, 8, 9]), F([ 4, 9, 5]),
            F([ 2, 4,11]), F([ 6, 2,10]), F([ 8, 6, 7]), F([ 9, 8, 1])]});
        this.Tesselate();
        world.push(this);
    }

    getMiddle( v1, v2) { // return index of point in the middle of v1 and v2
        var mid = middle( v1, v2);
        if(this.V.includes(mid)) return this.V.indexOf(mid);
        else this.V.push(mid);
    }

    Tesselate() {
        for (var i = 0; i < this.rcr; i++) {
            var tempFace = [];
            for(let f in this.F) { // replace triangle by 4 triangles
                var a = getMiddle(f.P[0], f.P[1]);
                var b = getMiddle(f.P[1], f.P[2]);
                var c = getMiddle(f.P[2], f.P[0]);

                tempFace.push(F([f.P[0], a, c]));
                tempFace.push(F([f.P[1], b, a]));
                tempFace.push(F([f.P[2], c, b]));
                tempFace.push(F([     a, b, c]));
            }
            this.F = tempFace;
        }
    }
}