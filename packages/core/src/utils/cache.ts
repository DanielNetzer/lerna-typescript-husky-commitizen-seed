import { caching, multiCaching, ICache } from "cache-manager";
import { ensureDirSync } from "fs-extra";
import { join } from "path";
import * as fsStore from "cache-manager-fs-hash";

const MAX_CACHE_SIZE = 250;
const TTL = Number.MAX_SAFE_INTEGER;

export class Cache {
  private name: string;
  private store: any;
  private cache: ICache;

  constructor({ name = "db", store = fsStore } = {}) {
    this.name = name;
    this.store = store;
  }

  get directory() {
    return join(process.cwd(), `.cache/caches/${this.name}`);
  }

  init() {
    ensureDirSync(this.directory);

    const caches = [
      {
        store: `memory`,
        max: MAX_CACHE_SIZE,
        ttl: TTL
      },
      {
        store: this.store,
        ttl: TTL,
        options: {
          path: this.directory
        }
      }
    ].map(cache => caching(cache));

    this.cache = multiCaching(caches);
    return this;
  }

  get(key: string) {
    return new Promise(resolve => {
      this.cache.get(key, (_, res) => resolve(res));
    });
  }

  set(key: string, value: any, ttl: number) {
    return new Promise((_, reject) => {
      this.cache.set(key, value, ttl, (err: any) => reject(err));
    });
  }
}
