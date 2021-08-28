import { gql } from '@apollo/client'
import { BOOK_DETAILS } from '../utils/bookdetails'

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
