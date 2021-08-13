import React, { useMemo} from 'react'
import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import AuthorBirdYearForm from './SetAuthorBirthYearForm'

const Authors = ({show,setError,user}) => {
  const result = useQuery(ALL_AUTHORS, { pollInterval: 2000 })
  const authors = useMemo( ()=> {
    if(result.data){
      return [...result.data.allAuthors]
    }
    return []
  },[result.data] )

  if (!show) {
    return null
  }

  if (result.loading) {
    return <p>Loading...</p>
  }

  return (
    <>
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>
                born
              </th>
              <th>
                books
              </th>
            </tr>
            {authors.map(a =>
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
      { user && <AuthorBirdYearForm authors = {authors} setError = {setError}/>}
    </>
  )
}

export default Authors
