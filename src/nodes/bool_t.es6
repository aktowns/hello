import NodeT from './node_t';

export default class BoolT extends NodeT {
  constructor(value) {
    super(bool_t, value);
  }
}
