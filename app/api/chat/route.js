import OpenAI from "openai";

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { message } = await request.json();

    const response = await openAi.chat.completions.create({
      model: "gpt-5-mini-2025-08-07",
      messages: [{ role: "user", content: message }],
    });

    return Response.json({
      content: response.choices[0].message.content,
    });
  } catch (error) {
    return Response.json(
      {
        error: "Failed to process request",
      },
      {
        status: 500,
      },
    );
  }
}
