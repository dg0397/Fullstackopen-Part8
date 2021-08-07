import React,{ useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { SET_AUTHOR_BIRTH_YEAR } from '../queries'

const AuthorBirdYearForm = () => {
    const [ setAuthorsBirthYear , result ] = useMutation(SET_AUTHOR_BIRTH_YEAR)
    const [name,setName] = useState('')
    const [year,setYear] = useState('')

    

    const handleSubmit = (e) => {
        e.preventDefault()

        setAuthorsBirthYear({
            variables : {
                name,
                setBornTo : Number(year)
            }
        })

        setName('')
        setYear('')
    }

    return (
        <div>
            <h3>Set BirthYear</h3>
            <form onSubmit = {handleSubmit}>
                <div>
                    Name:
                    <input
                        value = {name}
                        onChange = {({target}) => setName(target.value)} 
                    />
                </div>
                <div>
                    Born:
                    <input
                        value = {year}
                        onChange = {({target}) => setYear(target.value)}
                        type = 'number'
                    />
                </div>
                <button type = 'submit'>Update Author</button>
            </form>
        </div>
    )
}

export default AuthorBirdYearForm