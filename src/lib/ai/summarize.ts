import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function summarizeNote(
  body: string,
  classCode?: string
): Promise<string> {
  const courseContext = classCode
    ? `These are notes from a UIUC course: ${classCode}. Tailor your summary to the subject area and level of that course.`
    : `These are class notes from a UIUC student.`

  const systemPrompt = `You are an expert academic tutor who creates thorough, well-structured note summaries for university students. ${courseContext}

Your summaries should use markdown formatting and be detailed enough that a student could use them to review for an exam. Do NOT be overly brief — expand on important ideas and connections between concepts.`

  const userPrompt = `Summarize the following class notes:

${body.slice(0, 12000)}

Structure your summary with the following sections:

## Key Concepts
For each major concept, provide a bullet point with a **bolded term** followed by a clear, detailed explanation (2-3 sentences each). Include how concepts relate to each other where relevant.

## Detailed Summary
A thorough 4-6 sentence overview of the material covered. Explain the main themes, how they connect, and why they matter in the broader context of the subject.

## Important Details & Formulas
Any specific definitions, formulas, theorems, dates, or factual details worth memorizing. Use bullet points.

## Study Tips
2-3 actionable suggestions for understanding and retaining this material, specific to the content (not generic advice).`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 1500,
    temperature: 0.5,
  })

  return response.choices[0]?.message?.content || "Unable to generate summary."
}
