import React,{ useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../queries";

const LoginForm = ({setError,setUser,show}) => {
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    
    const [ login , result ] = useMutation(LOGIN,{
        onError : (error) => setError(error.graphQLErrors[0].message)
    }) 

    useEffect(()=>{
        if(result.data){
            const token = result.data.login.value
            setUser(token)
            localStorage.setItem('library-user-token', token)
        }
    },[result.data,setUser])

    const handleSubmit = (e) => {
        e.preventDefault()

        login({variables : {username,password}})

        setUsername('')
        setPassword('')

    }

    if(!show){
        return null
    }
    return(
        <div>
            <form onSubmit = {handleSubmit}>
                <div>
                    Username: 
                    <input
                        value = {username} 
                        onChange = {({target}) => setUsername(target.value)}
                        type = "text"
                    />
                </div>
                <div>
                    Password: 
                    <input
                        value = {password} 
                        onChange = {({target}) => setPassword(target.value)}
                        type = "password"
                    />
                </div>
                <button type = 'submit'>Login</button>
            </form>
        </div>
    )
}

export default LoginForm