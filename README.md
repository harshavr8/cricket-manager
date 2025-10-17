# 🏏 Cricket Team Manager (MERN Stack)

A simple web app to manage cricket teams, players, and matches — built using **MongoDB, Express, React, and Node.js**.  
Users can create teams, add players, schedule matches, and view stats.

---

## ⚙️ Tech Stack
- **Frontend:** React + Vite + TailwindCSS  
- **Backend:** Node.js + Express  
- **Database:** MongoDB Atlas (or local MongoDB)  

---

## 🚀 Setup Instructions

### 1️⃣ Clone the repo
```bash
git clone https://github.com/yourusername/cricket-manager.git
cd cricket-manager
```

---

### 2️⃣ Setup Backend (Server)
```bash
cd server
npm install
```

---

### 3️⃣ Setup MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create a **free cluster**
3. Add a **database user** with username and password
4. Allow access from anywhere (IP: `0.0.0.0/0`)
5. Copy your connection string from **Connect → Drivers** tab. Example:
   ```
   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/cricketdb
   ```

You can also use local MongoDB if you already have it installed:
```
mongodb://localhost:27017/cricketdb
```

 💡 **Note:**  
  If you don’t have time to set up your own MongoDB Atlas cluster or want to quickly check the existing demo database, you can use this shared connection URI:


 ```
 mongodb+srv://Criuser:cricket@cluster0.ck4gnc1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
 ```

 Simply copy this and paste it as your `MONGODB_URI` value in the `.env` file.

 ⚠️ This URI is for demonstration/testing only. 


---

### 4️⃣ Create `.env` file
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

---

### 5️⃣ Start Backend
```bash
npm run dev
```
Server runs on **http://localhost:4000**  
Health check endpoint:
```
http://localhost:4000/api/health
```

---

### 6️⃣ Setup Frontend (Client)
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
