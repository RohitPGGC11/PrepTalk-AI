import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AllQuestions.css";
import {useNavigate} from"react-router-dom";

const AllQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [domain, setDomain] = useState("All");
  const [difficultyTier, setDifficultyTier] = useState("All");
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const navigate = useNavigate
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/admin/fetch-questions", {
        params: { domain, difficultyTier },
      });
      setQuestions(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const removeQuestion = async (id) => {
    try {
      setRemovingId(id);
      await axios.delete(`http://localhost:4000/api/admin/delete-question/${id}`);
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (error) {
      console.log(error);
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [domain, difficultyTier]);

  const domainIcons = {
    frontend: "◈",
    backend: "⬡",
    database: "◉",
    All: "◎",
  };

  const difficultyColors = {
    beginner: "var(--tier-beginner)",
    intermediate: "var(--tier-intermediate)",
    advanced: "var(--tier-advanced)",
  };

  return (
    <div className="aq-root">
      {/* Header */}
      <header className="aq-header">
        <div className="aq-header-inner">
          <div className="aq-title-block">
            <span className="aq-eyebrow">Admin Panel</span>
            <h1 className="aq-title">Question Bank</h1>
          </div>
          {!loading && (
            <div className="aq-count-pill">
              <span className="aq-count-num">{questions.length}</span>
              <span className="aq-count-label">questions</span>
            </div>
          )}
        </div>
      </header>

      {/* Filters */}
      <div className="aq-filters">
        <div className="aq-filter-group">
          <span className="aq-filter-label">Domain</span>
          <div className="aq-select-wrap">
            <select value={domain} onChange={(e) => setDomain(e.target.value)} className="aq-select">
              <option value="All">All Domains</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="database">Database</option>
            </select>
            <span className="aq-select-arrow">↓</span>
          </div>
        </div>

        <div className="aq-filter-divider" />

        <div className="aq-filter-group">
          <span className="aq-filter-label">Difficulty</span>
          <div className="aq-select-wrap">
            <select value={difficultyTier} onChange={(e) => setDifficultyTier(e.target.value)} className="aq-select">
              <option value="All">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <span className="aq-select-arrow">↓</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <main className="aq-body">
        {loading && (
          <div className="aq-loading">
            <div className="aq-spinner">
              <span /><span /><span />
            </div>
            <p>Fetching questions…</p>
          </div>
        )}

        {!loading && questions.length === 0 && (
          <div className="aq-empty">
            <span className="aq-empty-icon">∅</span>
            <p>No questions match your filters.</p>
          </div>
        )}

        {!loading && questions.length > 0 && (
          <div className="aq-grid">
            {questions.map((q, i) => (
              <article
                key={q._id}
                className={`aq-card${removingId === q._id ? " aq-card--removing" : ""}`}
                style={{ "--card-index": i }}
              >
                <div className="aq-card-top">
                  <div className="aq-badges">
                    <span className="aq-badge aq-badge--domain">
                      <span className="aq-badge-icon">{domainIcons[q.domain] || "◇"}</span>
                      {q.domain}
                    </span>
                    <span
                      className="aq-badge aq-badge--tier"
                      style={{ "--tier-color": difficultyColors[q.difficultyTier] || "#888" }}
                    >
                      {q.difficultyTier}
                    </span>
                  </div>
                  <div className="aq-card-actions">
                    <span className="aq-order">#{String(q.order).padStart(2, "0")}</span>
                    <button
                      className="aq-remove-btn"
                      onClick={() => removeQuestion(q._id)}
                      disabled={removingId === q._id}
                      title="Remove question"
                    >
                      {removingId === q._id ? (
                        <span className="aq-remove-spinner" />
                      ) : (
                        " ...Remove"
                      )}
                    </button>

                  </div>
                </div>

                <p className="aq-question">{q.question}</p>

                {q.expectedKeywords && q.expectedKeywords.length > 0 && (
                  <div className="aq-keywords">
                    {q.expectedKeywords.map((kw, idx) => (
                      <span key={idx} className="aq-keyword">{kw}</span>
                    ))}
                  </div>
                )}

                <div className="aq-card-stripe" style={{ "--tier-color": difficultyColors[q.difficultyTier] || "#444" }} />
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllQuestions;