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
            author{
                name
            }
            id
        }
    }
`