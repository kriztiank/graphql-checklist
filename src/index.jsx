import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  // useQuery,
  // gql,
} from '@apollo/client'

// Hasura backend
// https://react-todo-graphql-online.herokuapp.com/console

const client = new ApolloClient({
  uri: 'https://react-todo-graphql-online.herokuapp.com/v1/graphql',
  cache: new InMemoryCache(),
})

// client
//   .query({
//     query: gql`
//       query getTodos {
//         todos {
//           done
//           id
//           text
//         }
//       }
//     `,
//   })
//   .then((data) => console.log(data))

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById('root')
)
