import NodeT from './node_t';
import {number_t} from '../types';

export default class NumberT extends NodeT {
  constructor(value) {
    super(number_t, value);
  }
}
