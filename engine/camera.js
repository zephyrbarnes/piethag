export default class Camera {
    constructor(ViewRate, Position, Rotation) {
        this.S = ViewRate;                 /*ViewRate*/
        this.U = new V(0, 1, 0);           /*Plumbing*/
        this.Direction = new V(0, 0, 1);   /*Direction*/
        this.P = Position || new V;        /*Position*/
        this.R = Rotation || new V;        /*Rotation*/
    }
}
