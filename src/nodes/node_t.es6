export default class NodeT {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  toString() {
    return `@${this.value}`;
  }
}
