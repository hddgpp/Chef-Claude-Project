import React from "react";

export default function RecipeDisplay(props) {
  // NEW: Clean markdown code blocks
  const cleanRecipeText = (text) => {
    return text.replace(/```markdown|```/g, '').trim();
  };

  const formatRecipeText = (text) => {
    const cleanedText = cleanRecipeText(text);
    
    return cleanedText.split('\n').map((line, index) => {
      // Handle headers (lines that start with #)
      if (line.startsWith('#')) {
        const level = line.match(/^#+/)[0].length;
        const content = line.replace(/^#+\s*/, '');
        return React.createElement(`h${Math.min(level, 6)}`, { 
          key: index,
          className: `recipe-heading level-${level}`
        }, content);
      }
      
      // Handle bold text (**text**)
      const boldRegex = /\*\*(.*?)\*\*/g;
      if (boldRegex.test(line)) {
        const parts = line.split(boldRegex);
        return (
          <p key={index} className="recipe-paragraph">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </p>
        );
      }
      
      // Handle list items (lines that start with - or *)
      if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        return (
          <li key={index} className="recipe-list-item">
            {line.replace(/^[-`*]\s*/, '')}
          </li>
        );
      }
      
      // Regular paragraphs
      if (line.trim()) {
        return (
          <p key={index} className="recipe-paragraph">
            {line}
          </p>
        );
      }
      
      // Empty lines (add spacing)
      return <br key={index} />;
    });
  };

  return (
    <div className="recipe-display">
      <h3>✨ Your AI-Generated Recipe</h3>
      <div className="recipe-content">
        {formatRecipeText(props.recipeShown)}
      </div>
    </div>
  );
}