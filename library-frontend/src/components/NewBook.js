import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_BOOK } from '../graphql/mutations/addBook'

const NewBook = ({ show, setError }) => {
  const [addNewBook] = useMutation(ADD_BOOK, {
    onError: (error) => { setError(error.graphQLErrors[0].message) }
    // update:(store,response) =>{
    //  const dataInStore = store.readQuery({query:ALL_BOOKS})
    //  store.writeQuery({
    //    query:ALL_BOOKS,
    //    data:{
    //      ...dataInStore,
    //      allBooks : [...dataInStore.allBooks,response.data.addBook]
    //    }
    //  })
    // }
  })

  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    addNewBook({
      variables: {
        title,
        author,
        published: Number(published),
        genres
      }
    })
    console.log('add book...')

    setTitle('')
    setPublished('')
    setAuhtor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type='button'>add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook
