"use client";
import Link from "next/link";
import { CONTRACT_ADDRESS } from "../lib/contract";

const CONTRACT_SHORT = `${CONTRACT_ADDRESS.slice(0, 10)}...${CONTRACT_ADDRESS.slice(-8)}`;

const stats = [
  { value: "6", label: "ZK Circuits", icon: "⚡" },
  { value: "5", label: "Private Witnesses", icon: "🔒" },
  { value: "0", label: "Data Leaked", icon: "🛡️" },
  { value: "10/10", label: "Tests Passing", icon: "✅" },
];

const features = [
  {
    icon: "🔒",
    title: "Zero-Knowledge Proofs",
    desc: "Your exam answers are proven correct without revealing them. The ZK proof is generated locally on your device.",
    badge: "Privacy-First",
    color: "#8b5cf6",
  },
  {
    icon: "🌐",
    title: "Midnight Network",
    desc: "Built on Compact smart contracts deployed on Midnight Preview Testnet with Midnight.js SDK integration.",
    badge: "On-Chain",
    color: "#3b82f6",
  },
  {
    icon: "👤",
    title: "Anonymous Identity",
    desc: "Student identity, answers, and scores remain confidential. Only a ZK commitment hash is anchored on-chain.",
    badge: "Anonymous",
    color: "#06b6d4",
  },
  {
    icon: "🛡️",
    title: "Anti-Cheating & Integrity",
    desc: "Tamper-proof submissions with replay protection via session nonces. Each submission is cryptographically unique.",
    badge: "Secure",
    color: "#10b981",
  },
  {
    icon: "🔌",
    title: "DApp Connector API",
    desc: "Real Midnight Lace / 1AM Wallet integration via @midnight-ntwrk/dapp-connector-api. No simulation.",
    badge: "SDK",
    color: "#f59e0b",
  },
  {
    icon: "📜",
    title: "Verifiable Results",
    desc: "Commitments can be verified publicly on-chain without revealing the underlying exam content or identity.",
    badge: "Transparent",
    color: "#ef4444",
  },
];

const steps = [
  { num: "01", title: "Connect Wallet", desc: "Connect your Midnight Lace or 1AM wallet extension to authenticate on Preview Testnet.", icon: "🔌" },
  { num: "02", title: "Enter Answers", desc: "Type your exam answers locally. They are hashed into a private witness — never transmitted as plaintext.", icon: "✍️" },
  { num: "03", title: "Generate ZK Proof", desc: "The Compact contract circuit generates a zero-knowledge proof of your answers locally on your device.", icon: "⚙️" },
  { num: "04", title: "Anchor On-Chain", desc: "A cryptographic commitment is submitted to the Midnight Preview blockchain. Your identity stays anonymous.", icon: "🌐" },
];

export default function HomePage() {
  return (
    <div style={{ overflowX: "hidden" }}>
      {/* Hero Section */}
      <section style={{ padding: "80px 24px 60px", textAlign: "center", position: "relative" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {/* Badge */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 18px",
              background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)",
              borderRadius: 50, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em",
              color: "#a78bfa", textTransform: "uppercase",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#8b5cf6", boxShadow: "0 0 8px #8b5cf6", display: "inline-block" }} />
              Midnight Network • Preview Testnet
            </div>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: "clamp(2.4rem, 6vw, 4rem)",
            fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1,
            marginBottom: 20, color: "#f1f5f9",
          }}>
            Exam Submissions,{" "}
            <span style={{
              background: "linear-gradient(135deg,#8b5cf6 0%,#3b82f6 50%,#06b6d4 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Completely Private
            </span>
          </h1>

          <p style={{
            fontSize: "1.15rem", color: "#94a3b8", lineHeight: 1.7,
            marginBottom: 36, maxWidth: 600, margin: "0 auto 36px",
          }}>
            Submit exam answers using zero-knowledge proofs. Your answers, identity, and score
            remain confidential — only a cryptographic commitment is anchored on-chain.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
            <Link href="/claim" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 32px",
              background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
              borderRadius: 50, fontWeight: 700, fontSize: "1rem", color: "#fff",
              boxShadow: "0 6px 24px rgba(139,92,246,0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}>
              ✍️ Submit Exam
            </Link>
            <Link href="/explorer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "13px 32px",
              background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.12)",
              borderRadius: 50, fontWeight: 600, fontSize: "1rem", color: "#e2e8f0",
              transition: "background 0.2s",
            }}>
              🔍 Explorer
            </Link>
            <a href={`https://preview.midnightexplorer.com/contracts/${CONTRACT_ADDRESS}`}
              target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "13px 32px",
              background: "rgba(139,92,246,0.08)", border: "1.5px solid rgba(139,92,246,0.2)",
              borderRadius: 50, fontWeight: 600, fontSize: "1rem", color: "#a78bfa",
              transition: "background 0.2s",
            }}>
              🚀 Midnight Explorer ↗
            </a>
          </div>

          {/* Contract Address Pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "10px 20px",
            background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12, fontFamily: "'JetBrains Mono','Fira Code',monospace",
          }}>
            <span style={{ fontSize: "0.72rem", color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Contract</span>
            <span style={{ fontSize: "0.82rem", color: "#a78bfa" }}>{CONTRACT_SHORT}</span>
            <span style={{ fontSize: "0.7rem", padding: "2px 8px", background: "rgba(16,185,129,0.15)", color: "#34d399", borderRadius: 4, fontWeight: 700 }}>LIVE</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "0 24px 60px" }}>
        <div style={{
          maxWidth: 900, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16,
        }}>
          {stats.map(s => (
            <div key={s.label} style={{
              textAlign: "center", padding: "28px 20px",
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16,
              transition: "border-color 0.2s, transform 0.2s",
            }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: "1.9rem", fontWeight: 900, color: "#f1f5f9", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "0 24px 60px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 16px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 50, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", color: "#a78bfa", textTransform: "uppercase", marginBottom: 14 }}>
              ⚡ Features
            </div>
            <h2 style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em" }}>
              Why ZKExam?
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
            {features.map(f => (
              <div key={f.title} style={{
                padding: "28px", borderRadius: 16,
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${f.color}18`, border: `1px solid ${f.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
                  }}>{f.icon}</div>
                  <span style={{
                    padding: "3px 10px", borderRadius: 50,
                    background: `${f.color}18`, border: `1px solid ${f.color}30`,
                    fontSize: "0.7rem", fontWeight: 700, color: f.color, textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>{f.badge}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#f1f5f9", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: "0 24px 60px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 16px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 50, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", color: "#60a5fa", textTransform: "uppercase", marginBottom: 14 }}>
              📋 Process
            </div>
            <h2 style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em" }}>
              How It Works
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
            {steps.map(s => (
              <div key={s.num} style={{
                padding: "24px", borderRadius: 16,
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                position: "relative",
              }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#8b5cf6", letterSpacing: "0.08em", marginBottom: 12 }}>
                  STEP {s.num}
                </div>
                <div style={{ fontSize: "1.4rem", marginBottom: 10 }}>{s.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: "#f1f5f9", marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}