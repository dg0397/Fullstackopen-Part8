import { ApolloServer, gql, UserInputError } from 'apollo-server-express'
import express from 'express'
//const { v1: uuid } = require("uuid");

import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';

import Author from '../models/author.js';
import Book from '../models/book.js';
import User from '../models/user.js';

import jwt from 'jsonwebtoken'
const JWT_SECRET = 'graphql_library'

import { PubSub } from 'graphql-subscriptions';
const pubsub = new PubSub()

import mongoose from 'mongoose';
const MONGODB_URI =
  "mongodb+srv://dionisio_24:GHh7o2ZpgWOfihkl@cluster0.6jg7g.mongodb.net/books_graphql?retryWrites=true&w=majority";


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
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
];

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
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "The Demon ",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
];

const typeDefs = gql`
  type Query {
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    authorCount: Int!
    allAuthors: [Author!]!
    me: User
  }
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
  type Subscription {
    bookAdded: Book!
  } 
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }
  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
  }
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author });
        const booksByAuthorAndGenre = await Book.find({
          author: author._id,
          genres: { $in: [args.genre] },
        });
        return booksByAuthorAndGenre;
      }
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        const booksByAuthor = await Book.find({ author: author._id });
        return booksByAuthor;
      }
      if (args.genre) {
        const booksByGenre = await Book.find({ genres: { $in: [args.genre] } });
        return booksByGenre;
      } else {
        return Book.find({});
      }
    },
    allAuthors: () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      const author = await Author.findOne({ name: args.author });

      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      try {
        if (!author) {
          const newAuthor = new Author({ name: args.author });
          await newAuthor.save();

          const newBook = new Book({ ...args, author: newAuthor._id });
          await newBook.save();

          pubsub.publish('BOOK_ADDED', { bookAdded: newBook })

          return newBook;
        }
        const newBook = new Book({ ...args, author: author._id });
        await newBook.save();
        
        pubsub.publish('BOOK_ADDED', { bookAdded: newBook })
        
        return newBook;
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      const authorToChange = await Author.findOne({ name: args.name });

      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      try {
        if (authorToChange) {
          authorToChange.born = args.setBornTo;
          await authorToChange.save();
          return authorToChange;
        }
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
    createUser: (root, args) => {
      const user = new User({...args})
  
      return user.save()
      .catch(error => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new UserInputError("wrong credentials")
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  },
  Author: {
    bookCount: async (root) => {
      const writtenBooks = await Book.find({ author: root._id });
      return writtenBooks.length;
    },
  },
  Book: {
    author: async (root) => {
      const selectedAuthor = await Author.findById(root.author);
      return selectedAuthor;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
});

//server.listen().then(({ url, subscriptionsUrl }) => {
//  console.log(`Server ready at ${url}`)
//  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
//})

async function startApolloServer(typeDefs, resolvers) {

  // Same ApolloServer initialization as before
  //const server = new ApolloServer({ 
  //  typeDefs, 
  //  resolvers,
  //  context: async ({ req }) => {
  //    const auth = req ? req.headers.authorization : null
  //    if (auth && auth.toLowerCase().startsWith('bearer ')) {
  //      const decodedToken = jwt.verify(
  //        auth.substring(7), JWT_SECRET
  //      )
  //      const currentUser = await User.findById(decodedToken.id)
  //      return { currentUser }
  //    }
  //  } 
  //});

  // Required logic for integrating with Express
  const app = express();
  const httpServer = createServer(app);
  const schema = makeExecutableSchema({ 
    typeDefs, 
    resolvers, 
  });
  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        const decodedToken = jwt.verify(
          auth.substring(7), JWT_SECRET
        )
        const currentUser = await User.findById(decodedToken.id)
        return { currentUser }
      }
    } 
  });
  await server.start();
  server.applyMiddleware({
     app,

     // By default, apollo-server hosts its GraphQL endpoint at the
     // server root. However, *other* Apollo Server packages host it at
     // /graphql. Optionally provide this to match apollo-server.
     path: '/'
  });
  const subscriptionServer = SubscriptionServer.create({
    // This is the `schema` we just created.
    schema,
    // These are imported from `graphql`.
    execute,
    subscribe,
 }, {
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // This `server` is the instance returned from `new ApolloServer`.
    path: server.graphqlPath,
 });
 
 // Shut down in the case of interrupt and termination signals
 // We expect to handle this more cleanly in the future. See (#5074)[https://github.com/apollographql/apollo-server/issues/5074] for reference.
 ['SIGINT', 'SIGTERM'].forEach(signal => {
   process.on(signal, () => subscriptionServer.close());
 });

  // Modified server startup
  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:4000${server.graphqlPath}`)
}

startApolloServer(typeDefs,resolvers)