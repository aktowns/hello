import NodeT from './node_t';
import {array_t} from '../types';

export default class ArrayT extends NodeT {
  constructor(value) {
    super(array_t, value);
  }

  toString() {
    return `@[${this.value}]`;
  }
}
