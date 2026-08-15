export function validateChatRequest(req , res , next){
    const { query } = req.body;

    if(query == undefined || query == null){
        return res.status(400).json({ error:"The 'query '  field is required."});
    }

    if(typeof query !== "string"){
        return res.status(400).json({ error:"The 'query' field must be a string"});
    }

    if(query.trim().length === 0){
        return res.status(400).json({ error:"The query field cannot be empty"});
    }

    if(query.length > 4000){
        return res.status(400).json({error : "The 'query' field must be 4000 characters or fewer."});
    }

    req.body.query = query.trim();
    next();
}