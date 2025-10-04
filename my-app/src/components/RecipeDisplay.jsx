import React from "react";

export default function RecipeDisplay(props) {
  return (
    <div className="recipe-display">
      <h3>Your Recipe</h3>
      {props.recipeShown}
    </div>
  );
}
