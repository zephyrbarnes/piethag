# Dictionary to map assembly instructions to machine code
inst_set = {
    'lod': '0000', 'sto': '0001', 'red': '0010', 'cnd': '0011',
    'add': '0100', 'sub': '0101', 'mul': '0110', 'div': '0111',
    'cmp': '1000', 'and': '1001', 'orr': '1010', 'not': '1011'}

# Dictionary to map data types to machine code
type_set = {
    'bln': '0000', 'chr': '0001', 'ptr': '0010', 'fnc': '0011',
    'int': '0100', 'flt': '0101', 'dbl': '0110', 'lng': '0111',
    'str': '1000', 'arr': '1001', 'obj': '1010', 'cls': '1011'}

# Dictionary to map registers to machine code
data_set = {
    'acc': '0000', 'idx': '0001', 'top': '0010', 'bot': '0011',
    'nex': '0100', 'cur': '0101'}

def parse_line(line):
    # Split the line into tokens
    tokens = line.split()

    # The first token is the instruction
    instruction = tokens[0]

    # The remaining tokens are the arguments
    args = tokens[1:]

    return instruction, args

def generate_code(instruction, args):
    machine = inst_set[instruction]

    # Translate each argument to machine code
    for arg in args:
        if arg in data_set: machine += ' ' + data_set[arg]
        elif arg in type_set: machine += ' ' + type_set[arg]
        else: machine += ' ' + arg

    return machine