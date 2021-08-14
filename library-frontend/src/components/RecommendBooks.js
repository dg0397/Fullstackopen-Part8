import React, { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { USER_INFO, ALL_BOOKS } from '../queries'
import BooksList from './BooksList'

const Recommend = ({show}) => {
    const resultUserInfo = useQuery(USER_INFO)
    const resultAllBooks = useQuery(ALL_BOOKS)
    const books = useMemo( ()=> {
        if(resultAllBooks.data){
          return [...resultAllBooks.data.allBooks]
        }
        return []
    },[resultAllBooks.data] )
    console.log(resultUserInfo)
    console.log(resultAllBooks)

    const genreSelected = useMemo(()=>{
        if(resultUserInfo.data){
            return resultUserInfo.data.me.favoriteGenre
        }
        return ''
    },[resultUserInfo.data])

    const generateSelectedBooks = ({books,genreSelected}) => {
        if(genreSelected === 'all'){
          return books
        }
        console.log(genreSelected)
        const booksByGenre = books.filter( book => book.genres.includes(genreSelected) ) 
        console.log(booksByGenre)
        return  booksByGenre
      }
    
    const booksToShow = useMemo(()=> generateSelectedBooks({books,genreSelected}),[genreSelected,books])
    

    if(!show){
        return null
    }

    if(resultAllBooks.loading){
        return <div>Loading...</div>
    }
    console.log(books)
    console.log(booksToShow)
    console.log(genreSelected)

    return(
        <div>
            <h2>Recommendations</h2>
            <p>Books in you favorite Genre:{genreSelected}</p>
            <BooksList books = {booksToShow} />
        </div>
    )
}

export default Recommend