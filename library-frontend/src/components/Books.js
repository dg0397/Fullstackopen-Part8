import React, { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { All_BOOKS } from '../queries'
import GenreMenu from './GenreMenu'

const Books = (props) => {
  const result = useQuery(All_BOOKS,{ pollInterval : 2000})
  const [genreSelected,setGenreSelected] = useState("all")
  const books = useMemo( ()=> {
    if(result.data){
      return [...result.data.allBooks]
    }
    return []
  },[result.data] )
  let genres = []

  const generateSelectedBooks = ({books,genreSelected}) => {
    if(genreSelected === 'all'){
      return books
    }
    const booksByGenre = books.filter( book => book.genres.includes(genreSelected) ) 
    return  booksByGenre
  }

  const booksToShow = useMemo(()=> generateSelectedBooks({books,genreSelected}),[genreSelected,books])

  const handleClick = ({value}) => {
    console.log(value)
    setGenreSelected(prevState => {
      if(prevState === value){
        return 'all'
      }else{
        return value
      }
    })
  }

  if (!props.show) {
    return null
  }

  if(result.loading){
    return <div>Loading...</div>
  }

  if(books.length >= 0){
    books.forEach(book => {
      book.genres.forEach(genre => genres.push(genre))
    });
    genres = [...new Set(genres)]
  }

  console.log(booksToShow)
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {booksToShow.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>

      <GenreMenu genres = {genres} setGenre = {handleClick} genreSelected = {genreSelected} />
    </div>
  )
}

export default Books