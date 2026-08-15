const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function parseJsonSafely(response){
    try{
        return await response.json();
    }catch{
        return null;
    }
}

export async function sendChatQuery(query){
    const response = await fetch(`${API_BASE_URL}/api/chat` , {
        method:"POST",
        headers:{"Content-Type" : "application/json"},
        body: JSON.stringify({query}),
    });

    const data = await parseJsonSafely(response);

    if(!response.ok){
        throw new Error(data?.error || "The router failed to process your query.");
    }
    return data;
}

export async function fetchAnalytics(){
    const response = await fetch(`${API_BASE_URL}/api/analytics`);
    const data = await parseJsonSafely(response);

    if(!response.ok){
        throw new Error(data?.error || "Could not load analytics.");
    }

return data;
}