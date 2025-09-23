export function RecipePage() {
  return (
    <div className="container">
      <div className="search-bar">
        <input type="text" placeholder="e.g. oregano" />
        <button className="add-btn">+ Add ingredient</button>
      </div>

      <div className="ingredients">
        <h2>Ingredients on hand:</h2>
        <ul>
          
        </ul>
      </div>
    </div>
  );
}
