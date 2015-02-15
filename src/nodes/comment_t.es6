import NodeT        from './node_t';
import {comment_t}  from '../types';

export default class CommentT extends NodeT {
  constructor(value) {
    super(comment_t, value);
  }

  toString() {
    return `@-- ${this.value}`;
  }
}
