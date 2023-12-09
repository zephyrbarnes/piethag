\\
Comments in this assembly language can be written in three ways:
1. Single Line Comments: Any text following `\\` on a line is ignored.
    add rf1 rf2 \\ This is a comment
2. In Line Comments: Any text following `\\` and preceding `//` on a line is ignored.
    add \\First Reference// rf1 \\Second Reference// rf2
3. Multiline Comments: Any text following `\\` and preceding `//` across multiple lines is ignored.
    The example is the the comment syntax documentation as a whole.
//

\\ Operations
typ lod reg rf1 \\ Load a variety of value types from a register
typ sto rf1 reg \\ Stow a variety of value types into a register
typ cmp rf1 rf2 \\ Compare a variety of the same value types
cnd rf1 rf2 \\ If reference one is true executes reference two

typ add rf1 rf2 \\ Add a variety of value types
typ sub rf1 rf2 \\ Subtract a variety of value types
typ mul rf1 rf2 \\ Multiply a variety of value types
typ div rf1 rf2 \\ Divide a variety of value types

\\ Operators
and rf1 rf2 \\ Returns true if both references are true
ore rf1 rf2 \\ Returns true if one reference is true
xor rf1 rf2 \\ Returns true if onr reference is true and one is false
not rf1 \\ Negates a boolean value