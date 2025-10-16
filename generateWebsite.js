// api/generateWebsite.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { project, client, prompt } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.WEBSITE_BUILDER_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an AI that generates fully working website HTML, CSS, and minimal JS." },
          { role: "user", content: `Project Name: ${project}\nClient Name: ${client}\nWebsite Description: ${prompt}\nOutput: full HTML website code.` }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    const data = await response.json();
    const websiteCode = data.choices[0].message.content;
    res.status(200).json({ websiteCode });

  } catch (err) {
    res.status(500).json({ error: 'Failed to generate website' });
  }
}
