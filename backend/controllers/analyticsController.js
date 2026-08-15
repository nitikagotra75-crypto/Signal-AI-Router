import Query from "../models/Query.js";

export async function getAnalytics(req , res , next) {
    try{
        const [summary] = await Query.aggregate([
           {
            $group:{
                _id:null,
                totalQueries : { $sum : 1},
                averageLatency : {$avg : "$latencyMs"},
            },
        },
        ]);

        const engineUsage = await Query.aggregate([
            {
                $group:{
                    _id:"$engineUsed",
                    count:{ $sum : 1},
                },
            },
            {
                $sort :{count:-1},
            },
            {
                $project:{
                    _id:0,
                    engine:"$_id",
                    count:1 ,
                },
            },
        ]);

        const categoryUsage = await Query.aggregate([
            {
                $group:{
                    _id:"$category",
                    count:{$sum :1},
                },
            },
            {
                $sort:{count: -1}
            },
            {
                $project:{
                    _id:0,
                    category:"$_id",
                    count:1,
                },
            },
        ]);

        return res.status(200).json({
            totalQueries:summary?.totalQueries || 0,
            averageLatency: summary?Math.round(summary.averageLatency):0,
            engineUsage,
            categoryUsage,
        });
    }catch(error){
        error.status = 500;
        next(error);
    }
}