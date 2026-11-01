import {cacheProvider} from "../cache/init.js";
import Json from "qs";

export function idempotency(ttl= 3600){
    return async function (req, res, next) {
        const idempotency = req.headers['idempotency-key'];
        let key = `${req.method}:${req.originalUrl}:${idempotency}`;
        const cached = await  cacheProvider.get(key);
        if (cached) {
            res.setHeader('X-Cache', 'HIT');
            return res.json(JSON.parse(cached));
        }
        const originalJson = res.json.bind(res);

        res.json=(async (body) => {
            await cacheProvider.set(key, Json.stringify(body), ttl);
            res.setHeader('X-Cache', 'MISS');
            return originalJson(body);
        });
        next();
    }
}