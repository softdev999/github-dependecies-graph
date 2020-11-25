import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import Tree from 'react-d3-tree';
import Loader from 'react-loader-spinner';
import NodeLabel from './NodeLabel';

const dependenciesGraph = [
  {
    name: 'Rails/Rails',
    attributes: {},
    children: [],
  },
];

export const GET_DEPENDENCY_QUERY = gql`
  query GetDependencies($name: String!, $login: String!, $count: Int!) {
    repository(owner: $login, name: $name) {
      dependencyGraphManifests(first: 1) {
        nodes {
          dependencies(first: $count) {
            nodes {
              packageName
              repository {
                dependencyGraphManifests(first: 1) {
                  nodes {
                    dependencies(first: 10) {
                      nodes {
                        packageName
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export function Graph(props) {
  const [treeData, setTreeData] = useState(dependenciesGraph)
  const [loadingQuery, setLoadingQuery] = useState(true)
  const translate = {x: window.innerWidth / 2, y: window.innerHeight / 3};

  const { count } = props;
  const { loading, error, data } = useQuery(
    GET_DEPENDENCY_QUERY, 
    { variables: { name: 'rails', login: 'rails', count:  count} }
  );

  useEffect(() => {
    if (data) {
      let originData = dependenciesGraph;
      const nodes = data.repository.dependencyGraphManifests.nodes;
      const firstNode = nodes[0]; // the very first node , in this case dependencies in Gemfile
      const dependencies = firstNode.dependencies.nodes;
      for (const dependency of dependencies) { // check the dependencies
        const level2Dependencies = 
          dependency?.repository?.dependencyGraphManifests?.nodes[0].dependencies.nodes; // each repo might have their own dependencies as well
        const level2Children = [];
        if (level2Dependencies) {
          for (const leve2Dependency of level2Dependencies) {
            level2Children.push({name: leve2Dependency.packageName})
          }
        }
        originData[0].children.push({
          name: dependency.packageName,
          children: level2Children,
        })
      }
      setTreeData(originData);
      setLoadingQuery(false);      
    }
  }, [data])

  useEffect(() => {
    if (error) {
      error.graphQLErrors.forEach(err => {
        console.error(err.message);
      });
      setLoadingQuery(false);
    }
  }, [error])

  if (loadingQuery || loading)
    return (
      <div className="App">
        <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
        <div>Loading ...</div>
      </div>
    );

  return (
      
      <div className="App">
        <div style={{width: '100vw', height: '100vh'}}>
          <Tree 
            data={treeData} 
            orientation="vertical"
            allowForeignObjects
            initialDepth={1}
            translate={translate}
            nodeLabelComponent={{
              render: <NodeLabel />,
              foreignObjectWrapper: {
                y: -20,
                x: -20,
                height: 40,
                width: 160,
              },
            }}
          />
        </div>
      </div>
  );
}
