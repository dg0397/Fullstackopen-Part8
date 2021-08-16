import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import Recommend from './components/RecommendBooks'

const App = () => {
  const [page, setPage] = useState('authors')
  const [error,setError] = useState('')
  const [user,setUser] = useState(null)
 
  useEffect(() => {
    const token = localStorage.getItem('library-user-token')
    if(token){
      setUser(token)
    }
  }, [])

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
              <button onClick={() => setPage('recommend')}>Recommend</button>
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

      {
        user ? 
        (
          <>
            <NewBook
              show={page === 'add'}
              setError = {notify}
            />

            <Recommend 
              show={page === 'recommend'}
            />
          </>
        ) : null
      }
    

      <LoginForm
        show={page === 'login'} 
        setUser = {setUser}
        setError = {setError}
      />

      

    </div>
  )
}

export default App