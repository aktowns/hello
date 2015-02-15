import NodeT from './node_t';
import {atom_t} from '../types';

export default class AtomT extends NodeT {
  constructor(value) {
    super(atom_t, value);
  }
}
