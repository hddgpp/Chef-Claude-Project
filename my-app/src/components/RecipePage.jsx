import React from 'react'

export default function RecipePage() {
    const [ingredients, SetIngredients] = React.useState([])
    const List = ingredients.map(x => {
    return(
      <li key={x}> {x}</li>
    )
   })

   function submit(e) {
    SetIngredients(prev => [...prev, newIngredient])

     e.preventDefault();
     const formData = new FormData(e.currentTarget)
     const newIngredient = formData.get('ingredient')

   }

  
  return (
    <main>
        <form  className="container" onSubmit={submit}>
            <div className="search-bar">
                <input type="text" placeholder="e.g. oregano" name="ingredient"/>
                <button className="add-btn" >+ Add ingredient</button>
                <button className="add-btn clear">Clear All</button>
            </div>

            <div className="ingredients">
                <h2>Ingredients on hand:</h2>
                <ul>
                    {List}
                </ul>
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
