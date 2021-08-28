import React, { useEffect, useMemo, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ALL_BOOKS } from '../graphql/queries/allBooks'
import GenreMenu from './GenreMenu'
import BooksList from './BooksList'

const Books = (props) => {
  const [getBooks, result] = useLazyQuery(ALL_BOOKS, { fetchPolicy: 'cache-and-network' })
  const [allBooks, setAllBooks] = useState([])
  const [genreSelected, setGenreSelected] = useState('all')

  useEffect(() => {
    if (genreSelected === 'all') {
      getBooks()
    } else {
      getBooks({ variables: { genre: genreSelected } })
    }
  }, [getBooks, genreSelected])

  useEffect(() => {
    if (result.data) {
      if (result.data.allBooks.length > allBooks.length) {
        console.log('updating book list')
        setAllBooks(prevState => [...result.data.allBooks])
      }
    }
  }, [result.data, allBooks])
  let genres = []

  const generateSelectedBooks = ({ allBooks, genreSelected, result }) => {
    if (genreSelected === 'all') {
      return allBooks
    } if (result.data) {
      return result.data.allBooks
    }
    return []
  }

  const booksToShow = useMemo(() => generateSelectedBooks({ allBooks, genreSelected, result }), [genreSelected, allBooks, result])

  console.log(result)

  const handleClick = ({ value }) => {
    console.log(value)
    setGenreSelected(prevState => {
      if (prevState === value) {
        return 'all'
      } else {
        return value
      }
    })
  }

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>Loading...</div>
  }

  if (allBooks.length >= 0) {
    allBooks.forEach(book => {
      book.genres.forEach(genre => genres.push(genre))
    })
    genres = [...new Set(genres)]
  }

  console.log(booksToShow)
  return (
    <div>
      <h2>books</h2>
      <BooksList books={booksToShow} />
      <GenreMenu genres={genres} setGenre={handleClick} genreSelected={genreSelected} />
    </div>
  )
}

export default Books
