import React from 'react'

export default function RecipePage() {
  const [ingredients, SetIngredients] = React.useState([])
  const [showAlert, setShowAlert] = React.useState(false)
  const inputRef = React.useRef(null)
  const timeoutRef = React.useRef(null) 

  function removeIngredient(index) {
    SetIngredients(prev => prev.filter((_, i) => i !== index))
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

    SetIngredients(prev => [...prev, newIngredient])
    inputRef.current.value = ''
    inputRef.current.focus()
  }

  function clear(e) {
    e.preventDefault()
    SetIngredients([])
    inputRef.current.value = ''
  }

  console.log(ingredients)

  return (
    <main>
      {showAlert && (
        <div className="alert-slide">
          Invalid input - Only letters and spaces allowed
        </div>
      )}

      <form className="container" action={submit}>
        <div className="search-bar">
          <input
            type="text"
            ref={inputRef}
            aria-label='Add ingredients'
            placeholder="e.g. oregano"
            name="ingredient"
            maxLength={40}
          />
          <button className="add-btn">+ Add ingredient</button>
          <button onClick={clear} className="add-btn clear">
            Clear All
          </button>
        </div>

        <div className="ingredients">
          <h2>Ingredients on hand:</h2>

          {ingredients.length === 0 ? (
            <p>No ingredients yet. Add something!</p>
          ) : (
            <ul>
              {ingredients.map((x, i) => (
                <li className="ingredient-item" key={i}>
                  {x}
                  <button
                    className="delete-btn"
                    onClick={() => removeIngredient(i)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {ingredients.length > 0 && (<div>
          <div className="footer-box">
            <div className="footer-text">
              <p className="title">Ready for a recipe?</p>
              <p className="subtitle">
                Generate a recipe from your list of ingredients.
              </p>
            </div>
            <button className="recipe-btn">Get a recipe</button>
          </div>
        </div>)}
      </form>
    </main>
  )
}
