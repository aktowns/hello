import fs from "fs";
import _ from "lodash";

import Parser from "./parser";
import Native from "./native";
import Context from "./context";
import Evaluator from "./evaluator";

// is there no way to call an infix function
Number.prototype.add    = function (y) { return this + y; };
Number.prototype.min    = function (y) { return this - y; };
Number.prototype.mul    = function (y) { return this * y; };
Number.prototype.div    = function (y) { return this / y; };
Number.prototype.mod    = function (y) { return this % y; };

Array.prototype.nth     = function (y) { return this[y] };
Array.prototype.head    = function () { return _.head(this); };
Array.prototype.tail    = function () { return _.tail(this); };
Array.prototype.rest    = function () { return _.rest(this); };
Array.prototype.initial = function () { return _.initial(this); };
Array.prototype.flatten = function () { return _.flatten(this); };
Array.prototype.insert  = function (index, item) {
  var a = this.slice();
  a.splice(index, 0, item);
  return a;
};

function run(str, ctx) {
  var parser = new Parser(str),
      tree = parser.parse();

  if (_.isArray(tree.value)) {
    _.each(tree.value, (x) => Evaluator.evalExpr(x, ctx));
  } else {
    Evaluator.evalExpr(tree.value, ctx);
  }
}

function evaluate(str, ctx = undefined) {
  if (ctx == undefined) {
    ctx = new Context();
    ctx.scope['VERSION'] = new Native(_.curry(() => '0.0.1'));

    evaluateFile("./core/external.hl", ctx);
    evaluateFile("./core/core.hl", ctx);
  }

  run(str, ctx);
}

function evaluateFile(filename, ctx = undefined) {
  var contents = fs.readFileSync(filename, {encoding: "utf8"});
  evaluate(contents, ctx);
}

if (typeof process != undefined && typeof process.argv != undefined) {
  evaluateFile(process.argv[2]);
}
