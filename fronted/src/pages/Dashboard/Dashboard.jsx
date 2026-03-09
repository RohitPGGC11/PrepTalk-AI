import "./Dashboard.css";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
import { useEffect,useState  } from "react";
import api from "../../utils/api";

// ── Mock Data — replace with your real API fetch ──────────────────────────────

// Session shape matches your DB exactly

// const sessions = [
//   { _id: "69a284be0a3c5ed3a8031c07", userId: "69a01b9435ee66c8d714fdc3", domain: "frontend", difficultyTier: "beginner",     status: "active",    totalQuestions: 4, avgScore: 1.96, createdAt: "2026-02-28T06:01:34.022Z", updatedAt: "2026-03-01T06:11:13.197Z" },
//   { _id: "69a284be0a3c5ed3a8031c08", userId: "69a01b9435ee66c8d714fdc3", domain: "frontend", difficultyTier: "intermediate", status: "completed", totalQuestions: 8, avgScore: 6.8,  createdAt: "2026-02-27T09:10:00.000Z", updatedAt: "2026-02-27T11:00:00.000Z" },
//   { _id: "69a284be0a3c5ed3a8031c09", userId: "69a01b9435ee66c8d714fdc3", domain: "backend",  difficultyTier: "beginner",     status: "completed", totalQuestions: 6, avgScore: 8.1,  createdAt: "2026-02-24T14:30:00.000Z", updatedAt: "2026-02-24T16:00:00.000Z" },
//   { _id: "69a284be0a3c5ed3a8031c10", userId: "69a01b9435ee66c8d714fdc3", domain: "dsa",      difficultyTier: "intermediate", status: "completed", totalQuestions: 7, avgScore: 5.9,  createdAt: "2026-02-20T11:00:00.000Z", updatedAt: "2026-02-20T12:30:00.000Z" },
// ];

// // Answer shape matches your DB exactly (includes communicationStructure)
// const answers = [
//   { _id: "69a3dd1e085e9b8f5ba9bb79", sessionId: "69a284be0a3c5ed3a8031c07", questionId: "69a3db8b085e9b8f5ba9bb68", attemtedquestion: "What is HTML and why is it used?",      userAnswer: "HTML (HyperText Markup Language) is the standard language used to create web pages.\nIt structures content using elements like headings, paragraphs, links, and images.\nIt is used to define the layout and structure of content displayed in a web browser.", accuracy: 9, depth: 8, clarity: 8, problemSolving: 6, exampleUsage: 5, communicationStructure: 7, grammar: 9, overallScore: 7.428571428571429, feedback: "Your answer is mostly accurate and well-structured. You could improve by providing more specific examples of how HTML elements are used to define layout and structure.", createdAt: "2026-03-01T06:30:54.846Z" },
//   { _id: "69a3dd1e085e9b8f5ba9bb80", sessionId: "69a284be0a3c5ed3a8031c07", questionId: "69a3db8b085e9b8f5ba9bb69", attemtedquestion: "What is CSS specificity?",              userAnswer: "CSS specificity determines which styles are applied when multiple rules target the same element. It is calculated based on the type of selectors — IDs have the highest weight, followed by classes, then element selectors.", accuracy: 7, depth: 6, clarity: 8, problemSolving: 5, exampleUsage: 7, communicationStructure: 6, grammar: 9, overallScore: 6.857142857142857, feedback: "Solid understanding shown. Add more depth on how specificity is actually calculated with numbers." },
//   { _id: "69a3dd1e085e9b8f5ba9bb81", sessionId: "69a284be0a3c5ed3a8031c07", questionId: "69a3db8b085e9b8f5ba9bb70", attemtedquestion: "Explain the CSS Box Model",             userAnswer: "The CSS box model wraps every HTML element in a box made of content, padding, border, and margin.\nContent is the actual text or image.\nPadding is space inside the border.\nBorder surrounds the padding.\nMargin is the space outside the border.", accuracy: 10, depth: 9, clarity: 9, problemSolving: 7, exampleUsage: 8, communicationStructure: 9, grammar: 10, overallScore: 8.857142857142858, feedback: "Excellent response! Clear structure, accurate content, and great use of examples." },
//   { _id: "69a3dd1e085e9b8f5ba9bb82", sessionId: "69a284be0a3c5ed3a8031c07", questionId: "69a3db8b085e9b8f5ba9bb71", attemtedquestion: "Difference between let, var, const?",   userAnswer: "var is function-scoped and can be re-declared. let is block-scoped and can be reassigned but not re-declared. const is block-scoped and cannot be reassigned after declaration. let and const were introduced in ES6.", accuracy: 9, depth: 8, clarity: 9, problemSolving: 8, exampleUsage: 9, communicationStructure: 8, grammar: 9, overallScore: 8.571428571428571, feedback: "Great answer with relevant examples and clear distinctions between all three." },
// ];

// ── Helpers ───────────────────────────────────────────────────────────────────






function scoreColor(score) {
  if (score >= 8) return "#4ade80";
  if (score >= 6) return "#facc15";
  return "#f87171";
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const CHART_LINE  = "#818cf8";
const CHART_RADAR = "#6366f1";

function average(arr, key) {
  return parseFloat((arr.reduce((sum, a) => sum + a[key], 0) / arr.length).toFixed(1));
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Dashboard() {

  const [sessions, setsessions] = useState([])
  const [answers, setanswers] = useState([])
  const [loading, setloading] = useState(true)

  useEffect(() => {
    const fetchdata = async () =>{
        try {
          const response = await api.get("/api/session/my-sessions");
          if(response.data.success){
            const sess= response.data.data
            setsessions(sess);

            const sessionIds = sess.map((a)=>a._id)

            const answerRes = await api.post("/api/user/answerBy-Id",{
              sessionIds
            })
            if(answerRes.data.success){
              setanswers(answerRes.data.answers)
            }
          }
        } catch (error) {
            console.log("dashboard fetch error",error);
            
        }finally{
          setloading(false);
        }
    }
    fetchdata();
  }, [])
  


  const [page, setPage] = useState("current");
  const [selectedSession, setSelectedSession] = useState(null);
  useEffect(()=>{
    if(sessions.length && !selectedSession){
      setSelectedSession(sessions[0]);
    }
  },[sessions])


  const [openAnswer, setOpenAnswer] = useState(null);
  const sessionAnswers = selectedSession ? answers.filter((a)=>a.sessionId === selectedSession._id) :[];

  const avgScore = sessionAnswers.length
    ? sessionAnswers.reduce((sum, a) => sum + a.overallScore, 0) / sessionAnswers.length
    : 0;

  if(loading){
    return <div className="loading">Loading dashboard...</div>
  }
    if(!loading && sessions.length === 0){
    return <div className="empty-msg">No sessions yet</div>
  }

  return (
    <div className="app">

      {/* ── Header ── */}
      <header className="header">
        <div className="header-brand">
          <span className="brand-icon">◈</span>
          <span className="brand-name">PrepTalk AI</span>
        </div>
        <nav className="header-nav">
          <button className={page === "current" ? "nav-btn active" : "nav-btn"} onClick={() => setPage("current")}>
            Current Session
          </button>
          <button className={page === "all" ? "nav-btn active" : "nav-btn"} onClick={() => setPage("all")}>
            All Sessions
          </button>
        </nav>
      </header>

      <div className="layout">

        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <p className="sidebar-label">SESSIONS</p>
          {sessions.map((s) => (
            <button
              key={s._id}
              className={selectedSession && selectedSession._id === s._id ? "sess-card selected" : "sess-card"}
              onClick={() => { setSelectedSession(s); setPage("current"); }}
            >
              <div className="sess-tags">
                <span className="tag blue">{s.domain}</span>
                <span className="tag green">{s.difficultyTier}</span>
                {s.status === "active" && <span className="live-dot" />}
              </div>
              <div className="sess-score" style={{ color: scoreColor(s.avgScore) }}>
                {s.avgScore.toFixed(1)}
              </div>
              <div className="sess-date">{formatDate(s.createdAt)}</div>
            </button>
          ))}
        </aside>

        {/* ── Page content ── */}
        <main className="main">
          {page === "current" && selectedSession ? (
            <CurrentPage
              session={selectedSession}
              sessionAnswers={sessionAnswers}
              avgScore={avgScore}
              openAnswer={openAnswer}
              setOpenAnswer={setOpenAnswer}
            />
          ) : (
            <AllSessionsPage sessions={sessions} />
          )}
        </main>

      </div>
    </div>
  );
}

// ── Current Session Page ──────────────────────────────────────────────────────

function CurrentPage({ session, sessionAnswers, avgScore, openAnswer, setOpenAnswer }) {

  const progressData = sessionAnswers.map((a, i) => ({
    name: `Q${i + 1}`,
    score: parseFloat(a.overallScore.toFixed(1)),
  }));

  const radarData = sessionAnswers.length ? [
    { skill: "Accuracy",        value: average(sessionAnswers, "accuracy") },
    { skill: "Depth",           value: average(sessionAnswers, "depth") },
    { skill: "Clarity",         value: average(sessionAnswers, "clarity") },
    { skill: "Problem Solving", value: average(sessionAnswers, "problemSolving") },
    { skill: "Examples",        value: average(sessionAnswers, "exampleUsage") },
    { skill: "Comm. Structure", value: average(sessionAnswers, "communicationStructure") },
    { skill: "Grammar",         value: average(sessionAnswers, "grammar") },
  ] : [];

  const bestScore = sessionAnswers.length ? Math.max(...sessionAnswers.map((a) => a.overallScore)) : 0;

  return (
    <div className="page">
      <h1 className="page-title">
        {session.domain} · {session.difficultyTier}
        {session.status === "active" && <span className="live-badge">● LIVE</span>}
      </h1>

      {/* Stat cards */}
      <div className="card-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ color: scoreColor(avgScore) }}>{avgScore.toFixed(1)}</div>
          <div className="stat-label">Avg Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: scoreColor(bestScore) }}>{bestScore.toFixed(1)}</div>
          <div className="stat-label">Best Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-value purple">{sessionAnswers.length}</div>
          <div className="stat-label">Questions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value blue">{formatDate(session.createdAt)}</div>
          <div className="stat-label">Date</div>
        </div>
      </div>

      {/* Charts */}
      <div className="chart-row">
        <div className="card">
          <p className="card-label">Score Over Time</p>
          {progressData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={progressData}>
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "rgba(15,23,42,0.95)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8 }} itemStyle={{ color: CHART_LINE }} />
                <Line type="monotone" dataKey="score" stroke={CHART_LINE} strokeWidth={2.5} dot={{ fill: CHART_LINE, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="empty-msg">Answer questions to see your progress</p>}
        </div>

        <div className="card">
          <p className="card-label">Skills Radar</p>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "#64748b", fontSize: 10 }} />
                <Radar dataKey="value" stroke={CHART_RADAR} fill={CHART_RADAR} fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          ) : <p className="empty-msg">No data yet</p>}
        </div>
      </div>

      {/* Answer log */}
      <div className="card">
        <p className="card-label">Answer Log</p>
        {sessionAnswers.length === 0 ? (
          <p className="empty-msg">No answers yet in this session</p>
        ) : (
          sessionAnswers.map((a, i) => (
            <div key={a._id} className="answer-item">
              <button className="answer-header" onClick={() => setOpenAnswer(openAnswer === a._id ? null : a._id)}>
                <span className="q-num">Q{i + 1}</span>
                <span className="q-text">{a.attemtedquestion}</span>
                <span className="q-score" style={{ color: scoreColor(a.overallScore) }}>{a.overallScore.toFixed(1)}</span>
                <span className="chevron">{openAnswer === a._id ? "▲" : "▼"}</span>
              </button>
              {openAnswer === a._id && (
                <div className="answer-body">
                  <p className="answer-body-label">Your Answer</p>
                  <p className="user-answer-text">{a.userAnswer}</p>

                  <p className="answer-body-label" style={{ marginTop: 16 }}>Score Breakdown</p>
                  <div className="metrics-row">
                    {[
                      ["Accuracy",       a.accuracy],
                      ["Depth",          a.depth],
                      ["Clarity",        a.clarity],
                      ["Prob. Solving",  a.problemSolving],
                      ["Examples",       a.exampleUsage],
                      ["Comm. Structure",a.communicationStructure],
                      ["Grammar",        a.grammar],
                    ].map(([label, val]) => (
                      <div key={label} className="metric-chip">
                        <span className="chip-label">{label}</span>
                        <span className="chip-value" style={{ color: scoreColor(val) }}>{val}</span>
                      </div>
                    ))}
                  </div>

                  <p className="answer-meta">Answered on {formatDate(a.createdAt)}</p>
                  <p className="feedback"><strong>Feedback: </strong>{a.feedback}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── All Sessions Page ─────────────────────────────────────────────────────────

function AllSessionsPage({ sessions }) {
  const totalQs    = sessions.reduce((sum, s) => sum + s.totalQuestions, 0);
  const overallAvg = sessions.reduce((sum, s) => sum + s.avgScore, 0) / sessions.length;
  const best       = sessions.length ?  sessions.reduce((b, s) => (s.avgScore > b.avgScore ? s : b)):{avgScore:0};

  const historyData = sessions.map((s) => ({ name: formatDate(s.createdAt), score: parseFloat(s.avgScore.toFixed(2)) }));

  return (
    <div className="page">
      <h1 className="page-title">All Sessions</h1>

      <div className="card-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ color: scoreColor(overallAvg) }}>{overallAvg.toFixed(1)}</div>
          <div className="stat-label">Overall Avg</div>
        </div>
        <div className="stat-card">
          <div className="stat-value purple">{sessions.length}</div>
          <div className="stat-label">Sessions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value blue">{totalQs}</div>
          <div className="stat-label">Total Questions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: scoreColor(best.avgScore) }}>{best.avgScore.toFixed(1)}</div>
          <div className="stat-label">Best Session</div>
        </div>
      </div>

      <div className="card">
        <p className="card-label">Score History</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={historyData}>
            <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 10]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "rgba(15,23,42,0.95)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8 }} itemStyle={{ color: CHART_LINE }} />
            <Line type="monotone" dataKey="score" stroke={CHART_LINE} strokeWidth={2.5} dot={{ fill: CHART_LINE, r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <p className="card-label">Session Log</p>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Domain</th>
              <th>Tier</th>
              <th>Questions</th>
              <th>Avg Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s._id}>
                <td>{formatDate(s.createdAt)}</td>
                <td><span className="tag blue">{s.domain}</span></td>
                <td><span className="tag green">{s.difficultyTier}</span></td>
                <td>{s.totalQuestions}</td>
                <td style={{ color: scoreColor(s.avgScore), fontWeight: 600 }}>{s.avgScore.toFixed(1)}</td>
                <td>
                  <span className={s.status === "active" ? "status-active" : "status-done"}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}