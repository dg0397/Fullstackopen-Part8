import { pubsub } from './mutation.js'

export const typeDef = `
    type Subscription {
        bookAdded: Book!
    }
`

export const resolvers = {
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}
