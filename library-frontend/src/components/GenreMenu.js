import React from 'react'

const GenreMenu = ({genres,setGenre,genreSelected}) => {
    console.log(genreSelected)
    return(
        <div>
            {
                genres.map( genre => (
                    <button 
                        key = {genre} 
                        onClick = { ()=> setGenre({value:genre}) } 
                        style = { genreSelected === genre ? { backgroundColor : 'red' } : null }>
                        {genre}
                    </button>
                ))
            }
            <button onClick = {() => setGenre({value : 'all'})} >All Genres</button>
        </div>
    )
}

export default GenreMenu