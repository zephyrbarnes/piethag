class MemoryController {
    constructor(memory) {
        this.memory = memory;
    }

    read(address) {
        if (address < 0 || address >= this.mem.size) {
            throw new Error('Invalid memory address');
        }
        return this.mem.read(address);
    }

    writ(address, value) {
        if (address < 0 || address >= this.mem.size) {
            throw new Error('Invalid memory address');
        }
        if (value < -1 || value > 1) {
            throw new Error('Invalid trit value');
        }
        this.mem.writ(address, value);
    }
}