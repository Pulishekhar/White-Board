import React from "react";

const Toolbar = ({ setTool, clearCanvas }) => {
  return (
    <div className="toolbar">
      <button onClick={() => setTool("brush")}>🖌 Brush</button>
      <button onClick={() => setTool("eraser")}>🧽 Eraser</button>
      <button onClick={clearCanvas}>🗑 Clear</button>
    </div>
  );
};

export default Toolbar;
