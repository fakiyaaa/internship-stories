import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const data = req.body

  const prompt = `
Rewrite internship survey responses into a short internship story article with exactly 3-4 paragraphs. Separate each paragraph with a blank line. Do not use bullet points or headers — only plain paragraphs.

Rules:
- ONLY use the information explicitly provided below
- If a field says "not provided", skip it entirely — do NOT invent or guess details for it
- Do not add facts, names, technologies, or experiences that are not in the responses
- Do not exaggerate
- Keep the tone natural and first-person

Responses:
Company: ${data.company || "not provided"}
Role: ${data.role || "not provided"}
Location: ${data.location || "not provided"}
Season: ${data.season || "not provided"}

How they applied: ${data.applicationProcess || "not provided"}
Interview stages: ${data.interviewProcess || "not provided"}
Preparation: ${data.preparation || "not provided"}

Team: ${data.team || "not provided"}
Project: ${data.project || "not provided"}
Technologies: ${data.techStack || "not provided"}
Hardest challenge: ${data.challenge || "not provided"}
Advice: ${data.advice || "not provided"}

If a field says "not provided", do not mention it in the article at all.
`

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    })

    res.status(200).json({ article: completion.choices[0].message.content })
  } catch (err) {
    console.error("Groq error:", err.message)
    res.status(500).json({ error: "Failed to generate article." })
  }
}
