class T { constructor(x = 0, y = 0) { Object.assign( this, {x:x, y:y})}}
class V { constructor(x = 0, y = 0, z = 0, w = 1) { Object.assign( this, {x:x, y:y, z:z, w:w})}}
class F { constructor(a, b, c, rd = 0, gr = 150, bl = 255, ap = 255, d){ Object.assign( this,
        {a:a, b:b, c:c, rgba:`rgba(${rd}, ${gr}, ${bl}, ${ap})`, d:d})}}

class Cube { constructor( P = new V, R = new V, S = V( 1, 1, 1)) { prc = 1;
    Object.assign( this, {/*Position*/P:P,/*Rotation*/R:R,/*Scale*/S:S, V:[ // Vertex Array
    new V(-1,-1,-1), new V(-1, 1,-1), new V( 1, 1,-1), new V( 1,-1,-1),
    new V( 1, 1, 1), new V( 1,-1, 1), new V(-1, 1, 1), new V(-1,-1, 1)], F:[  // Face Array
    new F( 0, 1, 2), new F( 0, 2, 3), /*SOUTH*/ new F( 4, 3, 2), new F( 3, 4, 5), /*EASTS*/
    new F( 5, 4, 6), new F( 5, 6, 7), /*NORTH*/ new F( 7, 6, 1), new F( 7, 1, 0), /*WESTS*/
    new F( 1, 6, 4), new F( 1, 4, 2), /*ABOVE*/ new F( 5, 7, 0), new F( 5, 0, 3)],/*BELOW*/T:[
    new T( 0, 1), new T( 0, 0), new T( 1, 0), new T( 0, 1), new T( 1, 0), new T( 1, 1),
    new T( 0, 1), new T( 0, 0), new T( 1, 0), new T( 0, 1), new T( 1, 0), new T( 1, 1),
    new T( 0, 1), new T( 0, 0), new T( 1, 0), new T( 0, 1), new T( 1, 0), new T( 1, 1),
    new T( 0, 1), new T( 0, 0), new T( 1, 0), new T( 0, 1), new T( 1, 0), new T( 1, 1),
    new T( 0, 1), new T( 0, 0), new T( 1, 0), new T( 0, 1), new T( 1, 0), new T( 1, 1),
    new T( 0, 1), new T( 0, 0), new T( 1, 0), new T( 0, 1), new T( 1, 0), new T( 1, 1)
    ]}); world.push(this)}}

class Mesh { constructor(path, P = new V, R = new V, S = new V( 1, 1, 1)) { prc = 3;
    Object.assign(this, {/*Position*/P:P,/*Rotation*/R:R,/*Scale*/S:S,/*Vector Array*/V:[],/*Faces*/F:[]});
    loadTexts(path).then( txt => { if (txt !== null) { var lines = txt.split("\n");
    for(var line of lines) { var s = line.split(" "); /*String*/
        if(s[0] == "f") this.F.push(new F((pf(s[1])-1), (pf(s[2])-1), (pf(s[3])-1))); /*Fill Face Array*/
        else if(s[0] == "v") this.V.push(new V(pf(s[1]), pf(s[2]), pf(s[3])));     /*Fill Vector Array*/
}}}); world.push(this)}}

class IcoSphere {constructor( P = new V, R = new V, S = new V(1,1,1), I = 0) { var t = (1 + sqrt(5)) / 2; prc = 2;
    Object.assign( this, {/*Position*/P:P,/*Rotation*/R:R,/*Scale*/S:S,/*Iterations*/I:I,  /*Fill Vector Array*/
    V: [nrml(new V(-1, t, 0)), nrml(new V( 1, t, 0)), nrml(new V(-1,-t, 0)), nrml(new V( 1,-t, 0)),
        nrml(new V( 0,-1, t)), nrml(new V( 0, 1, t)), nrml(new V( 0,-1,-t)), nrml(new V( 0, 1,-t)),
        nrml(new V( t, 0,-1)), nrml(new V( t, 0, 1)), nrml(new V(-t, 0,-1)), nrml(new V(-t, 0, 1))],
    F: [new F( 0,11, 5), new F( 0, 5, 1), new F( 0, 1, 7), new F( 0, 7,10), new F( 0,10,11), /*Fill Face Array*/
        new F( 1, 5, 9), new F( 5,11, 4), new F(11,10, 2), new F(10, 7, 6), new F( 7, 1, 8),
        new F( 3, 9, 4), new F( 3, 4, 2), new F( 3, 2, 6), new F( 3, 6, 8), new F( 3, 8, 9),
        new F( 4, 9, 5), new F( 2, 4,11), new F( 6, 2,10), new F( 8, 6, 7), new F( 9, 8, 1)]});
    this.Tesselate(); world.push(this)}

    middle( v1, v2) {
        var v = middlePnt(this.V[v1], this.V[v2]);
        var i = this.V.findIndex(vertex => vertex.x == v.x && vertex.y == v.y && vertex.z == v.z);
        if (i == -1) return this.V.push(normalize(v)) - 1; else return i;
    }

    Tesselate() {
        for (var i = 0; i < this.I; i++) { var tempFace = [];
            for(let f of this.F) {
                var t = new F(this.middle(f.a, f.b), this.middle(f.b, f.c), this.middle(f.c, f.a))
                tempFace.push(new F(f.a, t.a, t.c));
                tempFace.push(new F(f.b, t.b, t.a));
                tempFace.push(new F(f.c, t.c, t.b));
                tempFace.push(new F(t.a, t.b, t.c));}
            this.F = tempFace;
        }
    }
}

Mesh.prototype.smooth = function() {
    // Create a new array to hold the smoothed vertices
    var smoothedVertices = new Array(this.V.length);

    // For each vertex...
    for (var i = 0; i < this.V.length; i++) {
        // Find the neighboring vertices
        var neighbors = this.F
            .filter(face => face.a === i || face.b === i || face.c === i)
            .flatMap(face => [face.a, face.b, face.c])
            .filter(index => index !== i);

        // Calculate the average position of the neighboring vertices
        var avgX = 0, avgY = 0, avgZ = 0;
        for (var j = 0; j < neighbors.length; j++) {
            avgX += this.V[neighbors[j]].x;
            avgY += this.V[neighbors[j]].y;
            avgZ += this.V[neighbors[j]].z;
        }
        avgX /= neighbors.length;
        avgY /= neighbors.length;
        avgZ /= neighbors.length;

        // Create a new vertex at the average position
        smoothedVertices[i] = new V(avgX, avgY, avgZ);
    }

    // Replace the old vertices with the smoothed vertices
    this.V = smoothedVertices;
}