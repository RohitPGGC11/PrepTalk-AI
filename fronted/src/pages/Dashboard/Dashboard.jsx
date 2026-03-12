import "./Dashboard.css";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
import { useEffect,useState  } from "react";
import api from "../../utils/api";

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
        {session.status === "active" && <span className="live-badge">● Incompleted Session</span>}
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