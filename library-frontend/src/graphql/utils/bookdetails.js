import { gql } from '@apollo/client'

export const BOOK_DETAILS = gql`
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
