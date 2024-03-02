import React from 'react';
import { ResizableBox } from 'react-resizable';


const ResizableComp = ({ width, height, onResize }) => (
    <ResizableBox
      width={width}
      height={300}
      onResize={onResize}
      resizeHandles={['se']}
      draggableOpts={{ grid: [1, 1] }}
    >
      <div className="resizable-content">Resizable Component</div>
    </ResizableBox>
  );

export default ResizableComp