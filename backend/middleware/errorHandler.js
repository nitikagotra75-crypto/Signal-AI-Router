export function notFoundHandler(req , res , next){
    res.status(404).json({error:`Route not found :${req.method}${req.originUrl}`});
}

export function errorHandler(err , req , res , next){
    console.error("[error]" , err);

    const status = err.status || 500;
    const message = 
    status === 500 ? "Something went wrong while processing your request" : err.message;

    res.status(status).json({error:message});
}