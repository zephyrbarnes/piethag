class DozenalMath {
    constructor() {
        this.base = 12;
        this.digits = '0123456789↊↋'; // Dozenal digits
    }

    // Convert a dozenal number to decimal
    toDecimal(num) {
        let decimal = 0;
        for (let i = 0; i < num.length; i++) {
            decimal = decimal * this.base + this.digits.indexOf(num[i]);
        }
        return decimal;
    }

    // Convert a decimal number to dozenal
    toDozenal(num) {
        let dozenal = '';
        while (num > 0) {
            dozenal = this.digits[num % this.base] + dozenal;
            num = Math.floor(num / this.base);
        }
        return dozenal || '0';
    }

    // Convert a trinary number to dozenal
    trinaryToDozenal(num) {
        let decimal = parseInt(num, 3); // Convert trinary to decimal
        return this.toDuodecimal(decimal); // Convert decimal to dozenal
    }

    // Convert a dozenal number to trinary
    dozenalToTrinary(num) {
        let decimal = this.toDecimal(num); // Convert dozenal to decimal
        return decimal.toString(3); // Convert decimal to trinary
    }
}