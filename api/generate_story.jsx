export default async function handler(req, res) {
  const data = req.body;

  const prompt = `
Rewrite internship survey responses into a short internship story.

Rules:
- Only use the information provided
- Do not exaggerate
- Keep tone natural

Company: ${data.company}
Role: ${data.role}
Location: ${data.location}
Season: ${data.season}

Application: ${data.application}
Interview stages: ${data.interviews}
Preparation: ${data.preparation}

Team: ${data.team}
Project: ${data.project}
Technologies: ${data.technologies}
Hardest challenge: ${data.challenge}
Advice: ${data.advice}
`;

  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3",
      messages: [{ role: "user", content: prompt }],
      options: { temperature: 0.1 },
    }),
  });

  const result = await response.json();

  res.status(200).json({
    article: result.message.content,
  });
}