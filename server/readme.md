# Run backend
cd server
npm install
cp .env.example .env
# Paste your Atlas connection string in .env for MONGODB_URI
npm run dev

# Health check:
# http://localhost:4000/api/health

