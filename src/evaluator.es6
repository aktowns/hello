import _        from 'lodash';

import Types    from './types'
import Context  from './context';
import ListT    from './nodes/list_t';
import {number_t, list_t, array_t, atom_t, string_t, lambda_t, Nil} from './types';

export class Lambda {
  constructor(arglist, body, ctx) {
    this.argList = arglist;
    this.body = body;
    this.ctx = ctx;
    this.type = lambda_t;
  }

  run() {
    var args = Array.prototype.slice.call(arguments),
      scope = null;

    if (args.length == this.argList.length) {
      scope = _.extend(this.ctx.scope, _.object(this.argList, args));
      return Evaluator.evalExpr(this.body, new Context(scope));
    } else {
      scope = _.extend(this.ctx.scope, _.object(this.argList.slice(0, args.length), args));
      var left = this.argList.slice(args.length);
      return new Lambda(left, this.body, new Context(scope))
    }
  }
}

export default class Evaluator {
  static evalNumber(expr) {
    return expr.value;
  }

  static evalAtom(expr, ctx) {
    return ctx.scope[expr.value] || Nil;
  }

  static evalString(expr, ctx) {
    return expr.value;
  }

  static evalArray(expr, ctx) {
    return _.map(expr.value, (x) => Evaluator.evalExpr(x, ctx));
  }

  static applyFFIList1(expr, ctx) {
    const func = expr.head().value.split('.'),
          args = _.map(expr.tail(), (x) => Evaluator.evalExpr(x, ctx)),
          scoped = _.foldl(func, ((m, x) => m[x]), global);

    return scoped.apply(_.head(args), _.tail(args));
  }

  static applyFFIList(expr, ctx) {
    const func = expr.head().value.split('.'),
          args = _.map(expr.tail(), (x) => Evaluator.evalExpr(x, ctx)),
          scoped = _.foldl(func, ((m, x) => m[x]), global);

    return scoped.apply(null, args);
  }

  static applyList(expr, ctx) {
    const target = ctx.scope[expr.head().value];
    if (typeof target == 'undefined') {
      throw new Error(`the function '${expr.head()}' is not in scope. parsing: ${expr} -> ${ctx.scope}`);
    }

    const args = _.map(expr.tail(), (x) => Evaluator.evalExpr(x, ctx));

    return target.run.apply(target, args);
  }

  static evalType(expr, ctx) {

  }

  static evalList(expr, ctx) {
    const args = expr.tail();
    var name, body, argList, xs;

    if (expr.head().value == 'define') {
      name = _.head(args);
      var types = args[1];
      body = args[2];

      if (name.type != atom_t) {
        throw new Error(`define expects name to be of type atom is ${Types.toString(name.type)}`);
      }
      if (types.type != list_t) {
        throw new Error(`define expects type to be of type list is ${Types.toString(types.type)}`);
      }
      if (args.length > 3) {
        throw new Error("define expects a length of 3");
      }

      ctx.scope[name.value] = Evaluator.evalExpr(body, ctx.clone());
      return name;
    } else if (expr.head().value == 'defun') {
      name = _.head(args);
      argList = args[1];
      body = args[2];

      if (name.type != atom_t) {
        throw new Error(`defun expects name to be of type atom is ${Types.toString(name.type)}`);
      }
      if (argList.type != list_t) {
        throw new Error(`defun expects an arglist of type list is ${Types.toString(argList.type)}`);
      }
      if (body.type != list_t) {
        throw new Error(`defun expects a body of type list ${Types.toString(body.type)}`);
      }
      if (args.length > 3) {
        throw new Error("defun expects a length of 3");
      }

      xs = _.map(argList.value, (x) => x.value);

      ctx.scope[name.value] = new Lambda(xs, body, ctx.clone());

      return Nil;
    } else if (expr.head().value == 'lambda') {
      argList = args[0];
      body = args[1];

      if (argList.type != list_t) {
        throw new Error(`lambda expects an arglist of type list is ${Types.toString(argList.type)}`);
      }
      if (body.type != list_t) {
        throw new Error(`lambda expects a body of type list is ${Types.toString(body.type)}`);
      }
      if (args.length > 3) {
        throw new Error("lambda expects a length of 2");
      }

      xs = _.map(argList.value, (x) => x.value);

      return new Lambda(xs, body, ctx.clone())
    } else if (expr.head().value == 'ffi-call') {
      return Evaluator.applyFFIList(new ListT(expr.tail()), ctx)
    } else if (expr.head().value == 'ffi-call1') {
      return Evaluator.applyFFIList1(new ListT(expr.tail()), ctx)
    } else {
      return Evaluator.applyList(expr, ctx);
    }
  }

  static evalExpr(expr, ctx) {
    if (expr == undefined) {
      throw new Error('unexpected error!');
    }

    switch (expr.type) {
      case number_t:
        return Evaluator.evalNumber(expr);
      case list_t:
        return Evaluator.evalList(expr, ctx);
      case array_t:
        return Evaluator.evalArray(expr, ctx);
      case atom_t:
        return Evaluator.evalAtom(expr, ctx);
      case string_t:
        return Evaluator.evalString(expr, ctx);
      case comment_t:
        break;
      default:
        throw new Error(`Unknown expression: ${expr.toString()}`);
    }
  }
}
