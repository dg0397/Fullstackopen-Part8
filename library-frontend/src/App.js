import React, { useState, useEffect } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'

import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import Recommend from './components/RecommendBooks'

// import { ALL_BOOKS, BOOK_ADDED } from './queries'
import { ALL_BOOKS } from './graphql/queries/allBooks'
import { BOOK_ADDED } from './graphql/subscriptions/bookAdded'

const App = () => {
  const [page, setPage] = useState('authors')
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    const token = window.localStorage.getItem('library-user-token')
    if (token) {
      setUser(token)
    }
  }, [])

  const notify = (message) => {
    setError(message)
    setTimeout(() => {
      setError(null)
    }, 10000)
  }

  const logout = () => {
    setUser(null)
    window.localStorage.clear()
    client.resetStore()
  }

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => set.map(p => p.id).includes(object.id)

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook) }
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      console.log(addedBook)
      notify(`${addedBook.title} added`)
      updateCacheWith(addedBook)
    }
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {
          user
            ? (
              <>
                <button onClick={() => setPage('add')}>add book</button>
                <button onClick={() => setPage('recommend')}>Recommend</button>
                <button onClick={logout}>LogOut</button>
              </>
              )
            : (
              <button onClick={() => setPage('login')}>Login</button>
              )
        }
      </div>

      <Notify message={error} />

      <Authors
        show={page === 'authors'}
        setError={notify}
        user={user}
      />

      <Books
        show={page === 'books'}
      />

      {
        user
          ? (
            <>
              <NewBook
                show={page === 'add'}
                setError={notify}
              />

              <Recommend
                show={page === 'recommend'}
              />
            </>
            )
          : null
      }

      <LoginForm
        show={page === 'login'}
        setUser={setUser}
        setError={setError}
      />

    </div>
  )
}

export default App
