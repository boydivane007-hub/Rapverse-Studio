export default async function handler(req, res) {
  try {
    const { lyrics } = req.body;
    
    const start = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: { 
        "Authorization": `Token ${process.env.REPLICATE_API_KEY}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ 
        version: "b05b1dff1d8c6dc63e5db4a1eec7b79dfd6c60d8a4a6aafdd8b7d2a8a8c0b0c0",
        input: { prompt: lyrics } 
      })
    });
    const prediction = await start.json();
    if(prediction.error) throw new Error(prediction.error);

    await new Promise(r=>setTimeout(r,45000));
    
    const result = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: {"Authorization": `Token ${process.env.REPLICATE_API_KEY}`}
    }).then(r=>r.json());
    
    res.json({url: result.output?.audio || result.output?.[0]});
  } catch(e) {
    res.status(500).json({error: e.message});
  }
      }
