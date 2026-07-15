interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class MemoryCache {
  private store: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 300000; // 5 minutes

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data;
  }

  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    this.store.set(key, { data, expiresAt });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async deleteByPattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace('*', '.*'));
    for (const key of this.store.keys()) {
      if (regex.test(key)) this.store.delete(key);
    }
  }

  async remember<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;
    const data = await fetcher();
    await this.set(key, data, ttl);
    return data;
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  getStats() {
    return {
      keys: this.store.size,
      entries: Array.from(this.store.keys()),
    };
  }
}

export const cache = new MemoryCache();

// Cache decorator for API routes
export function cached(ttl?: number) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const key = `cache:${propertyKey}:${JSON.stringify(args)}`;
      return cache.remember(key, () => original.apply(this, args), ttl);
    };
    return descriptor;
  };
}