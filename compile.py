instruct = { # Dictionary to map assembly instructions to binary code
    'lod': '0000', 'sto': '0001', 'ref': '0010', 'cnd': '0011',
    'add': '0100', 'sub': '0101', 'mul': '0110', 'div': '0111',
    'cmp': '1000', 'and': '1001', 'orr': '1010', 'not': '1011'}

variable = { # Dictionary to map data types to binary code
    'bln': '0000', 'chr': '0001', 'int': '0010', 'flt': '0011',
    'dbl': '0100', 'lng': '0101', 'ptr': '0110', 'fnc': '0111',
    'str': '1000', 'arr': '1001', 'obj': '1010', 'cls': '1011'}

relevant = { # Dictionary to map registers to binary code
    'cur': '0000', 'nxt': '0001', 'top': '0010', 'bot': '0011',
    'acc': '0100', 'idx': '0101'}

def lod(type, address):
    value = relevant['cur'] = memory[address] # Store the value in the current register
    # Determine the register based on the value type
    if type == 'chr': register =
    elif type == 'str':
        if len(value) > 256: # If string exceeds 256 characters, split it into multiple strings
            value = [value[i:i+256] for i in range(0, len(value), 256)]
            lod('arr', len(value)) # Load the array length into the current register
    elif type == 'fnc': register =
    elif type == 'int': register =
    elif type == 'bln': register =
    elif type == 'chr': register =
    elif type == 'flt': register =
    elif type == 'int': register =
    elif type == 'int': register =
    elif type == 'int': register =
    elif type == 'int': register =
    elif type == 'int': register =
    else:
        raise ValueError(f"Invalid value type: {type}")
    value = memory[address] # Read the value from the memory address

    # Store this value in the register
    relevant[register] = value

def analyzing(line):
    tokens = line.split() # Split the line into tokens
    struct = tokens[0] # The first token is the instruction
    inputs = tokens[1:] # The remaining tokens are the arguments
    return struct, inputs

def generates(struct, inputs):
    binary = instruct[struct] # Translate the instruction to binary code
    for input in inputs: # Translate each argument to binary code
        if input in relevant: binary += ' ' + relevant[input]
        elif input in variable: binary += ' ' + variable[input]
        else: binary += ' ' + input
    return binary

def compiling(input_path, output_path):
    with open(input_path, 'r') as input_file, open(output_path, 'w') as output_file:
        for line in input_file:
            line = line.strip() # Remove leading and trailing whitespace
            if not line or line.startswith('#'): # Skip empty lines and comments
                continue
            struct, inputs = analyzing(line) # Parse the line
            binary = generates(struct, inputs) # Generate binary code
            output_file.write(binary + '\n') # Write the binary code to the output file