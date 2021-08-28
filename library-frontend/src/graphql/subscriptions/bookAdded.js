import { gql } from '@apollo/client'
import { BOOK_DETAILS } from '../utils/bookdetails'

export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            ...bookDetails
        }
    }
    ${BOOK_DETAILS}
`
