# piethag
Comments: There are three types of comments in this assembly language:

1. Single Line Comments: Any text following \\ on a line is ignored.
2. In Line Comments: Any text following \\ and preceding // on a line is ignored.
3. Multiline Comments: Any text following \\ and preceding // across multiple lines is ignored.

# Assembly Language Instructions

## Primitive Functions

- `lod:0000`: Load a value from a register.
- `sto:0001`: Store a value into a register.
- `ref:0010`: References an execution in a different part of the program.
- `cnd:0011`: If the first operand is true, it executes the second operand.

## Arithmetic Functions

- `add:0100`: Add two values.
- `sub:0101`: Subtract two values.
- `mul:0110`: Multiply two values.
- `div:0111`: Divide two values.

## Logical Functions

- `cmp:1000`: Compare two operands.
- `and:1001`: Returns true if both operands are true.
- `orr:1010`: Returns true if at least one operand is true.
- `not:1011`: Returns opposite boolean of operand.

## Data Types

### Primitive Data Types

- `bln:0000`: Boolean data type representing a binary true or false.
- `chr:0001`: Character data type representing a character.
- `int:0010`: Integer data type representing whole numbers with a range from -32,768 to 32,767.

### Numeric Data Types

- `flt:0011`: Float data type representing float numbers with a range from -32,767 to 32,767.99998. A precision of 5 decimal places.
- `dbl:0100`: Double data type representing a double with a range of -32,767 to 32,767.9999999998. A precision of 10 decimal places.
- `lng:0101`: Long data type representing long numbers with a range of -2,147,483,648 to 2,147,483,647.

### Pointer and Function Data Types

- `ptr:0110`: Pointer data type represents a 32-bit memory address of another value.
- `fnc:0111`: Function data type represents a short string that is a 64-bit pointer to a function in memory.

### Complex Data Types

- `str:1000`: String data type represents a 64-bit pointer to a sequence of characters in memory.
- `arr:1001`: Array data type representing a collection of the same data type. The number of elements stored as a 16-bit integer at the beginning of the array. The maximum size of an array is 65,535 elements.

### Object-Oriented Data Types

- `obj:1010`: Object data type represents an instance of a class. It holds three pointers to arrays the first of which is an array of its parent classes relevant data types, the second the equivalent data for those types, and third either a pointer to the parent classes array of methods or a pointer to its own array of methods which hold a clone of the parent classes method array.
- `cls:1011`: Class data type represents a blueprint for creating objects (Class instance). It stores a 64-bit pointer to a block of memory that contains the data for an instance of the class. This block of memory includes the values of the class's properties, as well as an array of 8-bit pointers to the class's methods.




Registers:The assembly language uses registers to store values. The lod instruction loads a value from a register, and the sto instruction stores a value into a register. The registers are referred to as rf1, rf2, etc. in the instructions.