function TernaryComputer() {
    // Initialize the memory, controller, and processor
    let memory = new Memory();
    let control = new control(memory);
    let process = new process(control);

    const memSize = 21;

    // Define some instructions
    let instructions = [
        { type: 'writ', address: 0, value: 1 },
        { type: 'read', address: 0 },
        // Add more instructions here
    ];

    // Execute the instructions
    for (let instruction of instructions) {
        process.execute(instruction);
    }
}

// Run the main function
TernaryComputer();