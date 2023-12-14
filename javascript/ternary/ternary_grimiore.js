const char = {
    '0':'FFFF0', '1':'FFFFT', '2':'FFF0F', '3':'FFF00', '4':'FFF0T', '5':'FFFTF', '6':'FFFT0', '7':'FFFTT', '8':'FF0FF', '9':'FF0F0', '↊':'FF0FT', '↋':'FF00F',
    'a':'FF000', 'b':'FF00T', 'c':'FF0TF', 'd':'FF0T0', 'e':'FF0TT', 'f':'FFTFF', 'g':'FFTF0', 'h':'FFTFT', 'i':'FFT0F',
    'j':'FFT00', 'k':'FFT0T', 'l':'FFTTF', 'm':'FFTT0', 'n':'FFTTT', 'o':'F0FFF', 'p':'F0FF0', 'q':'F0FFT', 'r':'F0F0F',
    's':'F0F00', 't':'F0F0T', 'u':'F0FTF', 'v':'F0FT0', 'w':'F0FTT', 'x':'F00FF', 'y':'F00F0', 'z':'F00FT', '.':'F000F',
    'A':'F0000', 'B':'F000T', 'C':'F00TF', 'D':'F00T0', 'E':'F00TT', 'F':'F0TFF', 'G':'F0TF0', 'H':'F0TFT', 'I':'F0T0F',
    'J':'F0T00', 'K':'F0T0T', 'L':'F0TTF', 'M':'F0TT0', 'N':'F0TTT', 'O':'FTFFF', 'P':'FTFF0', 'Q':'FTFFT', 'R':'FTF0F',
    'S':'FTF00', 'T':'FTF0T', 'U':'FTFTF', 'V':'FTFT0', 'W':'FTFTT', 'X':'FT0FF', 'Y':'FT0F0', 'Z':'FT0FT', '?':'FT00F',
    '':'FT000', '':'FT00T', '':'FT0TF', '':'FT0T0', '':'FT0TT', '':'FTTFF',
    '':'FTTF0', '':'FTTFT', '':'FTT0F', '':'FTT00', '':'FTT0T', '':'FTTTF', '':'FTTT0', '':'FTTTT', '':'0FFFF', '':'0FFF0', '':'0FFFT', '':'0FF0F',
    '':'0FF00', '':'0FF0T', '':'0FFTF', '':'0FFT0', '':'0FFTT', '':'0F0FF', '':'0F0F0', '':'0F0FT', '':'0F00F', '':'0F000', '':'0F00T', '':'0F0TF',
    '':'0F0T0', '':'0F0TT', '':'0FTFF', '':'0FTF0', '':'0FTFT', '':'0FT0F', '':'0FT00', '':'0FT0T', '':'0FTTF', '':'0FTT0', '':'0FTTT', '':'00FFF',
    '':'00FF0', '':'00FFT', '':'00F0F', '':'00F00', '':'00F0T', '':'00FTF', '':'00FT0', '':'00FTT', '':'000FF', '':'000F0', '':'000FT', '':'0000F',
    '':'00000', '':'0000T', '':'000TF', '':'000T0', '':'000TT', '':'00TFF', '':'00TF0', '':'00TFT', '':'00T0F', '':'00T00', '':'00T0T', '':'00TTF',
    '':'00TT0', '':'00TTT', '':'0TFFF', '':'0TFF0', '':'0TFFT', '':'0TF0F', '':'0TF00', '':'0TF0T', '':'0TFTF', '':'0TFT0', '':'0TFTT', '':'0T0FF',
    '':'0T0F0', '':'0T0FT', '':'0T00F', '':'0T000', '':'0T00T', '':'0T0TF', '':'0T0T0', '':'0T0TT', '':'0TTFF', '':'0TTF0', '':'0TTFT', '':'0TT0F',
    '':'0TT00', '':'0TT0T', '':'0TTTF', '':'0TTT0', '':'0TTTT', '':'TFFFF', '':'TFFF0', '':'TFFFT', '':'TFF0F', '':'TFF00', '':'TFF0T', '':'TFFTF',
    '':'TFFT0', '':'TFFTT', '':'TF0FF', '':'TF0F0', '':'TF0FT', '':'TF00F', '':'TF000', '':'TF00T', '':'TF0TF', '':'TF0T0', '':'TF0TT', '':'TFTFF',
    '':'TFTF0', '':'TFTFT', '':'TFT0F', '':'TFT00', '':'TFT0T', '':'TFTTF', '':'TFTT0', '':'TFTTT', '':'T0FFF', '':'T0FF0', '':'T0FFT', '':'T0F0F',
    '':'T0F00', '':'T0F0T', '':'T0FTF', '':'T0FT0', '':'T0FTT', '':'T00FF', '':'T00F0', '':'T00FT', '':'T000F', '':'T0000', '':'T000T', '':'T00TF',
    '':'T00T0', '':'T00TT', '':'T0TFF', '':'T0TF0', '':'T0TFT', '':'T0T0F', '':'T0T00', '':'T0T0T', '':'T0TTF', '':'T0TT0', '':'T0TTT', '':'TTFFF',
    '':'TTFF0', '':'TTFFT', '':'TTF0F', '':'TTF00', '':'TTF0T', '':'TTFTF', '':'TTFT0', '':'TTFTT', '':'TT0FF', '':'TT0F0', '':'TT0FT', '':'TT00F',
    '':'TT000', '':'TT00T', '':'TT0TF', '':'TT0T0', '':'TT0TT', '':'TTTFF', '':'TTTF0', '':'TTTFT', '':'TTT0F', '':'TTT00', '':'TTT0T', '':'TTTTF',
    '':'TTTT0', '':'TTTTT'
}

const step = {
    'load':'00', 'stow':'0T', 'jump':'0F', 'cond':'T0', '????':'TT',
    'add':'TF', 'sub':'F0', 'mul':'FT', 'div':'FF'
}

const type = {
    'trt':'00',
    'chr':'0T',
    'int':'0F', 'flt':'T0', 'lng':'TT', 'dbl':'TF',
    'str':'F0',
}

const nums =   {
    '0':'000', '1':'00T', '2':'00F',
    '3':'0T0', '4':'0TT', '5':'0TF',
    '6':'0F0', '7':'0FT', '8':'0FF',
    '9':'T00', '↊':'T0T', '↋':'T0F',
    '+':'TT0', '-':'TTT', '*':'TTF', '/':'TF0',
    '^':'TFT', '√':'TFF', '!':'F00', '%':'F0T',
    '(':'F0F', ')':'FT0', '=':'FTT', '&':'FTF',
    'FF0':'FF0', 'FFT':'FFT', 'FFF':'FFF'
}