import { gql } from '@apollo/client'

export const USER_INFO = gql`
    query{
        me{   
            username
            favoriteGenre
            id    
        }
    }
`
