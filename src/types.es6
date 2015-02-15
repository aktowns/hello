export var number_t  = Symbol('number');
export var bool_t    = Symbol('bool');
export var string_t  = Symbol('string');
export var atom_t    = Symbol('atom');
export var list_t    = Symbol('list');
export var array_t   = Symbol('array');
export var comment_t = Symbol('comment');
export var lambda_t  = Symbol('lambda');
export var context_t = Symbol('context');

export var Nil = null;

export default class Types {
  static fromString(str) {
    switch (str) {
      case 'number':  return number_t;
      case 'bool':    return bool_t;
      case 'string':  return string_t;
      case 'atom':    return atom_t;
      case 'list':    return list_t;
      case 'array':   return array_t;
      case 'comment': return comment_t;
      case 'lambda':  return lambda_t;
      case 'context': return context_t;
      default:        throw `unknown type: ${str}`
    }
  }

  static toString(sym) {
    switch (sym) {
      case number_t:  return 'number';
      case bool_t:    return 'bool';
      case string_t:  return 'string';
      case atom_t:    return 'atom';
      case list_t:    return 'list';
      case array_t:   return 'array';
      case comment_t: return 'comment';
      case lambda_t:  return 'lambda';
      case context_t: return 'context' ;
      default:        throw `unknown type: ${str}`
    }
  }
}
