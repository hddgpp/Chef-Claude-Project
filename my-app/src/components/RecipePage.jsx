import React, { useRef } from 'react'

export default function RecipePage() {
    const [ingredients, SetIngredients] = React.useState([])
    const inputRef = useRef(null)
    const List = ingredients.map(x => {
    return(
      <li key={x}>{x}</li>
    )
   })

   function removeIngredient(index) {
  SetIngredients(prev => prev.filter((_, i) => i !== index));
}

   function submit(e) {
     e.preventDefault();

     const formData = new FormData(e.currentTarget)
     const newIngredient = formData.get('ingredient').trim()

      if (!newIngredient) return;
      if (!/^[a-zA-Z\s]+$/.test(newIngredient)) {
      alert("Invalid input");
      return;
    }

    SetIngredients(prev => [...prev, newIngredient])

    inputRef.current.value = ''
    inputRef.current.focus()
   }

   function clear(e) {
    e.preventDefault();
    SetIngredients([])
    inputRef.current.value = ''
   }

  
  return (
    <main>
        <form  className="container" onSubmit={submit}>
            <div className="search-bar">
                <input type="text" ref={inputRef} placeholder="e.g. oregano" name="ingredient"/>
                <button className="add-btn" >+ Add ingredient</button>
                <button onClick={clear} className="add-btn clear">Clear All</button>
            </div>

            <div className="ingredients">
                <h2>Ingredients on hand:</h2>

                {ingredients.length === 0 ? (
                  <p>No ingredients yet. Add something!</p>
                ) : (
                  <ul>
                    {ingredients.map((x, i) => (
                       <li className='ingredient-item' key={i}>
                        {x}
                        <button className="delete-btn" onClick={() => removeIngredient(i)}>✕</button>
                       </li>
                    ))}
                  </ul>
                )}
            </div>
            <div>
            <div className="footer-box">
                <div className="footer-text">
                    <p className="title">Ready for a recipe?</p>
                    <p className="subtitle">Generate a recipe from your list of ingredients.</p>
                </div>
                <button className="recipe-btn">Get a recipe</button>
             </div>
        </div>
        </form>
    </main>
  );
}
