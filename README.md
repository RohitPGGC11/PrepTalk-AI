

# 🚀 PrepTalk AI – Smart AI Interview Practice Platform

PrepTalk AI is an intelligent mock interview platform that helps users practice technical interviews using AI-powered question generation, answer evaluation, and performance analytics.

It simulates real interview sessions by allowing users to select a domain and difficulty level, answer questions via text or speech, and receive detailed feedback along with performance tracking.

## 🎯 Features

* ✅ Domain-based Interview Sessions (Frontend, Backend, etc.)
* ✅ Beginner / Intermediate / Advanced Levels
* ✅ AI-Powered Question & Answer Evaluation
* ✅ Speech-to-Text Interview Mode
* ✅ Real-Time Feedback & Accuracy Scoring
* ✅ Session-Based Performance Tracking
* ✅ Analytics Dashboard (Charts & Reports)
* ✅ MongoDB-Based Session & Attempt Storage
## 🏗️ Tech Stack

### 🔹 Frontend

* React.js
* React Router
* Axios
* Recharts (Analytics Dashboard)
* Web Speech API (Speech Recognition)

### 🔹 Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Ollama / LLM-based AI Evaluation

---

## 📂 Project Structure

```
PrepTalk-AI/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── Dashboard/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── config/
│
└── README.md
```

---

## 🧠 How It Works

1. User logs in
2. Selects domain + difficulty level
3. A new session is created
4. AI generates structured interview questions
5. User answers via text or speech
6. AI evaluates answer:

   * Accuracy
   * Feedback
   * Expected Keywords
7. Data is stored in MongoDB
8. Dashboard displays:

   * Accuracy trends
   * Radar charts
   * Performance history

---

## 📊 Database Models

### 🔹 Session Model

* userId
* domain
* difficultyTier
* totalQuestions
* avgScore
* status

### 🔹 AnswerAttempt Model

* sessionId
* questionId
* userAnswer
* feedback
* accuracy
* keywordsMatched

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/preptalk-ai.git
cd preptalk-ai
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create `.env` file:

```
MONGO_URI=your_mongodb_connection
PORT=5000
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 📈 Dashboard Analytics

The dashboard provides:

* 📊 Radar Chart – Skill Distribution
* 📈 Line Chart – Performance Over Time
* 📉 Bar Chart – Session-wise Accuracy

Built using **Recharts**.

---

## 🔐 Environment Variables

Backend `.env`

```
MONGO_URI=
PORT=
AI_MODEL=
```

---


## 👨‍💻 Author

**Rohit Kumar**
Full Stack Developer
AI Enthusiast
