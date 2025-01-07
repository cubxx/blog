/**基本类型 */
type BaseType = string | boolean | number;
/**判断类型相等
 * https://stackoverflow.com/questions/68961864/how-does-the-equals-work-in-typescript
 */
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;
/**取元组最大值 */
type Maximum<
  T extends any[],
  U = T[number],
  N extends any[] = [],
> = T extends []
  ? never
  : Equal<U, N['length']> extends true
    ? U
    : Maximum<T, U extends N['length'] ? never : U, [...N, unknown]>;
/**根据数字生成顺序元组 */
type Number2Tuple<
  T extends number,
  U extends number[] = [],
> = U['length'] extends T ? U : Number2Tuple<T, [...U, U['length']]>;

/**字符串 */
//@ts-ignore
namespace string {
  /**获取最后一个字符 */
  type Last<S extends string> = S extends `${infer _}${infer R}`
    ? R extends ''
      ? S
      : Last<R>
    : S;
  /**翻转字符串 */
  type Reverse<
    S extends string,
    T extends string = '',
  > = S extends `${infer L}${infer R}` ? Reverse<R, `${L}${T}`> : T;
  /**判断开头是否为某个字符串 */
  type StartsWith<
    S extends string,
    T extends string,
  > = S extends `${T}${infer _}` ? true : false;
  /**判断末尾是否为某个字符串 */
  type EndsWith<S extends string, T extends string> = StartsWith<
    Reverse<S>,
    Reverse<T>
  >;
  /**字符串分割 */
  type Split<
    S extends string,
    D extends string,
    T extends string[] = [],
  > = S extends `${infer L}${D}${infer R}` ? Split<R, D, [...T, L]> : [...T, S];
}
/**联合类型 */
namespace union {
  type Last<T> =
    convert.UnionToIntersection<
      T extends any ? (e: T) => void : never
    > extends (e: infer U) => void
      ? U
      : never;
}
/**类型转换 */
namespace convert {
  /**联合类型转交叉类型 */
  type UnionToIntersection<T> = (
    T extends any ? (e: T) => void : never
  ) extends (e: infer U) => void
    ? U
    : never;
  /**联合类型转元组 */
  type UnionToTuple<
    T,
    S extends any[] = [],
    U = union.Last<T>,
  > = U extends never ? S : UnionToTuple<Exclude<T, U>, [U, ...S]>;

  /**交叉类型转联合类型 */
  type IntersectionToUnion<T> = (
    T extends any ? (e: T) => void : never
  ) extends (e: infer U) => void
    ? U
    : never;
}
