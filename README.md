# White-Board
# Whiteboard App  

🚀 Project Overview  
Whiteboard App is a collaborative online drawing tool that allows users to create, edit, and share drawings in real time.  

 📂 Project Structure  
whiteboard-app/ │── Backend/ # Node.js & Express backend │── Frontend/ # React.js frontend │── README.md # Documentation │── .gitignore # Git ignore file │── package.json # Project dependencies

bash
Copy
Edit

🛠️ Setup Instructions  

1️⃣ Clone the Repository 
```bash
git clone https://github.com/Pulishekhar/White-Board.git
cd White-Board
2️⃣ Install Dependencies
Backend Setup
bash
Copy
Edit
cd Backend
npm install
npm start
Backend will start at http://localhost:5000

Frontend Setup
bash
Copy
Edit
cd ../Frontend
npm install
npm run dev
Frontend will run at http://localhost:5173

📌 API Documentation
1️⃣ Upload a File
Endpoint: POST /api/upload
Request:

json
Copy
Edit
{
  "file": "PDF/PNG/JPG"
}
Response:

json
Copy
Edit
{
  "status": "success",
  "message": "File uploaded successfully"
}
2️⃣ Fetch Drawings
Endpoint: GET /api/drawings
Response:

json
Copy
Edit
[
  {
    "id": 1,
    "name": "Sketch 1",
    "imageUrl": "https://example.com/drawing1.png"
  }
]
🔥 Features
✔️ Real-time collaborative drawing
✔️ Save & load drawings
✔️ Upload images & annotate
✔️ Undo/redo functionality

🤝 Contributing
Feel free to fork this repo and submit pull requests.

📜 License
This project is MIT Licensed.

pgsql
Copy
Edit
**Instructions to Add & Push README to GitHub:**  
```bash
git add README.md
git commit -m "Added README documentation"
git push origin main
