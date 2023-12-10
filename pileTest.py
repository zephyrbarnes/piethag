import os
import compile as c

def test_compiling():
    # Define a test case
    input_path = 'test_insert.asm'
    expected_output_path = 'expected_output.bin'
    actual_output_path = 'test_export.bin'

    # Write the test input file
    with open(input_path, 'w') as f:
        f.write('add cur nxt\n')
        f.write('   sub acc idx\n') # Replace with your assembly code

    # Write the expected output file
    with open(expected_output_path, 'w') as f:
        f.write('0100 0000 0001\n') # Replace with the expected binary code
        f.write('0101 0100 0101\n') 

    # Run the compiler
    c.compiling(input_path, actual_output_path)

    # Compare the actual output with the expected output
    with open(expected_output_path, 'r') as expected, open(actual_output_path, 'r') as actual:
        assert expected.read() == actual.read(), 'Test failed: output does not match expected output'

    # Clean up
    os.remove(input_path)
    os.remove(expected_output_path)
    os.remove(actual_output_path)

    print('Test passed')

# Run the test
test_compiling()