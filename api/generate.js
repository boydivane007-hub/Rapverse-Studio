export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).end();
  
  const { prompt } = req.body;
  const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: { 
      "Authorization": `Token ${REPLICATE_API_KEY}`, 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({ 
      version: "6a8a2e2b5e8b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d", // Suno v3.5
      input: { 
        prompt: prompt,
        model_version: "v3_5",
        instrumental: false
      } 
    })
  });
  const data = await response.json();
  res.status(200).json(data);
}
