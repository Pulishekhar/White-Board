import React, { useRef, useEffect, useState } from "react";
import Toolbar from "./Toolbar";
import socket from "./socket";
import "./styles.css";

const roomId = "default"; // Change dynamically if needed

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState("brush");

  // Load board data from FastAPI on mount
  useEffect(() => {
    fetch(`http://localhost:5000/board/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Loaded board:", data);
        drawFromData(data); // Restore saved board
      })
      .catch((err) => console.error("Error loading board:", err));
  }, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctxRef.current = ctx;
  }, []);

  // Handle WebSocket messages (incoming updates)
  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received board update:", data);
      drawFromData(data);
    };
  }, []);

  const startDrawing = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    
    const ctx = ctxRef.current;
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 20;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = 5;
      ctx.strokeStyle = "black";
    }

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();

    // Send drawing update to FastAPI
    const newData = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY, tool };
    socket.send(JSON.stringify(newData));
  };

  const stopDrawing = () => {
    ctxRef.current.closePath();
    setDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Restore board from saved data
  const drawFromData = (data) => {
    if (!data || !Array.isArray(data)) return;
    const ctx = ctxRef.current;
    data.forEach(({ x, y, tool }) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 1, y + 1);
      ctx.strokeStyle = tool === "eraser" ? "white" : "black";
      ctx.stroke();
    });
  };

  return (
    <div>
      <h2>Real-Time Whiteboard</h2>
      <Toolbar setTool={setTool} clearCanvas={clearCanvas} />
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
};

export default Whiteboard;
