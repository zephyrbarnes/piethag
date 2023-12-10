import textwrap

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

def generates(struct, inputs):
    binary = instruct[struct] # Translate the instruction to binary code
    for input in inputs: # Translate each argument to binary code
        if input in relevant: binary += ' ' + relevant[input]
        elif input in variable: binary += ' ' + variable[input]
        else: binary += ' ' + input
    return binary

def compiling(input_path, output_path):
    with open(input_path, 'r') as input_file, open(output_path, 'w') as output_file:
        prevDent = 0
        inputs = []
        cmnt = False
        for line in input_file:
            line = line.rstrip() # Remove trailing whitespace
            currDent = len(line) - len(textwrap.dedent(line)) # Calculate indentation level
            if '\\' in line:
                cmnt = True
                line = line[:line.find('\\')] # Keep only the part before '\\'
            if '//' in line:
                cmnt = False
                line = line[line.find('//')+2:] # Keep only the part after '//'
            if not cmnt:
                continue
            if currDent > prevDent: # If the current line is indented more than the previous line
                inputs.append(line.strip()) # Add the current line to the inputs of the previous line
            else:
                tkns = line.split()
                struct = tkns[0] # The first token is the instruction
                inputs = tkns[1:] # The remaining tokens are the arguments
                binary = generates(struct, inputs) # Generate binary code
                output_file.write(binary + '\n') # Write the binary code to the output file
            prevDent = currDent # Update the previous indentation level