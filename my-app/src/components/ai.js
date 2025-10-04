const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are a creative chef assistant. The user will give you a list of ingredients they have. 
Suggest a delicious recipe using some or all of those ingredients.
You can suggest additional common ingredients, but try to minimize them.
Format your response in clean markdown with clear sections.
Make it friendly and encouraging!`;

export async function getRecipeFromAI(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ");

  try {
    console.log("Sending to Groq AI:", ingredientsString);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // 🚨 UPDATED MODEL - CURRENT & WORKING
        messages: [
          { 
            role: "system", 
            content: SYSTEM_PROMPT 
          },
          { 
            role: "user", 
            content: `I have these ingredients: ${ingredientsString}. Can you suggest a recipe I can make with them? Please provide ingredients and instructions.` 
          }
        ],
        max_tokens: 1024,
        temperature: 0.7,
        top_p: 0.9,
        stream: false
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Groq Response:", data);
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response format from Groq API");
    }
    
    return data.choices[0].message.content;
    
  } catch (err) {
    console.error("AI Error:", err);
    
    if (err.name === 'AbortError') {
      return "⏰ AI is taking too long to respond. Try again with fewer ingredients!";
    }
    
    // Creative fallback recipes
    const fallbackRecipes = [
      `**🍳 Quick ${ingredientsArr[0]} Recipe**\n\nSauté ${ingredientsArr.join(' and ')} with olive oil, garlic, and herbs. Serve hot! 🌟\n\n*Pro tip: Add your favorite spices for extra flavor!*`,
      `**👨‍🍳 Chef's ${ingredientsArr[1]} Creation**\n\nCombine ${ingredientsArr.join(', ')} in a baking dish. Roast at 400°F until golden and delicious! 🎯`,
      `**✨ ${ingredientsArr.length}-Ingredient Wonder**\n\nMix ${ingredientsArr.join(' with ')}. Add seasoning to taste and cook to perfection! 🏆\n\n*Cooking is an adventure - you've got this!*`
    ];
    
    return fallbackRecipes[Math.floor(Math.random() * fallbackRecipes.length)];
  }
}