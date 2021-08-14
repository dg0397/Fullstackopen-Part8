import React, { useMemo } from 'react'
import { useQuery,useLazyQuery } from '@apollo/client'
import { USER_INFO, ALL_BOOKS } from '../queries'
import BooksList from './BooksList'

const Recommend = ({show}) => {
    const [getBooks,resultAllBooks] = useLazyQuery(ALL_BOOKS)
    const resultUserInfo = useQuery(USER_INFO,{
        onCompleted: ({me}) => getBooks({variables:{genre:me.favoriteGenre}})
    })
    const booksToShow = useMemo( ()=> {
        if(resultAllBooks.data){
          return [...resultAllBooks.data.allBooks]
        }
        return []
    },[resultAllBooks.data] )
    
    const genreSelected = useMemo(()=>{
        if(resultUserInfo.data){
            return resultUserInfo.data.me.favoriteGenre
        }
        return ''
    },[resultUserInfo.data])
//
    //const generateSelectedBooks = ({books,genreSelected}) => {
    //    if(genreSelected === 'all'){
    //      return books
    //    }
    //    console.log(genreSelected)
    //    const booksByGenre = books.filter( book => book.genres.includes(genreSelected) ) 
    //    console.log(booksByGenre)
    //    return  booksByGenre
    //  }
    //
    //const booksToShow = useMemo(()=> generateSelectedBooks({books,genreSelected}),[genreSelected,books])

    if(!show){
        return null
    }

    if(resultAllBooks.loading){
        return <div>Loading...</div>
    }

    return(
        <div>
            <h2>Recommendations</h2>
            <p>Books in you favorite Genre:{genreSelected}</p>
            <BooksList books = {booksToShow} />
        </div>
    )
}

export default Recommend