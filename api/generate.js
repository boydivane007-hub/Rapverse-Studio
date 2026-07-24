export default async function handler(req, res) {
  try {
    const { lyrics } = req.body;
    if(!lyrics) return res.status(400).json({error: "Pas de paroles"});
    
    const start = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: { 
        "Authorization": `Token ${process.env.REPLICATE_API_KEY}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ 
        version: "7c5a8c2d3b0f4e1a9b8c7d6e5f4a3b2c1d0e9f8a", // MUSICGEN
        input: { 
          prompt: lyrics,
          duration: 10,
          model_version: "melody"
        } 
      })
    });
    
    const prediction = await start.json();
    if(prediction.error) throw new Error(prediction.error);

    // On attend que ça génère
    let result = prediction;
    while(result.status !== "succeeded" && result.status !== "failed"){
      await new Promise(r=>setTimeout(r,3000));
      result = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: {"Authorization": `Token ${process.env.REPLICATE_API_KEY}`}
      }).then(r=>r.json());
    }
    
    if(result.status === "failed") throw new Error(result.error);
    res.json({url: result.output});
    
  } catch(e) {
    res.status(500).json({error: e.message});
  }
}
