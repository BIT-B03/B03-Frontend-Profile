const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

const memoryCache = {};

export function getCachedData(key) {
    const now = Date.now();

    const entry = memoryCache[key];
    if (entry && entry.expiry > now) {
        return entry.data;
    }

    if (typeof window === 'undefined' || !window.sessionStorage) {
        return null;
    }

    try {
        const raw = window.sessionStorage.getItem(key);
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed.expiry !== 'number') return null;

        if (parsed.expiry <= now) {
            window.sessionStorage.removeItem(key);
            return null;
        }

        memoryCache[key] = { data: parsed.data, expiry: parsed.expiry };
        return parsed.data;
    } catch {
        return null;
    }
}

export function setCachedData(key, data, ttlMs = DEFAULT_TTL_MS) {
    const expiry = Date.now() + ttlMs;
    memoryCache[key] = { data, expiry };

    if (typeof window === 'undefined' || !window.sessionStorage) {
        return;
    }

    try {
        const payload = JSON.stringify({ data, expiry });
        window.sessionStorage.setItem(key, payload);
    } catch {
        // serialization errors
    }
}

export function clearCachedData(key) {
    delete memoryCache[key];

    if (typeof window === 'undefined' || !window.sessionStorage) {
        return;
    }

    try {
        window.sessionStorage.removeItem(key);
    } catch {
        // serialization errors
    }
}
