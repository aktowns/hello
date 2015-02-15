import _ from 'lodash';

import NodeT from './node_t';
import {list_t} from '../types';

export default class ListT extends NodeT {
  constructor(value) {
    super(list_t, value);
  }

  toString() {
    return `@(${this.value})`;
  }

  head() {
    return _.head(this.value);
  }

  tail() {
    return _.tail(this.value);
  }
}
