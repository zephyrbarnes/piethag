class Memory {
    constructor() {
        this.memory = [5415450034];
    }

    get size() {
        return this.memory.length;
    }

    read(address) {
        return this.memory[address];
    }

    writ(address, value) {
        this.memory[address] = value;
    }

    writ(value) {
        this.memory.push(value);
    }
}