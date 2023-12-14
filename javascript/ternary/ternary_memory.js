class TrinaryMemory {
    constructor() {
        this.memory = [];
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