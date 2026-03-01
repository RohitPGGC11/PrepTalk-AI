import { useState, useEffect } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from "recharts";
import "./Dashboard.css"
/* ─── SAMPLE DATA ─── */
const raw = [
  { sessionId:"S001", questionId:"Q1", accuracy:88, depth:72, clarity:91, problemSolving:85, exampleUsage:60, communicationStructure:78, grammar:95, overallScore:81, feedback:"Strong clarity but lean on examples." },
  { sessionId:"S001", questionId:"Q2", accuracy:74, depth:88, clarity:65, problemSolving:90, exampleUsage:82, communicationStructure:70, grammar:88, overallScore:79, feedback:"Excellent problem-solving, work on clarity." },
  { sessionId:"S001", questionId:"Q3", accuracy:95, depth:80, clarity:89, problemSolving:77, exampleUsage:91, communicationStructure:92, grammar:97, overallScore:89, feedback:"Well-rounded answer." },
  { sessionId:"S002", questionId:"Q1", accuracy:60, depth:55, clarity:70, problemSolving:65, exampleUsage:45, communicationStructure:60, grammar:80, overallScore:62, feedback:"Needs more depth and examples." },
  { sessionId:"S002", questionId:"Q2", accuracy:82, depth:78, clarity:80, problemSolving:84, exampleUsage:76, communicationStructure:82, grammar:90, overallScore:82, feedback:"Solid performance." },
  { sessionId:"S002", questionId:"Q3", accuracy:70, depth:65, clarity:75, problemSolving:72, exampleUsage:68, communicationStructure:71, grammar:85, overallScore:72, feedback:"Average, room to grow." },
  { sessionId:"S003", questionId:"Q1", accuracy:93, depth:91, clarity:95, problemSolving:92, exampleUsage:88, communicationStructure:94, grammar:98, overallScore:93, feedback:"Exceptional answer." },
  { sessionId:"S003", questionId:"Q2", accuracy:85, depth:82, clarity:88, problemSolving:87, exampleUsage:79, communicationStructure:85, grammar:92, overallScore:85, feedback:"Very strong across the board." },
  { sessionId:"S003", questionId:"Q3", accuracy:78, depth:74, clarity:80, problemSolving:76, exampleUsage:72, communicationStructure:78, grammar:88, overallScore:78, feedback:"Good but inconsistent." },
];

/* ─── CONSTANTS ─── */
const METRICS = ["accuracy","depth","clarity","problemSolving","exampleUsage","communicationStructure","grammar"];
const METRIC_LABELS = {
  accuracy:"Accuracy", depth:"Depth", clarity:"Clarity",
  problemSolving:"Problem Solving", exampleUsage:"Example Usage",
  communicationStructure:"Structure", grammar:"Grammar",
};
const SESSIONS  = [...new Set(raw.map(d => d.sessionId))];
const QUESTIONS = [...new Set(raw.map(d => d.questionId))];
// Dynamic per-session colours — used only where CSS classes can't carry a per-index value
const SESSION_COLORS = ["#00D4FF","#FF6B6B","#A78BFA","#34D399","#FBBF24"];

/* ─── HELPERS ─── */
const avg = arr => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);

function scoreClass(score) {
  if (score >= 85) return "score-good";
  if (score >= 70) return "score-mid";
  return "score-bad";
}

function scoreHex(score) {
  if (score >= 85) return "var(--score-good)";
  if (score >= 70) return "var(--score-mid)";
  return "var(--score-bad)";
}

/* ─── CUSTOM RECHARTS TOOLTIP ─── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></p>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const [selectedSession,  setSelectedSession]  = useState("All");
  const [selectedQuestion, setSelectedQuestion] = useState("All");
  const [activeTab, setActiveTab] = useState("overview");
  const [animIn,    setAnimIn]    = useState(false);

  useEffect(() => { setTimeout(() => setAnimIn(true), 50); }, []);

  /* ── Derived data ── */
  const filtered = raw.filter(d =>
    (selectedSession  === "All" || d.sessionId  === selectedSession) &&
    (selectedQuestion === "All" || d.questionId === selectedQuestion)
  );

  const overallAvg = avg(filtered.map(d => d.overallScore || avg(METRICS.map(m => d[m]))));

  const radarData = METRICS.map(m => ({
    subject: METRIC_LABELS[m],
    value:   avg(filtered.map(d => d[m])),
  }));

  const barData = QUESTIONS.map(q => {
    const qData = filtered.filter(d => d.questionId === q);
    if (!qData.length) return null;
    const obj = { question: q };
    SESSIONS.forEach(s => {
      const sd = qData.find(d => d.sessionId === s);
      if (sd) obj[s] = sd.overallScore || avg(METRICS.map(m => sd[m]));
    });
    return obj;
  }).filter(Boolean);

  const lineData = METRICS.map(m => ({
    metric: METRIC_LABELS[m],
    ...Object.fromEntries(
      SESSIONS.map(s => [s, avg(filtered.filter(d => d.sessionId === s).map(d => d[m]))])
    ),
  }));

  const sessionSummary = SESSIONS.map(s => {
    const sd = raw.filter(d => d.sessionId === s);
    return { session: s, score: avg(sd.map(d => d.overallScore || avg(METRICS.map(m => d[m])))), attempts: sd.length };
  }).sort((a, b) => b.score - a.score);

  const weakestMetric = METRICS.reduce((a, b) =>
    avg(filtered.map(d => d[a])) < avg(filtered.map(d => d[b])) ? a : b
  );

  const tabs = ["overview", "radar", "comparison", "details"];
  const animClass = `fade-up ${animIn ? "in" : ""}`;

  return (
    <div className="dashboard">

      {/* ══ HEADER ══ */}
      <header className="dashboard__header">
        <div className={`dashboard__header-top ${animClass}`}>
          <div>
            <p className="dashboard__eyebrow">Performance Intelligence</p>
            <h1 className="dashboard__title">ANALYTICS COMMAND CENTER</h1>
          </div>
          <div className="dashboard__filters">
            <select className="filter-select" value={selectedSession} onChange={e => setSelectedSession(e.target.value)}>
              <option value="All">All Sessions</option>
              {SESSIONS.map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="filter-select" value={selectedQuestion} onChange={e => setSelectedQuestion(e.target.value)}>
              <option value="All">All Questions</option>
              {QUESTIONS.map(q => <option key={q}>{q}</option>)}
            </select>
          </div>
        </div>

        <nav className="dashboard__tabs">
          {tabs.map(t => (
            <button key={t} className={`tab-btn ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
              {t}
            </button>
          ))}
        </nav>
      </header>

      {/* ══ BODY ══ */}
      <main className="dashboard__body">

        {/* ── KPI STRIP ── */}
        <div className="kpi-grid">
          {[
            { label:"Overall Score",   value:`${overallAvg}%`,            colorHex: scoreHex(overallAvg),  sub:"Composite average" },
            { label:"Total Attempts",  value:filtered.length,              colorHex:"var(--accent1)",        sub:`${SESSIONS.length} sessions` },
            { label:"Top Performer",   value:sessionSummary[0]?.session,   colorHex:"var(--accent3)",        sub:`${sessionSummary[0]?.score}% avg` },
            { label:"Weakest Metric",  value:METRIC_LABELS[weakestMetric], colorHex:"var(--accent2)",        sub:"Needs focus" },
          ].map((k, i) => (
            <div
              key={i}
              className={`card kpi-card hover-card ${animClass}`}
              style={{ borderLeft:`3px solid ${k.colorHex}`, transitionDelay:`${i * 0.06}s` }}
            >
              <p className="kpi-card__label">{k.label}</p>
              <p className="kpi-card__value" style={{ color: k.colorHex }}>{k.value}</p>
              <p className="kpi-card__sub">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* ════════ OVERVIEW TAB ════════ */}
        {activeTab === "overview" && (
          <div>
            <div className="two-col">

              {/* Metric Breakdown */}
              <div className={`card card--padded ${animClass}`} style={{ transitionDelay:".15s" }}>
                <p className="section-title">Metric Breakdown</p>
                {METRICS.map(m => {
                  const val = avg(filtered.map(d => d[m]));
                  return (
                    <div key={m} className="metric-row">
                      <div className="metric-row__header">
                        <span className="metric-row__label">{METRIC_LABELS[m]}</span>
                        <span className={`metric-row__value ${scoreClass(val)}`}>{val}%</span>
                      </div>
                      <div className="metric-bar">
                        <div
                          className="metric-bar__fill"
                          style={{ width:`${val}%`, background:`linear-gradient(90deg, ${scoreHex(val)}88, ${scoreHex(val)})` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Session Scorecard */}
              <div className={`card card--padded ${animClass}`} style={{ transitionDelay:".2s" }}>
                <p className="section-title">Session Scorecard</p>
                {SESSIONS.map((s, i) => {
                  const sd  = raw.filter(d => d.sessionId === s);
                  const sc  = avg(sd.map(d => d.overallScore || avg(METRICS.map(m => d[m]))));
                  const col = SESSION_COLORS[i];
                  return (
                    <div key={s} className="session-row">
                      <div
                        className="session-row__avatar"
                        style={{ background:`${col}22`, borderColor: col, color: col }}
                      >
                        {s.slice(-1)}
                      </div>
                      <div className="session-row__info">
                        <div className="session-row__name-row">
                          <span>{s}</span>
                          <span style={{ color: scoreHex(sc) }}>{sc}%</span>
                        </div>
                        <div className="metric-bar">
                          <div className="metric-bar__fill" style={{ width:`${sc}%`, background: col }} />
                        </div>
                      </div>
                      <span className="session-row__attempts">{sd.length} attempts</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bar Chart */}
            <div className={`card chart-wrap ${animClass}`} style={{ transitionDelay:".25s" }}>
              <p className="section-title section-title--lg">Score by Question &amp; Session</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="question" tick={{ fill:"var(--muted)", fontSize:11, fontFamily:"Space Mono" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0,100]}   tick={{ fill:"var(--muted)", fontSize:11, fontFamily:"Space Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize:11, fontFamily:"Space Mono", paddingTop:16 }} />
                  {SESSIONS.map((s, i) => (
                    <Bar key={s} dataKey={s} fill={SESSION_COLORS[i]} radius={[4,4,0,0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ════════ RADAR TAB ════════ */}
        {activeTab === "radar" && (
          <div className="two-col">
            <div className={`card card--padded ${animClass}`}>
              <p className="section-title section-title--lg">Skill Radar — Aggregated</p>
              <ResponsiveContainer width="100%" height={340}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill:"var(--muted)", fontSize:10, fontFamily:"Space Mono" }} />
                  <PolarRadiusAxis domain={[0,100]} tick={{ fill:"var(--muted)", fontSize:9 }} axisLine={false} />
                  <Radar name="Score" dataKey="value" stroke="var(--accent1)" fill="var(--accent1)" fillOpacity={0.25} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className={`card card--padded ${animClass}`} style={{ transitionDelay:".1s" }}>
              <p className="section-title section-title--lg">Multi-Session Radar Overlay</p>
              <ResponsiveContainer width="100%" height={340}>
                <RadarChart
                  data={METRICS.map(m => ({
                    subject: METRIC_LABELS[m],
                    ...Object.fromEntries(
                      SESSIONS.map(s => [s, avg(raw.filter(d => d.sessionId === s).map(d => d[m]))])
                    ),
                  }))}
                >
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill:"var(--muted)", fontSize:10, fontFamily:"Space Mono" }} />
                  <PolarRadiusAxis domain={[0,100]} tick={{ fill:"var(--muted)", fontSize:9 }} axisLine={false} />
                  {SESSIONS.map((s, i) => (
                    <Radar key={s} name={s} dataKey={s} stroke={SESSION_COLORS[i]} fill={SESSION_COLORS[i]} fillOpacity={0.15} />
                  ))}
                  <Legend wrapperStyle={{ fontSize:11, fontFamily:"Space Mono" }} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ════════ COMPARISON TAB ════════ */}
        {activeTab === "comparison" && (
          <div>
            <div className={`card chart-wrap ${animClass}`}>
              <p className="section-title section-title--lg">Metric-by-Metric Session Comparison</p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="metric" tick={{ fill:"var(--muted)", fontSize:10, fontFamily:"Space Mono" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0,100]}  tick={{ fill:"var(--muted)", fontSize:10, fontFamily:"Space Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize:11, fontFamily:"Space Mono", paddingTop:16 }} />
                  {SESSIONS.map((s, i) => (
                    <Line key={s} type="monotone" dataKey={s} stroke={SESSION_COLORS[i]} strokeWidth={2} dot={{ r:4, fill:SESSION_COLORS[i] }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="three-col">
              {SESSIONS.map((s, si) => {
                const sd  = raw.filter(d => d.sessionId === s);
                const sc  = avg(sd.map(d => d.overallScore || avg(METRICS.map(m => d[m]))));
                const col = SESSION_COLORS[si];
                return (
                  <div
                    key={s}
                    className={`card card--padded-sm hover-card ${animClass}`}
                    style={{ borderTop:`3px solid ${col}`, transitionDelay:`${si * 0.08}s` }}
                  >
                    <div className="session-card__header">
                      <span className="session-card__session-name" style={{ color: col }}>{s}</span>
                      <span className={`session-card__score ${scoreClass(sc)}`}>{sc}%</span>
                    </div>
                    {METRICS.map(m => {
                      const v = avg(sd.map(d => d[m]));
                      return (
                        <div key={m} className="session-card__metric-row">
                          <span>{METRIC_LABELS[m]}</span>
                          <span style={{ color: scoreHex(v) }}>{v}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════ DETAILS TAB ════════ */}
        {activeTab === "details" && (
          <div className={`details-grid ${animClass}`}>
            {filtered.map((d, i) => {
              const score = d.overallScore || avg(METRICS.map(m => d[m]));
              const si    = SESSIONS.indexOf(d.sessionId);
              const col   = SESSION_COLORS[si];
              return (
                <div
                  key={i}
                  className="card detail-card hover-card"
                  style={{ borderLeft:`3px solid ${col}` }}
                >
                  <div className="detail-card__score-block">
                    <div className={`detail-card__score-value ${scoreClass(score)}`}>{score}</div>
                    <div className="detail-card__score-label">score</div>
                  </div>

                  <div>
                    <div className="detail-card__tags">
                      <span className="tag" style={{ background:`${col}22`, color: col }}>{d.sessionId}</span>
                      <span className="tag tag--question">{d.questionId}</span>
                    </div>
                    <div className="detail-card__metrics">
                      {METRICS.map(m => (
                        <div key={m} className="detail-card__metric-chip">
                          <span style={{ color: scoreHex(d[m]) }}>{d[m]}</span>{" "}
                          {METRIC_LABELS[m].split(" ")[0]}
                        </div>
                      ))}
                    </div>
                    {d.feedback && (
                      <div className="detail-card__feedback">"{d.feedback}"</div>
                    )}
                  </div>

                  <div className="detail-card__mini-grid">
                    {METRICS.slice(0, 4).map(m => (
                      <div key={m} className="mini-stat">
                        <div className={`mini-stat__value ${scoreClass(d[m])}`}>{d[m]}</div>
                        <div className="mini-stat__label">{METRIC_LABELS[m].slice(0,4).toUpperCase()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}