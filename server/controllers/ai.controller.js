import OpenAI from "openai";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;

    const response = AI.chat.completions.create({
      model: "gemini-2.5-flash",
      reasoning_effort: "low",
      messages: [
        {
          role: "user",
          content: "Explain to me how AI works",
        },
      ],
      temperature: 0.7,
      max_token: length,
    });
    
    const content=response.choices[0].message.content;

    await sql `INSERT INTO creations (user_id, prompt, content, type)
    VALUES (${userId}, ${prompt}, ${content}, article)`

    res.json({success:true, content});
  } catch (error) {
    res.json({success:false, messsge:error.message});
  }
};
