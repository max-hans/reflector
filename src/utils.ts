import OpenAI from "openai";
import { systemPrompt } from "./prompts";
const apiKey = Bun.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey, // This is the default and can be omitted
});

export const generate = async (system: string, user: string) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    model: "gpt-4",
  });

  return chatCompletion.choices[0].message.content;
};
