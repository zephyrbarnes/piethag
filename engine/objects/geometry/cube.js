export default class Cube {
    constructor(Position, Rotation, Scale, imagePath, textured) {
        this.P = Position || new V;
        this.R = Rotation || new V;
        this.S = Scale || new V(1, 1, 1);
        this.IP = imagePath || null;
        if(this.IP) { this.I = new Image(); this.I.src = this.IP } else { this.I = null }
        this.tx = textured || false;

        this.V = [ // Vertex Array
            new V(-1,-1,-1), new V(-1, 1,-1), new V( 1, 1,-1), new V( 1,-1,-1),
            new V( 1, 1, 1), new V( 1,-1, 1), new V(-1, 1, 1), new V(-1,-1, 1)];

        this.F = [ // Faces Array
            new F(0, 1, 2), new F(0, 2, 3), /*SOUTH*/
            new F(4, 3, 2), new F(3, 4, 5), /*EASTS*/
            new F(5, 4, 6), new F(5, 6, 7), /*NORTH*/
            new F(7, 6, 1), new F(7, 1, 0), /*WESTS*/
            new F(1, 6, 4), new F(1, 4, 2), /*ABOVE*/
            new F(5, 7, 0), new F(5, 0, 3)];/*BELOW*/

        for(var n = 0; n < this.F.length; n += 2) {
            this.F[n].t = [new T(0, 1), new T(0, 0), new T(1, 0)];
            this.F[n + 1].t = [new T(0, 1), new T(1, 0), new T(1, 1)]
        }

        if(this.tx) {
            this.F[ 0].t = [new T(0, 1), new T(0, 0), new T(1, 0)];
            this.F[ 1].t = [new T(0, 1), new T(1, 0), new T(1, 1)];
            this.F[ 2].t = [new T(1, 1), new T(1, 0), new T(2, 0)];
            this.F[ 3].t = [new T(1, 1), new T(2, 0), new T(2, 1)];
            this.F[ 4].t = [new T(2, 1), new T(2, 0), new T(3, 0)];
            this.F[ 5].t = [new T(2, 1), new T(3, 0), new T(3, 1)];
            this.F[ 6].t = [new T(3, 1), new T(3, 0), new T(4, 0)];
            this.F[ 7].t = [new T(3, 1), new T(4, 0), new T(4, 1)];
            this.F[ 8].t = [new T(4, 1), new T(4, 0), new T(5, 0)];
            this.F[ 9].t = [new T(4, 1), new T(5, 0), new T(5, 1)];
            this.F[10].t = [new T(5, 1), new T(5, 0), new T(6, 0)];
            this.F[11].t = [new T(5, 1), new T(6, 0), new T(6, 1)]
        }
}}