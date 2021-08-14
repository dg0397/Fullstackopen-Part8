import React, { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import GenreMenu from './GenreMenu'
import BooksList from './BooksList'

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
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
      <BooksList books = {booksToShow} />
      <GenreMenu genres = {genres} setGenre = {handleClick} genreSelected = {genreSelected} />
    </div>
  )
}

export default Books