"use client";
import { useState } from "react";
import { getClient } from "../../lib/contract";
import Link from "next/link";

export default function AdminPage() {
  const [examId, setExamId] = useState("exam_cs101_cryptography_2027");
  const [resetMinScore, setResetMinScore] = useState(50);
  const [loadingReset, setLoadingReset] = useState(false);

  const [invigilatorKey, setInvigilatorKey] = useState("");
  const [invigilatorMinScore, setInvigilatorMinScore] = useState(30);
  const [loadingInvigilator, setLoadingInvigilator] = useState(false);

  const [revokeCommitment, setRevokeCommitment] = useState("");
  const [loadingRevoke, setLoadingRevoke] = useState(false);

  const [loadingSession, setLoadingSession] = useState(false);

  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<{ msg: string; type: string }[]>([]);

  const addLog = (msg: string, type = "info") => setLogs(l => [...l, { msg, type }]);
  const isLoading = loadingReset || loadingInvigilator || loadingRevoke || loadingSession;

  const handleSetInvigilator = async (e: React.FormEvent) => {
    e.preventDefault(); setLoadingInvigilator(true); setLogs([]); setResult(null);
    try {
      addLog("> [WALLET] Connecting to Midnight Lace Wallet...", "info");
      addLog("> [ZK WITNESS] invigilatorKey() - derived from private key, never disclosed", "info");
      addLog(`> [CIRCUIT] Executing setManufacturerCommitment(Uint<32>) - minimumPassScore=${invigilatorMinScore} points...`, "info");
      const client = getClient();
      client.setInvigilatorKey(invigilatorKey || "invigilator_default_signing_key_2026");
      const res = await client.setManufacturerCommitment(invigilatorMinScore);
      setResult({ ...res, circuit: "setManufacturerCommitment(Uint<32>)" });
      addLog(`> [SUCCESS] Invigilator authority commitment anchored on-chain!`, "success");
      addLog(`> [COMMITMENT] ${res.manufacturerCommitment}`, "success");
      addLog(`> [THRESHOLD] minimumPassScore set to ${res.newMinimumDays} points`, "success");
      addLog(`> [TXHASH] ${res.txHash}`, "success");
    } catch (err: any) { addLog(`> [ERROR] ${err?.message || err}`, "error"); }
    finally { setLoadingInvigilator(false); }
  };

  const handleRevoke = async (e: React.FormEvent) => {
    e.preventDefault(); setLoadingRevoke(true); setLogs([]); setResult(null);
    try {
      addLog("> [WALLET] Connecting to Midnight Lace Wallet...", "info");
      addLog("> [ZK WITNESS] invigilatorKey() - ZK authorization proof generated locally", "info");
      addLog(`> [CIRCUIT] Executing revokeWarranty(Bytes<32>) - commitment: ${revokeCommitment.substring(0, 20)}...`, "info");
      const client = getClient();
      client.setInvigilatorKey(invigilatorKey || "invigilator_default_signing_key_2026");
      const res = await client.revokeWarranty(revokeCommitment);
      setResult({ ...res, circuit: "revokeWarranty(Bytes<32>)" });
      addLog(`> [SUCCESS] Exam submission commitment revoked on-chain!`, "success");
      addLog(`> [REVOKED] ${res.revokedCommitment}`, "success");
      addLog(`> [TXHASH] ${res.txHash}`, "success");
    } catch (err: any) { addLog(`> [ERROR] ${err?.message || err}`, "error"); }
    finally { setLoadingRevoke(false); }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault(); setLoadingReset(true); setLogs([]); setResult(null);
    try {
      addLog("> [WALLET] Connecting to Midnight Lace Wallet...", "info");
      addLog(`> [CIRCUIT] Executing resetProduct(Bytes<32>, Uint<32>) - newExamId: ${examId}, minScore: ${resetMinScore}...`, "info");
      const res = await getClient().resetProduct(examId, resetMinScore);
      setResult({ ...res, circuit: "resetProduct(Bytes<32>, Uint<32>)" });
      addLog(`> [SUCCESS] Exam paper offering & passing threshold updated!`, "success");
      addLog(`> [EXAM ID] ${res.newProductId}`, "success");
      addLog(`> [TXHASH] ${res.txHash}`, "success");
    } catch (err: any) { addLog(`> [ERROR] ${err?.message || err}`, "error"); }
    finally { setLoadingReset(false); }
  };

  const handleIncrement = async () => {
    setLoadingSession(true); setLogs([]); setResult(null);
    try {
      addLog("> [CIRCUIT] Executing incrementSession() on Midnight ledger...", "info");
      const res = await getClient().incrementSession();
      setResult({ ...res, circuit: "incrementSession()" });
      addLog(`> [SUCCESS] Session epoch nonce incremented! Previous proofs invalidated.`, "success");
      addLog(`> [TXHASH] ${res.txHash}`, "success");
    } catch (err: any) { addLog(`> [ERROR] ${err?.message || err}`, "error"); }
    finally { setLoadingSession(false); }
  };

  return (
    <>
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.75rem", borderRadius: "99px", background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)" }}>
              Admin / Invigilator Portal
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.75rem", borderRadius: "99px", background: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.3)" }}>
              Governance Circuits
            </span>
          </div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.03em" }}>
            Invigilator Console
          </h1>
          <p style={{ color: "#94a3b8", marginTop: "0.5rem", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Execute authorized governance circuits on the Midnight contract: configure passing score thresholds, revoke disqualified submissions, or rotate active exam offerings.
          </p>
        </div>

        {/* Panel 1: Set Invigilator Commitment */}
        <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "1.25rem", borderLeft: "3px solid #8b5cf6" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#8b5cf6", marginBottom: "1rem" }}>
            ⚡ Panel 1 — setManufacturerCommitment(Uint&lt;32&gt;)
          </div>
          <p style={{ fontSize: "0.83rem", color: "#94a3b8", marginBottom: "1rem" }}>
            Anchors the invigilator's public authority commitment on-chain and sets the minimum passing score required for valid submissions.
          </p>
          <form onSubmit={handleSetInvigilator} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>
                Invigilator Private Signing Key (ZK Witness — invigilatorKey())
              </label>
              <input type="password" id="invigilatorKey" value={invigilatorKey} onChange={e => setInvigilatorKey(e.target.value)}
                placeholder="Invigilator private signing key (never transmitted)" autoComplete="off" />
            </div>
            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>
                Minimum Required Passing Score: <span style={{ color: "#8b5cf6" }}>{invigilatorMinScore} points</span>
              </label>
              <input type="range" min={0} max={100} step={5} value={invigilatorMinScore}
                onChange={e => setInvigilatorMinScore(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#8b5cf6" }} />
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading} id="setMfrBtn"
              style={{ background: "rgba(139,92,246,0.2)", borderColor: "rgba(139,92,246,0.5)" }}>
              {loadingInvigilator ? <><span className="spinner" /> Anchoring...</> : "Set Invigilator Authority & Threshold (ZK)"}
            </button>
          </form>
        </div>

        {/* Panel 2: Revoke Submission */}
        <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "1.25rem", borderLeft: "3px solid #ef4444" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ef4444", marginBottom: "1rem" }}>
            ⚡ Panel 2 — revokeWarranty(Bytes&lt;32&gt;)
          </div>
          <p style={{ fontSize: "0.83rem", color: "#94a3b8", marginBottom: "1rem" }}>
            Revoke or void an invalid or disqualified exam submission commitment. Requires invigilator authority proof via <code>invigilatorKey()</code> ZK witness. Stored in <code>lastRevokedCommitment</code>.
          </p>
          <form onSubmit={handleRevoke} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>
                Exam Commitment Hash to Revoke (Bytes&lt;32&gt;)
              </label>
              <input type="text" id="revokeCommitment" value={revokeCommitment}
                onChange={e => setRevokeCommitment(e.target.value)}
                placeholder="0x... exam submission commitment hash to revoke" required />
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading || !revokeCommitment} id="revokeBtn"
              style={{ background: "rgba(239,68,68,0.15)", borderColor: "rgba(239,68,68,0.4)" }}>
              {loadingRevoke ? <><span className="spinner" /> Revoking...</> : "Revoke Exam Submission (ZK Auth)"}
            </button>
          </form>
        </div>

        {/* Panel 3: Reset Exam Offering */}
        <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "1.25rem", borderLeft: "3px solid #f59e0b" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f59e0b", marginBottom: "1rem" }}>
            ⚡ Panel 3 — resetProduct(Bytes&lt;32&gt;, Uint&lt;32&gt;)
          </div>
          <p style={{ fontSize: "0.83rem", color: "#94a3b8", marginBottom: "1rem" }}>
            Update the active exam offering ID and adjust the minimum passing score requirement for new examination periods.
          </p>
          <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>
                New Exam Offering Identifier (Bytes&lt;32&gt;)
              </label>
              <input type="text" id="newExamId" value={examId} onChange={e => setExamId(e.target.value)}
                placeholder="exam_cs101_cryptography_2027" />
            </div>
            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>
                New Passing Score Threshold: <span style={{ color: "#f59e0b" }}>{resetMinScore} points</span>
              </label>
              <input type="range" min={0} max={100} step={5} value={resetMinScore}
                onChange={e => setResetMinScore(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#f59e0b" }} />
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading} id="resetBtn"
              style={{ background: "rgba(245,158,11,0.15)", borderColor: "rgba(245,158,11,0.4)" }}>
              {loadingReset ? <><span className="spinner" /> Updating...</> : "Update Exam Offering & Threshold"}
            </button>
          </form>
        </div>

        {/* Panel 4: Increment Session Nonce */}
        <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "1.25rem", borderLeft: "3px solid #06b6d4" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#06b6d4", marginBottom: "0.75rem" }}>
            ⚡ Panel 4 — incrementSession()
          </div>
          <p style={{ fontSize: "0.83rem", color: "#94a3b8", marginBottom: "1rem" }}>
            Bumps the <code>activeSession</code> nonce on the Midnight ledger to invalidate stale proofs from previous exam periods.
          </p>
          <button onClick={handleIncrement} className="btn-secondary" disabled={isLoading} id="sessionBtn">
            {loadingSession ? <><span className="spinner" /> Bumping Session...</> : "Increment Session Epoch Nonce"}
          </button>
        </div>

        {logs.length > 0 && (
          <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Activity Log</div>
            <div className="log-box">
              {logs.map((l, i) => <div key={i} className={`log-${l.type}`}>{l.msg}</div>)}
            </div>
          </div>
        )}

        {result && (
          <div className="glass-card fade-in" style={{ padding: "1.5rem", border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.05)" }}>
            <p style={{ color: "#6ee7b7", fontWeight: 700, fontSize: "1.05rem", marginBottom: "1rem" }}>✓ Transaction Confirmed On-Chain</p>
            {Object.entries(result).map(([k, v]) => v !== undefined && (
              <div key={k} style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.8rem", color: "#64748b", minWidth: 160 }}>{k}:</span>
                <span style={{ fontSize: "0.8rem", color: "#f1f5f9", fontFamily: "monospace", wordBreak: "break-all" }}>{String(v)}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" }}>
              <Link href="/" className="btn-secondary">Back to Dashboard</Link>
              <Link href="/explorer" className="btn-secondary">View on Explorer</Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}