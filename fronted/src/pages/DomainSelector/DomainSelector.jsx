import { useState } from "react";
import "./DomainSelector.css";
import { useContext } from "react";
import { userContext } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";

const domains = [
  { id: "frontend",  label: "Frontend",      icon: "⬡", color: "#6366f1", desc: "HTML, CSS, React, Vue"        },
  { id: "backend",   label: "Backend",       icon: "⬢", color: "#f97316", desc: "Node, Django, REST APIs"      },
  { id: "fullstack", label: "Full-Stack",    icon: "◈", color: "#8b5cf6", desc: "End-to-end development"       },
  { id: "dsa",       label: "DSA",           icon: "◉", color: "#0ea5e9", desc: "Algorithms & Data Structures" },
  { id: "devops",    label: "DevOps",        icon: "⬟", color: "#d97706", desc: "CI/CD, Docker, Kubernetes"    },
  { id: "ml",        label: "ML / AI",       icon: "◎", color: "#ec4899", desc: "Models, Training, Math"       },
  { id: "mobile",    label: "Mobile",        icon: "⬠", color: "#10b981", desc: "iOS, Android, React Native"   },
  { id: "system",    label: "System Design", icon: "◫", color: "#6366f1", desc: "Architecture & Scalability"   },
];

const tiers = [
  { id: "beginner",     label: "Beginner",     tag: "LVL 01", desc: "Core concepts & foundations",    accent: "#16a34a" },
  { id: "intermediate", label: "Intermediate", tag: "LVL 02", desc: "Real-world patterns & practice", accent: "#d97706" },
  { id: "advanced",     label: "Advanced",     tag: "LVL 03", desc: "Deep mastery & optimization",    accent: "#dc2626" },
];

export default function DomainSelector() {

  const {selectedDomain, setSelectedDomain,selectedTier,   setSelectedTier,confirmed,setConfirmed} =useContext(userContext)
  const navigate = useNavigate();
  
 
  const domainObj = domains.find((d) => d.id === selectedDomain);
  const tierObj   = tiers.find((t)   => t.id === selectedTier);
  const ready     = selectedDomain && selectedTier;

  const reset = () => { setSelectedDomain(null); setSelectedTier(null); setConfirmed(false); };

  return (
    <div className="ds-page">
      <div className="ds-wrap">

        {!confirmed ? (
          <>
            {/* Header */}
            <h1 className="ds-title">
              Choose Your <span className="ds-accent">Learning Path</span>
            </h1>
            <p className="ds-sub">Pick a domain and difficulty tier to get started.</p>

            {/* Domains */}
            <p className="ds-label">SELECT A DOMAIN</p>
            <div className="ds-grid">
              {domains.map((d) => (
                <button
                  key={d.id}
                  className={`ds-card${selectedDomain === d.id ? " active" : ""}`}
                  style={{ "--c": d.color }}
                  onClick={() => setSelectedDomain(d.id)}
                >
                  {selectedDomain === d.id && <span className="ds-check">✓</span>}
                  <span className="ds-card-icon">{d.icon}</span>
                  <span className="ds-card-name">{d.label}</span>
                  <span className="ds-card-desc">{d.desc}</span>
                </button>
              ))}
            </div>

            {/* Tiers */}
            <p className="ds-label">SELECT DIFFICULTY TIER</p>
            <div className="ds-tiers">
              {tiers.map((t) => (
                <button
                  key={t.id}
                  className={`ds-tier ${t.id}${selectedTier === t.id ? " active" : ""}`}
                  style={{ "--t": t.accent }}
                  onClick={() => setSelectedTier(t.id)}
                >
                  <span className="ds-tier-tag">{t.tag}</span>
                  <span className="ds-tier-name">{t.label}</span>
                  <span className="ds-tier-desc">{t.desc}</span>
                  <div className="ds-tier-bar" />
                </button>
              ))}
            </div>

            {/* CTA */}
            <button className="ds-btn" onClick={() => ready && setConfirmed(true)} disabled={!ready}>
              BEGIN PATH →
            </button>
            {!ready && (
              <p className="ds-hint">
                {!selectedDomain ? "Pick a domain to continue" : "Now pick a difficulty tier"}
              </p>
            )}
          </>
        ) : (
          /* Confirm */
          <div className="ds-confirm" style={{ "--t": tierObj.accent }}>
            <div className="ds-confirm-icon">{domainObj.icon}</div>
            <div className="ds-confirm-title" style={{ color: domainObj.color }}>{domainObj.label}</div>
            <div className="ds-confirm-badge">{tierObj.tag} · {tierObj.label}</div>
            <p className="ds-confirm-desc">
              You're set to explore <strong style={{ color: domainObj.color }}>{domainObj.label}</strong> at{" "}
              <strong style={{ color: tierObj.accent }}>{tierObj.label}</strong> level. Let's go!
            </p>
            <button className="ds-start-btn"  onClick={()=>{navigate("/chat")}}>🚀 Start Interview</button>
            <button className="ds-reset-btn" onClick={reset}>← Change selection</button>
          </div>
        )}

      </div>
    </div>
  );
}