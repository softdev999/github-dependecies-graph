import React from 'react';

const NodeLabel = ({nodeData}) => {

  const renderNodeSymbol = () => {
    const {
      _collapsed, _children
    } = nodeData;
    
    const hasChildren = _children && _children.length > 0;

    const circleStyleBase = {
      r: '4.5',
      strokeWidth: 1,
    };

    if (hasChildren && _collapsed) {
      return (
        <polygon points="-4,-2,4,-2,0,4" fill="#000000" stroke="#000000" />
      );
    }


    if (hasChildren) {
      return <circle stroke="#cccccc" fill="#cccccc" {...circleStyleBase} />;
    }

    return (
      <g>
        <circle stroke="#000000" fill="#f9fafb" {...circleStyleBase} />
      </g>
    );
  };

  const {name} = nodeData;

  return (
    <svg height="3rem">
      <g transform="translate(20, 20)" className="leafNodeItem">
        {renderNodeSymbol()}
        <g>
          <text
            className="nodeNameBase"
            textAnchor="start"
            x="10"
            y="-0.5"
            dy=".35em"
            style={{
              fontSize: '0.8rem',
              stroke: 'none',
              textOverflow: 'ellipsis'
            }}
          >
            &nbsp;{name}
          </text>
        </g>
      </g>
    </svg>
  );
}

export default NodeLabel;