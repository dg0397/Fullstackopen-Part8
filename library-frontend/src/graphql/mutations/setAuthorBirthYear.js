import { gql } from '@apollo/client'
import { AUTHOR_DETAILS } from '../utils/authordetails'

export const SET_AUTHOR_BIRTH_YEAR = gql`
    mutation setAuthorsBirthYear($name:String!,$setBornTo:Int!){
        editAuthor(
            name: $name,
            setBornTo : $setBornTo
        ){
            ...authorDetails
        }
    }
    ${AUTHOR_DETAILS}
`
