import React from 'react'

export default function RecipePage() {
  const [ingredients, setIngredients] = React.useState([])
  const [showAlert, setShowAlert] = React.useState(false)
  const [recipeShown, setRecipeShown] = React.useState(false)
  const inputRef = React.useRef(null)
  const timeoutRef = React.useRef(null) 

  function removeIngredient(index) {
    setIngredients(prev => prev.filter((_, i) => i !== index))
  }

  function toggleRecipeShown() {
    setRecipeShown(prev => !prev)
  }

  function submit(formData) {
    const newIngredient = formData.get('ingredient').trim()

    if (!newIngredient) return

    if (!/^[a-zA-Z\s]+$/.test(newIngredient)) {
      setShowAlert(true)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setShowAlert(false)
      }, 3000)
      return
    }

    setIngredients(prev => [...prev, newIngredient])
    inputRef.current.value = ''
    inputRef.current.focus()
  }

  function clear(e) {
    e.preventDefault()
    setIngredients([])
    inputRef.current.value = ''
    inputRef.current.focus()
  }

  return (
    <main>
      <div className="container">
        {showAlert && (
          <div className="alert-slide">
            Invalid input - Only letters and spaces allowed
          </div>
        )}

        {ingredients.length < 4 && ingredients.length > 0 && (
          <p className="ingredients-alert">
            You need at least 4 ingredients to generate a recipe. 
            {4 - ingredients.length} more to go!
          </p>
        )}

        <form action={submit}>
          <div className="search-bar">
            <input
              type="text"
              ref={inputRef}
              aria-label="Add ingredients"
              placeholder="e.g. oregano, chicken, tomatoes..."
              name="ingredient"
              maxLength={40}
            />
            <button type="submit" className="add-btn">
              + Add Ingredient
            </button>
            <button onClick={clear} className="add-btn clear">
              Clear All
            </button>
          </div>
        </form>

        <div className="ingredients">
          <h2>Ingredients on hand:</h2>

          {ingredients.length === 0 ? (
            <p>No ingredients yet. Add something to get started!</p>
          ) : (
            <ul>
              {ingredients.map((ingredient, index) => (
                <li className="ingredient-item" key={index}>
                  <span>{ingredient}</span>
                  <button
                    className="delete-btn"
                    onClick={() => removeIngredient(index)}
                    aria-label={`Remove ${ingredient}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {ingredients.length >= 4 && (
          <div className="footer-box">
            <div className="footer-text">
              <p className="title">Ready for a recipe?</p>
              <p className="subtitle">
                Generate a delicious recipe using your {ingredients.length} ingredients.
              </p>
            </div>
            <button className="recipe-btn" onClick={toggleRecipeShown}>
              {recipeShown ? 'Hide Recipe' : 'Get Recipe'}
            </button>
          </div>
        )}

        {recipeShown && ingredients.length >= 4 && (
          <div className="recipe-display">
            <h3>Your Recipe</h3>
            <p>Recipe content will appear here...</p>
          </div>
        )}
      </div>
    </main>
  )
}