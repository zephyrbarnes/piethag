/* The term grimoire is a general name given to a variety of texts setting out the names of
 * demons and instructions on how to raise them. Effectively a grimoire is a book of black
 * magic, a book on which a wizard relied for all the necessary advice and instruction on
 * raising spirits and casting spells.
*/

// const fs = require('fs');
const charTrit = 5;
const memSize = memory.memory.length;

const char = {
    '0':'FFFFN', '1':'FFFFT', '2':'FFFNF', '3':'FFFNN', '4':'FFFNT', '5':'FFFTF',               // 0-5
    '6':'FFFTN', '7':'FFFTT', '8':'FFNFF', '9':'FFNFN', '↊':'FFNFT', '↋':'FFNNF',               // 6-↋
    'a':'FFNNN', 'b':'FFNNT', 'c':'FFNTF', 'd':'FFNTN', 'e':'FFNTT', 'f':'FFTFF', 'g':'FFTFN',  // a-g
    'h':'FFTFT', 'i':'FFTNF', 'j':'FFTNN', 'k':'FFTNT', 'l':'FFTTF', 'm':'FFTTN', 'n':'FFTTT',  // h-n
    'o':'FNFFF', 'p':'FNFFN', 'q':'FNFFT', 'r':'FNFNF', 's':'FNFNN', 't':'FNFNT', 'u':'FNFTF',  // o-u
    'v':'FNFTN', 'w':'FNFTT', 'x':'FNNFF', 'y':'FNNFN', 'z':'FNNFT',                            // v-z
    'A':'FNNNF', 'B':'FNNNN', 'C':'FNNNT', 'D':'FNNTF', 'E':'FNNTN', 'F':'FNNTT', 'G':'FNTFF',  // A-G
    'H':'FNTFN', 'I':'FNTFT', 'J':'FNTNF', 'K':'FNTNN', 'L':'FNTNT', 'M':'FNTTF', 'N':'FNTTN',  // H-N
    'O':'FNTTT', 'P':'FTFFF', 'Q':'FTFFN', 'R':'FTFFT', 'S':'FTFNF', 'T':'FTFNN', 'U':'FTFNT',  // O-U
    'V':'FTFTF', 'W':'FTFTN', 'X':'FTFTT', 'Y':'FTNFF', 'Z':'FTNFN',                            // V-Z
    '.':'FTNFT', ',':'FTNNF', ';':'FTNNN', ':':'FTNNT', "'":'FTNTF', '"':'FTNTN', '!':'FTNTT',
    '?':'FTTFF', '@':'FTTFN', '#':'FTTFT', '$':'FTTNF', '%':'FTTNN', '^':'FTTNT', '&':'FTTTF',
    '*':'FTTTN', '(':'FTTTT', ')':'NFFFF', '_':'NFFFN', '+':'NFFFT', '-':'NFFNF', '=':'NFFNN',
    '{':'NFFNT', '}':'NFFTF', '[':'NFFTN', ']':'NFFTT', ' ':'NFNFF',
    '|':'NFNFN', '/':'NFNFT', '\\':'NFNNF', '\\n':'NFNNN', '\\t':'NFNNT',
}

const rach = {
    'FFFFN':'0', 'FFFFT':'1', 'FFFNF':'2', 'FFFNN':'3', 'FFFNT':'4', 'FFFTF':'5',
    'FFFTN':'6', 'FFFTT':'7', 'FFNFF':'8', 'FFNFN':'9', 'FFNFT':'↊', 'FFNNF':'↋',
    'FFNNN':'a', 'FFNNT':'b', 'FFNTF':'c', 'FFNTN':'d', 'FFNTT':'e', 'FFTFF':'f', 'FFTFN':'g',
    'FFTFT':'h', 'FFTNF':'i', 'FFTNN':'j', 'FFTNT':'k', 'FFTTF':'l', 'FFTTN':'m', 'FFTTT':'n',
    'FNFFF':'o', 'FNFFN':'p', 'FNFFT':'q', 'FNFNF':'r', 'FNFNN':'s', 'FNFNT':'t', 'FNFTF':'u',
    'FNFTN':'v', 'FNFTT':'w', 'FNNFF':'x', 'FNNFN':'y', 'FNNFT':'z',
    'FNNNF':'A', 'FNNNN':'B', 'FNNNT':'C', 'FNNTF':'D', 'FNNTN':'E', 'FNNTT':'F', 'FNTFF':'G',
    'FNTFN':'H', 'FNTFT':'I', 'FNTNF':'J', 'FNTNN':'K', 'FNTNT':'L', 'FNTTF':'M', 'FNTTN':'N',
    'FNTTT':'O', 'FTFFF':'P', 'FTFFN':'Q', 'FTFFT':'R', 'FTFNF':'S', 'FTFNN':'T', 'FTFNT':'U',
    'FTFTF':'V', 'FTFTN':'W', 'FTFTT':'X', 'FTNFF':'Y', 'FTNFN':'Z',
    'FTNFT':'.', 'FTNNF':',', 'FTNNN':';', 'FTNNT':':', 'FTNTF':"'", 'FTNTN':'"', 'FTNTT':'!',
    'FTTFF':'?', 'FTTFN':'@', 'FTTFT':'#', 'FTTNF':'$', 'FTTNN':'%', 'FTTNT':'^', 'FTTTF':'&',
    'FTTTN':'*', 'FTTTT':'(', 'NFFFF':')', 'NFFFN':'_', 'NFFFT':'+', 'NFFNF':'-', 'NFFNN':'=',
    'NFFNT':'{', 'NFFTF':'}', 'NFFTN':'[', 'NFFTT':']', 'NFNFF':' ',
    'NFNFN':'|', 'NFNFT':'/', 'NFNNF':'\\', 'NFNNN':'\\n', 'NFNNT':'\\t'
}

// let output = '';
// for (let key in rach) {
//     output += `'${key}':'${rach[key]}', `;
// }

// fs.writeFile('test.txt', output, (err) => {
//     if (err) throw err;
//     console.log('The file has been saved!');
// });

//LDR Rd, Rn - Loads the value at the memory address contained in Rn into Rd.
//STR Rd, Rn - Store the value in Rd at the memory address contained in Rn.
// JMP = B label - Unconditional branch to the instruction at the label.
// CND = BEQ label - Branch to the instruction at the label if the last CMP instruction determined that the two values were equal.
//ADD Rd, Rn, Operand2 - Adds the values in Rn and Operand2, then stores the result in Rd.
//SUB Rd, Rn, Operand2 - Subtracts Operand2 from Rn, then stores the result in Rd.
//MUL Rd, Rn, Rm - Multiply the values in Rn and Rm, then store the result in Rd.
//CMP Rn, Operand2 - Compares Rn and Operand2 by subtracting Operand2 from Rn. The result is not stored; only the condition flags are updated.
//AND Rd, Rn, Operand2 - Perform a bitwise AND operation on the values in Rn and Operand2, then store the result in Rd.
//ORR Rd, Rn, Operand2 - Perform a bitwise OR operation on the values in Rn and Operand2, then store the result in Rd.
// NOT = MVN Rd, Operand2 - Performs a bitwise logical NOT operation on the value, then store the result in Rd.

const step = {
    'lod':'FF', 'load':'FF', 'LOD':'FF', 'LOAD':'FF',
    'sto':'FN', 'stor':'FN', 'STI':'FN', 'STOR':'FN',
    'jmp':'FT', 'jump':'FT', 'JMP':'FT', 'JUMP':'FT',
    'add':'NF', 'ADD':'NF',
    'sub':'NN', 'SUB':'NN',
    'mul':'NT', 'MUL':'NT',
    'div':'TF', 'DIV':'TF'
    // TN, TT
}

const type = {
    'trt':'FF', 'trit':'FF', 'TRT':'FF', 'TRIT':'FF',
    'chr':'FN', 'char':'FN', 'CHR':'FN', 'CHAR':'FN',
    'int':'FT', 'INT':'FT',
    'flt':'NF', 'float':'NF', 'FLT':'NF', 'FLOAT':'NF',
    'lng':'NN', 'long':'NN', 'LONG':'NN',
    'dbl':'NT', 'double':'NT', 'DBL':'NT', 'DOUBLE':'NT',
    'str':'TF', 'string':'TF', 'STR':'TF', 'STRING':'TF',
    'fle':'TN', 'file':'TN', 'FLE':'TN', 'FILE':'TN',
    'arr':'TT', 'array':'TT', 'ARR':'TT', 'ARRAY':'TT'
}

const test = {
    'cnd':'FF', 'cond':'FF', 'CND':'FF', 'COND':'FF',
    'cmp':'FN', 'compare':'FN', 'CMP':'FN', 'COMPARE':'FN',
    'and':'FT', 'AND':'FT',
    'or':'NF', 'OR':'NF', 'orr':'NF', 'ORR':'NF',
    'not':'NN', 'NOT':'NN', 'mvn':'NN', 'MVN':'NN',
    'els':'NT', 'else':'NT', 'ELS':'NT', 'ELSE':'NT'
}

class Encoder {

    encode(string) {
        let encoded = '';
        for (let chr of string) { encoded += char[chr]; }
        return encoded;
    }

}

class Decoder {

    string(string) {
        let decoded = '';
        for (let i = 0; i < string.length; i += 5) {
            let chr = string.slice(i, i+5);
            if (rach.hasOwnProperty(chr)) decoded += rach[chr];
            else { throw new Error(`Character "${chr}" is not supported.`); }
        }
        return decoded;
    }

    step(string) {
        let tokens = [];
        let step = string.slice(0, 2);
        switch (step) {
            case 'FF':
                tokens.push('load');
                let register = string.slice(2, 5);
                tokens.push(this.parseValue(register));
                let address = string.slice(5, 5+21);
                tokens.push(this.parseValue(address));
                let rest = string.slice(5+21);
                let type = this.type(rest);
                break;
            case 'FN': decoded += 'stow'; break;
            case 'FT': decoded += 'jump'; break;
            case 'NF': decoded += 'add'; break;
            case 'NN': decoded += 'sub'; break;
            case 'NT': decoded += 'mul'; break;
            case 'TF': decoded += 'div'; break;
            default: throw new Error('Invalid step type');
        }
        return decoded;
    }

    type(string) {
        let decoded = '';
        for (let i = 0; i < string.length; i += 2) {
            let chr = string.slice(i, i+2);
            if (type.hasOwnProperty(chr)) decoded += type[chr];
            else { throw new Error(`Character "${chr}" is not supported.`); }
        }
        return decoded;
    }

    test(string) {
        let decoded = '';
        for (let i = 0; i < string.length; i += 2) {
            let chr = string.slice(i, i+2);
            if (test.hasOwnProperty(chr)) decoded += test[chr];
            else { throw new Error(`Character "${chr}" is not supported.`); }
        }
        return decoded;
    }

    parseValue(string) {
        let len = string.length;
        let value = 0;
        for (let i = 0; i < len; i++) {
            if(string[i] == 'N') value += Math.pow(3, len-i);
            if(string[i] == 'T') value += 2 * Math.pow(3, len-i);
        }
        return value;
    }

}