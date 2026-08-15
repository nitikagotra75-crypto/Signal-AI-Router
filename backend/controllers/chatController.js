import { routeQuery } from "../services/routerService.js";

import Query from "../models/Query.js";

export async function handleChat(req , res , next){
    const startTime = Date.now();

    try{
        const { query } = req.body;

        const { category , engine , response} = await routeQuery(query);

        const latency = Date.now()-startTime;

        await Query.create({
            query,
            category,
            engineUsed : engine,
            response,
            latencyMs:latency,
        });

        return res.status(200).json({
            category,
            engine,
            response, 
            latency,
        });
    }catch(error){
        error.status = error.status || 502;
        if(!error.message.includes("required")){
            error.message = `AI routing failed:${error.message}`;
        }
        next(error);
    }
}