import express from "express"

const app = express()
app.use(express.json())

app.post("/api/generate-story", async (req, res) => {
  const data = req.body

  const prompt = `
Rewrite internship survey responses into a short internship story article (2-4 paragraphs).

Rules:
- Only use the information provided
- Do not exaggerate or invent details
- Keep the tone natural and first-person

Company: ${data.company}
Role: ${data.role}
Location: ${data.location}
Season: ${data.season}

How they applied: ${data.applicationProcess}
Interview stages: ${data.interviewProcess}
Preparation: ${data.preparation}

Team: ${data.team}
Project: ${data.project}
Technologies: ${data.techStack}
Hardest challenge: ${data.challenge}
Advice: ${data.advice}
`

  try {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        messages: [{ role: "user", content: prompt }],
        stream: false,
        options: { temperature: 0.1 },
      }),
    })

    const result = await response.json()
    res.json({ article: result.message.content })
  } catch (err) {
    console.error("Ollama error:", err.message)
    res.status(500).json({ error: "Failed to generate article. Is Ollama running?" })
  }
})

app.listen(3001, () => {
  console.log("API server running on http://localhost:3001")
})
