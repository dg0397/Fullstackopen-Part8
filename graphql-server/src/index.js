const { ApolloServer, gql } = require('apollo-server')
const { v1 : uuid } = require('uuid')
const mongoose = require('mongoose')

const MONGODB_URI = "mongodb+srv://dionisio_24:GHh7o2ZpgWOfihkl@cluster0.6jg7g.mongodb.net/<dbname>?retryWrites=true&w=majority";

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's name in the context of the book instead of the author's id
 * However, for simplicity, we will store the author's name in connection with the book
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const typeDefs = gql`
  type Query {
    bookCount : Int!
    allBooks( author:String , genre:String ) : [Book!]!
    authorCount : Int!
    allAuthors : [Author!]!
  }
  type Mutation {
    addBook(
      title: String!,
      published: Int!,
      author: String!,
      genres: [String!]! 
    ) : Book
    editAuthor(
      name: String!,
      setBornTo: Int!
    ) : Author
  }
  type Book {
      title : String!
      published : Int!
      author : Author!
      genres : [String!]!
      id : ID!
  }
  type Author {
      name : String!
      born : Int
      id : ID!
      bookCount : Int!
  }
`

const resolvers = {
  Query: {
    bookCount : () => books.length,
    authorCount : () => authors.length,
    allBooks : (root,args) => {
      if(args.author && args.genre){
        const booksByAuthorAndGenre = books.filter(book => book.author === args.author && book.genres.includes(args.genre))
        return booksByAuthorAndGenre
      }
      if(args.author){
        const booksByAuthor = books.filter(book => book.author === args.author)
        return booksByAuthor 
      }if(args.genre){
        const booksByGenre = books.filter(book => book.genres.includes(args.genre))
      return booksByGenre
      }else{
        return books
      }
    },
    allAuthors : () => authors
  },
  Mutation:{
    addBook : (root,args) => {
      const newBook = {...args, id: uuid()}
      if(!authors.find(author => newBook.author === author.name)){
        const newAuthor = {name: newBook.author , id : uuid()}
        authors = authors.concat(newAuthor)
      }
      books = books.concat(newBook)
      return newBook
    },
    editAuthor : (root,args) => {
      const authorToChange = authors.find(author => author.name === args.name)
      if(authorToChange){
        const updatedAuthor = {...authorToChange, born: args.setBornTo}
        authors = authors.map(author => author.name === updatedAuthor.name ? updatedAuthor : author)
        return updatedAuthor
      }
    }
  },
  Author: {
    bookCount : (root) => {
      const writtenBooks = books.filter(book => book.author === root.name)
      return writtenBooks.length
    }
  },
  Book: {
    author : (root) => {
      const selectedAuthor = authors.find(author => author.name === root.author)
      return selectedAuthor
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})