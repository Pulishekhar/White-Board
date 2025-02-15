const socket = new WebSocket("ws://localhost:5000/ws/board/default");

socket.onopen = () => {
  console.log("Connected to WebSocket server");
};

socket.onerror = (error) => {
  console.error("WebSocket Error:", error);
};

export default socket;
