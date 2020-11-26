import React from 'react';
import { ApolloProvider, createHttpLink, ApolloClient, InMemoryCache } from '@apollo/client';
import ApolloLinkTimeout from 'apollo-link-timeout';
import { setContext } from '@apollo/client/link/context';
import { Graph } from './components/Graph'
import './App.css';

const TOKEN = process.env.REACT_APP_GIT_TOKEN // github token

const timeout = new ApolloLinkTimeout(10000); // need more timeout to get dependency information
const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
});

const authLink = setContext((_, {headers}) => { // authentication link for apollo client
  return {
    headers: {
      ...headers,
      'Authorization': `Bearer ${TOKEN}`,
      'Accept': "application/vnd.github.hawkgirl-preview+json" // this is needed to get dependency previews
    }
  }
});

const client = new ApolloClient({ // define new apollo client
  link: timeout.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache({
    typePolicies: {}
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    }
  }
});


function App() {
  return (
    <ApolloProvider client={client}>
      <Graph count={30} login="rails" name="rails" />
    </ApolloProvider>
  );
}

export default App;
