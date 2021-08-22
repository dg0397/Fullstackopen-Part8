import { PubSub } from 'graphql-subscriptions';
const pubsub = new PubSub()

export const typeDef = `
    type Subscription {
        bookAdded: Book!
    }
`;

export const resolvers = {
    Subscription: {
        bookAdded: {
          subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
        },
    }
}