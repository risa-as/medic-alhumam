
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model LocalProduct
 * 
 */
export type LocalProduct = $Result.DefaultSelection<Prisma.$LocalProductPayload>
/**
 * Model LocalUser
 * 
 */
export type LocalUser = $Result.DefaultSelection<Prisma.$LocalUserPayload>
/**
 * Model LocalCustomer
 * 
 */
export type LocalCustomer = $Result.DefaultSelection<Prisma.$LocalCustomerPayload>
/**
 * Model LocalSale
 * 
 */
export type LocalSale = $Result.DefaultSelection<Prisma.$LocalSalePayload>
/**
 * Model LocalSaleItem
 * 
 */
export type LocalSaleItem = $Result.DefaultSelection<Prisma.$LocalSaleItemPayload>
/**
 * Model SyncQueueItem
 * 
 */
export type SyncQueueItem = $Result.DefaultSelection<Prisma.$SyncQueueItemPayload>
/**
 * Model Meta
 * 
 */
export type Meta = $Result.DefaultSelection<Prisma.$MetaPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more LocalProducts
 * const localProducts = await prisma.localProduct.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more LocalProducts
   * const localProducts = await prisma.localProduct.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.localProduct`: Exposes CRUD operations for the **LocalProduct** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LocalProducts
    * const localProducts = await prisma.localProduct.findMany()
    * ```
    */
  get localProduct(): Prisma.LocalProductDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.localUser`: Exposes CRUD operations for the **LocalUser** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LocalUsers
    * const localUsers = await prisma.localUser.findMany()
    * ```
    */
  get localUser(): Prisma.LocalUserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.localCustomer`: Exposes CRUD operations for the **LocalCustomer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LocalCustomers
    * const localCustomers = await prisma.localCustomer.findMany()
    * ```
    */
  get localCustomer(): Prisma.LocalCustomerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.localSale`: Exposes CRUD operations for the **LocalSale** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LocalSales
    * const localSales = await prisma.localSale.findMany()
    * ```
    */
  get localSale(): Prisma.LocalSaleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.localSaleItem`: Exposes CRUD operations for the **LocalSaleItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LocalSaleItems
    * const localSaleItems = await prisma.localSaleItem.findMany()
    * ```
    */
  get localSaleItem(): Prisma.LocalSaleItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.syncQueueItem`: Exposes CRUD operations for the **SyncQueueItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SyncQueueItems
    * const syncQueueItems = await prisma.syncQueueItem.findMany()
    * ```
    */
  get syncQueueItem(): Prisma.SyncQueueItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.meta`: Exposes CRUD operations for the **Meta** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Metas
    * const metas = await prisma.meta.findMany()
    * ```
    */
  get meta(): Prisma.MetaDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    LocalProduct: 'LocalProduct',
    LocalUser: 'LocalUser',
    LocalCustomer: 'LocalCustomer',
    LocalSale: 'LocalSale',
    LocalSaleItem: 'LocalSaleItem',
    SyncQueueItem: 'SyncQueueItem',
    Meta: 'Meta'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "localProduct" | "localUser" | "localCustomer" | "localSale" | "localSaleItem" | "syncQueueItem" | "meta"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      LocalProduct: {
        payload: Prisma.$LocalProductPayload<ExtArgs>
        fields: Prisma.LocalProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocalProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocalProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload>
          }
          findFirst: {
            args: Prisma.LocalProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocalProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload>
          }
          findMany: {
            args: Prisma.LocalProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload>[]
          }
          create: {
            args: Prisma.LocalProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload>
          }
          createMany: {
            args: Prisma.LocalProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocalProductCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload>[]
          }
          delete: {
            args: Prisma.LocalProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload>
          }
          update: {
            args: Prisma.LocalProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload>
          }
          deleteMany: {
            args: Prisma.LocalProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocalProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocalProductUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload>[]
          }
          upsert: {
            args: Prisma.LocalProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalProductPayload>
          }
          aggregate: {
            args: Prisma.LocalProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocalProduct>
          }
          groupBy: {
            args: Prisma.LocalProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocalProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocalProductCountArgs<ExtArgs>
            result: $Utils.Optional<LocalProductCountAggregateOutputType> | number
          }
        }
      }
      LocalUser: {
        payload: Prisma.$LocalUserPayload<ExtArgs>
        fields: Prisma.LocalUserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocalUserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocalUserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload>
          }
          findFirst: {
            args: Prisma.LocalUserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocalUserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload>
          }
          findMany: {
            args: Prisma.LocalUserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload>[]
          }
          create: {
            args: Prisma.LocalUserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload>
          }
          createMany: {
            args: Prisma.LocalUserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocalUserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload>[]
          }
          delete: {
            args: Prisma.LocalUserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload>
          }
          update: {
            args: Prisma.LocalUserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload>
          }
          deleteMany: {
            args: Prisma.LocalUserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocalUserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocalUserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload>[]
          }
          upsert: {
            args: Prisma.LocalUserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalUserPayload>
          }
          aggregate: {
            args: Prisma.LocalUserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocalUser>
          }
          groupBy: {
            args: Prisma.LocalUserGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocalUserGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocalUserCountArgs<ExtArgs>
            result: $Utils.Optional<LocalUserCountAggregateOutputType> | number
          }
        }
      }
      LocalCustomer: {
        payload: Prisma.$LocalCustomerPayload<ExtArgs>
        fields: Prisma.LocalCustomerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocalCustomerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCustomerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocalCustomerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCustomerPayload>
          }
          findFirst: {
            args: Prisma.LocalCustomerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCustomerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocalCustomerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCustomerPayload>
          }
          findMany: {
            args: Prisma.LocalCustomerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCustomerPayload>[]
          }
          create: {
            args: Prisma.LocalCustomerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCustomerPayload>
          }
          createMany: {
            args: Prisma.LocalCustomerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocalCustomerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCustomerPayload>[]
          }
          delete: {
            args: Prisma.LocalCustomerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCustomerPayload>
          }
          update: {
            args: Prisma.LocalCustomerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCustomerPayload>
          }
          deleteMany: {
            args: Prisma.LocalCustomerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocalCustomerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocalCustomerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCustomerPayload>[]
          }
          upsert: {
            args: Prisma.LocalCustomerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalCustomerPayload>
          }
          aggregate: {
            args: Prisma.LocalCustomerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocalCustomer>
          }
          groupBy: {
            args: Prisma.LocalCustomerGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocalCustomerGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocalCustomerCountArgs<ExtArgs>
            result: $Utils.Optional<LocalCustomerCountAggregateOutputType> | number
          }
        }
      }
      LocalSale: {
        payload: Prisma.$LocalSalePayload<ExtArgs>
        fields: Prisma.LocalSaleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocalSaleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSalePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocalSaleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSalePayload>
          }
          findFirst: {
            args: Prisma.LocalSaleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSalePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocalSaleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSalePayload>
          }
          findMany: {
            args: Prisma.LocalSaleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSalePayload>[]
          }
          create: {
            args: Prisma.LocalSaleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSalePayload>
          }
          createMany: {
            args: Prisma.LocalSaleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocalSaleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSalePayload>[]
          }
          delete: {
            args: Prisma.LocalSaleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSalePayload>
          }
          update: {
            args: Prisma.LocalSaleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSalePayload>
          }
          deleteMany: {
            args: Prisma.LocalSaleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocalSaleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocalSaleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSalePayload>[]
          }
          upsert: {
            args: Prisma.LocalSaleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSalePayload>
          }
          aggregate: {
            args: Prisma.LocalSaleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocalSale>
          }
          groupBy: {
            args: Prisma.LocalSaleGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocalSaleGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocalSaleCountArgs<ExtArgs>
            result: $Utils.Optional<LocalSaleCountAggregateOutputType> | number
          }
        }
      }
      LocalSaleItem: {
        payload: Prisma.$LocalSaleItemPayload<ExtArgs>
        fields: Prisma.LocalSaleItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocalSaleItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSaleItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocalSaleItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSaleItemPayload>
          }
          findFirst: {
            args: Prisma.LocalSaleItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSaleItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocalSaleItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSaleItemPayload>
          }
          findMany: {
            args: Prisma.LocalSaleItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSaleItemPayload>[]
          }
          create: {
            args: Prisma.LocalSaleItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSaleItemPayload>
          }
          createMany: {
            args: Prisma.LocalSaleItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocalSaleItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSaleItemPayload>[]
          }
          delete: {
            args: Prisma.LocalSaleItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSaleItemPayload>
          }
          update: {
            args: Prisma.LocalSaleItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSaleItemPayload>
          }
          deleteMany: {
            args: Prisma.LocalSaleItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocalSaleItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocalSaleItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSaleItemPayload>[]
          }
          upsert: {
            args: Prisma.LocalSaleItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocalSaleItemPayload>
          }
          aggregate: {
            args: Prisma.LocalSaleItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocalSaleItem>
          }
          groupBy: {
            args: Prisma.LocalSaleItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocalSaleItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocalSaleItemCountArgs<ExtArgs>
            result: $Utils.Optional<LocalSaleItemCountAggregateOutputType> | number
          }
        }
      }
      SyncQueueItem: {
        payload: Prisma.$SyncQueueItemPayload<ExtArgs>
        fields: Prisma.SyncQueueItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SyncQueueItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueueItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SyncQueueItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueueItemPayload>
          }
          findFirst: {
            args: Prisma.SyncQueueItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueueItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SyncQueueItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueueItemPayload>
          }
          findMany: {
            args: Prisma.SyncQueueItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueueItemPayload>[]
          }
          create: {
            args: Prisma.SyncQueueItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueueItemPayload>
          }
          createMany: {
            args: Prisma.SyncQueueItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SyncQueueItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueueItemPayload>[]
          }
          delete: {
            args: Prisma.SyncQueueItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueueItemPayload>
          }
          update: {
            args: Prisma.SyncQueueItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueueItemPayload>
          }
          deleteMany: {
            args: Prisma.SyncQueueItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SyncQueueItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SyncQueueItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueueItemPayload>[]
          }
          upsert: {
            args: Prisma.SyncQueueItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SyncQueueItemPayload>
          }
          aggregate: {
            args: Prisma.SyncQueueItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSyncQueueItem>
          }
          groupBy: {
            args: Prisma.SyncQueueItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<SyncQueueItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.SyncQueueItemCountArgs<ExtArgs>
            result: $Utils.Optional<SyncQueueItemCountAggregateOutputType> | number
          }
        }
      }
      Meta: {
        payload: Prisma.$MetaPayload<ExtArgs>
        fields: Prisma.MetaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MetaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MetaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaPayload>
          }
          findFirst: {
            args: Prisma.MetaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MetaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaPayload>
          }
          findMany: {
            args: Prisma.MetaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaPayload>[]
          }
          create: {
            args: Prisma.MetaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaPayload>
          }
          createMany: {
            args: Prisma.MetaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MetaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaPayload>[]
          }
          delete: {
            args: Prisma.MetaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaPayload>
          }
          update: {
            args: Prisma.MetaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaPayload>
          }
          deleteMany: {
            args: Prisma.MetaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MetaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MetaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaPayload>[]
          }
          upsert: {
            args: Prisma.MetaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaPayload>
          }
          aggregate: {
            args: Prisma.MetaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMeta>
          }
          groupBy: {
            args: Prisma.MetaGroupByArgs<ExtArgs>
            result: $Utils.Optional<MetaGroupByOutputType>[]
          }
          count: {
            args: Prisma.MetaCountArgs<ExtArgs>
            result: $Utils.Optional<MetaCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    localProduct?: LocalProductOmit
    localUser?: LocalUserOmit
    localCustomer?: LocalCustomerOmit
    localSale?: LocalSaleOmit
    localSaleItem?: LocalSaleItemOmit
    syncQueueItem?: SyncQueueItemOmit
    meta?: MetaOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type LocalSaleCountOutputType
   */

  export type LocalSaleCountOutputType = {
    items: number
  }

  export type LocalSaleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | LocalSaleCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * LocalSaleCountOutputType without action
   */
  export type LocalSaleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSaleCountOutputType
     */
    select?: LocalSaleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LocalSaleCountOutputType without action
   */
  export type LocalSaleCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocalSaleItemWhereInput
  }


  /**
   * Models
   */

  /**
   * Model LocalProduct
   */

  export type AggregateLocalProduct = {
    _count: LocalProductCountAggregateOutputType | null
    _avg: LocalProductAvgAggregateOutputType | null
    _sum: LocalProductSumAggregateOutputType | null
    _min: LocalProductMinAggregateOutputType | null
    _max: LocalProductMaxAggregateOutputType | null
  }

  export type LocalProductAvgAggregateOutputType = {
    salePrice: number | null
    quantity: number | null
    minQuantity: number | null
  }

  export type LocalProductSumAggregateOutputType = {
    salePrice: number | null
    quantity: number | null
    minQuantity: number | null
  }

  export type LocalProductMinAggregateOutputType = {
    id: string | null
    nameAr: string | null
    sku: string | null
    salePrice: number | null
    quantity: number | null
    minQuantity: number | null
    isOnline: boolean | null
    updatedAt: string | null
  }

  export type LocalProductMaxAggregateOutputType = {
    id: string | null
    nameAr: string | null
    sku: string | null
    salePrice: number | null
    quantity: number | null
    minQuantity: number | null
    isOnline: boolean | null
    updatedAt: string | null
  }

  export type LocalProductCountAggregateOutputType = {
    id: number
    nameAr: number
    sku: number
    salePrice: number
    quantity: number
    minQuantity: number
    isOnline: number
    updatedAt: number
    _all: number
  }


  export type LocalProductAvgAggregateInputType = {
    salePrice?: true
    quantity?: true
    minQuantity?: true
  }

  export type LocalProductSumAggregateInputType = {
    salePrice?: true
    quantity?: true
    minQuantity?: true
  }

  export type LocalProductMinAggregateInputType = {
    id?: true
    nameAr?: true
    sku?: true
    salePrice?: true
    quantity?: true
    minQuantity?: true
    isOnline?: true
    updatedAt?: true
  }

  export type LocalProductMaxAggregateInputType = {
    id?: true
    nameAr?: true
    sku?: true
    salePrice?: true
    quantity?: true
    minQuantity?: true
    isOnline?: true
    updatedAt?: true
  }

  export type LocalProductCountAggregateInputType = {
    id?: true
    nameAr?: true
    sku?: true
    salePrice?: true
    quantity?: true
    minQuantity?: true
    isOnline?: true
    updatedAt?: true
    _all?: true
  }

  export type LocalProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalProduct to aggregate.
     */
    where?: LocalProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalProducts to fetch.
     */
    orderBy?: LocalProductOrderByWithRelationInput | LocalProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocalProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LocalProducts
    **/
    _count?: true | LocalProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocalProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocalProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocalProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocalProductMaxAggregateInputType
  }

  export type GetLocalProductAggregateType<T extends LocalProductAggregateArgs> = {
        [P in keyof T & keyof AggregateLocalProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocalProduct[P]>
      : GetScalarType<T[P], AggregateLocalProduct[P]>
  }




  export type LocalProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocalProductWhereInput
    orderBy?: LocalProductOrderByWithAggregationInput | LocalProductOrderByWithAggregationInput[]
    by: LocalProductScalarFieldEnum[] | LocalProductScalarFieldEnum
    having?: LocalProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocalProductCountAggregateInputType | true
    _avg?: LocalProductAvgAggregateInputType
    _sum?: LocalProductSumAggregateInputType
    _min?: LocalProductMinAggregateInputType
    _max?: LocalProductMaxAggregateInputType
  }

  export type LocalProductGroupByOutputType = {
    id: string
    nameAr: string
    sku: string
    salePrice: number
    quantity: number
    minQuantity: number
    isOnline: boolean
    updatedAt: string
    _count: LocalProductCountAggregateOutputType | null
    _avg: LocalProductAvgAggregateOutputType | null
    _sum: LocalProductSumAggregateOutputType | null
    _min: LocalProductMinAggregateOutputType | null
    _max: LocalProductMaxAggregateOutputType | null
  }

  type GetLocalProductGroupByPayload<T extends LocalProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocalProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocalProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocalProductGroupByOutputType[P]>
            : GetScalarType<T[P], LocalProductGroupByOutputType[P]>
        }
      >
    >


  export type LocalProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nameAr?: boolean
    sku?: boolean
    salePrice?: boolean
    quantity?: boolean
    minQuantity?: boolean
    isOnline?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localProduct"]>

  export type LocalProductSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nameAr?: boolean
    sku?: boolean
    salePrice?: boolean
    quantity?: boolean
    minQuantity?: boolean
    isOnline?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localProduct"]>

  export type LocalProductSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nameAr?: boolean
    sku?: boolean
    salePrice?: boolean
    quantity?: boolean
    minQuantity?: boolean
    isOnline?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localProduct"]>

  export type LocalProductSelectScalar = {
    id?: boolean
    nameAr?: boolean
    sku?: boolean
    salePrice?: boolean
    quantity?: boolean
    minQuantity?: boolean
    isOnline?: boolean
    updatedAt?: boolean
  }

  export type LocalProductOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nameAr" | "sku" | "salePrice" | "quantity" | "minQuantity" | "isOnline" | "updatedAt", ExtArgs["result"]["localProduct"]>

  export type $LocalProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LocalProduct"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nameAr: string
      sku: string
      salePrice: number
      quantity: number
      minQuantity: number
      isOnline: boolean
      updatedAt: string
    }, ExtArgs["result"]["localProduct"]>
    composites: {}
  }

  type LocalProductGetPayload<S extends boolean | null | undefined | LocalProductDefaultArgs> = $Result.GetResult<Prisma.$LocalProductPayload, S>

  type LocalProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocalProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocalProductCountAggregateInputType | true
    }

  export interface LocalProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LocalProduct'], meta: { name: 'LocalProduct' } }
    /**
     * Find zero or one LocalProduct that matches the filter.
     * @param {LocalProductFindUniqueArgs} args - Arguments to find a LocalProduct
     * @example
     * // Get one LocalProduct
     * const localProduct = await prisma.localProduct.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocalProductFindUniqueArgs>(args: SelectSubset<T, LocalProductFindUniqueArgs<ExtArgs>>): Prisma__LocalProductClient<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LocalProduct that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocalProductFindUniqueOrThrowArgs} args - Arguments to find a LocalProduct
     * @example
     * // Get one LocalProduct
     * const localProduct = await prisma.localProduct.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocalProductFindUniqueOrThrowArgs>(args: SelectSubset<T, LocalProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocalProductClient<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalProduct that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalProductFindFirstArgs} args - Arguments to find a LocalProduct
     * @example
     * // Get one LocalProduct
     * const localProduct = await prisma.localProduct.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocalProductFindFirstArgs>(args?: SelectSubset<T, LocalProductFindFirstArgs<ExtArgs>>): Prisma__LocalProductClient<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalProduct that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalProductFindFirstOrThrowArgs} args - Arguments to find a LocalProduct
     * @example
     * // Get one LocalProduct
     * const localProduct = await prisma.localProduct.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocalProductFindFirstOrThrowArgs>(args?: SelectSubset<T, LocalProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocalProductClient<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LocalProducts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LocalProducts
     * const localProducts = await prisma.localProduct.findMany()
     * 
     * // Get first 10 LocalProducts
     * const localProducts = await prisma.localProduct.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const localProductWithIdOnly = await prisma.localProduct.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocalProductFindManyArgs>(args?: SelectSubset<T, LocalProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LocalProduct.
     * @param {LocalProductCreateArgs} args - Arguments to create a LocalProduct.
     * @example
     * // Create one LocalProduct
     * const LocalProduct = await prisma.localProduct.create({
     *   data: {
     *     // ... data to create a LocalProduct
     *   }
     * })
     * 
     */
    create<T extends LocalProductCreateArgs>(args: SelectSubset<T, LocalProductCreateArgs<ExtArgs>>): Prisma__LocalProductClient<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LocalProducts.
     * @param {LocalProductCreateManyArgs} args - Arguments to create many LocalProducts.
     * @example
     * // Create many LocalProducts
     * const localProduct = await prisma.localProduct.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocalProductCreateManyArgs>(args?: SelectSubset<T, LocalProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LocalProducts and returns the data saved in the database.
     * @param {LocalProductCreateManyAndReturnArgs} args - Arguments to create many LocalProducts.
     * @example
     * // Create many LocalProducts
     * const localProduct = await prisma.localProduct.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LocalProducts and only return the `id`
     * const localProductWithIdOnly = await prisma.localProduct.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocalProductCreateManyAndReturnArgs>(args?: SelectSubset<T, LocalProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LocalProduct.
     * @param {LocalProductDeleteArgs} args - Arguments to delete one LocalProduct.
     * @example
     * // Delete one LocalProduct
     * const LocalProduct = await prisma.localProduct.delete({
     *   where: {
     *     // ... filter to delete one LocalProduct
     *   }
     * })
     * 
     */
    delete<T extends LocalProductDeleteArgs>(args: SelectSubset<T, LocalProductDeleteArgs<ExtArgs>>): Prisma__LocalProductClient<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LocalProduct.
     * @param {LocalProductUpdateArgs} args - Arguments to update one LocalProduct.
     * @example
     * // Update one LocalProduct
     * const localProduct = await prisma.localProduct.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocalProductUpdateArgs>(args: SelectSubset<T, LocalProductUpdateArgs<ExtArgs>>): Prisma__LocalProductClient<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LocalProducts.
     * @param {LocalProductDeleteManyArgs} args - Arguments to filter LocalProducts to delete.
     * @example
     * // Delete a few LocalProducts
     * const { count } = await prisma.localProduct.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocalProductDeleteManyArgs>(args?: SelectSubset<T, LocalProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalProducts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LocalProducts
     * const localProduct = await prisma.localProduct.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocalProductUpdateManyArgs>(args: SelectSubset<T, LocalProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalProducts and returns the data updated in the database.
     * @param {LocalProductUpdateManyAndReturnArgs} args - Arguments to update many LocalProducts.
     * @example
     * // Update many LocalProducts
     * const localProduct = await prisma.localProduct.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LocalProducts and only return the `id`
     * const localProductWithIdOnly = await prisma.localProduct.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocalProductUpdateManyAndReturnArgs>(args: SelectSubset<T, LocalProductUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LocalProduct.
     * @param {LocalProductUpsertArgs} args - Arguments to update or create a LocalProduct.
     * @example
     * // Update or create a LocalProduct
     * const localProduct = await prisma.localProduct.upsert({
     *   create: {
     *     // ... data to create a LocalProduct
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LocalProduct we want to update
     *   }
     * })
     */
    upsert<T extends LocalProductUpsertArgs>(args: SelectSubset<T, LocalProductUpsertArgs<ExtArgs>>): Prisma__LocalProductClient<$Result.GetResult<Prisma.$LocalProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LocalProducts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalProductCountArgs} args - Arguments to filter LocalProducts to count.
     * @example
     * // Count the number of LocalProducts
     * const count = await prisma.localProduct.count({
     *   where: {
     *     // ... the filter for the LocalProducts we want to count
     *   }
     * })
    **/
    count<T extends LocalProductCountArgs>(
      args?: Subset<T, LocalProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocalProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LocalProduct.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocalProductAggregateArgs>(args: Subset<T, LocalProductAggregateArgs>): Prisma.PrismaPromise<GetLocalProductAggregateType<T>>

    /**
     * Group by LocalProduct.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocalProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocalProductGroupByArgs['orderBy'] }
        : { orderBy?: LocalProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocalProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocalProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LocalProduct model
   */
  readonly fields: LocalProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LocalProduct.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocalProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LocalProduct model
   */
  interface LocalProductFieldRefs {
    readonly id: FieldRef<"LocalProduct", 'String'>
    readonly nameAr: FieldRef<"LocalProduct", 'String'>
    readonly sku: FieldRef<"LocalProduct", 'String'>
    readonly salePrice: FieldRef<"LocalProduct", 'Float'>
    readonly quantity: FieldRef<"LocalProduct", 'Int'>
    readonly minQuantity: FieldRef<"LocalProduct", 'Int'>
    readonly isOnline: FieldRef<"LocalProduct", 'Boolean'>
    readonly updatedAt: FieldRef<"LocalProduct", 'String'>
  }
    

  // Custom InputTypes
  /**
   * LocalProduct findUnique
   */
  export type LocalProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * Filter, which LocalProduct to fetch.
     */
    where: LocalProductWhereUniqueInput
  }

  /**
   * LocalProduct findUniqueOrThrow
   */
  export type LocalProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * Filter, which LocalProduct to fetch.
     */
    where: LocalProductWhereUniqueInput
  }

  /**
   * LocalProduct findFirst
   */
  export type LocalProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * Filter, which LocalProduct to fetch.
     */
    where?: LocalProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalProducts to fetch.
     */
    orderBy?: LocalProductOrderByWithRelationInput | LocalProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalProducts.
     */
    cursor?: LocalProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalProducts.
     */
    distinct?: LocalProductScalarFieldEnum | LocalProductScalarFieldEnum[]
  }

  /**
   * LocalProduct findFirstOrThrow
   */
  export type LocalProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * Filter, which LocalProduct to fetch.
     */
    where?: LocalProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalProducts to fetch.
     */
    orderBy?: LocalProductOrderByWithRelationInput | LocalProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalProducts.
     */
    cursor?: LocalProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalProducts.
     */
    distinct?: LocalProductScalarFieldEnum | LocalProductScalarFieldEnum[]
  }

  /**
   * LocalProduct findMany
   */
  export type LocalProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * Filter, which LocalProducts to fetch.
     */
    where?: LocalProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalProducts to fetch.
     */
    orderBy?: LocalProductOrderByWithRelationInput | LocalProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LocalProducts.
     */
    cursor?: LocalProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalProducts.
     */
    skip?: number
    distinct?: LocalProductScalarFieldEnum | LocalProductScalarFieldEnum[]
  }

  /**
   * LocalProduct create
   */
  export type LocalProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * The data needed to create a LocalProduct.
     */
    data: XOR<LocalProductCreateInput, LocalProductUncheckedCreateInput>
  }

  /**
   * LocalProduct createMany
   */
  export type LocalProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LocalProducts.
     */
    data: LocalProductCreateManyInput | LocalProductCreateManyInput[]
  }

  /**
   * LocalProduct createManyAndReturn
   */
  export type LocalProductCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * The data used to create many LocalProducts.
     */
    data: LocalProductCreateManyInput | LocalProductCreateManyInput[]
  }

  /**
   * LocalProduct update
   */
  export type LocalProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * The data needed to update a LocalProduct.
     */
    data: XOR<LocalProductUpdateInput, LocalProductUncheckedUpdateInput>
    /**
     * Choose, which LocalProduct to update.
     */
    where: LocalProductWhereUniqueInput
  }

  /**
   * LocalProduct updateMany
   */
  export type LocalProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LocalProducts.
     */
    data: XOR<LocalProductUpdateManyMutationInput, LocalProductUncheckedUpdateManyInput>
    /**
     * Filter which LocalProducts to update
     */
    where?: LocalProductWhereInput
    /**
     * Limit how many LocalProducts to update.
     */
    limit?: number
  }

  /**
   * LocalProduct updateManyAndReturn
   */
  export type LocalProductUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * The data used to update LocalProducts.
     */
    data: XOR<LocalProductUpdateManyMutationInput, LocalProductUncheckedUpdateManyInput>
    /**
     * Filter which LocalProducts to update
     */
    where?: LocalProductWhereInput
    /**
     * Limit how many LocalProducts to update.
     */
    limit?: number
  }

  /**
   * LocalProduct upsert
   */
  export type LocalProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * The filter to search for the LocalProduct to update in case it exists.
     */
    where: LocalProductWhereUniqueInput
    /**
     * In case the LocalProduct found by the `where` argument doesn't exist, create a new LocalProduct with this data.
     */
    create: XOR<LocalProductCreateInput, LocalProductUncheckedCreateInput>
    /**
     * In case the LocalProduct was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocalProductUpdateInput, LocalProductUncheckedUpdateInput>
  }

  /**
   * LocalProduct delete
   */
  export type LocalProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
    /**
     * Filter which LocalProduct to delete.
     */
    where: LocalProductWhereUniqueInput
  }

  /**
   * LocalProduct deleteMany
   */
  export type LocalProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalProducts to delete
     */
    where?: LocalProductWhereInput
    /**
     * Limit how many LocalProducts to delete.
     */
    limit?: number
  }

  /**
   * LocalProduct without action
   */
  export type LocalProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalProduct
     */
    select?: LocalProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalProduct
     */
    omit?: LocalProductOmit<ExtArgs> | null
  }


  /**
   * Model LocalUser
   */

  export type AggregateLocalUser = {
    _count: LocalUserCountAggregateOutputType | null
    _min: LocalUserMinAggregateOutputType | null
    _max: LocalUserMaxAggregateOutputType | null
  }

  export type LocalUserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    role: string | null
    updatedAt: string | null
  }

  export type LocalUserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    role: string | null
    updatedAt: string | null
  }

  export type LocalUserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    passwordHash: number
    role: number
    updatedAt: number
    _all: number
  }


  export type LocalUserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    role?: true
    updatedAt?: true
  }

  export type LocalUserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    role?: true
    updatedAt?: true
  }

  export type LocalUserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    role?: true
    updatedAt?: true
    _all?: true
  }

  export type LocalUserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalUser to aggregate.
     */
    where?: LocalUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalUsers to fetch.
     */
    orderBy?: LocalUserOrderByWithRelationInput | LocalUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocalUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LocalUsers
    **/
    _count?: true | LocalUserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocalUserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocalUserMaxAggregateInputType
  }

  export type GetLocalUserAggregateType<T extends LocalUserAggregateArgs> = {
        [P in keyof T & keyof AggregateLocalUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocalUser[P]>
      : GetScalarType<T[P], AggregateLocalUser[P]>
  }




  export type LocalUserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocalUserWhereInput
    orderBy?: LocalUserOrderByWithAggregationInput | LocalUserOrderByWithAggregationInput[]
    by: LocalUserScalarFieldEnum[] | LocalUserScalarFieldEnum
    having?: LocalUserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocalUserCountAggregateInputType | true
    _min?: LocalUserMinAggregateInputType
    _max?: LocalUserMaxAggregateInputType
  }

  export type LocalUserGroupByOutputType = {
    id: string
    name: string
    email: string
    passwordHash: string
    role: string
    updatedAt: string
    _count: LocalUserCountAggregateOutputType | null
    _min: LocalUserMinAggregateOutputType | null
    _max: LocalUserMaxAggregateOutputType | null
  }

  type GetLocalUserGroupByPayload<T extends LocalUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocalUserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocalUserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocalUserGroupByOutputType[P]>
            : GetScalarType<T[P], LocalUserGroupByOutputType[P]>
        }
      >
    >


  export type LocalUserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localUser"]>

  export type LocalUserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localUser"]>

  export type LocalUserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localUser"]>

  export type LocalUserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    updatedAt?: boolean
  }

  export type LocalUserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "passwordHash" | "role" | "updatedAt", ExtArgs["result"]["localUser"]>

  export type $LocalUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LocalUser"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      passwordHash: string
      role: string
      updatedAt: string
    }, ExtArgs["result"]["localUser"]>
    composites: {}
  }

  type LocalUserGetPayload<S extends boolean | null | undefined | LocalUserDefaultArgs> = $Result.GetResult<Prisma.$LocalUserPayload, S>

  type LocalUserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocalUserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocalUserCountAggregateInputType | true
    }

  export interface LocalUserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LocalUser'], meta: { name: 'LocalUser' } }
    /**
     * Find zero or one LocalUser that matches the filter.
     * @param {LocalUserFindUniqueArgs} args - Arguments to find a LocalUser
     * @example
     * // Get one LocalUser
     * const localUser = await prisma.localUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocalUserFindUniqueArgs>(args: SelectSubset<T, LocalUserFindUniqueArgs<ExtArgs>>): Prisma__LocalUserClient<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LocalUser that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocalUserFindUniqueOrThrowArgs} args - Arguments to find a LocalUser
     * @example
     * // Get one LocalUser
     * const localUser = await prisma.localUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocalUserFindUniqueOrThrowArgs>(args: SelectSubset<T, LocalUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocalUserClient<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalUserFindFirstArgs} args - Arguments to find a LocalUser
     * @example
     * // Get one LocalUser
     * const localUser = await prisma.localUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocalUserFindFirstArgs>(args?: SelectSubset<T, LocalUserFindFirstArgs<ExtArgs>>): Prisma__LocalUserClient<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalUser that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalUserFindFirstOrThrowArgs} args - Arguments to find a LocalUser
     * @example
     * // Get one LocalUser
     * const localUser = await prisma.localUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocalUserFindFirstOrThrowArgs>(args?: SelectSubset<T, LocalUserFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocalUserClient<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LocalUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalUserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LocalUsers
     * const localUsers = await prisma.localUser.findMany()
     * 
     * // Get first 10 LocalUsers
     * const localUsers = await prisma.localUser.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const localUserWithIdOnly = await prisma.localUser.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocalUserFindManyArgs>(args?: SelectSubset<T, LocalUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LocalUser.
     * @param {LocalUserCreateArgs} args - Arguments to create a LocalUser.
     * @example
     * // Create one LocalUser
     * const LocalUser = await prisma.localUser.create({
     *   data: {
     *     // ... data to create a LocalUser
     *   }
     * })
     * 
     */
    create<T extends LocalUserCreateArgs>(args: SelectSubset<T, LocalUserCreateArgs<ExtArgs>>): Prisma__LocalUserClient<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LocalUsers.
     * @param {LocalUserCreateManyArgs} args - Arguments to create many LocalUsers.
     * @example
     * // Create many LocalUsers
     * const localUser = await prisma.localUser.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocalUserCreateManyArgs>(args?: SelectSubset<T, LocalUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LocalUsers and returns the data saved in the database.
     * @param {LocalUserCreateManyAndReturnArgs} args - Arguments to create many LocalUsers.
     * @example
     * // Create many LocalUsers
     * const localUser = await prisma.localUser.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LocalUsers and only return the `id`
     * const localUserWithIdOnly = await prisma.localUser.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocalUserCreateManyAndReturnArgs>(args?: SelectSubset<T, LocalUserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LocalUser.
     * @param {LocalUserDeleteArgs} args - Arguments to delete one LocalUser.
     * @example
     * // Delete one LocalUser
     * const LocalUser = await prisma.localUser.delete({
     *   where: {
     *     // ... filter to delete one LocalUser
     *   }
     * })
     * 
     */
    delete<T extends LocalUserDeleteArgs>(args: SelectSubset<T, LocalUserDeleteArgs<ExtArgs>>): Prisma__LocalUserClient<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LocalUser.
     * @param {LocalUserUpdateArgs} args - Arguments to update one LocalUser.
     * @example
     * // Update one LocalUser
     * const localUser = await prisma.localUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocalUserUpdateArgs>(args: SelectSubset<T, LocalUserUpdateArgs<ExtArgs>>): Prisma__LocalUserClient<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LocalUsers.
     * @param {LocalUserDeleteManyArgs} args - Arguments to filter LocalUsers to delete.
     * @example
     * // Delete a few LocalUsers
     * const { count } = await prisma.localUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocalUserDeleteManyArgs>(args?: SelectSubset<T, LocalUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LocalUsers
     * const localUser = await prisma.localUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocalUserUpdateManyArgs>(args: SelectSubset<T, LocalUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalUsers and returns the data updated in the database.
     * @param {LocalUserUpdateManyAndReturnArgs} args - Arguments to update many LocalUsers.
     * @example
     * // Update many LocalUsers
     * const localUser = await prisma.localUser.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LocalUsers and only return the `id`
     * const localUserWithIdOnly = await prisma.localUser.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocalUserUpdateManyAndReturnArgs>(args: SelectSubset<T, LocalUserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LocalUser.
     * @param {LocalUserUpsertArgs} args - Arguments to update or create a LocalUser.
     * @example
     * // Update or create a LocalUser
     * const localUser = await prisma.localUser.upsert({
     *   create: {
     *     // ... data to create a LocalUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LocalUser we want to update
     *   }
     * })
     */
    upsert<T extends LocalUserUpsertArgs>(args: SelectSubset<T, LocalUserUpsertArgs<ExtArgs>>): Prisma__LocalUserClient<$Result.GetResult<Prisma.$LocalUserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LocalUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalUserCountArgs} args - Arguments to filter LocalUsers to count.
     * @example
     * // Count the number of LocalUsers
     * const count = await prisma.localUser.count({
     *   where: {
     *     // ... the filter for the LocalUsers we want to count
     *   }
     * })
    **/
    count<T extends LocalUserCountArgs>(
      args?: Subset<T, LocalUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocalUserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LocalUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocalUserAggregateArgs>(args: Subset<T, LocalUserAggregateArgs>): Prisma.PrismaPromise<GetLocalUserAggregateType<T>>

    /**
     * Group by LocalUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalUserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocalUserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocalUserGroupByArgs['orderBy'] }
        : { orderBy?: LocalUserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocalUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocalUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LocalUser model
   */
  readonly fields: LocalUserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LocalUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocalUserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LocalUser model
   */
  interface LocalUserFieldRefs {
    readonly id: FieldRef<"LocalUser", 'String'>
    readonly name: FieldRef<"LocalUser", 'String'>
    readonly email: FieldRef<"LocalUser", 'String'>
    readonly passwordHash: FieldRef<"LocalUser", 'String'>
    readonly role: FieldRef<"LocalUser", 'String'>
    readonly updatedAt: FieldRef<"LocalUser", 'String'>
  }
    

  // Custom InputTypes
  /**
   * LocalUser findUnique
   */
  export type LocalUserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * Filter, which LocalUser to fetch.
     */
    where: LocalUserWhereUniqueInput
  }

  /**
   * LocalUser findUniqueOrThrow
   */
  export type LocalUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * Filter, which LocalUser to fetch.
     */
    where: LocalUserWhereUniqueInput
  }

  /**
   * LocalUser findFirst
   */
  export type LocalUserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * Filter, which LocalUser to fetch.
     */
    where?: LocalUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalUsers to fetch.
     */
    orderBy?: LocalUserOrderByWithRelationInput | LocalUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalUsers.
     */
    cursor?: LocalUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalUsers.
     */
    distinct?: LocalUserScalarFieldEnum | LocalUserScalarFieldEnum[]
  }

  /**
   * LocalUser findFirstOrThrow
   */
  export type LocalUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * Filter, which LocalUser to fetch.
     */
    where?: LocalUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalUsers to fetch.
     */
    orderBy?: LocalUserOrderByWithRelationInput | LocalUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalUsers.
     */
    cursor?: LocalUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalUsers.
     */
    distinct?: LocalUserScalarFieldEnum | LocalUserScalarFieldEnum[]
  }

  /**
   * LocalUser findMany
   */
  export type LocalUserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * Filter, which LocalUsers to fetch.
     */
    where?: LocalUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalUsers to fetch.
     */
    orderBy?: LocalUserOrderByWithRelationInput | LocalUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LocalUsers.
     */
    cursor?: LocalUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalUsers.
     */
    skip?: number
    distinct?: LocalUserScalarFieldEnum | LocalUserScalarFieldEnum[]
  }

  /**
   * LocalUser create
   */
  export type LocalUserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * The data needed to create a LocalUser.
     */
    data: XOR<LocalUserCreateInput, LocalUserUncheckedCreateInput>
  }

  /**
   * LocalUser createMany
   */
  export type LocalUserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LocalUsers.
     */
    data: LocalUserCreateManyInput | LocalUserCreateManyInput[]
  }

  /**
   * LocalUser createManyAndReturn
   */
  export type LocalUserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * The data used to create many LocalUsers.
     */
    data: LocalUserCreateManyInput | LocalUserCreateManyInput[]
  }

  /**
   * LocalUser update
   */
  export type LocalUserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * The data needed to update a LocalUser.
     */
    data: XOR<LocalUserUpdateInput, LocalUserUncheckedUpdateInput>
    /**
     * Choose, which LocalUser to update.
     */
    where: LocalUserWhereUniqueInput
  }

  /**
   * LocalUser updateMany
   */
  export type LocalUserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LocalUsers.
     */
    data: XOR<LocalUserUpdateManyMutationInput, LocalUserUncheckedUpdateManyInput>
    /**
     * Filter which LocalUsers to update
     */
    where?: LocalUserWhereInput
    /**
     * Limit how many LocalUsers to update.
     */
    limit?: number
  }

  /**
   * LocalUser updateManyAndReturn
   */
  export type LocalUserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * The data used to update LocalUsers.
     */
    data: XOR<LocalUserUpdateManyMutationInput, LocalUserUncheckedUpdateManyInput>
    /**
     * Filter which LocalUsers to update
     */
    where?: LocalUserWhereInput
    /**
     * Limit how many LocalUsers to update.
     */
    limit?: number
  }

  /**
   * LocalUser upsert
   */
  export type LocalUserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * The filter to search for the LocalUser to update in case it exists.
     */
    where: LocalUserWhereUniqueInput
    /**
     * In case the LocalUser found by the `where` argument doesn't exist, create a new LocalUser with this data.
     */
    create: XOR<LocalUserCreateInput, LocalUserUncheckedCreateInput>
    /**
     * In case the LocalUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocalUserUpdateInput, LocalUserUncheckedUpdateInput>
  }

  /**
   * LocalUser delete
   */
  export type LocalUserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
    /**
     * Filter which LocalUser to delete.
     */
    where: LocalUserWhereUniqueInput
  }

  /**
   * LocalUser deleteMany
   */
  export type LocalUserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalUsers to delete
     */
    where?: LocalUserWhereInput
    /**
     * Limit how many LocalUsers to delete.
     */
    limit?: number
  }

  /**
   * LocalUser without action
   */
  export type LocalUserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalUser
     */
    select?: LocalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalUser
     */
    omit?: LocalUserOmit<ExtArgs> | null
  }


  /**
   * Model LocalCustomer
   */

  export type AggregateLocalCustomer = {
    _count: LocalCustomerCountAggregateOutputType | null
    _avg: LocalCustomerAvgAggregateOutputType | null
    _sum: LocalCustomerSumAggregateOutputType | null
    _min: LocalCustomerMinAggregateOutputType | null
    _max: LocalCustomerMaxAggregateOutputType | null
  }

  export type LocalCustomerAvgAggregateOutputType = {
    balance: number | null
  }

  export type LocalCustomerSumAggregateOutputType = {
    balance: number | null
  }

  export type LocalCustomerMinAggregateOutputType = {
    id: string | null
    name: string | null
    phone: string | null
    address: string | null
    balance: number | null
    updatedAt: string | null
  }

  export type LocalCustomerMaxAggregateOutputType = {
    id: string | null
    name: string | null
    phone: string | null
    address: string | null
    balance: number | null
    updatedAt: string | null
  }

  export type LocalCustomerCountAggregateOutputType = {
    id: number
    name: number
    phone: number
    address: number
    balance: number
    updatedAt: number
    _all: number
  }


  export type LocalCustomerAvgAggregateInputType = {
    balance?: true
  }

  export type LocalCustomerSumAggregateInputType = {
    balance?: true
  }

  export type LocalCustomerMinAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    address?: true
    balance?: true
    updatedAt?: true
  }

  export type LocalCustomerMaxAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    address?: true
    balance?: true
    updatedAt?: true
  }

  export type LocalCustomerCountAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    address?: true
    balance?: true
    updatedAt?: true
    _all?: true
  }

  export type LocalCustomerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalCustomer to aggregate.
     */
    where?: LocalCustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalCustomers to fetch.
     */
    orderBy?: LocalCustomerOrderByWithRelationInput | LocalCustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocalCustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalCustomers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalCustomers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LocalCustomers
    **/
    _count?: true | LocalCustomerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocalCustomerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocalCustomerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocalCustomerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocalCustomerMaxAggregateInputType
  }

  export type GetLocalCustomerAggregateType<T extends LocalCustomerAggregateArgs> = {
        [P in keyof T & keyof AggregateLocalCustomer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocalCustomer[P]>
      : GetScalarType<T[P], AggregateLocalCustomer[P]>
  }




  export type LocalCustomerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocalCustomerWhereInput
    orderBy?: LocalCustomerOrderByWithAggregationInput | LocalCustomerOrderByWithAggregationInput[]
    by: LocalCustomerScalarFieldEnum[] | LocalCustomerScalarFieldEnum
    having?: LocalCustomerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocalCustomerCountAggregateInputType | true
    _avg?: LocalCustomerAvgAggregateInputType
    _sum?: LocalCustomerSumAggregateInputType
    _min?: LocalCustomerMinAggregateInputType
    _max?: LocalCustomerMaxAggregateInputType
  }

  export type LocalCustomerGroupByOutputType = {
    id: string
    name: string
    phone: string | null
    address: string | null
    balance: number
    updatedAt: string
    _count: LocalCustomerCountAggregateOutputType | null
    _avg: LocalCustomerAvgAggregateOutputType | null
    _sum: LocalCustomerSumAggregateOutputType | null
    _min: LocalCustomerMinAggregateOutputType | null
    _max: LocalCustomerMaxAggregateOutputType | null
  }

  type GetLocalCustomerGroupByPayload<T extends LocalCustomerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocalCustomerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocalCustomerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocalCustomerGroupByOutputType[P]>
            : GetScalarType<T[P], LocalCustomerGroupByOutputType[P]>
        }
      >
    >


  export type LocalCustomerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    address?: boolean
    balance?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localCustomer"]>

  export type LocalCustomerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    address?: boolean
    balance?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localCustomer"]>

  export type LocalCustomerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    address?: boolean
    balance?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["localCustomer"]>

  export type LocalCustomerSelectScalar = {
    id?: boolean
    name?: boolean
    phone?: boolean
    address?: boolean
    balance?: boolean
    updatedAt?: boolean
  }

  export type LocalCustomerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "phone" | "address" | "balance" | "updatedAt", ExtArgs["result"]["localCustomer"]>

  export type $LocalCustomerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LocalCustomer"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      phone: string | null
      address: string | null
      balance: number
      updatedAt: string
    }, ExtArgs["result"]["localCustomer"]>
    composites: {}
  }

  type LocalCustomerGetPayload<S extends boolean | null | undefined | LocalCustomerDefaultArgs> = $Result.GetResult<Prisma.$LocalCustomerPayload, S>

  type LocalCustomerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocalCustomerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocalCustomerCountAggregateInputType | true
    }

  export interface LocalCustomerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LocalCustomer'], meta: { name: 'LocalCustomer' } }
    /**
     * Find zero or one LocalCustomer that matches the filter.
     * @param {LocalCustomerFindUniqueArgs} args - Arguments to find a LocalCustomer
     * @example
     * // Get one LocalCustomer
     * const localCustomer = await prisma.localCustomer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocalCustomerFindUniqueArgs>(args: SelectSubset<T, LocalCustomerFindUniqueArgs<ExtArgs>>): Prisma__LocalCustomerClient<$Result.GetResult<Prisma.$LocalCustomerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LocalCustomer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocalCustomerFindUniqueOrThrowArgs} args - Arguments to find a LocalCustomer
     * @example
     * // Get one LocalCustomer
     * const localCustomer = await prisma.localCustomer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocalCustomerFindUniqueOrThrowArgs>(args: SelectSubset<T, LocalCustomerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocalCustomerClient<$Result.GetResult<Prisma.$LocalCustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalCustomer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalCustomerFindFirstArgs} args - Arguments to find a LocalCustomer
     * @example
     * // Get one LocalCustomer
     * const localCustomer = await prisma.localCustomer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocalCustomerFindFirstArgs>(args?: SelectSubset<T, LocalCustomerFindFirstArgs<ExtArgs>>): Prisma__LocalCustomerClient<$Result.GetResult<Prisma.$LocalCustomerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalCustomer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalCustomerFindFirstOrThrowArgs} args - Arguments to find a LocalCustomer
     * @example
     * // Get one LocalCustomer
     * const localCustomer = await prisma.localCustomer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocalCustomerFindFirstOrThrowArgs>(args?: SelectSubset<T, LocalCustomerFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocalCustomerClient<$Result.GetResult<Prisma.$LocalCustomerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LocalCustomers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalCustomerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LocalCustomers
     * const localCustomers = await prisma.localCustomer.findMany()
     * 
     * // Get first 10 LocalCustomers
     * const localCustomers = await prisma.localCustomer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const localCustomerWithIdOnly = await prisma.localCustomer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocalCustomerFindManyArgs>(args?: SelectSubset<T, LocalCustomerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalCustomerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LocalCustomer.
     * @param {LocalCustomerCreateArgs} args - Arguments to create a LocalCustomer.
     * @example
     * // Create one LocalCustomer
     * const LocalCustomer = await prisma.localCustomer.create({
     *   data: {
     *     // ... data to create a LocalCustomer
     *   }
     * })
     * 
     */
    create<T extends LocalCustomerCreateArgs>(args: SelectSubset<T, LocalCustomerCreateArgs<ExtArgs>>): Prisma__LocalCustomerClient<$Result.GetResult<Prisma.$LocalCustomerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LocalCustomers.
     * @param {LocalCustomerCreateManyArgs} args - Arguments to create many LocalCustomers.
     * @example
     * // Create many LocalCustomers
     * const localCustomer = await prisma.localCustomer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocalCustomerCreateManyArgs>(args?: SelectSubset<T, LocalCustomerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LocalCustomers and returns the data saved in the database.
     * @param {LocalCustomerCreateManyAndReturnArgs} args - Arguments to create many LocalCustomers.
     * @example
     * // Create many LocalCustomers
     * const localCustomer = await prisma.localCustomer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LocalCustomers and only return the `id`
     * const localCustomerWithIdOnly = await prisma.localCustomer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocalCustomerCreateManyAndReturnArgs>(args?: SelectSubset<T, LocalCustomerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalCustomerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LocalCustomer.
     * @param {LocalCustomerDeleteArgs} args - Arguments to delete one LocalCustomer.
     * @example
     * // Delete one LocalCustomer
     * const LocalCustomer = await prisma.localCustomer.delete({
     *   where: {
     *     // ... filter to delete one LocalCustomer
     *   }
     * })
     * 
     */
    delete<T extends LocalCustomerDeleteArgs>(args: SelectSubset<T, LocalCustomerDeleteArgs<ExtArgs>>): Prisma__LocalCustomerClient<$Result.GetResult<Prisma.$LocalCustomerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LocalCustomer.
     * @param {LocalCustomerUpdateArgs} args - Arguments to update one LocalCustomer.
     * @example
     * // Update one LocalCustomer
     * const localCustomer = await prisma.localCustomer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocalCustomerUpdateArgs>(args: SelectSubset<T, LocalCustomerUpdateArgs<ExtArgs>>): Prisma__LocalCustomerClient<$Result.GetResult<Prisma.$LocalCustomerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LocalCustomers.
     * @param {LocalCustomerDeleteManyArgs} args - Arguments to filter LocalCustomers to delete.
     * @example
     * // Delete a few LocalCustomers
     * const { count } = await prisma.localCustomer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocalCustomerDeleteManyArgs>(args?: SelectSubset<T, LocalCustomerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalCustomers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalCustomerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LocalCustomers
     * const localCustomer = await prisma.localCustomer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocalCustomerUpdateManyArgs>(args: SelectSubset<T, LocalCustomerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalCustomers and returns the data updated in the database.
     * @param {LocalCustomerUpdateManyAndReturnArgs} args - Arguments to update many LocalCustomers.
     * @example
     * // Update many LocalCustomers
     * const localCustomer = await prisma.localCustomer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LocalCustomers and only return the `id`
     * const localCustomerWithIdOnly = await prisma.localCustomer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocalCustomerUpdateManyAndReturnArgs>(args: SelectSubset<T, LocalCustomerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalCustomerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LocalCustomer.
     * @param {LocalCustomerUpsertArgs} args - Arguments to update or create a LocalCustomer.
     * @example
     * // Update or create a LocalCustomer
     * const localCustomer = await prisma.localCustomer.upsert({
     *   create: {
     *     // ... data to create a LocalCustomer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LocalCustomer we want to update
     *   }
     * })
     */
    upsert<T extends LocalCustomerUpsertArgs>(args: SelectSubset<T, LocalCustomerUpsertArgs<ExtArgs>>): Prisma__LocalCustomerClient<$Result.GetResult<Prisma.$LocalCustomerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LocalCustomers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalCustomerCountArgs} args - Arguments to filter LocalCustomers to count.
     * @example
     * // Count the number of LocalCustomers
     * const count = await prisma.localCustomer.count({
     *   where: {
     *     // ... the filter for the LocalCustomers we want to count
     *   }
     * })
    **/
    count<T extends LocalCustomerCountArgs>(
      args?: Subset<T, LocalCustomerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocalCustomerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LocalCustomer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalCustomerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocalCustomerAggregateArgs>(args: Subset<T, LocalCustomerAggregateArgs>): Prisma.PrismaPromise<GetLocalCustomerAggregateType<T>>

    /**
     * Group by LocalCustomer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalCustomerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocalCustomerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocalCustomerGroupByArgs['orderBy'] }
        : { orderBy?: LocalCustomerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocalCustomerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocalCustomerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LocalCustomer model
   */
  readonly fields: LocalCustomerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LocalCustomer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocalCustomerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LocalCustomer model
   */
  interface LocalCustomerFieldRefs {
    readonly id: FieldRef<"LocalCustomer", 'String'>
    readonly name: FieldRef<"LocalCustomer", 'String'>
    readonly phone: FieldRef<"LocalCustomer", 'String'>
    readonly address: FieldRef<"LocalCustomer", 'String'>
    readonly balance: FieldRef<"LocalCustomer", 'Float'>
    readonly updatedAt: FieldRef<"LocalCustomer", 'String'>
  }
    

  // Custom InputTypes
  /**
   * LocalCustomer findUnique
   */
  export type LocalCustomerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCustomer
     */
    select?: LocalCustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCustomer
     */
    omit?: LocalCustomerOmit<ExtArgs> | null
    /**
     * Filter, which LocalCustomer to fetch.
     */
    where: LocalCustomerWhereUniqueInput
  }

  /**
   * LocalCustomer findUniqueOrThrow
   */
  export type LocalCustomerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCustomer
     */
    select?: LocalCustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCustomer
     */
    omit?: LocalCustomerOmit<ExtArgs> | null
    /**
     * Filter, which LocalCustomer to fetch.
     */
    where: LocalCustomerWhereUniqueInput
  }

  /**
   * LocalCustomer findFirst
   */
  export type LocalCustomerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCustomer
     */
    select?: LocalCustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCustomer
     */
    omit?: LocalCustomerOmit<ExtArgs> | null
    /**
     * Filter, which LocalCustomer to fetch.
     */
    where?: LocalCustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalCustomers to fetch.
     */
    orderBy?: LocalCustomerOrderByWithRelationInput | LocalCustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalCustomers.
     */
    cursor?: LocalCustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalCustomers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalCustomers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalCustomers.
     */
    distinct?: LocalCustomerScalarFieldEnum | LocalCustomerScalarFieldEnum[]
  }

  /**
   * LocalCustomer findFirstOrThrow
   */
  export type LocalCustomerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCustomer
     */
    select?: LocalCustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCustomer
     */
    omit?: LocalCustomerOmit<ExtArgs> | null
    /**
     * Filter, which LocalCustomer to fetch.
     */
    where?: LocalCustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalCustomers to fetch.
     */
    orderBy?: LocalCustomerOrderByWithRelationInput | LocalCustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalCustomers.
     */
    cursor?: LocalCustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalCustomers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalCustomers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalCustomers.
     */
    distinct?: LocalCustomerScalarFieldEnum | LocalCustomerScalarFieldEnum[]
  }

  /**
   * LocalCustomer findMany
   */
  export type LocalCustomerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCustomer
     */
    select?: LocalCustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCustomer
     */
    omit?: LocalCustomerOmit<ExtArgs> | null
    /**
     * Filter, which LocalCustomers to fetch.
     */
    where?: LocalCustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalCustomers to fetch.
     */
    orderBy?: LocalCustomerOrderByWithRelationInput | LocalCustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LocalCustomers.
     */
    cursor?: LocalCustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalCustomers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalCustomers.
     */
    skip?: number
    distinct?: LocalCustomerScalarFieldEnum | LocalCustomerScalarFieldEnum[]
  }

  /**
   * LocalCustomer create
   */
  export type LocalCustomerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCustomer
     */
    select?: LocalCustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCustomer
     */
    omit?: LocalCustomerOmit<ExtArgs> | null
    /**
     * The data needed to create a LocalCustomer.
     */
    data: XOR<LocalCustomerCreateInput, LocalCustomerUncheckedCreateInput>
  }

  /**
   * LocalCustomer createMany
   */
  export type LocalCustomerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LocalCustomers.
     */
    data: LocalCustomerCreateManyInput | LocalCustomerCreateManyInput[]
  }

  /**
   * LocalCustomer createManyAndReturn
   */
  export type LocalCustomerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCustomer
     */
    select?: LocalCustomerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCustomer
     */
    omit?: LocalCustomerOmit<ExtArgs> | null
    /**
     * The data used to create many LocalCustomers.
     */
    data: LocalCustomerCreateManyInput | LocalCustomerCreateManyInput[]
  }

  /**
   * LocalCustomer update
   */
  export type LocalCustomerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCustomer
     */
    select?: LocalCustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCustomer
     */
    omit?: LocalCustomerOmit<ExtArgs> | null
    /**
     * The data needed to update a LocalCustomer.
     */
    data: XOR<LocalCustomerUpdateInput, LocalCustomerUncheckedUpdateInput>
    /**
     * Choose, which LocalCustomer to update.
     */
    where: LocalCustomerWhereUniqueInput
  }

  /**
   * LocalCustomer updateMany
   */
  export type LocalCustomerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LocalCustomers.
     */
    data: XOR<LocalCustomerUpdateManyMutationInput, LocalCustomerUncheckedUpdateManyInput>
    /**
     * Filter which LocalCustomers to update
     */
    where?: LocalCustomerWhereInput
    /**
     * Limit how many LocalCustomers to update.
     */
    limit?: number
  }

  /**
   * LocalCustomer updateManyAndReturn
   */
  export type LocalCustomerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCustomer
     */
    select?: LocalCustomerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCustomer
     */
    omit?: LocalCustomerOmit<ExtArgs> | null
    /**
     * The data used to update LocalCustomers.
     */
    data: XOR<LocalCustomerUpdateManyMutationInput, LocalCustomerUncheckedUpdateManyInput>
    /**
     * Filter which LocalCustomers to update
     */
    where?: LocalCustomerWhereInput
    /**
     * Limit how many LocalCustomers to update.
     */
    limit?: number
  }

  /**
   * LocalCustomer upsert
   */
  export type LocalCustomerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCustomer
     */
    select?: LocalCustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCustomer
     */
    omit?: LocalCustomerOmit<ExtArgs> | null
    /**
     * The filter to search for the LocalCustomer to update in case it exists.
     */
    where: LocalCustomerWhereUniqueInput
    /**
     * In case the LocalCustomer found by the `where` argument doesn't exist, create a new LocalCustomer with this data.
     */
    create: XOR<LocalCustomerCreateInput, LocalCustomerUncheckedCreateInput>
    /**
     * In case the LocalCustomer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocalCustomerUpdateInput, LocalCustomerUncheckedUpdateInput>
  }

  /**
   * LocalCustomer delete
   */
  export type LocalCustomerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCustomer
     */
    select?: LocalCustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCustomer
     */
    omit?: LocalCustomerOmit<ExtArgs> | null
    /**
     * Filter which LocalCustomer to delete.
     */
    where: LocalCustomerWhereUniqueInput
  }

  /**
   * LocalCustomer deleteMany
   */
  export type LocalCustomerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalCustomers to delete
     */
    where?: LocalCustomerWhereInput
    /**
     * Limit how many LocalCustomers to delete.
     */
    limit?: number
  }

  /**
   * LocalCustomer without action
   */
  export type LocalCustomerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalCustomer
     */
    select?: LocalCustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalCustomer
     */
    omit?: LocalCustomerOmit<ExtArgs> | null
  }


  /**
   * Model LocalSale
   */

  export type AggregateLocalSale = {
    _count: LocalSaleCountAggregateOutputType | null
    _avg: LocalSaleAvgAggregateOutputType | null
    _sum: LocalSaleSumAggregateOutputType | null
    _min: LocalSaleMinAggregateOutputType | null
    _max: LocalSaleMaxAggregateOutputType | null
  }

  export type LocalSaleAvgAggregateOutputType = {
    subtotal: number | null
    discount: number | null
    total: number | null
    paid: number | null
    remaining: number | null
  }

  export type LocalSaleSumAggregateOutputType = {
    subtotal: number | null
    discount: number | null
    total: number | null
    paid: number | null
    remaining: number | null
  }

  export type LocalSaleMinAggregateOutputType = {
    id: string | null
    clientEventId: string | null
    invoiceNo: string | null
    userId: string | null
    customerName: string | null
    customerPhone: string | null
    subtotal: number | null
    discount: number | null
    total: number | null
    paid: number | null
    remaining: number | null
    paymentType: string | null
    priceEdited: boolean | null
    synced: boolean | null
    createdAt: string | null
  }

  export type LocalSaleMaxAggregateOutputType = {
    id: string | null
    clientEventId: string | null
    invoiceNo: string | null
    userId: string | null
    customerName: string | null
    customerPhone: string | null
    subtotal: number | null
    discount: number | null
    total: number | null
    paid: number | null
    remaining: number | null
    paymentType: string | null
    priceEdited: boolean | null
    synced: boolean | null
    createdAt: string | null
  }

  export type LocalSaleCountAggregateOutputType = {
    id: number
    clientEventId: number
    invoiceNo: number
    userId: number
    customerName: number
    customerPhone: number
    subtotal: number
    discount: number
    total: number
    paid: number
    remaining: number
    paymentType: number
    priceEdited: number
    synced: number
    createdAt: number
    _all: number
  }


  export type LocalSaleAvgAggregateInputType = {
    subtotal?: true
    discount?: true
    total?: true
    paid?: true
    remaining?: true
  }

  export type LocalSaleSumAggregateInputType = {
    subtotal?: true
    discount?: true
    total?: true
    paid?: true
    remaining?: true
  }

  export type LocalSaleMinAggregateInputType = {
    id?: true
    clientEventId?: true
    invoiceNo?: true
    userId?: true
    customerName?: true
    customerPhone?: true
    subtotal?: true
    discount?: true
    total?: true
    paid?: true
    remaining?: true
    paymentType?: true
    priceEdited?: true
    synced?: true
    createdAt?: true
  }

  export type LocalSaleMaxAggregateInputType = {
    id?: true
    clientEventId?: true
    invoiceNo?: true
    userId?: true
    customerName?: true
    customerPhone?: true
    subtotal?: true
    discount?: true
    total?: true
    paid?: true
    remaining?: true
    paymentType?: true
    priceEdited?: true
    synced?: true
    createdAt?: true
  }

  export type LocalSaleCountAggregateInputType = {
    id?: true
    clientEventId?: true
    invoiceNo?: true
    userId?: true
    customerName?: true
    customerPhone?: true
    subtotal?: true
    discount?: true
    total?: true
    paid?: true
    remaining?: true
    paymentType?: true
    priceEdited?: true
    synced?: true
    createdAt?: true
    _all?: true
  }

  export type LocalSaleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalSale to aggregate.
     */
    where?: LocalSaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalSales to fetch.
     */
    orderBy?: LocalSaleOrderByWithRelationInput | LocalSaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocalSaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalSales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalSales.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LocalSales
    **/
    _count?: true | LocalSaleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocalSaleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocalSaleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocalSaleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocalSaleMaxAggregateInputType
  }

  export type GetLocalSaleAggregateType<T extends LocalSaleAggregateArgs> = {
        [P in keyof T & keyof AggregateLocalSale]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocalSale[P]>
      : GetScalarType<T[P], AggregateLocalSale[P]>
  }




  export type LocalSaleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocalSaleWhereInput
    orderBy?: LocalSaleOrderByWithAggregationInput | LocalSaleOrderByWithAggregationInput[]
    by: LocalSaleScalarFieldEnum[] | LocalSaleScalarFieldEnum
    having?: LocalSaleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocalSaleCountAggregateInputType | true
    _avg?: LocalSaleAvgAggregateInputType
    _sum?: LocalSaleSumAggregateInputType
    _min?: LocalSaleMinAggregateInputType
    _max?: LocalSaleMaxAggregateInputType
  }

  export type LocalSaleGroupByOutputType = {
    id: string
    clientEventId: string
    invoiceNo: string
    userId: string | null
    customerName: string | null
    customerPhone: string | null
    subtotal: number
    discount: number
    total: number
    paid: number
    remaining: number
    paymentType: string
    priceEdited: boolean
    synced: boolean
    createdAt: string
    _count: LocalSaleCountAggregateOutputType | null
    _avg: LocalSaleAvgAggregateOutputType | null
    _sum: LocalSaleSumAggregateOutputType | null
    _min: LocalSaleMinAggregateOutputType | null
    _max: LocalSaleMaxAggregateOutputType | null
  }

  type GetLocalSaleGroupByPayload<T extends LocalSaleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocalSaleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocalSaleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocalSaleGroupByOutputType[P]>
            : GetScalarType<T[P], LocalSaleGroupByOutputType[P]>
        }
      >
    >


  export type LocalSaleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientEventId?: boolean
    invoiceNo?: boolean
    userId?: boolean
    customerName?: boolean
    customerPhone?: boolean
    subtotal?: boolean
    discount?: boolean
    total?: boolean
    paid?: boolean
    remaining?: boolean
    paymentType?: boolean
    priceEdited?: boolean
    synced?: boolean
    createdAt?: boolean
    items?: boolean | LocalSale$itemsArgs<ExtArgs>
    _count?: boolean | LocalSaleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["localSale"]>

  export type LocalSaleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientEventId?: boolean
    invoiceNo?: boolean
    userId?: boolean
    customerName?: boolean
    customerPhone?: boolean
    subtotal?: boolean
    discount?: boolean
    total?: boolean
    paid?: boolean
    remaining?: boolean
    paymentType?: boolean
    priceEdited?: boolean
    synced?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["localSale"]>

  export type LocalSaleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientEventId?: boolean
    invoiceNo?: boolean
    userId?: boolean
    customerName?: boolean
    customerPhone?: boolean
    subtotal?: boolean
    discount?: boolean
    total?: boolean
    paid?: boolean
    remaining?: boolean
    paymentType?: boolean
    priceEdited?: boolean
    synced?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["localSale"]>

  export type LocalSaleSelectScalar = {
    id?: boolean
    clientEventId?: boolean
    invoiceNo?: boolean
    userId?: boolean
    customerName?: boolean
    customerPhone?: boolean
    subtotal?: boolean
    discount?: boolean
    total?: boolean
    paid?: boolean
    remaining?: boolean
    paymentType?: boolean
    priceEdited?: boolean
    synced?: boolean
    createdAt?: boolean
  }

  export type LocalSaleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "clientEventId" | "invoiceNo" | "userId" | "customerName" | "customerPhone" | "subtotal" | "discount" | "total" | "paid" | "remaining" | "paymentType" | "priceEdited" | "synced" | "createdAt", ExtArgs["result"]["localSale"]>
  export type LocalSaleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | LocalSale$itemsArgs<ExtArgs>
    _count?: boolean | LocalSaleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LocalSaleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type LocalSaleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $LocalSalePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LocalSale"
    objects: {
      items: Prisma.$LocalSaleItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clientEventId: string
      invoiceNo: string
      userId: string | null
      customerName: string | null
      customerPhone: string | null
      subtotal: number
      discount: number
      total: number
      paid: number
      remaining: number
      paymentType: string
      priceEdited: boolean
      synced: boolean
      createdAt: string
    }, ExtArgs["result"]["localSale"]>
    composites: {}
  }

  type LocalSaleGetPayload<S extends boolean | null | undefined | LocalSaleDefaultArgs> = $Result.GetResult<Prisma.$LocalSalePayload, S>

  type LocalSaleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocalSaleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocalSaleCountAggregateInputType | true
    }

  export interface LocalSaleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LocalSale'], meta: { name: 'LocalSale' } }
    /**
     * Find zero or one LocalSale that matches the filter.
     * @param {LocalSaleFindUniqueArgs} args - Arguments to find a LocalSale
     * @example
     * // Get one LocalSale
     * const localSale = await prisma.localSale.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocalSaleFindUniqueArgs>(args: SelectSubset<T, LocalSaleFindUniqueArgs<ExtArgs>>): Prisma__LocalSaleClient<$Result.GetResult<Prisma.$LocalSalePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LocalSale that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocalSaleFindUniqueOrThrowArgs} args - Arguments to find a LocalSale
     * @example
     * // Get one LocalSale
     * const localSale = await prisma.localSale.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocalSaleFindUniqueOrThrowArgs>(args: SelectSubset<T, LocalSaleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocalSaleClient<$Result.GetResult<Prisma.$LocalSalePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalSale that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSaleFindFirstArgs} args - Arguments to find a LocalSale
     * @example
     * // Get one LocalSale
     * const localSale = await prisma.localSale.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocalSaleFindFirstArgs>(args?: SelectSubset<T, LocalSaleFindFirstArgs<ExtArgs>>): Prisma__LocalSaleClient<$Result.GetResult<Prisma.$LocalSalePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalSale that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSaleFindFirstOrThrowArgs} args - Arguments to find a LocalSale
     * @example
     * // Get one LocalSale
     * const localSale = await prisma.localSale.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocalSaleFindFirstOrThrowArgs>(args?: SelectSubset<T, LocalSaleFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocalSaleClient<$Result.GetResult<Prisma.$LocalSalePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LocalSales that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSaleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LocalSales
     * const localSales = await prisma.localSale.findMany()
     * 
     * // Get first 10 LocalSales
     * const localSales = await prisma.localSale.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const localSaleWithIdOnly = await prisma.localSale.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocalSaleFindManyArgs>(args?: SelectSubset<T, LocalSaleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalSalePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LocalSale.
     * @param {LocalSaleCreateArgs} args - Arguments to create a LocalSale.
     * @example
     * // Create one LocalSale
     * const LocalSale = await prisma.localSale.create({
     *   data: {
     *     // ... data to create a LocalSale
     *   }
     * })
     * 
     */
    create<T extends LocalSaleCreateArgs>(args: SelectSubset<T, LocalSaleCreateArgs<ExtArgs>>): Prisma__LocalSaleClient<$Result.GetResult<Prisma.$LocalSalePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LocalSales.
     * @param {LocalSaleCreateManyArgs} args - Arguments to create many LocalSales.
     * @example
     * // Create many LocalSales
     * const localSale = await prisma.localSale.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocalSaleCreateManyArgs>(args?: SelectSubset<T, LocalSaleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LocalSales and returns the data saved in the database.
     * @param {LocalSaleCreateManyAndReturnArgs} args - Arguments to create many LocalSales.
     * @example
     * // Create many LocalSales
     * const localSale = await prisma.localSale.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LocalSales and only return the `id`
     * const localSaleWithIdOnly = await prisma.localSale.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocalSaleCreateManyAndReturnArgs>(args?: SelectSubset<T, LocalSaleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalSalePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LocalSale.
     * @param {LocalSaleDeleteArgs} args - Arguments to delete one LocalSale.
     * @example
     * // Delete one LocalSale
     * const LocalSale = await prisma.localSale.delete({
     *   where: {
     *     // ... filter to delete one LocalSale
     *   }
     * })
     * 
     */
    delete<T extends LocalSaleDeleteArgs>(args: SelectSubset<T, LocalSaleDeleteArgs<ExtArgs>>): Prisma__LocalSaleClient<$Result.GetResult<Prisma.$LocalSalePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LocalSale.
     * @param {LocalSaleUpdateArgs} args - Arguments to update one LocalSale.
     * @example
     * // Update one LocalSale
     * const localSale = await prisma.localSale.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocalSaleUpdateArgs>(args: SelectSubset<T, LocalSaleUpdateArgs<ExtArgs>>): Prisma__LocalSaleClient<$Result.GetResult<Prisma.$LocalSalePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LocalSales.
     * @param {LocalSaleDeleteManyArgs} args - Arguments to filter LocalSales to delete.
     * @example
     * // Delete a few LocalSales
     * const { count } = await prisma.localSale.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocalSaleDeleteManyArgs>(args?: SelectSubset<T, LocalSaleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalSales.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSaleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LocalSales
     * const localSale = await prisma.localSale.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocalSaleUpdateManyArgs>(args: SelectSubset<T, LocalSaleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalSales and returns the data updated in the database.
     * @param {LocalSaleUpdateManyAndReturnArgs} args - Arguments to update many LocalSales.
     * @example
     * // Update many LocalSales
     * const localSale = await prisma.localSale.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LocalSales and only return the `id`
     * const localSaleWithIdOnly = await prisma.localSale.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocalSaleUpdateManyAndReturnArgs>(args: SelectSubset<T, LocalSaleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalSalePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LocalSale.
     * @param {LocalSaleUpsertArgs} args - Arguments to update or create a LocalSale.
     * @example
     * // Update or create a LocalSale
     * const localSale = await prisma.localSale.upsert({
     *   create: {
     *     // ... data to create a LocalSale
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LocalSale we want to update
     *   }
     * })
     */
    upsert<T extends LocalSaleUpsertArgs>(args: SelectSubset<T, LocalSaleUpsertArgs<ExtArgs>>): Prisma__LocalSaleClient<$Result.GetResult<Prisma.$LocalSalePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LocalSales.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSaleCountArgs} args - Arguments to filter LocalSales to count.
     * @example
     * // Count the number of LocalSales
     * const count = await prisma.localSale.count({
     *   where: {
     *     // ... the filter for the LocalSales we want to count
     *   }
     * })
    **/
    count<T extends LocalSaleCountArgs>(
      args?: Subset<T, LocalSaleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocalSaleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LocalSale.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSaleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocalSaleAggregateArgs>(args: Subset<T, LocalSaleAggregateArgs>): Prisma.PrismaPromise<GetLocalSaleAggregateType<T>>

    /**
     * Group by LocalSale.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSaleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocalSaleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocalSaleGroupByArgs['orderBy'] }
        : { orderBy?: LocalSaleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocalSaleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocalSaleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LocalSale model
   */
  readonly fields: LocalSaleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LocalSale.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocalSaleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    items<T extends LocalSale$itemsArgs<ExtArgs> = {}>(args?: Subset<T, LocalSale$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalSaleItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LocalSale model
   */
  interface LocalSaleFieldRefs {
    readonly id: FieldRef<"LocalSale", 'String'>
    readonly clientEventId: FieldRef<"LocalSale", 'String'>
    readonly invoiceNo: FieldRef<"LocalSale", 'String'>
    readonly userId: FieldRef<"LocalSale", 'String'>
    readonly customerName: FieldRef<"LocalSale", 'String'>
    readonly customerPhone: FieldRef<"LocalSale", 'String'>
    readonly subtotal: FieldRef<"LocalSale", 'Float'>
    readonly discount: FieldRef<"LocalSale", 'Float'>
    readonly total: FieldRef<"LocalSale", 'Float'>
    readonly paid: FieldRef<"LocalSale", 'Float'>
    readonly remaining: FieldRef<"LocalSale", 'Float'>
    readonly paymentType: FieldRef<"LocalSale", 'String'>
    readonly priceEdited: FieldRef<"LocalSale", 'Boolean'>
    readonly synced: FieldRef<"LocalSale", 'Boolean'>
    readonly createdAt: FieldRef<"LocalSale", 'String'>
  }
    

  // Custom InputTypes
  /**
   * LocalSale findUnique
   */
  export type LocalSaleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSale
     */
    select?: LocalSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSale
     */
    omit?: LocalSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleInclude<ExtArgs> | null
    /**
     * Filter, which LocalSale to fetch.
     */
    where: LocalSaleWhereUniqueInput
  }

  /**
   * LocalSale findUniqueOrThrow
   */
  export type LocalSaleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSale
     */
    select?: LocalSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSale
     */
    omit?: LocalSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleInclude<ExtArgs> | null
    /**
     * Filter, which LocalSale to fetch.
     */
    where: LocalSaleWhereUniqueInput
  }

  /**
   * LocalSale findFirst
   */
  export type LocalSaleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSale
     */
    select?: LocalSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSale
     */
    omit?: LocalSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleInclude<ExtArgs> | null
    /**
     * Filter, which LocalSale to fetch.
     */
    where?: LocalSaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalSales to fetch.
     */
    orderBy?: LocalSaleOrderByWithRelationInput | LocalSaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalSales.
     */
    cursor?: LocalSaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalSales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalSales.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalSales.
     */
    distinct?: LocalSaleScalarFieldEnum | LocalSaleScalarFieldEnum[]
  }

  /**
   * LocalSale findFirstOrThrow
   */
  export type LocalSaleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSale
     */
    select?: LocalSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSale
     */
    omit?: LocalSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleInclude<ExtArgs> | null
    /**
     * Filter, which LocalSale to fetch.
     */
    where?: LocalSaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalSales to fetch.
     */
    orderBy?: LocalSaleOrderByWithRelationInput | LocalSaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalSales.
     */
    cursor?: LocalSaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalSales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalSales.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalSales.
     */
    distinct?: LocalSaleScalarFieldEnum | LocalSaleScalarFieldEnum[]
  }

  /**
   * LocalSale findMany
   */
  export type LocalSaleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSale
     */
    select?: LocalSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSale
     */
    omit?: LocalSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleInclude<ExtArgs> | null
    /**
     * Filter, which LocalSales to fetch.
     */
    where?: LocalSaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalSales to fetch.
     */
    orderBy?: LocalSaleOrderByWithRelationInput | LocalSaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LocalSales.
     */
    cursor?: LocalSaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalSales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalSales.
     */
    skip?: number
    distinct?: LocalSaleScalarFieldEnum | LocalSaleScalarFieldEnum[]
  }

  /**
   * LocalSale create
   */
  export type LocalSaleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSale
     */
    select?: LocalSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSale
     */
    omit?: LocalSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleInclude<ExtArgs> | null
    /**
     * The data needed to create a LocalSale.
     */
    data: XOR<LocalSaleCreateInput, LocalSaleUncheckedCreateInput>
  }

  /**
   * LocalSale createMany
   */
  export type LocalSaleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LocalSales.
     */
    data: LocalSaleCreateManyInput | LocalSaleCreateManyInput[]
  }

  /**
   * LocalSale createManyAndReturn
   */
  export type LocalSaleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSale
     */
    select?: LocalSaleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSale
     */
    omit?: LocalSaleOmit<ExtArgs> | null
    /**
     * The data used to create many LocalSales.
     */
    data: LocalSaleCreateManyInput | LocalSaleCreateManyInput[]
  }

  /**
   * LocalSale update
   */
  export type LocalSaleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSale
     */
    select?: LocalSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSale
     */
    omit?: LocalSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleInclude<ExtArgs> | null
    /**
     * The data needed to update a LocalSale.
     */
    data: XOR<LocalSaleUpdateInput, LocalSaleUncheckedUpdateInput>
    /**
     * Choose, which LocalSale to update.
     */
    where: LocalSaleWhereUniqueInput
  }

  /**
   * LocalSale updateMany
   */
  export type LocalSaleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LocalSales.
     */
    data: XOR<LocalSaleUpdateManyMutationInput, LocalSaleUncheckedUpdateManyInput>
    /**
     * Filter which LocalSales to update
     */
    where?: LocalSaleWhereInput
    /**
     * Limit how many LocalSales to update.
     */
    limit?: number
  }

  /**
   * LocalSale updateManyAndReturn
   */
  export type LocalSaleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSale
     */
    select?: LocalSaleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSale
     */
    omit?: LocalSaleOmit<ExtArgs> | null
    /**
     * The data used to update LocalSales.
     */
    data: XOR<LocalSaleUpdateManyMutationInput, LocalSaleUncheckedUpdateManyInput>
    /**
     * Filter which LocalSales to update
     */
    where?: LocalSaleWhereInput
    /**
     * Limit how many LocalSales to update.
     */
    limit?: number
  }

  /**
   * LocalSale upsert
   */
  export type LocalSaleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSale
     */
    select?: LocalSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSale
     */
    omit?: LocalSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleInclude<ExtArgs> | null
    /**
     * The filter to search for the LocalSale to update in case it exists.
     */
    where: LocalSaleWhereUniqueInput
    /**
     * In case the LocalSale found by the `where` argument doesn't exist, create a new LocalSale with this data.
     */
    create: XOR<LocalSaleCreateInput, LocalSaleUncheckedCreateInput>
    /**
     * In case the LocalSale was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocalSaleUpdateInput, LocalSaleUncheckedUpdateInput>
  }

  /**
   * LocalSale delete
   */
  export type LocalSaleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSale
     */
    select?: LocalSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSale
     */
    omit?: LocalSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleInclude<ExtArgs> | null
    /**
     * Filter which LocalSale to delete.
     */
    where: LocalSaleWhereUniqueInput
  }

  /**
   * LocalSale deleteMany
   */
  export type LocalSaleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalSales to delete
     */
    where?: LocalSaleWhereInput
    /**
     * Limit how many LocalSales to delete.
     */
    limit?: number
  }

  /**
   * LocalSale.items
   */
  export type LocalSale$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSaleItem
     */
    select?: LocalSaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSaleItem
     */
    omit?: LocalSaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleItemInclude<ExtArgs> | null
    where?: LocalSaleItemWhereInput
    orderBy?: LocalSaleItemOrderByWithRelationInput | LocalSaleItemOrderByWithRelationInput[]
    cursor?: LocalSaleItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LocalSaleItemScalarFieldEnum | LocalSaleItemScalarFieldEnum[]
  }

  /**
   * LocalSale without action
   */
  export type LocalSaleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSale
     */
    select?: LocalSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSale
     */
    omit?: LocalSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleInclude<ExtArgs> | null
  }


  /**
   * Model LocalSaleItem
   */

  export type AggregateLocalSaleItem = {
    _count: LocalSaleItemCountAggregateOutputType | null
    _avg: LocalSaleItemAvgAggregateOutputType | null
    _sum: LocalSaleItemSumAggregateOutputType | null
    _min: LocalSaleItemMinAggregateOutputType | null
    _max: LocalSaleItemMaxAggregateOutputType | null
  }

  export type LocalSaleItemAvgAggregateOutputType = {
    quantity: number | null
    unitPrice: number | null
    lineDiscount: number | null
    lineTotal: number | null
  }

  export type LocalSaleItemSumAggregateOutputType = {
    quantity: number | null
    unitPrice: number | null
    lineDiscount: number | null
    lineTotal: number | null
  }

  export type LocalSaleItemMinAggregateOutputType = {
    id: string | null
    saleId: string | null
    productId: string | null
    nameAr: string | null
    quantity: number | null
    unitPrice: number | null
    lineDiscount: number | null
    lineTotal: number | null
  }

  export type LocalSaleItemMaxAggregateOutputType = {
    id: string | null
    saleId: string | null
    productId: string | null
    nameAr: string | null
    quantity: number | null
    unitPrice: number | null
    lineDiscount: number | null
    lineTotal: number | null
  }

  export type LocalSaleItemCountAggregateOutputType = {
    id: number
    saleId: number
    productId: number
    nameAr: number
    quantity: number
    unitPrice: number
    lineDiscount: number
    lineTotal: number
    _all: number
  }


  export type LocalSaleItemAvgAggregateInputType = {
    quantity?: true
    unitPrice?: true
    lineDiscount?: true
    lineTotal?: true
  }

  export type LocalSaleItemSumAggregateInputType = {
    quantity?: true
    unitPrice?: true
    lineDiscount?: true
    lineTotal?: true
  }

  export type LocalSaleItemMinAggregateInputType = {
    id?: true
    saleId?: true
    productId?: true
    nameAr?: true
    quantity?: true
    unitPrice?: true
    lineDiscount?: true
    lineTotal?: true
  }

  export type LocalSaleItemMaxAggregateInputType = {
    id?: true
    saleId?: true
    productId?: true
    nameAr?: true
    quantity?: true
    unitPrice?: true
    lineDiscount?: true
    lineTotal?: true
  }

  export type LocalSaleItemCountAggregateInputType = {
    id?: true
    saleId?: true
    productId?: true
    nameAr?: true
    quantity?: true
    unitPrice?: true
    lineDiscount?: true
    lineTotal?: true
    _all?: true
  }

  export type LocalSaleItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalSaleItem to aggregate.
     */
    where?: LocalSaleItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalSaleItems to fetch.
     */
    orderBy?: LocalSaleItemOrderByWithRelationInput | LocalSaleItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocalSaleItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalSaleItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalSaleItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LocalSaleItems
    **/
    _count?: true | LocalSaleItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocalSaleItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocalSaleItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocalSaleItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocalSaleItemMaxAggregateInputType
  }

  export type GetLocalSaleItemAggregateType<T extends LocalSaleItemAggregateArgs> = {
        [P in keyof T & keyof AggregateLocalSaleItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocalSaleItem[P]>
      : GetScalarType<T[P], AggregateLocalSaleItem[P]>
  }




  export type LocalSaleItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocalSaleItemWhereInput
    orderBy?: LocalSaleItemOrderByWithAggregationInput | LocalSaleItemOrderByWithAggregationInput[]
    by: LocalSaleItemScalarFieldEnum[] | LocalSaleItemScalarFieldEnum
    having?: LocalSaleItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocalSaleItemCountAggregateInputType | true
    _avg?: LocalSaleItemAvgAggregateInputType
    _sum?: LocalSaleItemSumAggregateInputType
    _min?: LocalSaleItemMinAggregateInputType
    _max?: LocalSaleItemMaxAggregateInputType
  }

  export type LocalSaleItemGroupByOutputType = {
    id: string
    saleId: string
    productId: string
    nameAr: string
    quantity: number
    unitPrice: number
    lineDiscount: number
    lineTotal: number
    _count: LocalSaleItemCountAggregateOutputType | null
    _avg: LocalSaleItemAvgAggregateOutputType | null
    _sum: LocalSaleItemSumAggregateOutputType | null
    _min: LocalSaleItemMinAggregateOutputType | null
    _max: LocalSaleItemMaxAggregateOutputType | null
  }

  type GetLocalSaleItemGroupByPayload<T extends LocalSaleItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocalSaleItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocalSaleItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocalSaleItemGroupByOutputType[P]>
            : GetScalarType<T[P], LocalSaleItemGroupByOutputType[P]>
        }
      >
    >


  export type LocalSaleItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    saleId?: boolean
    productId?: boolean
    nameAr?: boolean
    quantity?: boolean
    unitPrice?: boolean
    lineDiscount?: boolean
    lineTotal?: boolean
    sale?: boolean | LocalSaleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["localSaleItem"]>

  export type LocalSaleItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    saleId?: boolean
    productId?: boolean
    nameAr?: boolean
    quantity?: boolean
    unitPrice?: boolean
    lineDiscount?: boolean
    lineTotal?: boolean
    sale?: boolean | LocalSaleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["localSaleItem"]>

  export type LocalSaleItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    saleId?: boolean
    productId?: boolean
    nameAr?: boolean
    quantity?: boolean
    unitPrice?: boolean
    lineDiscount?: boolean
    lineTotal?: boolean
    sale?: boolean | LocalSaleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["localSaleItem"]>

  export type LocalSaleItemSelectScalar = {
    id?: boolean
    saleId?: boolean
    productId?: boolean
    nameAr?: boolean
    quantity?: boolean
    unitPrice?: boolean
    lineDiscount?: boolean
    lineTotal?: boolean
  }

  export type LocalSaleItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "saleId" | "productId" | "nameAr" | "quantity" | "unitPrice" | "lineDiscount" | "lineTotal", ExtArgs["result"]["localSaleItem"]>
  export type LocalSaleItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sale?: boolean | LocalSaleDefaultArgs<ExtArgs>
  }
  export type LocalSaleItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sale?: boolean | LocalSaleDefaultArgs<ExtArgs>
  }
  export type LocalSaleItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sale?: boolean | LocalSaleDefaultArgs<ExtArgs>
  }

  export type $LocalSaleItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LocalSaleItem"
    objects: {
      sale: Prisma.$LocalSalePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      saleId: string
      productId: string
      nameAr: string
      quantity: number
      unitPrice: number
      lineDiscount: number
      lineTotal: number
    }, ExtArgs["result"]["localSaleItem"]>
    composites: {}
  }

  type LocalSaleItemGetPayload<S extends boolean | null | undefined | LocalSaleItemDefaultArgs> = $Result.GetResult<Prisma.$LocalSaleItemPayload, S>

  type LocalSaleItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocalSaleItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocalSaleItemCountAggregateInputType | true
    }

  export interface LocalSaleItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LocalSaleItem'], meta: { name: 'LocalSaleItem' } }
    /**
     * Find zero or one LocalSaleItem that matches the filter.
     * @param {LocalSaleItemFindUniqueArgs} args - Arguments to find a LocalSaleItem
     * @example
     * // Get one LocalSaleItem
     * const localSaleItem = await prisma.localSaleItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocalSaleItemFindUniqueArgs>(args: SelectSubset<T, LocalSaleItemFindUniqueArgs<ExtArgs>>): Prisma__LocalSaleItemClient<$Result.GetResult<Prisma.$LocalSaleItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LocalSaleItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocalSaleItemFindUniqueOrThrowArgs} args - Arguments to find a LocalSaleItem
     * @example
     * // Get one LocalSaleItem
     * const localSaleItem = await prisma.localSaleItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocalSaleItemFindUniqueOrThrowArgs>(args: SelectSubset<T, LocalSaleItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocalSaleItemClient<$Result.GetResult<Prisma.$LocalSaleItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalSaleItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSaleItemFindFirstArgs} args - Arguments to find a LocalSaleItem
     * @example
     * // Get one LocalSaleItem
     * const localSaleItem = await prisma.localSaleItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocalSaleItemFindFirstArgs>(args?: SelectSubset<T, LocalSaleItemFindFirstArgs<ExtArgs>>): Prisma__LocalSaleItemClient<$Result.GetResult<Prisma.$LocalSaleItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocalSaleItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSaleItemFindFirstOrThrowArgs} args - Arguments to find a LocalSaleItem
     * @example
     * // Get one LocalSaleItem
     * const localSaleItem = await prisma.localSaleItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocalSaleItemFindFirstOrThrowArgs>(args?: SelectSubset<T, LocalSaleItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocalSaleItemClient<$Result.GetResult<Prisma.$LocalSaleItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LocalSaleItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSaleItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LocalSaleItems
     * const localSaleItems = await prisma.localSaleItem.findMany()
     * 
     * // Get first 10 LocalSaleItems
     * const localSaleItems = await prisma.localSaleItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const localSaleItemWithIdOnly = await prisma.localSaleItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocalSaleItemFindManyArgs>(args?: SelectSubset<T, LocalSaleItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalSaleItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LocalSaleItem.
     * @param {LocalSaleItemCreateArgs} args - Arguments to create a LocalSaleItem.
     * @example
     * // Create one LocalSaleItem
     * const LocalSaleItem = await prisma.localSaleItem.create({
     *   data: {
     *     // ... data to create a LocalSaleItem
     *   }
     * })
     * 
     */
    create<T extends LocalSaleItemCreateArgs>(args: SelectSubset<T, LocalSaleItemCreateArgs<ExtArgs>>): Prisma__LocalSaleItemClient<$Result.GetResult<Prisma.$LocalSaleItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LocalSaleItems.
     * @param {LocalSaleItemCreateManyArgs} args - Arguments to create many LocalSaleItems.
     * @example
     * // Create many LocalSaleItems
     * const localSaleItem = await prisma.localSaleItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocalSaleItemCreateManyArgs>(args?: SelectSubset<T, LocalSaleItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LocalSaleItems and returns the data saved in the database.
     * @param {LocalSaleItemCreateManyAndReturnArgs} args - Arguments to create many LocalSaleItems.
     * @example
     * // Create many LocalSaleItems
     * const localSaleItem = await prisma.localSaleItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LocalSaleItems and only return the `id`
     * const localSaleItemWithIdOnly = await prisma.localSaleItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocalSaleItemCreateManyAndReturnArgs>(args?: SelectSubset<T, LocalSaleItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalSaleItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LocalSaleItem.
     * @param {LocalSaleItemDeleteArgs} args - Arguments to delete one LocalSaleItem.
     * @example
     * // Delete one LocalSaleItem
     * const LocalSaleItem = await prisma.localSaleItem.delete({
     *   where: {
     *     // ... filter to delete one LocalSaleItem
     *   }
     * })
     * 
     */
    delete<T extends LocalSaleItemDeleteArgs>(args: SelectSubset<T, LocalSaleItemDeleteArgs<ExtArgs>>): Prisma__LocalSaleItemClient<$Result.GetResult<Prisma.$LocalSaleItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LocalSaleItem.
     * @param {LocalSaleItemUpdateArgs} args - Arguments to update one LocalSaleItem.
     * @example
     * // Update one LocalSaleItem
     * const localSaleItem = await prisma.localSaleItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocalSaleItemUpdateArgs>(args: SelectSubset<T, LocalSaleItemUpdateArgs<ExtArgs>>): Prisma__LocalSaleItemClient<$Result.GetResult<Prisma.$LocalSaleItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LocalSaleItems.
     * @param {LocalSaleItemDeleteManyArgs} args - Arguments to filter LocalSaleItems to delete.
     * @example
     * // Delete a few LocalSaleItems
     * const { count } = await prisma.localSaleItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocalSaleItemDeleteManyArgs>(args?: SelectSubset<T, LocalSaleItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalSaleItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSaleItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LocalSaleItems
     * const localSaleItem = await prisma.localSaleItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocalSaleItemUpdateManyArgs>(args: SelectSubset<T, LocalSaleItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocalSaleItems and returns the data updated in the database.
     * @param {LocalSaleItemUpdateManyAndReturnArgs} args - Arguments to update many LocalSaleItems.
     * @example
     * // Update many LocalSaleItems
     * const localSaleItem = await prisma.localSaleItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LocalSaleItems and only return the `id`
     * const localSaleItemWithIdOnly = await prisma.localSaleItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocalSaleItemUpdateManyAndReturnArgs>(args: SelectSubset<T, LocalSaleItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocalSaleItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LocalSaleItem.
     * @param {LocalSaleItemUpsertArgs} args - Arguments to update or create a LocalSaleItem.
     * @example
     * // Update or create a LocalSaleItem
     * const localSaleItem = await prisma.localSaleItem.upsert({
     *   create: {
     *     // ... data to create a LocalSaleItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LocalSaleItem we want to update
     *   }
     * })
     */
    upsert<T extends LocalSaleItemUpsertArgs>(args: SelectSubset<T, LocalSaleItemUpsertArgs<ExtArgs>>): Prisma__LocalSaleItemClient<$Result.GetResult<Prisma.$LocalSaleItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LocalSaleItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSaleItemCountArgs} args - Arguments to filter LocalSaleItems to count.
     * @example
     * // Count the number of LocalSaleItems
     * const count = await prisma.localSaleItem.count({
     *   where: {
     *     // ... the filter for the LocalSaleItems we want to count
     *   }
     * })
    **/
    count<T extends LocalSaleItemCountArgs>(
      args?: Subset<T, LocalSaleItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocalSaleItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LocalSaleItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSaleItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocalSaleItemAggregateArgs>(args: Subset<T, LocalSaleItemAggregateArgs>): Prisma.PrismaPromise<GetLocalSaleItemAggregateType<T>>

    /**
     * Group by LocalSaleItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocalSaleItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocalSaleItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocalSaleItemGroupByArgs['orderBy'] }
        : { orderBy?: LocalSaleItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocalSaleItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocalSaleItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LocalSaleItem model
   */
  readonly fields: LocalSaleItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LocalSaleItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocalSaleItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sale<T extends LocalSaleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LocalSaleDefaultArgs<ExtArgs>>): Prisma__LocalSaleClient<$Result.GetResult<Prisma.$LocalSalePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LocalSaleItem model
   */
  interface LocalSaleItemFieldRefs {
    readonly id: FieldRef<"LocalSaleItem", 'String'>
    readonly saleId: FieldRef<"LocalSaleItem", 'String'>
    readonly productId: FieldRef<"LocalSaleItem", 'String'>
    readonly nameAr: FieldRef<"LocalSaleItem", 'String'>
    readonly quantity: FieldRef<"LocalSaleItem", 'Int'>
    readonly unitPrice: FieldRef<"LocalSaleItem", 'Float'>
    readonly lineDiscount: FieldRef<"LocalSaleItem", 'Float'>
    readonly lineTotal: FieldRef<"LocalSaleItem", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * LocalSaleItem findUnique
   */
  export type LocalSaleItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSaleItem
     */
    select?: LocalSaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSaleItem
     */
    omit?: LocalSaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleItemInclude<ExtArgs> | null
    /**
     * Filter, which LocalSaleItem to fetch.
     */
    where: LocalSaleItemWhereUniqueInput
  }

  /**
   * LocalSaleItem findUniqueOrThrow
   */
  export type LocalSaleItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSaleItem
     */
    select?: LocalSaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSaleItem
     */
    omit?: LocalSaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleItemInclude<ExtArgs> | null
    /**
     * Filter, which LocalSaleItem to fetch.
     */
    where: LocalSaleItemWhereUniqueInput
  }

  /**
   * LocalSaleItem findFirst
   */
  export type LocalSaleItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSaleItem
     */
    select?: LocalSaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSaleItem
     */
    omit?: LocalSaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleItemInclude<ExtArgs> | null
    /**
     * Filter, which LocalSaleItem to fetch.
     */
    where?: LocalSaleItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalSaleItems to fetch.
     */
    orderBy?: LocalSaleItemOrderByWithRelationInput | LocalSaleItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalSaleItems.
     */
    cursor?: LocalSaleItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalSaleItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalSaleItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalSaleItems.
     */
    distinct?: LocalSaleItemScalarFieldEnum | LocalSaleItemScalarFieldEnum[]
  }

  /**
   * LocalSaleItem findFirstOrThrow
   */
  export type LocalSaleItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSaleItem
     */
    select?: LocalSaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSaleItem
     */
    omit?: LocalSaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleItemInclude<ExtArgs> | null
    /**
     * Filter, which LocalSaleItem to fetch.
     */
    where?: LocalSaleItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalSaleItems to fetch.
     */
    orderBy?: LocalSaleItemOrderByWithRelationInput | LocalSaleItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocalSaleItems.
     */
    cursor?: LocalSaleItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalSaleItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalSaleItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocalSaleItems.
     */
    distinct?: LocalSaleItemScalarFieldEnum | LocalSaleItemScalarFieldEnum[]
  }

  /**
   * LocalSaleItem findMany
   */
  export type LocalSaleItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSaleItem
     */
    select?: LocalSaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSaleItem
     */
    omit?: LocalSaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleItemInclude<ExtArgs> | null
    /**
     * Filter, which LocalSaleItems to fetch.
     */
    where?: LocalSaleItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocalSaleItems to fetch.
     */
    orderBy?: LocalSaleItemOrderByWithRelationInput | LocalSaleItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LocalSaleItems.
     */
    cursor?: LocalSaleItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocalSaleItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocalSaleItems.
     */
    skip?: number
    distinct?: LocalSaleItemScalarFieldEnum | LocalSaleItemScalarFieldEnum[]
  }

  /**
   * LocalSaleItem create
   */
  export type LocalSaleItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSaleItem
     */
    select?: LocalSaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSaleItem
     */
    omit?: LocalSaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleItemInclude<ExtArgs> | null
    /**
     * The data needed to create a LocalSaleItem.
     */
    data: XOR<LocalSaleItemCreateInput, LocalSaleItemUncheckedCreateInput>
  }

  /**
   * LocalSaleItem createMany
   */
  export type LocalSaleItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LocalSaleItems.
     */
    data: LocalSaleItemCreateManyInput | LocalSaleItemCreateManyInput[]
  }

  /**
   * LocalSaleItem createManyAndReturn
   */
  export type LocalSaleItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSaleItem
     */
    select?: LocalSaleItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSaleItem
     */
    omit?: LocalSaleItemOmit<ExtArgs> | null
    /**
     * The data used to create many LocalSaleItems.
     */
    data: LocalSaleItemCreateManyInput | LocalSaleItemCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LocalSaleItem update
   */
  export type LocalSaleItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSaleItem
     */
    select?: LocalSaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSaleItem
     */
    omit?: LocalSaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleItemInclude<ExtArgs> | null
    /**
     * The data needed to update a LocalSaleItem.
     */
    data: XOR<LocalSaleItemUpdateInput, LocalSaleItemUncheckedUpdateInput>
    /**
     * Choose, which LocalSaleItem to update.
     */
    where: LocalSaleItemWhereUniqueInput
  }

  /**
   * LocalSaleItem updateMany
   */
  export type LocalSaleItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LocalSaleItems.
     */
    data: XOR<LocalSaleItemUpdateManyMutationInput, LocalSaleItemUncheckedUpdateManyInput>
    /**
     * Filter which LocalSaleItems to update
     */
    where?: LocalSaleItemWhereInput
    /**
     * Limit how many LocalSaleItems to update.
     */
    limit?: number
  }

  /**
   * LocalSaleItem updateManyAndReturn
   */
  export type LocalSaleItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSaleItem
     */
    select?: LocalSaleItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSaleItem
     */
    omit?: LocalSaleItemOmit<ExtArgs> | null
    /**
     * The data used to update LocalSaleItems.
     */
    data: XOR<LocalSaleItemUpdateManyMutationInput, LocalSaleItemUncheckedUpdateManyInput>
    /**
     * Filter which LocalSaleItems to update
     */
    where?: LocalSaleItemWhereInput
    /**
     * Limit how many LocalSaleItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LocalSaleItem upsert
   */
  export type LocalSaleItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSaleItem
     */
    select?: LocalSaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSaleItem
     */
    omit?: LocalSaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleItemInclude<ExtArgs> | null
    /**
     * The filter to search for the LocalSaleItem to update in case it exists.
     */
    where: LocalSaleItemWhereUniqueInput
    /**
     * In case the LocalSaleItem found by the `where` argument doesn't exist, create a new LocalSaleItem with this data.
     */
    create: XOR<LocalSaleItemCreateInput, LocalSaleItemUncheckedCreateInput>
    /**
     * In case the LocalSaleItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocalSaleItemUpdateInput, LocalSaleItemUncheckedUpdateInput>
  }

  /**
   * LocalSaleItem delete
   */
  export type LocalSaleItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSaleItem
     */
    select?: LocalSaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSaleItem
     */
    omit?: LocalSaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleItemInclude<ExtArgs> | null
    /**
     * Filter which LocalSaleItem to delete.
     */
    where: LocalSaleItemWhereUniqueInput
  }

  /**
   * LocalSaleItem deleteMany
   */
  export type LocalSaleItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocalSaleItems to delete
     */
    where?: LocalSaleItemWhereInput
    /**
     * Limit how many LocalSaleItems to delete.
     */
    limit?: number
  }

  /**
   * LocalSaleItem without action
   */
  export type LocalSaleItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocalSaleItem
     */
    select?: LocalSaleItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocalSaleItem
     */
    omit?: LocalSaleItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocalSaleItemInclude<ExtArgs> | null
  }


  /**
   * Model SyncQueueItem
   */

  export type AggregateSyncQueueItem = {
    _count: SyncQueueItemCountAggregateOutputType | null
    _avg: SyncQueueItemAvgAggregateOutputType | null
    _sum: SyncQueueItemSumAggregateOutputType | null
    _min: SyncQueueItemMinAggregateOutputType | null
    _max: SyncQueueItemMaxAggregateOutputType | null
  }

  export type SyncQueueItemAvgAggregateOutputType = {
    attempts: number | null
  }

  export type SyncQueueItemSumAggregateOutputType = {
    attempts: number | null
  }

  export type SyncQueueItemMinAggregateOutputType = {
    id: string | null
    clientEventId: string | null
    payload: string | null
    status: string | null
    attempts: number | null
    lastError: string | null
    createdAt: string | null
  }

  export type SyncQueueItemMaxAggregateOutputType = {
    id: string | null
    clientEventId: string | null
    payload: string | null
    status: string | null
    attempts: number | null
    lastError: string | null
    createdAt: string | null
  }

  export type SyncQueueItemCountAggregateOutputType = {
    id: number
    clientEventId: number
    payload: number
    status: number
    attempts: number
    lastError: number
    createdAt: number
    _all: number
  }


  export type SyncQueueItemAvgAggregateInputType = {
    attempts?: true
  }

  export type SyncQueueItemSumAggregateInputType = {
    attempts?: true
  }

  export type SyncQueueItemMinAggregateInputType = {
    id?: true
    clientEventId?: true
    payload?: true
    status?: true
    attempts?: true
    lastError?: true
    createdAt?: true
  }

  export type SyncQueueItemMaxAggregateInputType = {
    id?: true
    clientEventId?: true
    payload?: true
    status?: true
    attempts?: true
    lastError?: true
    createdAt?: true
  }

  export type SyncQueueItemCountAggregateInputType = {
    id?: true
    clientEventId?: true
    payload?: true
    status?: true
    attempts?: true
    lastError?: true
    createdAt?: true
    _all?: true
  }

  export type SyncQueueItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SyncQueueItem to aggregate.
     */
    where?: SyncQueueItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncQueueItems to fetch.
     */
    orderBy?: SyncQueueItemOrderByWithRelationInput | SyncQueueItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SyncQueueItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncQueueItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncQueueItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SyncQueueItems
    **/
    _count?: true | SyncQueueItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SyncQueueItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SyncQueueItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SyncQueueItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SyncQueueItemMaxAggregateInputType
  }

  export type GetSyncQueueItemAggregateType<T extends SyncQueueItemAggregateArgs> = {
        [P in keyof T & keyof AggregateSyncQueueItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSyncQueueItem[P]>
      : GetScalarType<T[P], AggregateSyncQueueItem[P]>
  }




  export type SyncQueueItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SyncQueueItemWhereInput
    orderBy?: SyncQueueItemOrderByWithAggregationInput | SyncQueueItemOrderByWithAggregationInput[]
    by: SyncQueueItemScalarFieldEnum[] | SyncQueueItemScalarFieldEnum
    having?: SyncQueueItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SyncQueueItemCountAggregateInputType | true
    _avg?: SyncQueueItemAvgAggregateInputType
    _sum?: SyncQueueItemSumAggregateInputType
    _min?: SyncQueueItemMinAggregateInputType
    _max?: SyncQueueItemMaxAggregateInputType
  }

  export type SyncQueueItemGroupByOutputType = {
    id: string
    clientEventId: string
    payload: string
    status: string
    attempts: number
    lastError: string | null
    createdAt: string
    _count: SyncQueueItemCountAggregateOutputType | null
    _avg: SyncQueueItemAvgAggregateOutputType | null
    _sum: SyncQueueItemSumAggregateOutputType | null
    _min: SyncQueueItemMinAggregateOutputType | null
    _max: SyncQueueItemMaxAggregateOutputType | null
  }

  type GetSyncQueueItemGroupByPayload<T extends SyncQueueItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SyncQueueItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SyncQueueItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SyncQueueItemGroupByOutputType[P]>
            : GetScalarType<T[P], SyncQueueItemGroupByOutputType[P]>
        }
      >
    >


  export type SyncQueueItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientEventId?: boolean
    payload?: boolean
    status?: boolean
    attempts?: boolean
    lastError?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["syncQueueItem"]>

  export type SyncQueueItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientEventId?: boolean
    payload?: boolean
    status?: boolean
    attempts?: boolean
    lastError?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["syncQueueItem"]>

  export type SyncQueueItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientEventId?: boolean
    payload?: boolean
    status?: boolean
    attempts?: boolean
    lastError?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["syncQueueItem"]>

  export type SyncQueueItemSelectScalar = {
    id?: boolean
    clientEventId?: boolean
    payload?: boolean
    status?: boolean
    attempts?: boolean
    lastError?: boolean
    createdAt?: boolean
  }

  export type SyncQueueItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "clientEventId" | "payload" | "status" | "attempts" | "lastError" | "createdAt", ExtArgs["result"]["syncQueueItem"]>

  export type $SyncQueueItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SyncQueueItem"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clientEventId: string
      payload: string
      status: string
      attempts: number
      lastError: string | null
      createdAt: string
    }, ExtArgs["result"]["syncQueueItem"]>
    composites: {}
  }

  type SyncQueueItemGetPayload<S extends boolean | null | undefined | SyncQueueItemDefaultArgs> = $Result.GetResult<Prisma.$SyncQueueItemPayload, S>

  type SyncQueueItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SyncQueueItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SyncQueueItemCountAggregateInputType | true
    }

  export interface SyncQueueItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SyncQueueItem'], meta: { name: 'SyncQueueItem' } }
    /**
     * Find zero or one SyncQueueItem that matches the filter.
     * @param {SyncQueueItemFindUniqueArgs} args - Arguments to find a SyncQueueItem
     * @example
     * // Get one SyncQueueItem
     * const syncQueueItem = await prisma.syncQueueItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SyncQueueItemFindUniqueArgs>(args: SelectSubset<T, SyncQueueItemFindUniqueArgs<ExtArgs>>): Prisma__SyncQueueItemClient<$Result.GetResult<Prisma.$SyncQueueItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SyncQueueItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SyncQueueItemFindUniqueOrThrowArgs} args - Arguments to find a SyncQueueItem
     * @example
     * // Get one SyncQueueItem
     * const syncQueueItem = await prisma.syncQueueItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SyncQueueItemFindUniqueOrThrowArgs>(args: SelectSubset<T, SyncQueueItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SyncQueueItemClient<$Result.GetResult<Prisma.$SyncQueueItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SyncQueueItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncQueueItemFindFirstArgs} args - Arguments to find a SyncQueueItem
     * @example
     * // Get one SyncQueueItem
     * const syncQueueItem = await prisma.syncQueueItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SyncQueueItemFindFirstArgs>(args?: SelectSubset<T, SyncQueueItemFindFirstArgs<ExtArgs>>): Prisma__SyncQueueItemClient<$Result.GetResult<Prisma.$SyncQueueItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SyncQueueItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncQueueItemFindFirstOrThrowArgs} args - Arguments to find a SyncQueueItem
     * @example
     * // Get one SyncQueueItem
     * const syncQueueItem = await prisma.syncQueueItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SyncQueueItemFindFirstOrThrowArgs>(args?: SelectSubset<T, SyncQueueItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__SyncQueueItemClient<$Result.GetResult<Prisma.$SyncQueueItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SyncQueueItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncQueueItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SyncQueueItems
     * const syncQueueItems = await prisma.syncQueueItem.findMany()
     * 
     * // Get first 10 SyncQueueItems
     * const syncQueueItems = await prisma.syncQueueItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const syncQueueItemWithIdOnly = await prisma.syncQueueItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SyncQueueItemFindManyArgs>(args?: SelectSubset<T, SyncQueueItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncQueueItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SyncQueueItem.
     * @param {SyncQueueItemCreateArgs} args - Arguments to create a SyncQueueItem.
     * @example
     * // Create one SyncQueueItem
     * const SyncQueueItem = await prisma.syncQueueItem.create({
     *   data: {
     *     // ... data to create a SyncQueueItem
     *   }
     * })
     * 
     */
    create<T extends SyncQueueItemCreateArgs>(args: SelectSubset<T, SyncQueueItemCreateArgs<ExtArgs>>): Prisma__SyncQueueItemClient<$Result.GetResult<Prisma.$SyncQueueItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SyncQueueItems.
     * @param {SyncQueueItemCreateManyArgs} args - Arguments to create many SyncQueueItems.
     * @example
     * // Create many SyncQueueItems
     * const syncQueueItem = await prisma.syncQueueItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SyncQueueItemCreateManyArgs>(args?: SelectSubset<T, SyncQueueItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SyncQueueItems and returns the data saved in the database.
     * @param {SyncQueueItemCreateManyAndReturnArgs} args - Arguments to create many SyncQueueItems.
     * @example
     * // Create many SyncQueueItems
     * const syncQueueItem = await prisma.syncQueueItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SyncQueueItems and only return the `id`
     * const syncQueueItemWithIdOnly = await prisma.syncQueueItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SyncQueueItemCreateManyAndReturnArgs>(args?: SelectSubset<T, SyncQueueItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncQueueItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SyncQueueItem.
     * @param {SyncQueueItemDeleteArgs} args - Arguments to delete one SyncQueueItem.
     * @example
     * // Delete one SyncQueueItem
     * const SyncQueueItem = await prisma.syncQueueItem.delete({
     *   where: {
     *     // ... filter to delete one SyncQueueItem
     *   }
     * })
     * 
     */
    delete<T extends SyncQueueItemDeleteArgs>(args: SelectSubset<T, SyncQueueItemDeleteArgs<ExtArgs>>): Prisma__SyncQueueItemClient<$Result.GetResult<Prisma.$SyncQueueItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SyncQueueItem.
     * @param {SyncQueueItemUpdateArgs} args - Arguments to update one SyncQueueItem.
     * @example
     * // Update one SyncQueueItem
     * const syncQueueItem = await prisma.syncQueueItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SyncQueueItemUpdateArgs>(args: SelectSubset<T, SyncQueueItemUpdateArgs<ExtArgs>>): Prisma__SyncQueueItemClient<$Result.GetResult<Prisma.$SyncQueueItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SyncQueueItems.
     * @param {SyncQueueItemDeleteManyArgs} args - Arguments to filter SyncQueueItems to delete.
     * @example
     * // Delete a few SyncQueueItems
     * const { count } = await prisma.syncQueueItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SyncQueueItemDeleteManyArgs>(args?: SelectSubset<T, SyncQueueItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SyncQueueItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncQueueItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SyncQueueItems
     * const syncQueueItem = await prisma.syncQueueItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SyncQueueItemUpdateManyArgs>(args: SelectSubset<T, SyncQueueItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SyncQueueItems and returns the data updated in the database.
     * @param {SyncQueueItemUpdateManyAndReturnArgs} args - Arguments to update many SyncQueueItems.
     * @example
     * // Update many SyncQueueItems
     * const syncQueueItem = await prisma.syncQueueItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SyncQueueItems and only return the `id`
     * const syncQueueItemWithIdOnly = await prisma.syncQueueItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SyncQueueItemUpdateManyAndReturnArgs>(args: SelectSubset<T, SyncQueueItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SyncQueueItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SyncQueueItem.
     * @param {SyncQueueItemUpsertArgs} args - Arguments to update or create a SyncQueueItem.
     * @example
     * // Update or create a SyncQueueItem
     * const syncQueueItem = await prisma.syncQueueItem.upsert({
     *   create: {
     *     // ... data to create a SyncQueueItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SyncQueueItem we want to update
     *   }
     * })
     */
    upsert<T extends SyncQueueItemUpsertArgs>(args: SelectSubset<T, SyncQueueItemUpsertArgs<ExtArgs>>): Prisma__SyncQueueItemClient<$Result.GetResult<Prisma.$SyncQueueItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SyncQueueItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncQueueItemCountArgs} args - Arguments to filter SyncQueueItems to count.
     * @example
     * // Count the number of SyncQueueItems
     * const count = await prisma.syncQueueItem.count({
     *   where: {
     *     // ... the filter for the SyncQueueItems we want to count
     *   }
     * })
    **/
    count<T extends SyncQueueItemCountArgs>(
      args?: Subset<T, SyncQueueItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SyncQueueItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SyncQueueItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncQueueItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SyncQueueItemAggregateArgs>(args: Subset<T, SyncQueueItemAggregateArgs>): Prisma.PrismaPromise<GetSyncQueueItemAggregateType<T>>

    /**
     * Group by SyncQueueItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SyncQueueItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SyncQueueItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SyncQueueItemGroupByArgs['orderBy'] }
        : { orderBy?: SyncQueueItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SyncQueueItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSyncQueueItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SyncQueueItem model
   */
  readonly fields: SyncQueueItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SyncQueueItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SyncQueueItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SyncQueueItem model
   */
  interface SyncQueueItemFieldRefs {
    readonly id: FieldRef<"SyncQueueItem", 'String'>
    readonly clientEventId: FieldRef<"SyncQueueItem", 'String'>
    readonly payload: FieldRef<"SyncQueueItem", 'String'>
    readonly status: FieldRef<"SyncQueueItem", 'String'>
    readonly attempts: FieldRef<"SyncQueueItem", 'Int'>
    readonly lastError: FieldRef<"SyncQueueItem", 'String'>
    readonly createdAt: FieldRef<"SyncQueueItem", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SyncQueueItem findUnique
   */
  export type SyncQueueItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueueItem
     */
    select?: SyncQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueueItem
     */
    omit?: SyncQueueItemOmit<ExtArgs> | null
    /**
     * Filter, which SyncQueueItem to fetch.
     */
    where: SyncQueueItemWhereUniqueInput
  }

  /**
   * SyncQueueItem findUniqueOrThrow
   */
  export type SyncQueueItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueueItem
     */
    select?: SyncQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueueItem
     */
    omit?: SyncQueueItemOmit<ExtArgs> | null
    /**
     * Filter, which SyncQueueItem to fetch.
     */
    where: SyncQueueItemWhereUniqueInput
  }

  /**
   * SyncQueueItem findFirst
   */
  export type SyncQueueItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueueItem
     */
    select?: SyncQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueueItem
     */
    omit?: SyncQueueItemOmit<ExtArgs> | null
    /**
     * Filter, which SyncQueueItem to fetch.
     */
    where?: SyncQueueItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncQueueItems to fetch.
     */
    orderBy?: SyncQueueItemOrderByWithRelationInput | SyncQueueItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SyncQueueItems.
     */
    cursor?: SyncQueueItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncQueueItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncQueueItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SyncQueueItems.
     */
    distinct?: SyncQueueItemScalarFieldEnum | SyncQueueItemScalarFieldEnum[]
  }

  /**
   * SyncQueueItem findFirstOrThrow
   */
  export type SyncQueueItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueueItem
     */
    select?: SyncQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueueItem
     */
    omit?: SyncQueueItemOmit<ExtArgs> | null
    /**
     * Filter, which SyncQueueItem to fetch.
     */
    where?: SyncQueueItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncQueueItems to fetch.
     */
    orderBy?: SyncQueueItemOrderByWithRelationInput | SyncQueueItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SyncQueueItems.
     */
    cursor?: SyncQueueItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncQueueItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncQueueItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SyncQueueItems.
     */
    distinct?: SyncQueueItemScalarFieldEnum | SyncQueueItemScalarFieldEnum[]
  }

  /**
   * SyncQueueItem findMany
   */
  export type SyncQueueItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueueItem
     */
    select?: SyncQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueueItem
     */
    omit?: SyncQueueItemOmit<ExtArgs> | null
    /**
     * Filter, which SyncQueueItems to fetch.
     */
    where?: SyncQueueItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SyncQueueItems to fetch.
     */
    orderBy?: SyncQueueItemOrderByWithRelationInput | SyncQueueItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SyncQueueItems.
     */
    cursor?: SyncQueueItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SyncQueueItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SyncQueueItems.
     */
    skip?: number
    distinct?: SyncQueueItemScalarFieldEnum | SyncQueueItemScalarFieldEnum[]
  }

  /**
   * SyncQueueItem create
   */
  export type SyncQueueItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueueItem
     */
    select?: SyncQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueueItem
     */
    omit?: SyncQueueItemOmit<ExtArgs> | null
    /**
     * The data needed to create a SyncQueueItem.
     */
    data: XOR<SyncQueueItemCreateInput, SyncQueueItemUncheckedCreateInput>
  }

  /**
   * SyncQueueItem createMany
   */
  export type SyncQueueItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SyncQueueItems.
     */
    data: SyncQueueItemCreateManyInput | SyncQueueItemCreateManyInput[]
  }

  /**
   * SyncQueueItem createManyAndReturn
   */
  export type SyncQueueItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueueItem
     */
    select?: SyncQueueItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueueItem
     */
    omit?: SyncQueueItemOmit<ExtArgs> | null
    /**
     * The data used to create many SyncQueueItems.
     */
    data: SyncQueueItemCreateManyInput | SyncQueueItemCreateManyInput[]
  }

  /**
   * SyncQueueItem update
   */
  export type SyncQueueItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueueItem
     */
    select?: SyncQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueueItem
     */
    omit?: SyncQueueItemOmit<ExtArgs> | null
    /**
     * The data needed to update a SyncQueueItem.
     */
    data: XOR<SyncQueueItemUpdateInput, SyncQueueItemUncheckedUpdateInput>
    /**
     * Choose, which SyncQueueItem to update.
     */
    where: SyncQueueItemWhereUniqueInput
  }

  /**
   * SyncQueueItem updateMany
   */
  export type SyncQueueItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SyncQueueItems.
     */
    data: XOR<SyncQueueItemUpdateManyMutationInput, SyncQueueItemUncheckedUpdateManyInput>
    /**
     * Filter which SyncQueueItems to update
     */
    where?: SyncQueueItemWhereInput
    /**
     * Limit how many SyncQueueItems to update.
     */
    limit?: number
  }

  /**
   * SyncQueueItem updateManyAndReturn
   */
  export type SyncQueueItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueueItem
     */
    select?: SyncQueueItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueueItem
     */
    omit?: SyncQueueItemOmit<ExtArgs> | null
    /**
     * The data used to update SyncQueueItems.
     */
    data: XOR<SyncQueueItemUpdateManyMutationInput, SyncQueueItemUncheckedUpdateManyInput>
    /**
     * Filter which SyncQueueItems to update
     */
    where?: SyncQueueItemWhereInput
    /**
     * Limit how many SyncQueueItems to update.
     */
    limit?: number
  }

  /**
   * SyncQueueItem upsert
   */
  export type SyncQueueItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueueItem
     */
    select?: SyncQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueueItem
     */
    omit?: SyncQueueItemOmit<ExtArgs> | null
    /**
     * The filter to search for the SyncQueueItem to update in case it exists.
     */
    where: SyncQueueItemWhereUniqueInput
    /**
     * In case the SyncQueueItem found by the `where` argument doesn't exist, create a new SyncQueueItem with this data.
     */
    create: XOR<SyncQueueItemCreateInput, SyncQueueItemUncheckedCreateInput>
    /**
     * In case the SyncQueueItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SyncQueueItemUpdateInput, SyncQueueItemUncheckedUpdateInput>
  }

  /**
   * SyncQueueItem delete
   */
  export type SyncQueueItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueueItem
     */
    select?: SyncQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueueItem
     */
    omit?: SyncQueueItemOmit<ExtArgs> | null
    /**
     * Filter which SyncQueueItem to delete.
     */
    where: SyncQueueItemWhereUniqueInput
  }

  /**
   * SyncQueueItem deleteMany
   */
  export type SyncQueueItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SyncQueueItems to delete
     */
    where?: SyncQueueItemWhereInput
    /**
     * Limit how many SyncQueueItems to delete.
     */
    limit?: number
  }

  /**
   * SyncQueueItem without action
   */
  export type SyncQueueItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SyncQueueItem
     */
    select?: SyncQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SyncQueueItem
     */
    omit?: SyncQueueItemOmit<ExtArgs> | null
  }


  /**
   * Model Meta
   */

  export type AggregateMeta = {
    _count: MetaCountAggregateOutputType | null
    _min: MetaMinAggregateOutputType | null
    _max: MetaMaxAggregateOutputType | null
  }

  export type MetaMinAggregateOutputType = {
    key: string | null
    value: string | null
  }

  export type MetaMaxAggregateOutputType = {
    key: string | null
    value: string | null
  }

  export type MetaCountAggregateOutputType = {
    key: number
    value: number
    _all: number
  }


  export type MetaMinAggregateInputType = {
    key?: true
    value?: true
  }

  export type MetaMaxAggregateInputType = {
    key?: true
    value?: true
  }

  export type MetaCountAggregateInputType = {
    key?: true
    value?: true
    _all?: true
  }

  export type MetaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Meta to aggregate.
     */
    where?: MetaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Metas to fetch.
     */
    orderBy?: MetaOrderByWithRelationInput | MetaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MetaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Metas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Metas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Metas
    **/
    _count?: true | MetaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MetaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MetaMaxAggregateInputType
  }

  export type GetMetaAggregateType<T extends MetaAggregateArgs> = {
        [P in keyof T & keyof AggregateMeta]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMeta[P]>
      : GetScalarType<T[P], AggregateMeta[P]>
  }




  export type MetaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MetaWhereInput
    orderBy?: MetaOrderByWithAggregationInput | MetaOrderByWithAggregationInput[]
    by: MetaScalarFieldEnum[] | MetaScalarFieldEnum
    having?: MetaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MetaCountAggregateInputType | true
    _min?: MetaMinAggregateInputType
    _max?: MetaMaxAggregateInputType
  }

  export type MetaGroupByOutputType = {
    key: string
    value: string
    _count: MetaCountAggregateOutputType | null
    _min: MetaMinAggregateOutputType | null
    _max: MetaMaxAggregateOutputType | null
  }

  type GetMetaGroupByPayload<T extends MetaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MetaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MetaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MetaGroupByOutputType[P]>
            : GetScalarType<T[P], MetaGroupByOutputType[P]>
        }
      >
    >


  export type MetaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    value?: boolean
  }, ExtArgs["result"]["meta"]>

  export type MetaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    value?: boolean
  }, ExtArgs["result"]["meta"]>

  export type MetaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    value?: boolean
  }, ExtArgs["result"]["meta"]>

  export type MetaSelectScalar = {
    key?: boolean
    value?: boolean
  }

  export type MetaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"key" | "value", ExtArgs["result"]["meta"]>

  export type $MetaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Meta"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      key: string
      value: string
    }, ExtArgs["result"]["meta"]>
    composites: {}
  }

  type MetaGetPayload<S extends boolean | null | undefined | MetaDefaultArgs> = $Result.GetResult<Prisma.$MetaPayload, S>

  type MetaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MetaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MetaCountAggregateInputType | true
    }

  export interface MetaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Meta'], meta: { name: 'Meta' } }
    /**
     * Find zero or one Meta that matches the filter.
     * @param {MetaFindUniqueArgs} args - Arguments to find a Meta
     * @example
     * // Get one Meta
     * const meta = await prisma.meta.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MetaFindUniqueArgs>(args: SelectSubset<T, MetaFindUniqueArgs<ExtArgs>>): Prisma__MetaClient<$Result.GetResult<Prisma.$MetaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Meta that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MetaFindUniqueOrThrowArgs} args - Arguments to find a Meta
     * @example
     * // Get one Meta
     * const meta = await prisma.meta.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MetaFindUniqueOrThrowArgs>(args: SelectSubset<T, MetaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MetaClient<$Result.GetResult<Prisma.$MetaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Meta that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetaFindFirstArgs} args - Arguments to find a Meta
     * @example
     * // Get one Meta
     * const meta = await prisma.meta.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MetaFindFirstArgs>(args?: SelectSubset<T, MetaFindFirstArgs<ExtArgs>>): Prisma__MetaClient<$Result.GetResult<Prisma.$MetaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Meta that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetaFindFirstOrThrowArgs} args - Arguments to find a Meta
     * @example
     * // Get one Meta
     * const meta = await prisma.meta.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MetaFindFirstOrThrowArgs>(args?: SelectSubset<T, MetaFindFirstOrThrowArgs<ExtArgs>>): Prisma__MetaClient<$Result.GetResult<Prisma.$MetaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Metas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Metas
     * const metas = await prisma.meta.findMany()
     * 
     * // Get first 10 Metas
     * const metas = await prisma.meta.findMany({ take: 10 })
     * 
     * // Only select the `key`
     * const metaWithKeyOnly = await prisma.meta.findMany({ select: { key: true } })
     * 
     */
    findMany<T extends MetaFindManyArgs>(args?: SelectSubset<T, MetaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Meta.
     * @param {MetaCreateArgs} args - Arguments to create a Meta.
     * @example
     * // Create one Meta
     * const Meta = await prisma.meta.create({
     *   data: {
     *     // ... data to create a Meta
     *   }
     * })
     * 
     */
    create<T extends MetaCreateArgs>(args: SelectSubset<T, MetaCreateArgs<ExtArgs>>): Prisma__MetaClient<$Result.GetResult<Prisma.$MetaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Metas.
     * @param {MetaCreateManyArgs} args - Arguments to create many Metas.
     * @example
     * // Create many Metas
     * const meta = await prisma.meta.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MetaCreateManyArgs>(args?: SelectSubset<T, MetaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Metas and returns the data saved in the database.
     * @param {MetaCreateManyAndReturnArgs} args - Arguments to create many Metas.
     * @example
     * // Create many Metas
     * const meta = await prisma.meta.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Metas and only return the `key`
     * const metaWithKeyOnly = await prisma.meta.createManyAndReturn({
     *   select: { key: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MetaCreateManyAndReturnArgs>(args?: SelectSubset<T, MetaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Meta.
     * @param {MetaDeleteArgs} args - Arguments to delete one Meta.
     * @example
     * // Delete one Meta
     * const Meta = await prisma.meta.delete({
     *   where: {
     *     // ... filter to delete one Meta
     *   }
     * })
     * 
     */
    delete<T extends MetaDeleteArgs>(args: SelectSubset<T, MetaDeleteArgs<ExtArgs>>): Prisma__MetaClient<$Result.GetResult<Prisma.$MetaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Meta.
     * @param {MetaUpdateArgs} args - Arguments to update one Meta.
     * @example
     * // Update one Meta
     * const meta = await prisma.meta.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MetaUpdateArgs>(args: SelectSubset<T, MetaUpdateArgs<ExtArgs>>): Prisma__MetaClient<$Result.GetResult<Prisma.$MetaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Metas.
     * @param {MetaDeleteManyArgs} args - Arguments to filter Metas to delete.
     * @example
     * // Delete a few Metas
     * const { count } = await prisma.meta.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MetaDeleteManyArgs>(args?: SelectSubset<T, MetaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Metas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Metas
     * const meta = await prisma.meta.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MetaUpdateManyArgs>(args: SelectSubset<T, MetaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Metas and returns the data updated in the database.
     * @param {MetaUpdateManyAndReturnArgs} args - Arguments to update many Metas.
     * @example
     * // Update many Metas
     * const meta = await prisma.meta.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Metas and only return the `key`
     * const metaWithKeyOnly = await prisma.meta.updateManyAndReturn({
     *   select: { key: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MetaUpdateManyAndReturnArgs>(args: SelectSubset<T, MetaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Meta.
     * @param {MetaUpsertArgs} args - Arguments to update or create a Meta.
     * @example
     * // Update or create a Meta
     * const meta = await prisma.meta.upsert({
     *   create: {
     *     // ... data to create a Meta
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Meta we want to update
     *   }
     * })
     */
    upsert<T extends MetaUpsertArgs>(args: SelectSubset<T, MetaUpsertArgs<ExtArgs>>): Prisma__MetaClient<$Result.GetResult<Prisma.$MetaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Metas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetaCountArgs} args - Arguments to filter Metas to count.
     * @example
     * // Count the number of Metas
     * const count = await prisma.meta.count({
     *   where: {
     *     // ... the filter for the Metas we want to count
     *   }
     * })
    **/
    count<T extends MetaCountArgs>(
      args?: Subset<T, MetaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MetaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Meta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MetaAggregateArgs>(args: Subset<T, MetaAggregateArgs>): Prisma.PrismaPromise<GetMetaAggregateType<T>>

    /**
     * Group by Meta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MetaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MetaGroupByArgs['orderBy'] }
        : { orderBy?: MetaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MetaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMetaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Meta model
   */
  readonly fields: MetaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Meta.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MetaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Meta model
   */
  interface MetaFieldRefs {
    readonly key: FieldRef<"Meta", 'String'>
    readonly value: FieldRef<"Meta", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Meta findUnique
   */
  export type MetaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meta
     */
    select?: MetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meta
     */
    omit?: MetaOmit<ExtArgs> | null
    /**
     * Filter, which Meta to fetch.
     */
    where: MetaWhereUniqueInput
  }

  /**
   * Meta findUniqueOrThrow
   */
  export type MetaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meta
     */
    select?: MetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meta
     */
    omit?: MetaOmit<ExtArgs> | null
    /**
     * Filter, which Meta to fetch.
     */
    where: MetaWhereUniqueInput
  }

  /**
   * Meta findFirst
   */
  export type MetaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meta
     */
    select?: MetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meta
     */
    omit?: MetaOmit<ExtArgs> | null
    /**
     * Filter, which Meta to fetch.
     */
    where?: MetaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Metas to fetch.
     */
    orderBy?: MetaOrderByWithRelationInput | MetaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Metas.
     */
    cursor?: MetaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Metas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Metas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Metas.
     */
    distinct?: MetaScalarFieldEnum | MetaScalarFieldEnum[]
  }

  /**
   * Meta findFirstOrThrow
   */
  export type MetaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meta
     */
    select?: MetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meta
     */
    omit?: MetaOmit<ExtArgs> | null
    /**
     * Filter, which Meta to fetch.
     */
    where?: MetaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Metas to fetch.
     */
    orderBy?: MetaOrderByWithRelationInput | MetaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Metas.
     */
    cursor?: MetaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Metas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Metas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Metas.
     */
    distinct?: MetaScalarFieldEnum | MetaScalarFieldEnum[]
  }

  /**
   * Meta findMany
   */
  export type MetaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meta
     */
    select?: MetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meta
     */
    omit?: MetaOmit<ExtArgs> | null
    /**
     * Filter, which Metas to fetch.
     */
    where?: MetaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Metas to fetch.
     */
    orderBy?: MetaOrderByWithRelationInput | MetaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Metas.
     */
    cursor?: MetaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Metas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Metas.
     */
    skip?: number
    distinct?: MetaScalarFieldEnum | MetaScalarFieldEnum[]
  }

  /**
   * Meta create
   */
  export type MetaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meta
     */
    select?: MetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meta
     */
    omit?: MetaOmit<ExtArgs> | null
    /**
     * The data needed to create a Meta.
     */
    data: XOR<MetaCreateInput, MetaUncheckedCreateInput>
  }

  /**
   * Meta createMany
   */
  export type MetaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Metas.
     */
    data: MetaCreateManyInput | MetaCreateManyInput[]
  }

  /**
   * Meta createManyAndReturn
   */
  export type MetaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meta
     */
    select?: MetaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Meta
     */
    omit?: MetaOmit<ExtArgs> | null
    /**
     * The data used to create many Metas.
     */
    data: MetaCreateManyInput | MetaCreateManyInput[]
  }

  /**
   * Meta update
   */
  export type MetaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meta
     */
    select?: MetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meta
     */
    omit?: MetaOmit<ExtArgs> | null
    /**
     * The data needed to update a Meta.
     */
    data: XOR<MetaUpdateInput, MetaUncheckedUpdateInput>
    /**
     * Choose, which Meta to update.
     */
    where: MetaWhereUniqueInput
  }

  /**
   * Meta updateMany
   */
  export type MetaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Metas.
     */
    data: XOR<MetaUpdateManyMutationInput, MetaUncheckedUpdateManyInput>
    /**
     * Filter which Metas to update
     */
    where?: MetaWhereInput
    /**
     * Limit how many Metas to update.
     */
    limit?: number
  }

  /**
   * Meta updateManyAndReturn
   */
  export type MetaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meta
     */
    select?: MetaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Meta
     */
    omit?: MetaOmit<ExtArgs> | null
    /**
     * The data used to update Metas.
     */
    data: XOR<MetaUpdateManyMutationInput, MetaUncheckedUpdateManyInput>
    /**
     * Filter which Metas to update
     */
    where?: MetaWhereInput
    /**
     * Limit how many Metas to update.
     */
    limit?: number
  }

  /**
   * Meta upsert
   */
  export type MetaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meta
     */
    select?: MetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meta
     */
    omit?: MetaOmit<ExtArgs> | null
    /**
     * The filter to search for the Meta to update in case it exists.
     */
    where: MetaWhereUniqueInput
    /**
     * In case the Meta found by the `where` argument doesn't exist, create a new Meta with this data.
     */
    create: XOR<MetaCreateInput, MetaUncheckedCreateInput>
    /**
     * In case the Meta was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MetaUpdateInput, MetaUncheckedUpdateInput>
  }

  /**
   * Meta delete
   */
  export type MetaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meta
     */
    select?: MetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meta
     */
    omit?: MetaOmit<ExtArgs> | null
    /**
     * Filter which Meta to delete.
     */
    where: MetaWhereUniqueInput
  }

  /**
   * Meta deleteMany
   */
  export type MetaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Metas to delete
     */
    where?: MetaWhereInput
    /**
     * Limit how many Metas to delete.
     */
    limit?: number
  }

  /**
   * Meta without action
   */
  export type MetaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meta
     */
    select?: MetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meta
     */
    omit?: MetaOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const LocalProductScalarFieldEnum: {
    id: 'id',
    nameAr: 'nameAr',
    sku: 'sku',
    salePrice: 'salePrice',
    quantity: 'quantity',
    minQuantity: 'minQuantity',
    isOnline: 'isOnline',
    updatedAt: 'updatedAt'
  };

  export type LocalProductScalarFieldEnum = (typeof LocalProductScalarFieldEnum)[keyof typeof LocalProductScalarFieldEnum]


  export const LocalUserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    passwordHash: 'passwordHash',
    role: 'role',
    updatedAt: 'updatedAt'
  };

  export type LocalUserScalarFieldEnum = (typeof LocalUserScalarFieldEnum)[keyof typeof LocalUserScalarFieldEnum]


  export const LocalCustomerScalarFieldEnum: {
    id: 'id',
    name: 'name',
    phone: 'phone',
    address: 'address',
    balance: 'balance',
    updatedAt: 'updatedAt'
  };

  export type LocalCustomerScalarFieldEnum = (typeof LocalCustomerScalarFieldEnum)[keyof typeof LocalCustomerScalarFieldEnum]


  export const LocalSaleScalarFieldEnum: {
    id: 'id',
    clientEventId: 'clientEventId',
    invoiceNo: 'invoiceNo',
    userId: 'userId',
    customerName: 'customerName',
    customerPhone: 'customerPhone',
    subtotal: 'subtotal',
    discount: 'discount',
    total: 'total',
    paid: 'paid',
    remaining: 'remaining',
    paymentType: 'paymentType',
    priceEdited: 'priceEdited',
    synced: 'synced',
    createdAt: 'createdAt'
  };

  export type LocalSaleScalarFieldEnum = (typeof LocalSaleScalarFieldEnum)[keyof typeof LocalSaleScalarFieldEnum]


  export const LocalSaleItemScalarFieldEnum: {
    id: 'id',
    saleId: 'saleId',
    productId: 'productId',
    nameAr: 'nameAr',
    quantity: 'quantity',
    unitPrice: 'unitPrice',
    lineDiscount: 'lineDiscount',
    lineTotal: 'lineTotal'
  };

  export type LocalSaleItemScalarFieldEnum = (typeof LocalSaleItemScalarFieldEnum)[keyof typeof LocalSaleItemScalarFieldEnum]


  export const SyncQueueItemScalarFieldEnum: {
    id: 'id',
    clientEventId: 'clientEventId',
    payload: 'payload',
    status: 'status',
    attempts: 'attempts',
    lastError: 'lastError',
    createdAt: 'createdAt'
  };

  export type SyncQueueItemScalarFieldEnum = (typeof SyncQueueItemScalarFieldEnum)[keyof typeof SyncQueueItemScalarFieldEnum]


  export const MetaScalarFieldEnum: {
    key: 'key',
    value: 'value'
  };

  export type MetaScalarFieldEnum = (typeof MetaScalarFieldEnum)[keyof typeof MetaScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type LocalProductWhereInput = {
    AND?: LocalProductWhereInput | LocalProductWhereInput[]
    OR?: LocalProductWhereInput[]
    NOT?: LocalProductWhereInput | LocalProductWhereInput[]
    id?: StringFilter<"LocalProduct"> | string
    nameAr?: StringFilter<"LocalProduct"> | string
    sku?: StringFilter<"LocalProduct"> | string
    salePrice?: FloatFilter<"LocalProduct"> | number
    quantity?: IntFilter<"LocalProduct"> | number
    minQuantity?: IntFilter<"LocalProduct"> | number
    isOnline?: BoolFilter<"LocalProduct"> | boolean
    updatedAt?: StringFilter<"LocalProduct"> | string
  }

  export type LocalProductOrderByWithRelationInput = {
    id?: SortOrder
    nameAr?: SortOrder
    sku?: SortOrder
    salePrice?: SortOrder
    quantity?: SortOrder
    minQuantity?: SortOrder
    isOnline?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalProductWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sku?: string
    AND?: LocalProductWhereInput | LocalProductWhereInput[]
    OR?: LocalProductWhereInput[]
    NOT?: LocalProductWhereInput | LocalProductWhereInput[]
    nameAr?: StringFilter<"LocalProduct"> | string
    salePrice?: FloatFilter<"LocalProduct"> | number
    quantity?: IntFilter<"LocalProduct"> | number
    minQuantity?: IntFilter<"LocalProduct"> | number
    isOnline?: BoolFilter<"LocalProduct"> | boolean
    updatedAt?: StringFilter<"LocalProduct"> | string
  }, "id" | "sku">

  export type LocalProductOrderByWithAggregationInput = {
    id?: SortOrder
    nameAr?: SortOrder
    sku?: SortOrder
    salePrice?: SortOrder
    quantity?: SortOrder
    minQuantity?: SortOrder
    isOnline?: SortOrder
    updatedAt?: SortOrder
    _count?: LocalProductCountOrderByAggregateInput
    _avg?: LocalProductAvgOrderByAggregateInput
    _max?: LocalProductMaxOrderByAggregateInput
    _min?: LocalProductMinOrderByAggregateInput
    _sum?: LocalProductSumOrderByAggregateInput
  }

  export type LocalProductScalarWhereWithAggregatesInput = {
    AND?: LocalProductScalarWhereWithAggregatesInput | LocalProductScalarWhereWithAggregatesInput[]
    OR?: LocalProductScalarWhereWithAggregatesInput[]
    NOT?: LocalProductScalarWhereWithAggregatesInput | LocalProductScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LocalProduct"> | string
    nameAr?: StringWithAggregatesFilter<"LocalProduct"> | string
    sku?: StringWithAggregatesFilter<"LocalProduct"> | string
    salePrice?: FloatWithAggregatesFilter<"LocalProduct"> | number
    quantity?: IntWithAggregatesFilter<"LocalProduct"> | number
    minQuantity?: IntWithAggregatesFilter<"LocalProduct"> | number
    isOnline?: BoolWithAggregatesFilter<"LocalProduct"> | boolean
    updatedAt?: StringWithAggregatesFilter<"LocalProduct"> | string
  }

  export type LocalUserWhereInput = {
    AND?: LocalUserWhereInput | LocalUserWhereInput[]
    OR?: LocalUserWhereInput[]
    NOT?: LocalUserWhereInput | LocalUserWhereInput[]
    id?: StringFilter<"LocalUser"> | string
    name?: StringFilter<"LocalUser"> | string
    email?: StringFilter<"LocalUser"> | string
    passwordHash?: StringFilter<"LocalUser"> | string
    role?: StringFilter<"LocalUser"> | string
    updatedAt?: StringFilter<"LocalUser"> | string
  }

  export type LocalUserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalUserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: LocalUserWhereInput | LocalUserWhereInput[]
    OR?: LocalUserWhereInput[]
    NOT?: LocalUserWhereInput | LocalUserWhereInput[]
    name?: StringFilter<"LocalUser"> | string
    passwordHash?: StringFilter<"LocalUser"> | string
    role?: StringFilter<"LocalUser"> | string
    updatedAt?: StringFilter<"LocalUser"> | string
  }, "id" | "email">

  export type LocalUserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    updatedAt?: SortOrder
    _count?: LocalUserCountOrderByAggregateInput
    _max?: LocalUserMaxOrderByAggregateInput
    _min?: LocalUserMinOrderByAggregateInput
  }

  export type LocalUserScalarWhereWithAggregatesInput = {
    AND?: LocalUserScalarWhereWithAggregatesInput | LocalUserScalarWhereWithAggregatesInput[]
    OR?: LocalUserScalarWhereWithAggregatesInput[]
    NOT?: LocalUserScalarWhereWithAggregatesInput | LocalUserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LocalUser"> | string
    name?: StringWithAggregatesFilter<"LocalUser"> | string
    email?: StringWithAggregatesFilter<"LocalUser"> | string
    passwordHash?: StringWithAggregatesFilter<"LocalUser"> | string
    role?: StringWithAggregatesFilter<"LocalUser"> | string
    updatedAt?: StringWithAggregatesFilter<"LocalUser"> | string
  }

  export type LocalCustomerWhereInput = {
    AND?: LocalCustomerWhereInput | LocalCustomerWhereInput[]
    OR?: LocalCustomerWhereInput[]
    NOT?: LocalCustomerWhereInput | LocalCustomerWhereInput[]
    id?: StringFilter<"LocalCustomer"> | string
    name?: StringFilter<"LocalCustomer"> | string
    phone?: StringNullableFilter<"LocalCustomer"> | string | null
    address?: StringNullableFilter<"LocalCustomer"> | string | null
    balance?: FloatFilter<"LocalCustomer"> | number
    updatedAt?: StringFilter<"LocalCustomer"> | string
  }

  export type LocalCustomerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    balance?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalCustomerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LocalCustomerWhereInput | LocalCustomerWhereInput[]
    OR?: LocalCustomerWhereInput[]
    NOT?: LocalCustomerWhereInput | LocalCustomerWhereInput[]
    name?: StringFilter<"LocalCustomer"> | string
    phone?: StringNullableFilter<"LocalCustomer"> | string | null
    address?: StringNullableFilter<"LocalCustomer"> | string | null
    balance?: FloatFilter<"LocalCustomer"> | number
    updatedAt?: StringFilter<"LocalCustomer"> | string
  }, "id">

  export type LocalCustomerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    balance?: SortOrder
    updatedAt?: SortOrder
    _count?: LocalCustomerCountOrderByAggregateInput
    _avg?: LocalCustomerAvgOrderByAggregateInput
    _max?: LocalCustomerMaxOrderByAggregateInput
    _min?: LocalCustomerMinOrderByAggregateInput
    _sum?: LocalCustomerSumOrderByAggregateInput
  }

  export type LocalCustomerScalarWhereWithAggregatesInput = {
    AND?: LocalCustomerScalarWhereWithAggregatesInput | LocalCustomerScalarWhereWithAggregatesInput[]
    OR?: LocalCustomerScalarWhereWithAggregatesInput[]
    NOT?: LocalCustomerScalarWhereWithAggregatesInput | LocalCustomerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LocalCustomer"> | string
    name?: StringWithAggregatesFilter<"LocalCustomer"> | string
    phone?: StringNullableWithAggregatesFilter<"LocalCustomer"> | string | null
    address?: StringNullableWithAggregatesFilter<"LocalCustomer"> | string | null
    balance?: FloatWithAggregatesFilter<"LocalCustomer"> | number
    updatedAt?: StringWithAggregatesFilter<"LocalCustomer"> | string
  }

  export type LocalSaleWhereInput = {
    AND?: LocalSaleWhereInput | LocalSaleWhereInput[]
    OR?: LocalSaleWhereInput[]
    NOT?: LocalSaleWhereInput | LocalSaleWhereInput[]
    id?: StringFilter<"LocalSale"> | string
    clientEventId?: StringFilter<"LocalSale"> | string
    invoiceNo?: StringFilter<"LocalSale"> | string
    userId?: StringNullableFilter<"LocalSale"> | string | null
    customerName?: StringNullableFilter<"LocalSale"> | string | null
    customerPhone?: StringNullableFilter<"LocalSale"> | string | null
    subtotal?: FloatFilter<"LocalSale"> | number
    discount?: FloatFilter<"LocalSale"> | number
    total?: FloatFilter<"LocalSale"> | number
    paid?: FloatFilter<"LocalSale"> | number
    remaining?: FloatFilter<"LocalSale"> | number
    paymentType?: StringFilter<"LocalSale"> | string
    priceEdited?: BoolFilter<"LocalSale"> | boolean
    synced?: BoolFilter<"LocalSale"> | boolean
    createdAt?: StringFilter<"LocalSale"> | string
    items?: LocalSaleItemListRelationFilter
  }

  export type LocalSaleOrderByWithRelationInput = {
    id?: SortOrder
    clientEventId?: SortOrder
    invoiceNo?: SortOrder
    userId?: SortOrderInput | SortOrder
    customerName?: SortOrderInput | SortOrder
    customerPhone?: SortOrderInput | SortOrder
    subtotal?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    paid?: SortOrder
    remaining?: SortOrder
    paymentType?: SortOrder
    priceEdited?: SortOrder
    synced?: SortOrder
    createdAt?: SortOrder
    items?: LocalSaleItemOrderByRelationAggregateInput
  }

  export type LocalSaleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    clientEventId?: string
    AND?: LocalSaleWhereInput | LocalSaleWhereInput[]
    OR?: LocalSaleWhereInput[]
    NOT?: LocalSaleWhereInput | LocalSaleWhereInput[]
    invoiceNo?: StringFilter<"LocalSale"> | string
    userId?: StringNullableFilter<"LocalSale"> | string | null
    customerName?: StringNullableFilter<"LocalSale"> | string | null
    customerPhone?: StringNullableFilter<"LocalSale"> | string | null
    subtotal?: FloatFilter<"LocalSale"> | number
    discount?: FloatFilter<"LocalSale"> | number
    total?: FloatFilter<"LocalSale"> | number
    paid?: FloatFilter<"LocalSale"> | number
    remaining?: FloatFilter<"LocalSale"> | number
    paymentType?: StringFilter<"LocalSale"> | string
    priceEdited?: BoolFilter<"LocalSale"> | boolean
    synced?: BoolFilter<"LocalSale"> | boolean
    createdAt?: StringFilter<"LocalSale"> | string
    items?: LocalSaleItemListRelationFilter
  }, "id" | "clientEventId">

  export type LocalSaleOrderByWithAggregationInput = {
    id?: SortOrder
    clientEventId?: SortOrder
    invoiceNo?: SortOrder
    userId?: SortOrderInput | SortOrder
    customerName?: SortOrderInput | SortOrder
    customerPhone?: SortOrderInput | SortOrder
    subtotal?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    paid?: SortOrder
    remaining?: SortOrder
    paymentType?: SortOrder
    priceEdited?: SortOrder
    synced?: SortOrder
    createdAt?: SortOrder
    _count?: LocalSaleCountOrderByAggregateInput
    _avg?: LocalSaleAvgOrderByAggregateInput
    _max?: LocalSaleMaxOrderByAggregateInput
    _min?: LocalSaleMinOrderByAggregateInput
    _sum?: LocalSaleSumOrderByAggregateInput
  }

  export type LocalSaleScalarWhereWithAggregatesInput = {
    AND?: LocalSaleScalarWhereWithAggregatesInput | LocalSaleScalarWhereWithAggregatesInput[]
    OR?: LocalSaleScalarWhereWithAggregatesInput[]
    NOT?: LocalSaleScalarWhereWithAggregatesInput | LocalSaleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LocalSale"> | string
    clientEventId?: StringWithAggregatesFilter<"LocalSale"> | string
    invoiceNo?: StringWithAggregatesFilter<"LocalSale"> | string
    userId?: StringNullableWithAggregatesFilter<"LocalSale"> | string | null
    customerName?: StringNullableWithAggregatesFilter<"LocalSale"> | string | null
    customerPhone?: StringNullableWithAggregatesFilter<"LocalSale"> | string | null
    subtotal?: FloatWithAggregatesFilter<"LocalSale"> | number
    discount?: FloatWithAggregatesFilter<"LocalSale"> | number
    total?: FloatWithAggregatesFilter<"LocalSale"> | number
    paid?: FloatWithAggregatesFilter<"LocalSale"> | number
    remaining?: FloatWithAggregatesFilter<"LocalSale"> | number
    paymentType?: StringWithAggregatesFilter<"LocalSale"> | string
    priceEdited?: BoolWithAggregatesFilter<"LocalSale"> | boolean
    synced?: BoolWithAggregatesFilter<"LocalSale"> | boolean
    createdAt?: StringWithAggregatesFilter<"LocalSale"> | string
  }

  export type LocalSaleItemWhereInput = {
    AND?: LocalSaleItemWhereInput | LocalSaleItemWhereInput[]
    OR?: LocalSaleItemWhereInput[]
    NOT?: LocalSaleItemWhereInput | LocalSaleItemWhereInput[]
    id?: StringFilter<"LocalSaleItem"> | string
    saleId?: StringFilter<"LocalSaleItem"> | string
    productId?: StringFilter<"LocalSaleItem"> | string
    nameAr?: StringFilter<"LocalSaleItem"> | string
    quantity?: IntFilter<"LocalSaleItem"> | number
    unitPrice?: FloatFilter<"LocalSaleItem"> | number
    lineDiscount?: FloatFilter<"LocalSaleItem"> | number
    lineTotal?: FloatFilter<"LocalSaleItem"> | number
    sale?: XOR<LocalSaleScalarRelationFilter, LocalSaleWhereInput>
  }

  export type LocalSaleItemOrderByWithRelationInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    nameAr?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    lineDiscount?: SortOrder
    lineTotal?: SortOrder
    sale?: LocalSaleOrderByWithRelationInput
  }

  export type LocalSaleItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LocalSaleItemWhereInput | LocalSaleItemWhereInput[]
    OR?: LocalSaleItemWhereInput[]
    NOT?: LocalSaleItemWhereInput | LocalSaleItemWhereInput[]
    saleId?: StringFilter<"LocalSaleItem"> | string
    productId?: StringFilter<"LocalSaleItem"> | string
    nameAr?: StringFilter<"LocalSaleItem"> | string
    quantity?: IntFilter<"LocalSaleItem"> | number
    unitPrice?: FloatFilter<"LocalSaleItem"> | number
    lineDiscount?: FloatFilter<"LocalSaleItem"> | number
    lineTotal?: FloatFilter<"LocalSaleItem"> | number
    sale?: XOR<LocalSaleScalarRelationFilter, LocalSaleWhereInput>
  }, "id">

  export type LocalSaleItemOrderByWithAggregationInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    nameAr?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    lineDiscount?: SortOrder
    lineTotal?: SortOrder
    _count?: LocalSaleItemCountOrderByAggregateInput
    _avg?: LocalSaleItemAvgOrderByAggregateInput
    _max?: LocalSaleItemMaxOrderByAggregateInput
    _min?: LocalSaleItemMinOrderByAggregateInput
    _sum?: LocalSaleItemSumOrderByAggregateInput
  }

  export type LocalSaleItemScalarWhereWithAggregatesInput = {
    AND?: LocalSaleItemScalarWhereWithAggregatesInput | LocalSaleItemScalarWhereWithAggregatesInput[]
    OR?: LocalSaleItemScalarWhereWithAggregatesInput[]
    NOT?: LocalSaleItemScalarWhereWithAggregatesInput | LocalSaleItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LocalSaleItem"> | string
    saleId?: StringWithAggregatesFilter<"LocalSaleItem"> | string
    productId?: StringWithAggregatesFilter<"LocalSaleItem"> | string
    nameAr?: StringWithAggregatesFilter<"LocalSaleItem"> | string
    quantity?: IntWithAggregatesFilter<"LocalSaleItem"> | number
    unitPrice?: FloatWithAggregatesFilter<"LocalSaleItem"> | number
    lineDiscount?: FloatWithAggregatesFilter<"LocalSaleItem"> | number
    lineTotal?: FloatWithAggregatesFilter<"LocalSaleItem"> | number
  }

  export type SyncQueueItemWhereInput = {
    AND?: SyncQueueItemWhereInput | SyncQueueItemWhereInput[]
    OR?: SyncQueueItemWhereInput[]
    NOT?: SyncQueueItemWhereInput | SyncQueueItemWhereInput[]
    id?: StringFilter<"SyncQueueItem"> | string
    clientEventId?: StringFilter<"SyncQueueItem"> | string
    payload?: StringFilter<"SyncQueueItem"> | string
    status?: StringFilter<"SyncQueueItem"> | string
    attempts?: IntFilter<"SyncQueueItem"> | number
    lastError?: StringNullableFilter<"SyncQueueItem"> | string | null
    createdAt?: StringFilter<"SyncQueueItem"> | string
  }

  export type SyncQueueItemOrderByWithRelationInput = {
    id?: SortOrder
    clientEventId?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    lastError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type SyncQueueItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    clientEventId?: string
    AND?: SyncQueueItemWhereInput | SyncQueueItemWhereInput[]
    OR?: SyncQueueItemWhereInput[]
    NOT?: SyncQueueItemWhereInput | SyncQueueItemWhereInput[]
    payload?: StringFilter<"SyncQueueItem"> | string
    status?: StringFilter<"SyncQueueItem"> | string
    attempts?: IntFilter<"SyncQueueItem"> | number
    lastError?: StringNullableFilter<"SyncQueueItem"> | string | null
    createdAt?: StringFilter<"SyncQueueItem"> | string
  }, "id" | "clientEventId">

  export type SyncQueueItemOrderByWithAggregationInput = {
    id?: SortOrder
    clientEventId?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    lastError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: SyncQueueItemCountOrderByAggregateInput
    _avg?: SyncQueueItemAvgOrderByAggregateInput
    _max?: SyncQueueItemMaxOrderByAggregateInput
    _min?: SyncQueueItemMinOrderByAggregateInput
    _sum?: SyncQueueItemSumOrderByAggregateInput
  }

  export type SyncQueueItemScalarWhereWithAggregatesInput = {
    AND?: SyncQueueItemScalarWhereWithAggregatesInput | SyncQueueItemScalarWhereWithAggregatesInput[]
    OR?: SyncQueueItemScalarWhereWithAggregatesInput[]
    NOT?: SyncQueueItemScalarWhereWithAggregatesInput | SyncQueueItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SyncQueueItem"> | string
    clientEventId?: StringWithAggregatesFilter<"SyncQueueItem"> | string
    payload?: StringWithAggregatesFilter<"SyncQueueItem"> | string
    status?: StringWithAggregatesFilter<"SyncQueueItem"> | string
    attempts?: IntWithAggregatesFilter<"SyncQueueItem"> | number
    lastError?: StringNullableWithAggregatesFilter<"SyncQueueItem"> | string | null
    createdAt?: StringWithAggregatesFilter<"SyncQueueItem"> | string
  }

  export type MetaWhereInput = {
    AND?: MetaWhereInput | MetaWhereInput[]
    OR?: MetaWhereInput[]
    NOT?: MetaWhereInput | MetaWhereInput[]
    key?: StringFilter<"Meta"> | string
    value?: StringFilter<"Meta"> | string
  }

  export type MetaOrderByWithRelationInput = {
    key?: SortOrder
    value?: SortOrder
  }

  export type MetaWhereUniqueInput = Prisma.AtLeast<{
    key?: string
    AND?: MetaWhereInput | MetaWhereInput[]
    OR?: MetaWhereInput[]
    NOT?: MetaWhereInput | MetaWhereInput[]
    value?: StringFilter<"Meta"> | string
  }, "key">

  export type MetaOrderByWithAggregationInput = {
    key?: SortOrder
    value?: SortOrder
    _count?: MetaCountOrderByAggregateInput
    _max?: MetaMaxOrderByAggregateInput
    _min?: MetaMinOrderByAggregateInput
  }

  export type MetaScalarWhereWithAggregatesInput = {
    AND?: MetaScalarWhereWithAggregatesInput | MetaScalarWhereWithAggregatesInput[]
    OR?: MetaScalarWhereWithAggregatesInput[]
    NOT?: MetaScalarWhereWithAggregatesInput | MetaScalarWhereWithAggregatesInput[]
    key?: StringWithAggregatesFilter<"Meta"> | string
    value?: StringWithAggregatesFilter<"Meta"> | string
  }

  export type LocalProductCreateInput = {
    id: string
    nameAr: string
    sku: string
    salePrice: number
    quantity?: number
    minQuantity?: number
    isOnline?: boolean
    updatedAt: string
  }

  export type LocalProductUncheckedCreateInput = {
    id: string
    nameAr: string
    sku: string
    salePrice: number
    quantity?: number
    minQuantity?: number
    isOnline?: boolean
    updatedAt: string
  }

  export type LocalProductUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nameAr?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    salePrice?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    minQuantity?: IntFieldUpdateOperationsInput | number
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: StringFieldUpdateOperationsInput | string
  }

  export type LocalProductUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nameAr?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    salePrice?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    minQuantity?: IntFieldUpdateOperationsInput | number
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: StringFieldUpdateOperationsInput | string
  }

  export type LocalProductCreateManyInput = {
    id: string
    nameAr: string
    sku: string
    salePrice: number
    quantity?: number
    minQuantity?: number
    isOnline?: boolean
    updatedAt: string
  }

  export type LocalProductUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nameAr?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    salePrice?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    minQuantity?: IntFieldUpdateOperationsInput | number
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: StringFieldUpdateOperationsInput | string
  }

  export type LocalProductUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nameAr?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    salePrice?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    minQuantity?: IntFieldUpdateOperationsInput | number
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: StringFieldUpdateOperationsInput | string
  }

  export type LocalUserCreateInput = {
    id: string
    name: string
    email: string
    passwordHash: string
    role: string
    updatedAt: string
  }

  export type LocalUserUncheckedCreateInput = {
    id: string
    name: string
    email: string
    passwordHash: string
    role: string
    updatedAt: string
  }

  export type LocalUserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    updatedAt?: StringFieldUpdateOperationsInput | string
  }

  export type LocalUserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    updatedAt?: StringFieldUpdateOperationsInput | string
  }

  export type LocalUserCreateManyInput = {
    id: string
    name: string
    email: string
    passwordHash: string
    role: string
    updatedAt: string
  }

  export type LocalUserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    updatedAt?: StringFieldUpdateOperationsInput | string
  }

  export type LocalUserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    updatedAt?: StringFieldUpdateOperationsInput | string
  }

  export type LocalCustomerCreateInput = {
    id: string
    name: string
    phone?: string | null
    address?: string | null
    balance?: number
    updatedAt: string
  }

  export type LocalCustomerUncheckedCreateInput = {
    id: string
    name: string
    phone?: string | null
    address?: string | null
    balance?: number
    updatedAt: string
  }

  export type LocalCustomerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    balance?: FloatFieldUpdateOperationsInput | number
    updatedAt?: StringFieldUpdateOperationsInput | string
  }

  export type LocalCustomerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    balance?: FloatFieldUpdateOperationsInput | number
    updatedAt?: StringFieldUpdateOperationsInput | string
  }

  export type LocalCustomerCreateManyInput = {
    id: string
    name: string
    phone?: string | null
    address?: string | null
    balance?: number
    updatedAt: string
  }

  export type LocalCustomerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    balance?: FloatFieldUpdateOperationsInput | number
    updatedAt?: StringFieldUpdateOperationsInput | string
  }

  export type LocalCustomerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    balance?: FloatFieldUpdateOperationsInput | number
    updatedAt?: StringFieldUpdateOperationsInput | string
  }

  export type LocalSaleCreateInput = {
    id?: string
    clientEventId: string
    invoiceNo: string
    userId?: string | null
    customerName?: string | null
    customerPhone?: string | null
    subtotal: number
    discount?: number
    total: number
    paid?: number
    remaining?: number
    paymentType: string
    priceEdited?: boolean
    synced?: boolean
    createdAt: string
    items?: LocalSaleItemCreateNestedManyWithoutSaleInput
  }

  export type LocalSaleUncheckedCreateInput = {
    id?: string
    clientEventId: string
    invoiceNo: string
    userId?: string | null
    customerName?: string | null
    customerPhone?: string | null
    subtotal: number
    discount?: number
    total: number
    paid?: number
    remaining?: number
    paymentType: string
    priceEdited?: boolean
    synced?: boolean
    createdAt: string
    items?: LocalSaleItemUncheckedCreateNestedManyWithoutSaleInput
  }

  export type LocalSaleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientEventId?: StringFieldUpdateOperationsInput | string
    invoiceNo?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    paid?: FloatFieldUpdateOperationsInput | number
    remaining?: FloatFieldUpdateOperationsInput | number
    paymentType?: StringFieldUpdateOperationsInput | string
    priceEdited?: BoolFieldUpdateOperationsInput | boolean
    synced?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
    items?: LocalSaleItemUpdateManyWithoutSaleNestedInput
  }

  export type LocalSaleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientEventId?: StringFieldUpdateOperationsInput | string
    invoiceNo?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    paid?: FloatFieldUpdateOperationsInput | number
    remaining?: FloatFieldUpdateOperationsInput | number
    paymentType?: StringFieldUpdateOperationsInput | string
    priceEdited?: BoolFieldUpdateOperationsInput | boolean
    synced?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
    items?: LocalSaleItemUncheckedUpdateManyWithoutSaleNestedInput
  }

  export type LocalSaleCreateManyInput = {
    id?: string
    clientEventId: string
    invoiceNo: string
    userId?: string | null
    customerName?: string | null
    customerPhone?: string | null
    subtotal: number
    discount?: number
    total: number
    paid?: number
    remaining?: number
    paymentType: string
    priceEdited?: boolean
    synced?: boolean
    createdAt: string
  }

  export type LocalSaleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientEventId?: StringFieldUpdateOperationsInput | string
    invoiceNo?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    paid?: FloatFieldUpdateOperationsInput | number
    remaining?: FloatFieldUpdateOperationsInput | number
    paymentType?: StringFieldUpdateOperationsInput | string
    priceEdited?: BoolFieldUpdateOperationsInput | boolean
    synced?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
  }

  export type LocalSaleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientEventId?: StringFieldUpdateOperationsInput | string
    invoiceNo?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    paid?: FloatFieldUpdateOperationsInput | number
    remaining?: FloatFieldUpdateOperationsInput | number
    paymentType?: StringFieldUpdateOperationsInput | string
    priceEdited?: BoolFieldUpdateOperationsInput | boolean
    synced?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
  }

  export type LocalSaleItemCreateInput = {
    id?: string
    productId: string
    nameAr: string
    quantity: number
    unitPrice: number
    lineDiscount?: number
    lineTotal: number
    sale: LocalSaleCreateNestedOneWithoutItemsInput
  }

  export type LocalSaleItemUncheckedCreateInput = {
    id?: string
    saleId: string
    productId: string
    nameAr: string
    quantity: number
    unitPrice: number
    lineDiscount?: number
    lineTotal: number
  }

  export type LocalSaleItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    nameAr?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineDiscount?: FloatFieldUpdateOperationsInput | number
    lineTotal?: FloatFieldUpdateOperationsInput | number
    sale?: LocalSaleUpdateOneRequiredWithoutItemsNestedInput
  }

  export type LocalSaleItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    nameAr?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineDiscount?: FloatFieldUpdateOperationsInput | number
    lineTotal?: FloatFieldUpdateOperationsInput | number
  }

  export type LocalSaleItemCreateManyInput = {
    id?: string
    saleId: string
    productId: string
    nameAr: string
    quantity: number
    unitPrice: number
    lineDiscount?: number
    lineTotal: number
  }

  export type LocalSaleItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    nameAr?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineDiscount?: FloatFieldUpdateOperationsInput | number
    lineTotal?: FloatFieldUpdateOperationsInput | number
  }

  export type LocalSaleItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    nameAr?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineDiscount?: FloatFieldUpdateOperationsInput | number
    lineTotal?: FloatFieldUpdateOperationsInput | number
  }

  export type SyncQueueItemCreateInput = {
    id?: string
    clientEventId: string
    payload: string
    status?: string
    attempts?: number
    lastError?: string | null
    createdAt: string
  }

  export type SyncQueueItemUncheckedCreateInput = {
    id?: string
    clientEventId: string
    payload: string
    status?: string
    attempts?: number
    lastError?: string | null
    createdAt: string
  }

  export type SyncQueueItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientEventId?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: StringFieldUpdateOperationsInput | string
  }

  export type SyncQueueItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientEventId?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: StringFieldUpdateOperationsInput | string
  }

  export type SyncQueueItemCreateManyInput = {
    id?: string
    clientEventId: string
    payload: string
    status?: string
    attempts?: number
    lastError?: string | null
    createdAt: string
  }

  export type SyncQueueItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientEventId?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: StringFieldUpdateOperationsInput | string
  }

  export type SyncQueueItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientEventId?: StringFieldUpdateOperationsInput | string
    payload?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: StringFieldUpdateOperationsInput | string
  }

  export type MetaCreateInput = {
    key: string
    value: string
  }

  export type MetaUncheckedCreateInput = {
    key: string
    value: string
  }

  export type MetaUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type MetaUncheckedUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type MetaCreateManyInput = {
    key: string
    value: string
  }

  export type MetaUpdateManyMutationInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type MetaUncheckedUpdateManyInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type LocalProductCountOrderByAggregateInput = {
    id?: SortOrder
    nameAr?: SortOrder
    sku?: SortOrder
    salePrice?: SortOrder
    quantity?: SortOrder
    minQuantity?: SortOrder
    isOnline?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalProductAvgOrderByAggregateInput = {
    salePrice?: SortOrder
    quantity?: SortOrder
    minQuantity?: SortOrder
  }

  export type LocalProductMaxOrderByAggregateInput = {
    id?: SortOrder
    nameAr?: SortOrder
    sku?: SortOrder
    salePrice?: SortOrder
    quantity?: SortOrder
    minQuantity?: SortOrder
    isOnline?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalProductMinOrderByAggregateInput = {
    id?: SortOrder
    nameAr?: SortOrder
    sku?: SortOrder
    salePrice?: SortOrder
    quantity?: SortOrder
    minQuantity?: SortOrder
    isOnline?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalProductSumOrderByAggregateInput = {
    salePrice?: SortOrder
    quantity?: SortOrder
    minQuantity?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type LocalUserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalUserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalUserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LocalCustomerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    balance?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalCustomerAvgOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type LocalCustomerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    balance?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalCustomerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    balance?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocalCustomerSumOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type LocalSaleItemListRelationFilter = {
    every?: LocalSaleItemWhereInput
    some?: LocalSaleItemWhereInput
    none?: LocalSaleItemWhereInput
  }

  export type LocalSaleItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LocalSaleCountOrderByAggregateInput = {
    id?: SortOrder
    clientEventId?: SortOrder
    invoiceNo?: SortOrder
    userId?: SortOrder
    customerName?: SortOrder
    customerPhone?: SortOrder
    subtotal?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    paid?: SortOrder
    remaining?: SortOrder
    paymentType?: SortOrder
    priceEdited?: SortOrder
    synced?: SortOrder
    createdAt?: SortOrder
  }

  export type LocalSaleAvgOrderByAggregateInput = {
    subtotal?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    paid?: SortOrder
    remaining?: SortOrder
  }

  export type LocalSaleMaxOrderByAggregateInput = {
    id?: SortOrder
    clientEventId?: SortOrder
    invoiceNo?: SortOrder
    userId?: SortOrder
    customerName?: SortOrder
    customerPhone?: SortOrder
    subtotal?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    paid?: SortOrder
    remaining?: SortOrder
    paymentType?: SortOrder
    priceEdited?: SortOrder
    synced?: SortOrder
    createdAt?: SortOrder
  }

  export type LocalSaleMinOrderByAggregateInput = {
    id?: SortOrder
    clientEventId?: SortOrder
    invoiceNo?: SortOrder
    userId?: SortOrder
    customerName?: SortOrder
    customerPhone?: SortOrder
    subtotal?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    paid?: SortOrder
    remaining?: SortOrder
    paymentType?: SortOrder
    priceEdited?: SortOrder
    synced?: SortOrder
    createdAt?: SortOrder
  }

  export type LocalSaleSumOrderByAggregateInput = {
    subtotal?: SortOrder
    discount?: SortOrder
    total?: SortOrder
    paid?: SortOrder
    remaining?: SortOrder
  }

  export type LocalSaleScalarRelationFilter = {
    is?: LocalSaleWhereInput
    isNot?: LocalSaleWhereInput
  }

  export type LocalSaleItemCountOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    nameAr?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    lineDiscount?: SortOrder
    lineTotal?: SortOrder
  }

  export type LocalSaleItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    lineDiscount?: SortOrder
    lineTotal?: SortOrder
  }

  export type LocalSaleItemMaxOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    nameAr?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    lineDiscount?: SortOrder
    lineTotal?: SortOrder
  }

  export type LocalSaleItemMinOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    productId?: SortOrder
    nameAr?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    lineDiscount?: SortOrder
    lineTotal?: SortOrder
  }

  export type LocalSaleItemSumOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    lineDiscount?: SortOrder
    lineTotal?: SortOrder
  }

  export type SyncQueueItemCountOrderByAggregateInput = {
    id?: SortOrder
    clientEventId?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    lastError?: SortOrder
    createdAt?: SortOrder
  }

  export type SyncQueueItemAvgOrderByAggregateInput = {
    attempts?: SortOrder
  }

  export type SyncQueueItemMaxOrderByAggregateInput = {
    id?: SortOrder
    clientEventId?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    lastError?: SortOrder
    createdAt?: SortOrder
  }

  export type SyncQueueItemMinOrderByAggregateInput = {
    id?: SortOrder
    clientEventId?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    lastError?: SortOrder
    createdAt?: SortOrder
  }

  export type SyncQueueItemSumOrderByAggregateInput = {
    attempts?: SortOrder
  }

  export type MetaCountOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
  }

  export type MetaMaxOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
  }

  export type MetaMinOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type LocalSaleItemCreateNestedManyWithoutSaleInput = {
    create?: XOR<LocalSaleItemCreateWithoutSaleInput, LocalSaleItemUncheckedCreateWithoutSaleInput> | LocalSaleItemCreateWithoutSaleInput[] | LocalSaleItemUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: LocalSaleItemCreateOrConnectWithoutSaleInput | LocalSaleItemCreateOrConnectWithoutSaleInput[]
    createMany?: LocalSaleItemCreateManySaleInputEnvelope
    connect?: LocalSaleItemWhereUniqueInput | LocalSaleItemWhereUniqueInput[]
  }

  export type LocalSaleItemUncheckedCreateNestedManyWithoutSaleInput = {
    create?: XOR<LocalSaleItemCreateWithoutSaleInput, LocalSaleItemUncheckedCreateWithoutSaleInput> | LocalSaleItemCreateWithoutSaleInput[] | LocalSaleItemUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: LocalSaleItemCreateOrConnectWithoutSaleInput | LocalSaleItemCreateOrConnectWithoutSaleInput[]
    createMany?: LocalSaleItemCreateManySaleInputEnvelope
    connect?: LocalSaleItemWhereUniqueInput | LocalSaleItemWhereUniqueInput[]
  }

  export type LocalSaleItemUpdateManyWithoutSaleNestedInput = {
    create?: XOR<LocalSaleItemCreateWithoutSaleInput, LocalSaleItemUncheckedCreateWithoutSaleInput> | LocalSaleItemCreateWithoutSaleInput[] | LocalSaleItemUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: LocalSaleItemCreateOrConnectWithoutSaleInput | LocalSaleItemCreateOrConnectWithoutSaleInput[]
    upsert?: LocalSaleItemUpsertWithWhereUniqueWithoutSaleInput | LocalSaleItemUpsertWithWhereUniqueWithoutSaleInput[]
    createMany?: LocalSaleItemCreateManySaleInputEnvelope
    set?: LocalSaleItemWhereUniqueInput | LocalSaleItemWhereUniqueInput[]
    disconnect?: LocalSaleItemWhereUniqueInput | LocalSaleItemWhereUniqueInput[]
    delete?: LocalSaleItemWhereUniqueInput | LocalSaleItemWhereUniqueInput[]
    connect?: LocalSaleItemWhereUniqueInput | LocalSaleItemWhereUniqueInput[]
    update?: LocalSaleItemUpdateWithWhereUniqueWithoutSaleInput | LocalSaleItemUpdateWithWhereUniqueWithoutSaleInput[]
    updateMany?: LocalSaleItemUpdateManyWithWhereWithoutSaleInput | LocalSaleItemUpdateManyWithWhereWithoutSaleInput[]
    deleteMany?: LocalSaleItemScalarWhereInput | LocalSaleItemScalarWhereInput[]
  }

  export type LocalSaleItemUncheckedUpdateManyWithoutSaleNestedInput = {
    create?: XOR<LocalSaleItemCreateWithoutSaleInput, LocalSaleItemUncheckedCreateWithoutSaleInput> | LocalSaleItemCreateWithoutSaleInput[] | LocalSaleItemUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: LocalSaleItemCreateOrConnectWithoutSaleInput | LocalSaleItemCreateOrConnectWithoutSaleInput[]
    upsert?: LocalSaleItemUpsertWithWhereUniqueWithoutSaleInput | LocalSaleItemUpsertWithWhereUniqueWithoutSaleInput[]
    createMany?: LocalSaleItemCreateManySaleInputEnvelope
    set?: LocalSaleItemWhereUniqueInput | LocalSaleItemWhereUniqueInput[]
    disconnect?: LocalSaleItemWhereUniqueInput | LocalSaleItemWhereUniqueInput[]
    delete?: LocalSaleItemWhereUniqueInput | LocalSaleItemWhereUniqueInput[]
    connect?: LocalSaleItemWhereUniqueInput | LocalSaleItemWhereUniqueInput[]
    update?: LocalSaleItemUpdateWithWhereUniqueWithoutSaleInput | LocalSaleItemUpdateWithWhereUniqueWithoutSaleInput[]
    updateMany?: LocalSaleItemUpdateManyWithWhereWithoutSaleInput | LocalSaleItemUpdateManyWithWhereWithoutSaleInput[]
    deleteMany?: LocalSaleItemScalarWhereInput | LocalSaleItemScalarWhereInput[]
  }

  export type LocalSaleCreateNestedOneWithoutItemsInput = {
    create?: XOR<LocalSaleCreateWithoutItemsInput, LocalSaleUncheckedCreateWithoutItemsInput>
    connectOrCreate?: LocalSaleCreateOrConnectWithoutItemsInput
    connect?: LocalSaleWhereUniqueInput
  }

  export type LocalSaleUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<LocalSaleCreateWithoutItemsInput, LocalSaleUncheckedCreateWithoutItemsInput>
    connectOrCreate?: LocalSaleCreateOrConnectWithoutItemsInput
    upsert?: LocalSaleUpsertWithoutItemsInput
    connect?: LocalSaleWhereUniqueInput
    update?: XOR<XOR<LocalSaleUpdateToOneWithWhereWithoutItemsInput, LocalSaleUpdateWithoutItemsInput>, LocalSaleUncheckedUpdateWithoutItemsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type LocalSaleItemCreateWithoutSaleInput = {
    id?: string
    productId: string
    nameAr: string
    quantity: number
    unitPrice: number
    lineDiscount?: number
    lineTotal: number
  }

  export type LocalSaleItemUncheckedCreateWithoutSaleInput = {
    id?: string
    productId: string
    nameAr: string
    quantity: number
    unitPrice: number
    lineDiscount?: number
    lineTotal: number
  }

  export type LocalSaleItemCreateOrConnectWithoutSaleInput = {
    where: LocalSaleItemWhereUniqueInput
    create: XOR<LocalSaleItemCreateWithoutSaleInput, LocalSaleItemUncheckedCreateWithoutSaleInput>
  }

  export type LocalSaleItemCreateManySaleInputEnvelope = {
    data: LocalSaleItemCreateManySaleInput | LocalSaleItemCreateManySaleInput[]
  }

  export type LocalSaleItemUpsertWithWhereUniqueWithoutSaleInput = {
    where: LocalSaleItemWhereUniqueInput
    update: XOR<LocalSaleItemUpdateWithoutSaleInput, LocalSaleItemUncheckedUpdateWithoutSaleInput>
    create: XOR<LocalSaleItemCreateWithoutSaleInput, LocalSaleItemUncheckedCreateWithoutSaleInput>
  }

  export type LocalSaleItemUpdateWithWhereUniqueWithoutSaleInput = {
    where: LocalSaleItemWhereUniqueInput
    data: XOR<LocalSaleItemUpdateWithoutSaleInput, LocalSaleItemUncheckedUpdateWithoutSaleInput>
  }

  export type LocalSaleItemUpdateManyWithWhereWithoutSaleInput = {
    where: LocalSaleItemScalarWhereInput
    data: XOR<LocalSaleItemUpdateManyMutationInput, LocalSaleItemUncheckedUpdateManyWithoutSaleInput>
  }

  export type LocalSaleItemScalarWhereInput = {
    AND?: LocalSaleItemScalarWhereInput | LocalSaleItemScalarWhereInput[]
    OR?: LocalSaleItemScalarWhereInput[]
    NOT?: LocalSaleItemScalarWhereInput | LocalSaleItemScalarWhereInput[]
    id?: StringFilter<"LocalSaleItem"> | string
    saleId?: StringFilter<"LocalSaleItem"> | string
    productId?: StringFilter<"LocalSaleItem"> | string
    nameAr?: StringFilter<"LocalSaleItem"> | string
    quantity?: IntFilter<"LocalSaleItem"> | number
    unitPrice?: FloatFilter<"LocalSaleItem"> | number
    lineDiscount?: FloatFilter<"LocalSaleItem"> | number
    lineTotal?: FloatFilter<"LocalSaleItem"> | number
  }

  export type LocalSaleCreateWithoutItemsInput = {
    id?: string
    clientEventId: string
    invoiceNo: string
    userId?: string | null
    customerName?: string | null
    customerPhone?: string | null
    subtotal: number
    discount?: number
    total: number
    paid?: number
    remaining?: number
    paymentType: string
    priceEdited?: boolean
    synced?: boolean
    createdAt: string
  }

  export type LocalSaleUncheckedCreateWithoutItemsInput = {
    id?: string
    clientEventId: string
    invoiceNo: string
    userId?: string | null
    customerName?: string | null
    customerPhone?: string | null
    subtotal: number
    discount?: number
    total: number
    paid?: number
    remaining?: number
    paymentType: string
    priceEdited?: boolean
    synced?: boolean
    createdAt: string
  }

  export type LocalSaleCreateOrConnectWithoutItemsInput = {
    where: LocalSaleWhereUniqueInput
    create: XOR<LocalSaleCreateWithoutItemsInput, LocalSaleUncheckedCreateWithoutItemsInput>
  }

  export type LocalSaleUpsertWithoutItemsInput = {
    update: XOR<LocalSaleUpdateWithoutItemsInput, LocalSaleUncheckedUpdateWithoutItemsInput>
    create: XOR<LocalSaleCreateWithoutItemsInput, LocalSaleUncheckedCreateWithoutItemsInput>
    where?: LocalSaleWhereInput
  }

  export type LocalSaleUpdateToOneWithWhereWithoutItemsInput = {
    where?: LocalSaleWhereInput
    data: XOR<LocalSaleUpdateWithoutItemsInput, LocalSaleUncheckedUpdateWithoutItemsInput>
  }

  export type LocalSaleUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientEventId?: StringFieldUpdateOperationsInput | string
    invoiceNo?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    paid?: FloatFieldUpdateOperationsInput | number
    remaining?: FloatFieldUpdateOperationsInput | number
    paymentType?: StringFieldUpdateOperationsInput | string
    priceEdited?: BoolFieldUpdateOperationsInput | boolean
    synced?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
  }

  export type LocalSaleUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientEventId?: StringFieldUpdateOperationsInput | string
    invoiceNo?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    subtotal?: FloatFieldUpdateOperationsInput | number
    discount?: FloatFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    paid?: FloatFieldUpdateOperationsInput | number
    remaining?: FloatFieldUpdateOperationsInput | number
    paymentType?: StringFieldUpdateOperationsInput | string
    priceEdited?: BoolFieldUpdateOperationsInput | boolean
    synced?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: StringFieldUpdateOperationsInput | string
  }

  export type LocalSaleItemCreateManySaleInput = {
    id?: string
    productId: string
    nameAr: string
    quantity: number
    unitPrice: number
    lineDiscount?: number
    lineTotal: number
  }

  export type LocalSaleItemUpdateWithoutSaleInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    nameAr?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineDiscount?: FloatFieldUpdateOperationsInput | number
    lineTotal?: FloatFieldUpdateOperationsInput | number
  }

  export type LocalSaleItemUncheckedUpdateWithoutSaleInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    nameAr?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineDiscount?: FloatFieldUpdateOperationsInput | number
    lineTotal?: FloatFieldUpdateOperationsInput | number
  }

  export type LocalSaleItemUncheckedUpdateManyWithoutSaleInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    nameAr?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    unitPrice?: FloatFieldUpdateOperationsInput | number
    lineDiscount?: FloatFieldUpdateOperationsInput | number
    lineTotal?: FloatFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}