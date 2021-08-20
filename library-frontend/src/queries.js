import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
    fragment bookDetails on Book { 
        title
        published
        genres
        author{
            name
            id
        }
        id
    }
`

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

export const ALL_BOOKS = gql`
    query getAllBooks($genre:String){
        allBooks(genre:$genre){
            ...bookDetails
        }
    }
    ${BOOK_DETAILS}
`

export const ADD_BOOK = gql`
    mutation addNewBook($title:String!,$published:Int!,$author:String!,$genres:[String!]!){
        addBook(
            title:$title,
            published:$published,
            author:$author,
            genres:$genres
        ){
            ...bookDetails
        }
    }
    ${BOOK_DETAILS}
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

export const USER_INFO = gql`
    query{
        me{   
            username
            favoriteGenre
            id    
        }
    }
`

export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            ...bookDetails
        }
    }
    ${BOOK_DETAILS}
`