import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
    query{
        allAuthors{
            name
            born
            bookCount
            id
        }
    }
`

export const All_BOOKS = gql`
    query{
        allBooks{
            title
            published
            genres
            author{
                name
                id
            }
            id
        }
    }
`

export const ADD_BOOK = gql`
    mutation addNewBook($title:String!,$published:Int!,$author:String!,$genres:[String!]!){
        addBook(
            title:$title,
            published:$published,
            author:$author,
            genres:$genres
        ){
            title
            published
            author{
                name
                id
            }
            genres
            id
        }
    }
`

export const SET_AUTHOR_BIRTH_YEAR = gql`
    mutation setAuthorsBirthYear($name:String!,$setBornTo:Int!){
        editAuthor(
            name: $name,
            setBornTo : $setBornTo
        ){
            name,
            born,
            bookCount,
            id
        }
    }
`

export const LOGIN = gql`
    mutation login($username:String!,$password:String!){
        login(
            username : $username,
            password : $password
        ){
            value
        }
    }
`