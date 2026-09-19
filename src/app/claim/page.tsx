"use client";
import { useState } from "react";
import { getClient } from "../../lib/contract";
import Link from "next/link";

export default function ClaimPage() {
  const [examId, setExamId] = useState("exam_cs101_cryptography_2026");
  const [studentSecretKey, setStudentSecretKey] = useState("");
  const [answersPayload, setAnswersPayload] = useState("");
  const [submissionScore, setSubmissionScore] = useState(85);
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [claimedCommitment, setClaimedCommitment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<{ msg: string; type: string }[]>([]);

  const MINIMUM_PASS_SCORE = 30;
  const addLog = (msg: string, type = "info") => setLogs(l => [...l, { msg, type }]);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null); setLogs([]);
    try {
      addLog("> [WALLET] Connecting to Midnight Lace Wallet...", "info");
      const client = getClient();
      
      const effectiveStudentKey = studentSecretKey || "student_zk_key_shuvam_2026";
      const effectiveAnswers = answersPayload || "answers_section_a_b_c_payload";

      // Set witnesses using standard setters (backward-compatible with aliases)
      client.setStudentSecretKey(effectiveStudentKey);
      client.setAnswersHash(effectiveAnswers);
      client.setSubmissionScore(submissionScore);

      addLog("> [ZK WITNESS] studentSecretKey() - private student key derived locally (never disclosed)", "info");
      addLog("> [ZK WITNESS] submissionNonce() - cryptographic replay protection entropy salt", "info");
      addLog("> [ZK WITNESS] answersHash() - SHA-256 hash of submitted exam answers", "info");
      addLog(`> [ZK WITNESS] submissionScore() - ${submissionScore} points vs. ${MINIMUM_PASS_SCORE} points passing threshold`, "info");
      addLog(`> [ZK THRESHOLD] Asserting submissionScore >= minimumPassScore privately in Zero-Knowledge...`, "info");

      if (submissionScore < MINIMUM_PASS_SCORE) {
        addLog(`> [REJECTED] ${submissionScore} points < ${MINIMUM_PASS_SCORE} passing threshold - circuit would reject proof`, "error");
        setError(`Submission Rejected: ${submissionScore} points is below the required ${MINIMUM_PASS_SCORE}-point passing threshold.`);
        return;
      }

      addLog("> [CIRCUIT] Executing submitExam(Bytes<32>) on Midnight Preview Network...", "info");
      const res = await client.submitExam(examId);
      setResult(res);
      addLog(`> [SUCCESS] Anonymous exam submission verified & confirmed! TxHash: ${res.txHash}`, "success");
      addLog(`> [COMMITMENT] ZK Submission Commitment: ${res.commitmentHex}`, "success");
      addLog(`> [PRIVACY] Student identity, raw answers, exact score - NEVER disclosed on-chain`, "success");
      addLog(`> [FEE] Transaction fee: ${res.txFee} ${res.txFeeAsset}`, "info");
    } catch (err: any) {
      addLog(`> [ERROR] ${err?.message || err}`, "error");
      setError(err?.message || "Failed to submit exam proof");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimedCommitment.trim()) return;
    setVerifyLoading(true); setVerifyResult(null);
    try {
      const res = await getClient().verifyWarranty(claimedCommitment.trim());
      setVerifyResult(res);
    } catch (err: any) {
      setError(err?.message || "Verification failed");
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <>
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>
        {/* Page Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.75rem", borderRadius: "99px", background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)" }}>
              Circuit 1: submitExam(Bytes&lt;32&gt;)
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.75rem", borderRadius: "99px", background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" }}>
              Zero-Knowledge Privacy
            </span>
          </div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.03em" }}>
            Anonymous Exam Submission
          </h1>
          <p style={{ color: "#94a3b8", marginTop: "0.5rem", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Prove exam answers and passing score without revealing your identity or answers.
            The Compact smart contract verifies your zero-knowledge proof and anchors the cryptographic commitment on-chain.
          </p>
        </div>

        {/* Submission Form Card */}
        <div className="glass-card" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
          <form onSubmit={handleClaim} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.5rem" }}>
                Exam Paper ID / Course Identifier (Public Input)
              </label>
              <input type="text" id="examId" value={examId} onChange={e => setExamId(e.target.value)}
                placeholder="e.g. exam_cs101_cryptography_2026" required />
              <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.4rem" }}>
                Identifies which exam offering is being submitted to on the Midnight ledger.
              </p>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.5rem" }}>
                Student Secret Key — Private Witness (studentSecretKey)
              </label>
              <input type="password" id="studentSecretKey" value={studentSecretKey} onChange={e => setStudentSecretKey(e.target.value)}
                placeholder="Your private student key (never transmitted to network)" autoComplete="off" />
              <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.4rem" }}>
                Calculated locally on your device to generate <code>studentSecretKey()</code> ZK witness — never leaves your browser.
              </p>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.5rem" }}>
                Submission Score — Private Threshold Witness (submissionScore)
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <input type="range" id="submissionScore" min={0} max={100} step={1} value={submissionScore}
                  onChange={e => setSubmissionScore(Number(e.target.value))}
                  style={{ flex: 1, accentColor: submissionScore >= MINIMUM_PASS_SCORE ? "#10b981" : "#ef4444" }} />
                <span style={{
                  fontFamily: "monospace", fontWeight: 700, fontSize: "1rem",
                  color: submissionScore >= MINIMUM_PASS_SCORE ? "#10b981" : "#ef4444", minWidth: "5.5rem"
                }}>{submissionScore} points</span>
                <span style={{
                  fontSize: "0.75rem", padding: "0.2rem 0.6rem", borderRadius: "99px",
                  background: submissionScore >= MINIMUM_PASS_SCORE ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                  color: submissionScore >= MINIMUM_PASS_SCORE ? "#10b981" : "#ef4444"
                }}>
                  {submissionScore >= MINIMUM_PASS_SCORE ? "✓ PASSING" : "✕ BELOW PASS"}
                </span>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.4rem" }}>
                Compared privately via <code>submissionScore()</code> vs. on-chain <code>minimumPassScore</code> ({MINIMUM_PASS_SCORE} points) — exact score never disclosed.
              </p>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.5rem" }}>
                Exam Answers & Solution Payload (answersHash)
              </label>
              <textarea id="answersPayload" value={answersPayload} onChange={e => setAnswersPayload(e.target.value)}
                placeholder="Paste exam answers or solution text (hashed locally via SHA-256 before generating ZK proof)..."
                rows={3} style={{ resize: "vertical" }} />
              <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.4rem" }}>
                Content is hashed locally on your device — only the SHA-256 <code>answersHash()</code> enters the zero-knowledge proof.
              </p>
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button type="submit" className="btn-primary" disabled={loading} id="claimBtn">
                {loading ? <><span className="spinner" /> Generating ZK Proof...</> : "Submit Exam (ZK Proof)"}
              </button>
              <Link href="/" className="btn-secondary">Back to Dashboard</Link>
            </div>
          </form>
        </div>

        {/* Activity Logs */}
        {logs.length > 0 && (
          <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Activity Log</div>
            <div className="log-box">
              {logs.map((l, i) => <div key={i} className={`log-${l.type}`}>{l.msg}</div>)}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="glass-card fade-in" style={{ padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.05)" }}>
            <p style={{ color: "#fca5a5", fontWeight: 600 }}>Error</p>
            <p style={{ color: "#94a3b8", marginTop: "0.5rem", fontSize: "0.9rem" }}>{error}</p>
          </div>
        )}

        {/* Success Result */}
        {result && (
          <div className="glass-card fade-in" style={{ padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.05)" }}>
            <p style={{ color: "#6ee7b7", fontWeight: 700, fontSize: "1.05rem", marginBottom: "1rem" }}>✓ Exam Submission Verified & Confirmed On-Chain!</p>
            {[
              { label: "Circuit", value: "submitExam(Bytes<32>)" },
              { label: "ZK Submission Commitment", value: result.commitmentHex },
              { label: "On-Chain TxHash", value: result.txHash },
              { label: "Passing Score Satisfied", value: result.daysRequirementMet ? "✓ Satisfied (Zero-Knowledge)" : "✕ Below Passing Score" },
              { label: "Signed By", value: result.signedBy },
              { label: "Tx Fee", value: `${result.txFee} ${result.txFeeAsset}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.8rem", color: "#64748b", minWidth: 180 }}>{label}:</span>
                <span style={{ fontSize: "0.8rem", color: "#f1f5f9", fontFamily: "monospace", wordBreak: "break-all" }}>{value as string}</span>
              </div>
            ))}
            <p style={{ fontSize: "0.8rem", color: "#10b981", marginTop: "0.75rem", fontWeight: 600 }}>Status: CONFIRMED (Midnight Preview)</p>
          </div>
        )}

        {/* Verify Submission Panel */}
        <div className="glass-card" style={{ padding: "1.5rem", borderLeft: "3px solid #06b6d4" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#06b6d4", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Verify Exam Submission — verifyWarranty(Bytes&lt;32&gt;)
          </div>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1rem" }}>
            Invigilators, institutions, and candidates can publicly verify whether a claimed ZK commitment matches a confirmed exam submission on-chain without revealing answers or identity.
          </p>
          <form onSubmit={handleVerify} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <input type="text" id="claimedCommitment" value={claimedCommitment}
              onChange={e => setClaimedCommitment(e.target.value)}
              placeholder="0x... claimed exam commitment hash"
              style={{ flex: 1, minWidth: "200px" }} />
            <button type="submit" className="btn-secondary" disabled={verifyLoading} id="verifyBtn" style={{ whiteSpace: "nowrap" }}>
              {verifyLoading ? <><span className="spinner" /> Verifying...</> : "Verify On-Chain"}
            </button>
          </form>
          {verifyResult && (
            <div style={{ marginTop: "1rem", padding: "0.75rem", borderRadius: "8px",
              background: verifyResult.matches ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
              border: `1px solid ${verifyResult.matches ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}` }}>
              <p style={{ color: verifyResult.matches ? "#6ee7b7" : "#fca5a5", fontWeight: 700, marginBottom: "0.5rem" }}>
                {verifyResult.matches ? "✓ VALID — Exam Submission Commitment Verified On-Chain" : "✕ INVALID — Commitment Mismatch"}
              </p>
              <div style={{ fontSize: "0.78rem", color: "#64748b" }}>TxHash: <span style={{ color: "#f1f5f9", fontFamily: "monospace" }}>{verifyResult.txHash}</span></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}