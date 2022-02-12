import { Compilation } from "webpack";

// Types declared in 'webpack' v5.68.0, but not exported:
// Argument, ArgumentConfig, EntryOptions, FileCacheOptions, AssetEmittedInfo
//
// We can either duplicate them here or open a PR to expose them
//
// import { Argument, ArgumentConfig, EntryOptions, FileCacheOptions, AssetEmittedInfo, Problem } from "webpack";
// export {Argument, ArgumentConfig, EntryOptions, FileCacheOptions, AssetEmittedInfo, Problem}
//

export interface Problem {
  type: ProblemType;
  path: string;
  argument: string;
  value?: unknown;
  index?: number;
  expected?: string;
}
type ProblemType =
  | "unknown-argument"
  | "unexpected-non-array-in-path"
  | "unexpected-non-object-in-path"
  | "multiple-values-unexpected"
  | "invalid-value";

interface MapOptions {
  columns?: boolean;
  module?: boolean;
}

declare class Hash {
  constructor();

  /**
   * Update hash {@link https://nodejs.org/api/crypto.html#crypto_hash_update_data_inputencoding}
   */
  update(data: string | Buffer, inputEncoding?: string): Hash;

  /**
   * Calculates the digest {@link https://nodejs.org/api/crypto.html#crypto_hash_digest_encoding}
   */
  digest(encoding?: string): string | Buffer;
}

declare class Source {
  constructor();
  size(): number;
  map(options?: MapOptions): object;
  sourceAndMap(options?: MapOptions): { source: string | Buffer; map: object };
  updateHash(hash: Hash): void;
  source(): string | Buffer;
  buffer(): Buffer;
}
export interface FileCacheOptions {
  /**
   * Allows to collect unused memory allocated during deserialization. This requires copying data into smaller buffers and has a performance cost.
   */
  allowCollectingMemory?: boolean;

  /**
   * Dependencies the build depends on (in multiple categories, default categories: 'defaultWebpack').
   */
  buildDependencies?: { [index: string]: string[] };

  /**
   * Base directory for the cache (defaults to node_modules/.cache/webpack).
   */
  cacheDirectory?: string;

  /**
   * Locations for the cache (defaults to cacheDirectory / name).
   */
  cacheLocation?: string;

  /**
   * Compression type used for the cache files.
   */
  compression?: false | "gzip" | "brotli";

  /**
   * Algorithm used for generation the hash (see node.js crypto package).
   */
  hashAlgorithm?: string;

  /**
   * Time in ms after which idle period the cache storing should happen.
   */
  idleTimeout?: number;

  /**
   * Time in ms after which idle period the cache storing should happen when larger changes has been detected (cumulative build time > 2 x avg cache store time).
   */
  idleTimeoutAfterLargeChanges?: number;

  /**
   * Time in ms after which idle period the initial cache storing should happen.
   */
  idleTimeoutForInitialStore?: number;

  /**
   * List of paths that are managed by a package manager and contain a version or hash in its path so all files are immutable.
   */
  immutablePaths?: (string | RegExp)[];

  /**
   * List of paths that are managed by a package manager and can be trusted to not be modified otherwise.
   */
  managedPaths?: (string | RegExp)[];

  /**
   * Time for which unused cache entries stay in the filesystem cache at minimum (in milliseconds).
   */
  maxAge?: number;

  /**
   * Number of generations unused cache entries stay in memory cache at minimum (0 = no memory cache used, 1 = may be removed after unused for a single compilation, ..., Infinity: kept forever). Cache entries will be deserialized from disk when removed from memory cache.
   */
  maxMemoryGenerations?: number;

  /**
   * Additionally cache computation of modules that are unchanged and reference only unchanged modules in memory.
   */
  memoryCacheUnaffected?: boolean;

  /**
   * Name for the cache. Different names will lead to different coexisting caches.
   */
  name?: string;

  /**
   * Track and log detailed timing information for individual cache items.
   */
  profile?: boolean;

  /**
   * When to store data to the filesystem. (pack: Store data when compiler is idle in a single file).
   */
  store?: "pack";

  /**
   * Filesystem caching.
   */
  type: "filesystem";

  /**
   * Version of the cache data. Different versions won't allow to reuse the cache and override existing content. Update the version when config changed in a way which doesn't allow to reuse cache. This will invalidate the cache.
   */
  version?: string;
}

export interface AssetEmittedInfo {
  content: Buffer;
  source: Source;
  compilation: Compilation;
  outputPath: string;
  targetPath: string;
}
type EntryDescriptionNormalized = any;

export interface Argument {
  description: string;
  simpleType: "string" | "number" | "boolean";
  multiple: boolean;
  configs: ArgumentConfig[];
}
interface ArgumentConfig {
  description: string;
  negatedDescription?: string;
  path: string;
  multiple: boolean;
  type: "string" | "number" | "boolean" | "path" | "enum" | "RegExp" | "reset";
  values?: any[];
}

export type EntryOptions = { name?: string } & Omit<EntryDescriptionNormalized, "import">;
