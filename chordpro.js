/*
 * Copyright (c) 2011 Jonathan Perkin <jonathan@perkin.org.uk>
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

/*
 * Project page:  http://github.com/jperkin/chordpro.js/
 * Personal page: http://www.perkin.org.uk/
 */

/*
 * Shamelessly based on mustache.js as I have no JS skills and likely Jan has
 * lots I can steal^Wre-use.  One day I might actually understand all this :)
 */
var ChordPro = function() {
  var Renderer = function() {};

  Renderer.prototype = {
    chordregex: /\[([^\]]*)\]/,
    inword: /[a-z]$/,
    buffer: [],

    send: function(line) {
      this.buffer.push(line);
    },

    /* Parse a ChordPro template */
    parse: function(template) {
      if (!template) {
        return;
      }
      template.split("\n").forEach(function(line, linenum) {
        /* Comment, ignore */
        if (line.match(/^#/)) {
          return;
        }
        /* Chord line */
        if (line.match(this.chordregex)) {
          var chords = "";
          var lyrics = "";
          var chordlen = 0;
          line.split(this.chordregex).forEach(function(word, pos) {
            var dash = 0;
            /* Lyrics */
            if ((pos % 2) == 0) {
              lyrics = lyrics + word;
              /*
               * Whether or not to add a dash (within a word)
               */
              if (word.match(this.inword)) {
                dash = 1;
              }
              /*
               * Apply padding.  We never want two chords directly adjacent,
               * so unconditionally add an extra space.
               */
              if (word && word.length < chordlen) {
                chords = chords + " ";
                lyrics = (dash == 1) ? lyrics + "- " : lyrics + "  ";
                for (i = chordlen - word.length - dash; i != 0; i--) {
                  lyrics = lyrics + " ";
                }
              }
              else if (word && word.length == chordlen) {
                chords = chords + " ";
                lyrics = (dash == 1) ? lyrics + "-" : lyrics + " ";
              }
              else if (word && word.length > chordlen) {
                for (i = word.length - chordlen; i != 0; i--) {
                  chords = chords + " ";
                }
              }
            }
            /* Chords */
            else {
              chord = word.replace(/[[]]/, "");
              chordlen = chord.length;
              chords = chords + chord;
            }
          }, this);
          this.send(chords + "\n" + lyrics);
          return;
        }
        /* Commands, ignored for now */
        if (line.match(/^{.*}/)) {
          return;
        }
        /* Anything else */
        this.send(line);
      }, this);
    },
  };

  return({
    name: "chordpro.js",
    version: "0.0.1",

    to_txt: function(template) {
      var renderer = new Renderer();
      renderer.parse(template);
      return renderer.buffer.join("\n");
    }
  });
}();

exports.name = ChordPro.name;
exports.version = ChordPro.version;

exports.to_txt = ChordPro.to_txt;
