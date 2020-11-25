import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import {GET_DEPENDENCY_QUERY, Graph} from './components/Graph';
import { act } from 'react-dom/test-utils';

const mocks = 
  {
    request: {
      query: GET_DEPENDENCY_QUERY,
      variables: {
        name: "rails",
        login: "rails",
        count: 1,
      },
    },
    result: {
      data: {
        repository:{ 
          dependencyGraphManifests:{
            nodes:[{
              dependencies:{
                nodes:[{
                  packageName:"activerecord-jdbcmysql-adapter",
                  repository:{
                    dependencyGraphManifests:{
                      nodes:[{
                        dependencies:{
                          nodes:[
                            {
                              packageName:"activerecord",
                              __typename:"DependencyGraphDependency"
                            },
                            {
                              packageName:"jdbc-mysql",
                              __typename:"DependencyGraphDependency"
                            },
                            {
                              packageName:"jdbc-postgres",
                              __typename:"DependencyGraphDependency"
                            }
                          ],
                        __typename:"DependencyGraphDependencyConnection"
                      },
                      __typename:"DependencyGraphManifest"
                    }],
                    __typename:"DependencyGraphManifestConnection"
                  },
                  __typename:"Repository"
                },
                __typename:"DependencyGraphDependency"
              }],
              __typename:"DependencyGraphDependencyConnection"
            },
            __typename:"DependencyGraphManifest"
          }],
          __typename:"DependencyGraphManifestConnection"
        },
        __typename:"Repository"}
      },
      loading: false,
      error: null,
    }  
  }


it('render graph ql', () => {
  render(
    <MockedProvider mocks={[mocks]} >
      <Graph count={1}/>
    </MockedProvider>
  )
});

it('should render dependency', async () => {
  await act(async () => {
    const component = render(
      <MockedProvider mocks={[mocks, mocks, mocks, mocks, mocks]} addTypename={false}>
        <Graph count={1}/>
      </MockedProvider>
    )
  
    await new Promise(resolve => setTimeout(resolve, 100)); // await 100 ms
    const text = component.getByText(/activerecord-jdbcmysql-adapter/i);
    expect(text).toBeInTheDocument();
  })
  
})

it('should render loading state initially', () => {
  const component = render(
    <MockedProvider mocks={[]} >
      <Graph count={1}/>
    </MockedProvider>
  )
  const { getByText } = component
  const loadingElement = getByText(/Loading .../i);
  expect(loadingElement).toBeInTheDocument();
})