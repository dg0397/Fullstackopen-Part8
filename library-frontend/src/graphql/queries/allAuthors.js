import { gql } from '@apollo/client'
import { AUTHOR_DETAILS } from '../utils/authordetails'

export const ALL_AUTHORS = gql`
    query{
        allAuthors{
            ...authorDetails
        }
    }
    ${AUTHOR_DETAILS}
`
