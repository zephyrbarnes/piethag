instruct = {'LOD': '0000', #LDR Rd, Rn - Loads the value at the memory address contained in Rn into Rd.
            'STO': '0001', #STR Rd, Rn - Store the value in Rd at the memory address contained in Rn.
            'JMP': '0010', #B label - Unconditional branch to the instruction at the label.
            'CND': '0011', #BEQ label - Branch to the instruction at the label if the last CMP instruction determined that the two values were equal.
            'ADD': '0100', #ADD Rd, Rn, Operand2 - Adds the values in Rn and Operand2, then stores the result in Rd.
            'SUB': '0101', #SUB Rd, Rn, Operand2 - Subtracts Operand2 from Rn, then stores the result in Rd.
            'MUL': '0110', #MUL Rd, Rn, Rm - Multiply the values in Rn and Rm, then store the result in Rd.
            'DIV': '0111',
            'CMP': '1000', #CMP Rn, Operand2 - Compares Rn and Operand2 by subtracting Operand2 from Rn. The result is not stored; only the condition flags are updated.
            'AND': '1001', #AND Rd, Rn, Operand2 - Perform a bitwise AND operation on the values in Rn and Operand2, then store the result in Rd.
            'ORR': '1010', #ORR Rd, Rn, Operand2 - Perform a bitwise OR operation on the values in Rn and Operand2, then store the result in Rd.
            'NOT': '1011'} #MVN Rd, Operand2 - Performs a bitwise logical NOT operation on the value, then store the result in Rd.