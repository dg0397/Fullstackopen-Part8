import { UserInputError, AuthenticationError } from 'apollo-server-errors'

import Author from '../models/author.js'
import Book from '../models/book.js'
import User from '../models/user.js'

import jwt from 'jsonwebtoken'
import { SECRET as JWT_SECRET } from '../utils/config.js'

import { PubSub } from 'graphql-subscriptions'
export const pubsub = new PubSub()

export const typeDef = `
    type Mutation {
        addBook(
          title: String!
          published: Int!
          author: String!
          genres: [String!]!
        ): Book
        editAuthor(name: String!, setBornTo: Int!): Author
        createUser(username: String!, favoriteGenre: String!): User
        login(username: String!, password: String!): Token
    }
`

export const resolvers = {
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      const author = await Author.findOne({ name: args.author })

      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      try {
        if (!author) {
          const newAuthor = new Author({ name: args.author })

          const newBook = new Book({ ...args, author: newAuthor._id })
          newAuthor.bookCount++

          await newAuthor.save()
          await newBook.save()

          const bookToReturn = await Book.findById(newBook._id).populate('author')

          pubsub.publish('BOOK_ADDED', { bookAdded: bookToReturn })

          return bookToReturn
        }
        const newBook = new Book({ ...args, author: author._id })
        author.bookCount++

        await author.save()
        await newBook.save()

        const bookToReturn = await Book.findById(newBook._id).populate('author')

        pubsub.publish('BOOK_ADDED', { bookAdded: bookToReturn })

        return bookToReturn
      } catch (error) {
        console.log(error)
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      const authorToChange = await Author.findOne({ name: args.name })

      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      try {
        if (authorToChange) {
          authorToChange.born = args.setBornTo
          await authorToChange.save()
          return authorToChange
        }
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
    },
    createUser: (root, args) => {
      const user = new User({ ...args })

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  }
}
