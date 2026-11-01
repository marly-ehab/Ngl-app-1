import {cacheProvider} from "./init.js";
import {json} from "express";

export function withCache(ttl=3600) {
    return async (req, res, next) => {
        //request
        //method + url
        //"Get:/products":"[{},{},{},.....]"
        let key = `${req.method}${req.originalUrl}`;
      const cached =  await cacheProvider.get(key);
      if (cached) {
          res.setHeader('X-Cache',"HIT");
          return res.json(JSON.parse(cached));
      }
      //interceptor
        //res.json(body)>> send client response
        //res.json(body)>> cache + send a client response
        //get deep copy from implementation res.json before modify
        const originalJson = res.json.bind(res);
      //res.json () >> res() >> originalJson(body);
        res.json =(async (body) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                //1.cache body
                await cacheProvider.set(key, json.stringify(body), ttl);
                //2.send response
                res.setHeader('X-Cache',"MISS");
            }
            return originalJson(body);
        });
        next();
    }
}