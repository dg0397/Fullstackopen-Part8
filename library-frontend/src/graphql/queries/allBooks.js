import { gql } from '@apollo/client'
import { BOOK_DETAILS } from '../utils/bookdetails'

export const ALL_BOOKS = gql`
    query getAllBooks($genre:String){
        allBooks(genre:$genre){
            ...bookDetails
        }
    }
    ${BOOK_DETAILS}
`
