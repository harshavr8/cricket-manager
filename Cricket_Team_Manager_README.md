# 🏏 Cricket Team Manager (MERN Stack)

A simple web app to manage cricket teams, players, and matches — built using **MongoDB, Express, React, and Node.js**.  
Users can create teams, add players, schedule matches, and view stats.

---

## ⚙️ Tech Stack
- **Frontend:** React + Vite + TailwindCSS  
- **Backend:** Node.js + Express  
- **Database:** MongoDB Atlas (or local MongoDB)  

---

## 🗂 Project Structure
```
project-root/
│
├── client/        → React frontend
├── server/        → Express backend
│   ├── models/    → Mongoose schemas
│   ├── routes/    → API routes
│   ├── controllers/ → Business logic
│   ├── .env.example
│   └── server.js
└── README.md
```

---

## 🚀 Setup Instructions

### 1️⃣ Clone the repo
```bash
git clone https://github.com/harshavr8/cricket-manager.git
cd cricket-manager
```

---

### 2️⃣ Setup Backend (Server)
```bash
cd server
npm install
```

#### Create `.env` file
```bash
cp .env.example .env
```

#### Example `.env`
```env
# MongoDB Atlas connection (preferred)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/cricketdb

# or local MongoDB (if installed)
# MONGODB_URI=mongodb://localhost:27017/cricketdb

PORT=4000
```

#### Start server
```bash
npm run dev
```

Server runs on **http://localhost:4000**  
Check API health:
```
http://localhost:4000/api/health
```

---

### 3️⃣ Setup Frontend (Client)
```bash
cd ../client
npm install
```

#### Create local env
```bash
cp .env.example .env.local
```

#### Example `.env.local`
```env
VITE_API_URL=http://localhost:4000/api
```

#### Start client
```bash
npm run dev
```

App runs on **http://localhost:5173**

---

## 🧩 Features
✅ CRUD operations for Teams, Players, and Matches  
✅ Player filters (search, team, sort)  
✅ Add Player via modal  
✅ Match scheduling + simple result update  
✅ Loading spinners, notices, and clean UI  

---

## 🌐 MongoDB Atlas Quick Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create a **free cluster**
3. Add a **database user** and **allow access from anywhere (0.0.0.0/0)**  
4. Copy the connection string:
   ```
   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/cricketdb
   ```
5. Paste it into your `.env`

---

## 🧪 Optional: Seed Sample Data
You can create initial sample players/teams directly through the UI  
or run a simple seed script (if you added one later):
```bash
npm run seed
```

---

## 🧰 Common Commands
| Command | Description |
|----------|-------------|
| `npm run dev` | Run in dev mode (server or client) |
| `npm start` | Run production build |
| `npm run build` | Build frontend for deployment |


---

## ✅ Done!
Now open the app → add a few teams → add players → schedule matches.  
Search, sort, and enjoy your mini cricket manager app! 🏏

---
