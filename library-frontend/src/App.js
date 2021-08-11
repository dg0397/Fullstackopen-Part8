import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Notify from './components/Notify'

const App = () => {
  const [page, setPage] = useState('authors')
  const [error,setError] = useState('')
  const [user,setUser] = useState(null)
 
  const notify = (message) => {
    setError(message)
    setTimeout(() => {
      setError(null)
    }, 10000)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {
          user ?  (
            <>
              <button onClick={() => setPage('add')}>add book</button>
              <button onClick={() => setUser(null)}>LogOut</button>
            </>
          ) : (
            <button onClick = {() => setPage('login')}>Login</button>
          )
        }
      </div>

      <Notify message = {error} />

      <Authors
        show={page === 'authors'}
        setError = {notify}
        user = {user}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
        setError = {notify}
      />

      <LoginForm
        show={page === 'login'} 
        setUser = {setUser}
        setError = {setError}
      />

      

    </div>
  )
}

export default App