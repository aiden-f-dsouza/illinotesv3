import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function summarizeNote(
  title: string,
  body: string,
  classCode: string
): Promise<string> {
  const prompt = `Summarize the following class notes for a UIUC student studying ${classCode}.

Title: ${title}

Notes:
${body.slice(0, 12000)}

Provide a clear, structured summary with:
1. **Key Concepts** (bullet points of the most important ideas)
2. **Summary** (2-3 sentence overview)
3. **Study Tips** (1-2 specific suggestions for remembering this material)

Keep it concise and student-friendly.`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 600,
    temperature: 0.5,
  })

  return response.choices[0]?.message?.content || "Unable to generate summary."
}
