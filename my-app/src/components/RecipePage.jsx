import React from 'react'
import RecipeDisplay from "./RecipeDisplay"; 
import {getRecipeFromAI} from './ai.js'

export default function RecipePage() {
  const [ingredients, setIngredients] = React.useState([])
  const [showAlert, setShowAlert] = React.useState(false)
  const [recipeShown, setRecipeShown] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const inputRef = React.useRef(null)
  const timeoutRef = React.useRef(null) 
  const recipeSectionRef = React.useRef(null)
  const hasScrolledRef = React.useRef(false) // NEW: Track if we've auto-scrolled

  function removeIngredient(index) {
    setIngredients(prev => prev.filter((_, i) => i !== index))
  }

  // NEW: Auto-scroll when button appears (when ingredients reach 4)
  React.useEffect(() => {
    if (ingredients.length >= 4 && !hasScrolledRef.current) {
      setTimeout(() => {
        recipeSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        })
        hasScrolledRef.current = true
      }, 300)
    }
  }, [ingredients.length])

  async function GetRecipe() {
    if (recipeShown) {
      // If recipe is already shown, just hide it
      setRecipeShown('')
      return
    }

    setIsLoading(true)
    setRecipeShown('')
    
    // NEW: Also scroll when clicking the button
    setTimeout(() => {
      recipeSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }, 100)
    
    const generatedRecipe = await getRecipeFromAI(ingredients)
    setRecipeShown(generatedRecipe)
    setIsLoading(false)
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
    setRecipeShown('')
    hasScrolledRef.current = false // NEW: Reset scroll tracking
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
          <div className="footer-box" ref={recipeSectionRef}>
            <div className="footer-text">
              <p className="title">Ready for a recipe?</p>
              <p className="subtitle">
                Generate a delicious recipe using your {ingredients.length} ingredients.
              </p>
            </div>
            <button 
              className="recipe-btn" 
              onClick={GetRecipe}
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : (recipeShown ? 'Hide Recipe' : 'Get Recipe')}
            </button>
          </div>
        )}

        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>AI is cooking up your recipe...</p>
          </div>
        )}

        {recipeShown && !isLoading && ingredients.length >= 4 && (
           <RecipeDisplay ingredients={ingredients} recipeShown={recipeShown}/>
        )}
      </div>
    </main>
  )
}