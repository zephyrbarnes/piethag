export default class IcoSphere {
    constructor(Position, Rotation, Scaling, Iterate) {
        this.P = Position || new V;
        this.R = Rotation || new V;
        this.S = Scaling || new V(1,1,1);
        this.I = Iterate || 0;
        var temp = (1 + sqrt(5)) / 2;
        this.V = [
            normalize(new V(-1, t, 0)), normalize(new V( 1, t, 0)),
            normalize(new V(-1,-t, 0)), normalize(new V( 1,-t, 0)),
            normalize(new V( 0,-1, t)), normalize(new V( 0, 1, t)),
            normalize(new V( 0,-1,-t)), normalize(new V( 0, 1,-t)),
            normalize(new V( t, 0,-1)), normalize(new V( t, 0, 1)),
            normalize(new V(-t, 0,-1)), normalize(new V(-t, 0, 1))];
        this.F = [
            new F(0,11, 5), new F(0, 5, 1), new F( 0, 1, 7), new F( 0, 7,10), new F(0,10,11),  /*Fill Face Array*/
            new F(1, 5, 9), new F(5,11, 4), new F(11,10, 2), new F(10, 7, 6), new F(7, 1, 8),
            new F(3, 9, 4), new F(3, 4, 2), new F( 3, 2, 6), new F( 3, 6, 8), new F(3, 8, 9),
            new F(4, 9, 5), new F(2, 4,11), new F( 6, 2,10), new F( 8, 6, 7), new F(9, 8, 1)];

        for (var n = 0; n < this.I; n++) { var tempFace = [];
            for(let face of this.F) {
                temp = new F(this.mid(face.i, face.j), this.mid(face.j, face.k), this.mid(face.k, face.i))
                tempFace.push(new F(face.i, temp.i, temp.k));
                tempFace.push(new F(face.j, temp.j, temp.i));
                tempFace.push(new F(face.k, temp.k, temp.j));
                tempFace.push(new F(temp.i, temp.j, temp.k))
            }
            this.F = tempFace
        }
    }

    mid(v1, v2) {
        var v = middlePnt(this.V[v1], this.V[v2]);
        var n = this.V.findIndex(vt => vt.x == v.x && vt.y == v.y && vt.z == v.z);
        if (n == -1) return this.V.push(normalize(v)) - 1;
        else return n
    }
}