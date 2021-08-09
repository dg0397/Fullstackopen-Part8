import React,{ useState } from 'react'
import { useMutation } from '@apollo/client'
import { SET_AUTHOR_BIRTH_YEAR } from '../queries'
import Select from 'react-select'

const AuthorBirdYearForm = ({ authors }) => {
    const [ setAuthorsBirthYear , ] = useMutation(SET_AUTHOR_BIRTH_YEAR)
    const [selectedName,setSelectedName] = useState(null)
    const [year,setYear] = useState('')

    const authorsOptions = authors.map(author => ({value : author.name , label : author.name}))
    

    const handleSubmit = (e) => {
        e.preventDefault()

        setAuthorsBirthYear({
            variables : {
                name:selectedName.value,
                setBornTo : Number(year)
            }
        })

        setSelectedName(null)
        setYear('')
    }

    return (
        <div>
            <h3>Set BirthYear</h3>
            <form onSubmit = {handleSubmit}>
                <div>
                    Name:
                    <Select
                        defaultValue = {selectedName}
                        onChange = {setSelectedName}
                        options = {authorsOptions} 
                        placeholder = "Select an Author"
                        value = {selectedName}
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