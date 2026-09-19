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
          <span style={{ padding: "4px 12px", background: "rgba(6,182,222,0.12)", border: "1px solid rgba(6,182,222,0.25)", borderRadius: 50, fontSize: "0.72rem", fontWeight: 700, color: "#22d3ee", letterSpacing: "0.06em", textTransform: "uppercase" }}>Midnight Explorer</span>
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
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
          padding: "12px 16px", background: "rgba(0,0,0,0.4)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)",
          fontFamily: "'JetBrains Mono','Fira Code',monospace",
        }}>
          <span style={{ fontSize: "0.83rem", color: "#e2e8f0", wordBreak: "break-all" }}>{CONTRACT_ADDRESS}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => navigator.clipboard.writeText(CONTRACT_ADDRESS)}
              style={{
                padding: "6px 14px", background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)",
                borderRadius: 8, fontSize: "0.75rem", fontWeight: 600, color: "#a78bfa", cursor: "pointer",
              }}>
              Copy
            </button>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "6px 14px", background: "linear-gradient(135deg,#8b5cf6,#3b82f6)", borderRadius: 8,
                fontSize: "0.75rem", fontWeight: 600, color: "#fff", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4,
              }}>
              View in Explorer ↗
            </a>
          </div>
        </div>
      </div>

      {/* Network Configuration */}
      <div style={{
        padding: 24, borderRadius: 16, marginBottom: 20,
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
      }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Network Configuration</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
          {[
            { label: "Network ID", val: NETWORK_CONFIG.networkId },
            { label: "Indexer", val: NETWORK_CONFIG.indexer },
            { label: "Node RPC", val: NETWORK_CONFIG.node },
            { label: "Proof Server", val: NETWORK_CONFIG.proofServer },
          ].map(c => (
            <div key={c.label} style={{ padding: "10px 14px", background: "rgba(0,0,0,0.3)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontSize: "0.78rem", color: "#cbd5e1", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contract Ledger Fields */}
      <div style={{
        padding: 24, borderRadius: 16, marginBottom: 20,
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
      }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          On-Chain Ledger State (8 Fields)
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ledgerFields.map(f => (
            <div key={f.field} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
              padding: "10px 14px", background: "rgba(0,0,0,0.25)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.04)",
            }}>
              <span style={{ fontFamily: "monospace", fontSize: "0.82rem", color: f.color, fontWeight: 600 }}>{f.field}</span>
              <span style={{ fontSize: "0.78rem", color: "#64748b" }}>{f.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/claim" style={{
          padding: "10px 24px", background: "linear-gradient(135deg,#8b5cf6,#3b82f6)", borderRadius: 10,
          fontWeight: 600, fontSize: "0.88rem", color: "#fff", textDecoration: "none",
        }}>
          ✍️ Submit Exam
        </Link>
        <Link href="/admin" style={{
          padding: "10px 24px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10, fontWeight: 600, fontSize: "0.88rem", color: "#cbd5e1", textDecoration: "none",
        }}>
          🛡️ Invigilator Console
        </Link>
      </div>
    </div>
  );
}