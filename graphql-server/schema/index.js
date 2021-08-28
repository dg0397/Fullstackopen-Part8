import { makeExecutableSchema } from '@graphql-tools/schema'
import merge from 'lodash.merge'

import { typeDef as BookType } from './book.js'
import { typeDef as AuthorType } from './author.js'
import { typeDef as User } from './user.js'
import { typeDef as Mutation, resolvers as mutationResolvers } from './mutation.js'
import { typeDef as Subscription, resolvers as subscriptionResolvers } from './subscription.js'
import { typeDef as Token } from './token.js'

import Author from '../models/author.js'
import Book from '../models/book.js'

const Query = `
  type Query {
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    authorCount: Int!
    allAuthors: [Author!]!
    me: User
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author })
        const booksByAuthorAndGenre = await Book.find({
          author: author._id,
          genres: { $in: [args.genre] }
        }).populate('author')
        return booksByAuthorAndGenre
      }
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        const booksByAuthor = await Book.find({ author: author._id }).populate('author')
        return booksByAuthor
      }
      if (args.genre) {
        const booksByGenre = await Book.find({ genres: { $in: [args.genre] } }).populate('author')
        return booksByGenre
      } else {
        return Book.find({}).populate('author')
      }
    },
    allAuthors: () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  }
}

const typeDefs = [Query, Mutation, Subscription, BookType, AuthorType, User, Token]

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: merge(resolvers, mutationResolvers, subscriptionResolvers)
})

export default schema
