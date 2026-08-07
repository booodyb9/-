import re

with open('server.js', 'r') as f:
    content = f.read()

import_statement = "import { GoogleGenAI } from '@google/genai';\n"
if "import { GoogleGenAI }" not in content:
    content = import_statement + content

# Ensure GEMINI_API_KEY is available
api_route = """
app.use(express.json());

app.post('/api/generate-seo', async (req, res) => {
  try {
    const { title, content, type } = req.body;
    if (!title && !content) {
      return res.status(400).json({ error: 'Title or content is required' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are an expert SEO copywriter. Based on the following content for a ${type} page, suggest an SEO-optimized meta title (max 60 characters) and meta description (max 160 characters). Respond ONLY with a valid JSON object in this format: {"title": "Suggested Meta Title", "description": "Suggested Meta Description"}. Do not include markdown code block formatting or any other text.
    
    Content Title: ${title || ''}
    Content Body: ${content || ''}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text();
    let jsonResult;
    try {
        jsonResult = JSON.parse(text);
    } catch (e) {
        // Fallback cleanup if model returned markdown
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        jsonResult = JSON.parse(cleaned);
    }

    res.json(jsonResult);
  } catch (error) {
    console.error('Error generating SEO:', error);
    res.status(500).json({ error: 'Failed to generate SEO suggestions' });
  }
});
"""

if "/api/generate-seo" not in content:
    content = content.replace("app.get('/robots.txt'", api_route + "\napp.get('/robots.txt'")

with open('server.js', 'w') as f:
    f.write(content)

print("server.js updated with Gemini route")
