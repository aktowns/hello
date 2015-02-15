import _ from 'lodash';
import Parsimmon from 'parsimmon';
import {regex, string, optWhitespace, alt, lazy} from 'parsimmon';

import AtomT from './nodes/atom_t';
import NumberT from './nodes/number_t';
import ListT from './nodes/list_t';
import StringT from './nodes/string_t';
import ArrayT from './nodes/array_t';

export default class Parser {
  constructor(source) {
    this.source = source;
  }

  parse() {
    const atom_rgx = regex(/[a-zA-Z_][\w\-\.]*/i);
    const number_rgx = regex(/-?(0|[1-9]\d*)([.]\d+)?(e[+-]?\d+)?/i);
    const comment_rgx = regex(/.*?\n/i);
    const string_rgx = regex(/"((?:\\.|.)*?)"/, 1);

    const lbrack = Parser.lexeme(string('['));
    const rbrack = Parser.lexeme(string(']'));
    const lparen = Parser.lexeme(string('('));
    const rparen = Parser.lexeme(string(')'));
    const quote  = Parser.lexeme(string("'"));
    const atom   = Parser.lexeme(atom_rgx).map((x) => new AtomT(x));

    const comment = string('--').then(comment_rgx).map((x) => new CommentT(x));

    const stringLiteral = Parser.lexeme(string_rgx).map((x) => {
      var str = Parser.interpretEscapes(x);
      return new StringT(str.substring(1, str.length - 1));
    });

    const numberLiteral = Parser.lexeme(number_rgx).map((x) => new NumberT(parseInt(x)));

    const arrayLiteral = lbrack.then(alt(atom, numberLiteral, stringLiteral).many()).skip(rbrack).map((xs) => {
      return new ArrayT(xs);
    });

    const expr = lazy('s-expression', () => alt(form, atom, numberLiteral, stringLiteral, arrayLiteral, comment));

    const form = lparen.then(expr.many()).skip(rparen).map((xs) => new ListT(xs));

    const topLevel = lazy('top level', () => expr.atLeast(1));

    const tree = topLevel.parse(this.source);
    if (!tree.status) {
      console.log(`Failed to parse: ${this.source}`);
      throw Parsimmon.formatError(this.source, tree);
    }
    // console.log(require('util').inspect(tree.value, true, 10));

    return tree;
  }

  static lexeme(p) {
    return p.skip(optWhitespace);
  }

  static interpretEscapes(str) {
    var escapes = {
      b: '\b',
      f: '\f',
      n: '\n',
      r: '\r',
      t: '\t'
    };

    return str.replace(/\\(u[0-9a-fA-F]{4}|[^u])/, function (_, escape) {
      var type = escape.charAt(0);
      var hex = escape.slice(1);
      if (type === 'u') return String.fromCharCode(parseInt(hex, 16));
      if (escapes.hasOwnProperty(type)) return escapes[type];
      return type;
    });
  }
}
