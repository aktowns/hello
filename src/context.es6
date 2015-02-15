import _ from 'lodash';

import {context_t} from './types';

export default class Context {
  constructor(scope = {}) {
    this.scope = scope;
    this.type = context_t;
  }

  clone() {
    var that = _.extend({}, this);
    that.scope = _.extend({}, this.scope);
    return that;
  }
}
