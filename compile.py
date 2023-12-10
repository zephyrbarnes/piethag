instruct = {'lod': '0000', 'sto': '0001', 'ref': '0010', 'cnd': '0011', # Dictionary to map assembly instructions to binary code
            'add': '0100', 'sub': '0101', 'mul': '0110', 'div': '0111',
            'cmp': '1000', 'and': '1001', 'orr': '1010', 'not': '1011'}

variable = {'bln': '0000', 'chr': '0001', 'int': '0010', 'flt': '0011', # Dictionary to map data types to binary code
            'dbl': '0100', 'lng': '0101', 'ptr': '0110', 'fnc': '0111',
            'str': '1000', 'arr': '1001', 'obj': '1010', 'cls': '1011'}

relevant = {'cur': '0000', 'nxt': '0001', 'top': '0010', # Dictionary to map registers to binary code
            'bot': '0011', 'acc': '0100', 'idx': '0101'}

def generates(struct, inputs):
    binary = instruct[struct] # Translate the instruction to binary
    for input in inputs: # Translate each argument to binary code
        if input in relevant:   binary += ' ' + relevant[input]
        elif input in variable: binary += ' ' + variable[input]
        else: binary += ' ' + input
    return binary

def compiling(input_path, output_path):
    with open(input_path, 'r') as input_file, open(output_path, 'w') as output_file:
        cmnt = False
        for line in input_file:
            line = line.rstrip()
            if '\\' in line: cmnt = True;  line = line[:line.find('\\')]   # Keep anything befor '\\'
            if '//' in line: cmnt = False; line = line[line.find('//')+2:] # Keep anything after '//'
            if cmnt:
                print(f"Skipping line: {line}")
                continue
            else:
                print(f"Processing line: {line}")
                tkns = line.split()
                struct = tkns[0]; inputs = tkns[1:] # Intake tokens
                binary = generates(struct, inputs) # Generate binary code
                output_file.write(binary + '\n') # Write the binary code to the output file