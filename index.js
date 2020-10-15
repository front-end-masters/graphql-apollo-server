const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Book {
    title: String
    author: Author
  }
  
  type Author {
    name: String
  }

  type Query {
    books: [Book]
    authors: [Author]
  }
  
  type Mutation {
    addBook(input: BookInput): Book
    addAuthor(name: String): Author
  }

  input AuthorInput {
    name: String
  }

  input BookInput {
    author: AuthorInput
    title: String
  }
`;

const books = [{
  title: 'The Awakening',
}, {
  title: 'City of Glass',
}];

const authors = [{
  name: 'Kate Chopin',
}, {
  name: 'Paul Auster',
}];

books.forEach((book, i) => {
  book.author = authors[i];
})

const resolvers = {
  Query: {
    books: () => books,
    authors: () => authors,
  },
  // https://www.apollographql.com/docs/tutorial/resolvers/#the-resolver-function-signature
  Mutation: {
    addAuthor: (parent, args, context, info) => {
      console.log(args);
      
      const author = {
        name: args.name
      };
      authors.push(author);
      return author;
    },
    addBook: (parent, args, context, info) => {
      const { author, title } = args.input;
      const authorObj = authors.find(a => a.name === author.name);

      if (!authorObj) {
        authors.push(author);
      }

      const book = {
        title,
        author: authorObj || author,
      };

      books.push(book);

      return book;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
