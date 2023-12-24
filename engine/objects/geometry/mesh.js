export default class Mesh {
    constructor(path, Position, Rotation, Scale) {
        this.P = Position || new V;
        this.R = Rotation || new V;
        this.S = Scale || new V(1, 1, 1);
        this.V = [];                    /*Vertex Array*/
        this.F = [];                    /*Faces Array*/
        loadTexts(path).then( txt => {
            if (txt !== null) {
                var lines = txt.split("\n"); // Lines Array
                for(var line of lines) {
                    var s = line.split(" "); // Strings Array
                    if(s[0] == "f") this.F.push(new F((pf(s[1])-1), (pf(s[2])-1), (pf(s[3])-1))); /*Fill Face Array*/
                    else if(s[0] == "v") this.V.push(new V(pf(s[1]), pf(s[2]), pf(s[3])));     /*Fill Vector Array*/
                }
            }
        })
    }
}