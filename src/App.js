import React from 'react';
import { ApolloProvider, createHttpLink, ApolloClient, InMemoryCache } from '@apollo/client';
import ApolloLinkTimeout from 'apollo-link-timeout';
import { setContext } from '@apollo/client/link/context';
import { Graph } from './components/Graph'
import './App.css';

const TOKEN = process.env.REACT_APP_GIT_TOKEN // github token

const timeout = new ApolloLinkTimeout(10000);
const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
});

const authLink = setContext((_, {headers}) => {
  return {
    headers: {
      ...headers,
      'Authorization': `Bearer ${TOKEN}`,
      'Accept': "application/vnd.github.hawkgirl-preview+json"
    }
  }
});

const client = new ApolloClient({
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
      <Graph count={50}/>
    </ApolloProvider>
  );
}

export default App;
