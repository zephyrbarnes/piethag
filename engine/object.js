class T { constructor(x = 0, y = 0) { Object.assign( this, {x:x, y:y})}}
class V { constructor(x = 0, y = 0, z = 0, w = 1) { Object.assign( this, {x:x, y:y, z:z, w:w})}}
class F { constructor(i, j, k, r = 0, g = 150, b = 255, a = 255, d){ Object.assign( this,
        { i:i, j:j, k:k, rgba:`rgba(${r},${g},${b},${a})`, d:d})}}

class Cube { constructor( P = new V, R = new V, S = V( 1, 1, 1)) { prc = 1;
    Object.assign( this, {/*Position*/P:P,/*Rotation*/R:R,/*Scale*/S:S, V:[ // Vertex Array
    new V(-1,-1,-1), new V(-1, 1,-1), new V( 1, 1,-1), new V( 1,-1,-1),
    new V( 1, 1, 1), new V( 1,-1, 1), new V(-1, 1, 1), new V(-1,-1, 1)], F:[  // Face Array
    new F( 0, 1, 2), new F( 0, 2, 3), /*SOUTH*/ new F( 4, 3, 2), new F( 3, 4, 5), /*EASTS*/
    new F( 5, 4, 6), new F( 5, 6, 7), /*NORTH*/ new F( 7, 6, 1), new F( 7, 1, 0), /*WESTS*/
    new F( 1, 6, 4), new F( 1, 4, 2), /*ABOVE*/ new F( 5, 7, 0), new F( 5, 0, 3)],/*BELOW*/
    }); world.push(this)}}

class Mesh { constructor(path, P = new V, R = new V, S = new V( 1, 1, 1)) { prc = 3;
    Object.assign(this, {/*Position*/P:P,/*Rotation*/R:R,/*Scale*/S:S,/*Vector Array*/V:[],/*Faces*/F:[]});
    loadTexts(path).then( txt => { if (txt !== null) { var lines = txt.split("\n");
    for(var line of lines) { var s = line.split(" "); /*String*/
        if(s[0] == "f") this.F.push(new F((pf(s[1])-1), (pf(s[2])-1), (pf(s[3])-1))); /*Fill Face Array*/
        else if(s[0] == "v") this.V.push(new V(pf(s[1]), pf(s[2]), pf(s[3])));     /*Fill Vector Array*/
}}}); world.push(this)}}

class IcoSphere {constructor( P = new V, R = new V, S = new V(1,1,1), I = 0) { var t = (1 + sqrt(5)) / 2; prc = 2;
    Object.assign( this, {/*Position*/P:P,/*Rotation*/R:R,/*Scale*/S:S,/*Iterations*/I:I,/*Fill Vector Array*/
    V: [nrml(new V(-1, t, 0)), nrml(new V( 1, t, 0)), nrml(new V(-1,-t, 0)), nrml(new V( 1,-t, 0)),
        nrml(new V( 0,-1, t)), nrml(new V( 0, 1, t)), nrml(new V( 0,-1,-t)), nrml(new V( 0, 1,-t)),
        nrml(new V( t, 0,-1)), nrml(new V( t, 0, 1)), nrml(new V(-t, 0,-1)), nrml(new V(-t, 0, 1))],
    F: [new F(0,11, 5), new F(0, 5, 1), new F( 0, 1, 7), new F( 0, 7,10), new F(0,10,11),  /*Fill Face Array*/
        new F(1, 5, 9), new F(5,11, 4), new F(11,10, 2), new F(10, 7, 6), new F(7, 1, 8),
        new F(3, 9, 4), new F(3, 4, 2), new F( 3, 2, 6), new F( 3, 6, 8), new F(3, 8, 9),
        new F(4, 9, 5), new F(2, 4,11), new F( 6, 2,10), new F( 8, 6, 7), new F(9, 8, 1)]});
    this.Tesselate(); world.push(this)}

    mid(v1, v2) {
        var v = middlePnt(this.V[v1], this.V[v2]);
        var n = this.V.findIndex(vt => vt.x == v.x && vt.y == v.y && vt.z == v.z);
        if (n == -1) return this.V.push(nrml(v)) - 1;
        else return n}

    Tesselate() {
        for (var n = 0; n < this.I; n++) { var tempFace = [];
            for(let f of this.F) {
                var t = new F(this.mid(f.i,f.j), this.mid(f.j,f.k), this.mid(f.k,f.i))
                tempFace.push(new F(f.i,t.i,t.k));
                tempFace.push(new F(f.j,t.j,t.i));
                tempFace.push(new F(f.k,t.k,t.j));
                tempFace.push(new F(t.i,t.j,t.k))}
        this.F = tempFace}
    }
}