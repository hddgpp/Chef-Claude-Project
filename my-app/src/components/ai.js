import { HfInference } from '@huggingface/inference';

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. 
You don't need to use every ingredient they mention in your recipe. 
The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. 
Format your response in markdown to make it easier to render to a web page.
`;

const HF_ACCESS_TOKEN = import.meta.env.local.VITE_HF_ACCESS_TOKEN;
const hf = new HfInference(HF_ACCESS_TOKEN);

export async function getRecipeFromAI(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ");

  try {
    console.log("Sending to AI:", ingredientsString);
    
    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout
    
    const response = await hf.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `I have ${ingredientsString}. Please give me a recipe!` },
      ],
      max_tokens: 800,
    }, { signal: controller.signal });

    clearTimeout(timeoutId);
    console.log("AI Response:", response);
    return response.choices[0].message.content;
    
  } catch (err) {
    console.error("AI Error:", err);
    if (err.name === 'AbortError') {
      return "AI is taking too long to respond. Try again or use fewer ingredients.";
    }
    return `Demo: Recipe for ${ingredientsArr.join(', ')} - Mix and cook!`;
  }
}