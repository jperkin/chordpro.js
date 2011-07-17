# chordpro.js - ChordPro parser

This is a JavaScript parser for ChordPro files.

## ChordPro format

Basically, take this

    [C]Twinkle [C/E]twinkle [F]little [C]star
    [F]How I [C]wonder [G]what you [C]are

and output this
 
    C       C/E     F      C
    Twinkle twinkle little star
    F     C      G        C
    How I wonder what you are

See examples/syntax.txt or, you know, Google for more details.

## Usage

Currently only ASCII output is supported, more formats will follow.

    var chordpro = require("./chordpro.js");
    var song = "[C]Twinkle [C/E]twinkle [F]little [C]star\n" +
               "[F]How I [C]wonder [G]what you [C]are\n";
    var output = chordpro.to_txt(song);
