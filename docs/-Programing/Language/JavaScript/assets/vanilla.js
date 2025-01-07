function isObject(value) {
  return result !== null && typeof result === 'object';
}
// #region new
function newFn(constructor, ...args) {
  // 创建空的实例对象
  const instance = {};
  // 如果原型链为对象，则实例对象 __proto__ 指向原型链
  if (isObject(constructor.prototype)) {
    instance.__proto__ = constructor.prototype;
  }
  // 构造器内部的 this 指向实例对象
  const result = constructor.apply(instance, args);
  // 如果返回值为非原始值，则覆盖实例对象
  return isObject(result) ? result : instance;
}
newFn(Foo); // new Foo();
// #endregion new
// #region instanceof
function instanceofFn(target, constructor) {
  // target 应为对象，constructor 应为函数
  if (!(isObject(target) && typeof constructor === 'function')) {
    return false;
  }
  // constructor.prototype 应为对象
  if (!isObject(constructor.prototype)) {
    throw new TypeError(
      "Function has non-object prototype 'null' in instanceof check",
    );
  }
  // 检查 constructor.prototype 是否在 target 的原型链中
  while (target) {
    if (target.__proto__ === constructor.prototype) {
      return true;
    }
    target = target.__proto__;
  }
  return false;
}
instanceofFn(foo, Array); // foo instanceof Array
Function.prototype[Symbol.hasInstance].call(Array, foo); // foo instanceof Array
// #endregion instanceof
// #region async_await
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }
      _next(undefined);
    });
  };
}
// #endregion async_await
// #region Demo
function DemoFn() {}
// #endregion Demo

// #region Array
class Array {
  reduce(callback, initValue) {
    let acc;
    if (initValue === void 0) {
      if (this.length === 0) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      acc = this[0];
      for (let i = 1; i < this.length; i++) {
        acc = callback(acc, this[i], i, this);
      }
    } else {
      acc = initValue;
      for (let i = 0; i < this.length; i++) {
        acc = callback(acc, this[i], i, this);
      }
    }
    return acc;
  }
  flat(depth = 1) {
    if (typeof depth !== 'number' || depth === 0) {
      return this;
    }
    let arr = [];
    for (let e of this) {
      arr = arr.concat(Array.isArray(e) ? e.flat(depth - 1) : [e]);
    }
    return arr;
  }
}
// #endregion Array
// #region Promise
const STATUS = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
};
class Promise {
  _status = 'pending';
  _value = void 0;
  _resolveQueue = [];
  _rejectQueue = [];

  constructor(executor) {
    const handle = (newStatus, queue) => (value) => {
      queueMicrotask(() => {
        if (this._status !== STATUS.PENDING) return;
        this._value = value;
        this._status = newStatus;
        while (queue.length) {
          queue.shift()(value);
        }
      });
    };
    const resolve = handle(STATUS.FULFILLED, this._resolveQueue);
    const reject = handle(STATUS.REJECTED, this._rejectQueue);
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === 'function'
        ? onFulfilled
        : (v) => {
            return v;
          };
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (e) => {
            throw e;
          };
    return new Promise((resolve, reject) => {
      const handle = (callback) => (value) => {
        try {
          const result = callback(value);
          result instanceof Promise
            ? result.then(resolve, reject)
            : resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      const resolveFn = handle(onFulfilled);
      const rejectFn = handle(onRejected);
      switch (this._status) {
        case STATUS.PENDING:
          this._resolveQueue.push(resolveFn);
          this._rejectQueue.push(rejectFn);
          break;
        case STATUS.FULFILLED:
          resolveFn(this._value);
          break;
        case STATUS.REJECTED:
          rejectFn(this._value);
          break;
        default:
          throw 'Promise 状态错误';
      }
    });
  }

  static resolve(value) {
    return value instanceof Promise
      ? value
      : new Promise((resolve) => resolve(value));
  }
  static reject(error) {
    return new Promise((resolve, reject) => reject(error));
  }
  static all(iterable) {
    let count = 0;
    const result = [];
    const array = [...iterable];
    return new Promise((resolve, reject) => {
      if (array.length === 0) {
        return resolve(result);
      }
      array.forEach((p, i) => {
        Promise.resolve(p).then((value) => {
          result[i] = value;
          if (++count === array.length) {
            resolve(result);
          }
        }, reject);
      });
    });
  }
  static race(iterable) {
    const array = [...iterable];
    return new Promise((resolve, reject) => {
      array.forEach((p) => {
        Promise.resolve(p).then(resolve, reject);
      });
    });
  }
}
// #endregion Promise
// #region Function
class Function {
  call(context, ...args) {
    const key = Symbol();
    context[key] = this;
    const result = context[key](...args);
    delete context[key];
    return result;
  }
  bind(context, ...args) {
    const self = this;
    return function (...restArgs) {
      return self.apply(context, args.concat(restArgs));
    };
  }
}
// #endregion Function
// #region Generator
class GeneratorFunction {}
class Generator {}
// #endregion Generator
// #region Demo
class Demo {}
// #endregion Demo
