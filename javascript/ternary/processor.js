const fs = require('fs');
const enc = grimiore.Encoder(), dec = grimiore.Decoder();

class Processor {
    constructor(control) {
        this.mem = control;
        this.reg = new Array[27];
    }

    func(input) {
        let { step, token } = this.pars(input);

        switch (step) {
            case 'load': this.reg[token[0]] = this.mem.read(token[1]); break;
            case 'stow': this.mem.writ(token[0], token[1]); break;
            // case 'jump':
            // case 'cond':
            // case 'add':
            //     switch (token[0]) {

            //     }
            // case 'sub':
            //     switch (token[0]) {
            //         case 'int':
            //         case 'flt':
            //         case 'dbl':
            //         case 'lng':
            //     }
            // case 'mul':
            //     switch (token[0]) {
            //         case 'int':
            //         case 'flt':
            //         case 'dbl':
            //         case 'lng':
            //     }
            // case 'div':
            //     switch (token[0]) {
            //         case 'int':
            //         case 'flt':
            //         case 'dbl':
            //         case 'lng':
            //     }
            default:
                throw new Error('Invalid input type');
        }
    }

    pars(instruction) {
        let token = instruction.split(' ');
        if (token.length < 1) {
            throw new Error('Invalid instruction');
        }
    
        let step = token[0];
    
        return step, token;
    }

}

function generateCombinations() {
    const trits = ['F', 'N', 'T'];
    const length = 2;
    const combinations = [];

    const helper = (current) => {
        if (current.length === length) {
            combinations.push(current);
            return;
        }

        for (let trit of trits) {
            helper(current + trit);
        }
    };

    helper('');
    return combinations;
}

let combinations = generateCombinations();
let output = '';
for(let combination of combinations) {
    output += "'':'" + combination + "',\n";
}

fs.writeFile('test.txt', output, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});