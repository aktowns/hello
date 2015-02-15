import NodeT from './node_t';
import {string_t} from '../types';

export default class StringT extends NodeT {
  constructor(value) {
    super(string_t, value);
  }

  toString() {
    return `@"${this.value}"`;
  }
}
