import { gql } from '@apollo/client'

export const AUTHOR_DETAILS = gql`
    fragment authorDetails on Author {
        name
        born
        bookCount
        id
    }
`
