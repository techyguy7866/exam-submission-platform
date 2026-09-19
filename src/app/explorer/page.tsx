"use client";
import Link from "next/link";
import { CONTRACT_ADDRESS, NETWORK_CONFIG } from "../../lib/contract";

export default function ExplorerPage() {
  const explorerUrl = `https://preview.midnightexplorer.com/contracts/${CONTRACT_ADDRESS}`;

  const ledgerFields = [
    { field: "submissionCount: Counter",     desc: "Total anonymous exam submissions filed",         color: "#e11d48" },
    { field: "revokedCount: Counter",        desc: "Total revoked/voided submissions",               color: "#ef4444" },
    { field: "activeSession: Counter",       desc: "Epoch nonce — replay protection",                color: "#06b6d4" },
    { field: "examId: Bytes<32>",            desc: "Active exam offering identifier",                color: "#10b981" },
    { field: "invigilatorCommitment: Bytes<32>", desc: "Invigilator public authority anchor",        color: "#f59e0b" },
    { field: "lastSubmissionCommitment: Bytes<32>", desc: "Most recent ZK submission commitment",    color: "#8b5cf6" },
    { field: "lastRevokedCommitment: Bytes<32>",    desc: "Most recent revoked commitment hash",     color: "#ef4444" },
    { field: "minimumPassScore: Uint<32>",   desc: "Minimum passing score threshold enforced in ZK", color: "#06b6d4" },
  ];

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <span style={{ padding: "4px 12px", background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)", borderRadius: 50, fontSize: "0.72rem", fontWeight: 700, color: "#22d3ee", letterSpacing: "0.06em", textTransform: "uppercase" }}>Midnight Explorer</span>
          <span style={{ padding: "4px 12px", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 50, fontSize: "0.72rem", fontWeight: 700, color: "#34d399", letterSpacing: "0.06em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981", display: "inline-block" }} />Preview Network
          </span>
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em", marginBottom: 8 }}>Contract Explorer</h1>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.6 }}>
          Live on-chain state of the <strong style={{ color: "#a78bfa" }}>ZKExam — Confidential Exam Submission</strong> contract on Midnight Preview Testnet.
        </p>
      </div>

      {/* Contract Address Card */}
      <div style={{
        padding: 24, borderRadius: 16, marginBottom: 20,
        background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)",
      }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Contract Address</div>
        <code style={{ fontSize: "0.85rem", color: "#06b6d4", wordBreak: "break-all", lineHeight: 1.7, display: "block", marginBottom: 16, fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>
          {CONTRACT_ADDRESS}
        </code>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href={explorerUrl} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 22px", borderRadius: 50,
            background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
            color: "#fff", fontWeight: 700, fontSize: "0.9rem",
            boxShadow: "0 4px 16px rgba(139,92,246,0.35)",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
            View on Midnight Explorer →
          </a>
          <button onClick={() => navigator.clipboard?.writeText(CONTRACT_ADDRESS)} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "10px 18px", borderRadius: 50,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#94a3b8", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
          }}>📋 Copy Address</button>
        </div>
      </div>

      {/* Network Info */}
      <div style={{
        padding: 24, borderRadius: 16, marginBottom: 20,
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
      }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.08em" }}>Network Configuration</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
          {[
            { label: "Network ID",  value: NETWORK_CONFIG.networkId, icon: "🌐" },
            { label: "Node RPC",    value: NETWORK_CONFIG.nodeUrl,   icon: "🔗" },
            { label: "Indexer",     value: "indexer.preview.midnight.network", icon: "📡" },
            { label: "Language",    value: "Compact v0.23",          icon: "⚙️" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{ fontSize: "1rem", marginTop: 2 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</div>
                <div style={{ fontSize: "0.8rem", color: "#e2e8f0", fontWeight: 500, marginTop: 2, wordBreak: "break-all", fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ledger Fields */}
      <div style={{
        padding: 24, borderRadius: 16, marginBottom: 24,
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
      }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.08em" }}>Public Ledger Fields (8)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {ledgerFields.map(f => (
            <div key={f.field} style={{
              display: "flex", gap: 16, padding: "10px 0",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}>
              <code style={{ fontSize: "0.78rem", color: f.color, minWidth: 280, flexShrink: 0, fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>{f.field}</code>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{f.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "10px 22px", borderRadius: 50,
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
          color: "#94a3b8", fontWeight: 600, fontSize: "0.9rem",
        }}>← Back to Dashboard</Link>
        <Link href="/claim" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "10px 22px", borderRadius: 50,
          background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
          color: "#fff", fontWeight: 700, fontSize: "0.9rem",
          boxShadow: "0 4px 16px rgba(139,92,246,0.35)",
        }}>✏️ Submit Exam →</Link>
      </div>
    </div>
  );
}
