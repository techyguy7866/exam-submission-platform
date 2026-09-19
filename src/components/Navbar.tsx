"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  connecting: boolean;
}

export default function Navbar({ walletAddress, onConnect, onDisconnect, connecting }: NavbarProps) {
  const path = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/claim", label: "Submit Exam" },
    { href: "/admin", label: "Admin" },
    { href: "/explorer", label: "Explorer" },
  ];

  const short = walletAddress
    ? `${walletAddress.slice(0, 8)}…${walletAddress.slice(-6)}`
    : null;

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      backdropFilter: "blur(20px)",
      background: "rgba(10,10,15,0.85)",
    }}>
      <div style={{
        maxWidth: 1180, margin: "0 auto",
        padding: "0 24px",
        display: "flex", alignItems: "center",
        height: 64, gap: 8,
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 28, flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 800, color: "#fff", flexShrink: 0,
          }}>Z</div>
          <span style={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.02em", color: "#f1f5f9" }}>
            ZK<span style={{ color: "#8b5cf6" }}>Exam</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: "0.875rem", fontWeight: 500,
              color: path === l.href ? "#a78bfa" : "#94a3b8",
              background: path === l.href ? "rgba(139,92,246,0.12)" : "transparent",
              transition: "color 0.15s, background 0.15s",
            }}
            onMouseEnter={e => { if (path !== l.href) (e.currentTarget as HTMLElement).style.color = "#e2e8f0"; }}
            onMouseLeave={e => { if (path !== l.href) (e.currentTarget as HTMLElement).style.color = "#94a3b8"; }}
            >{l.label}</Link>
          ))}
        </div>

        {/* Network pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "5px 12px",
          background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
          borderRadius: 50, fontSize: "0.75rem", fontWeight: 600, color: "#34d399",
          flexShrink: 0,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981", display: "inline-block" }} />
          Preview
        </div>

        {/* Wallet button */}
        {walletAddress ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{
              padding: "6px 14px", borderRadius: 50,
              background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)",
              fontSize: "0.8rem", fontWeight: 600, color: "#a78bfa",
              fontFamily: "'Fira Code','Consolas',monospace",
            }}>{short}</div>
            <button onClick={onDisconnect} style={{
              padding: "7px 14px", borderRadius: 50,
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
              fontSize: "0.8rem", fontWeight: 600, color: "#f87171", cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.2)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}>
              Disconnect
            </button>
          </div>
        ) : (
          <button onClick={onConnect} disabled={connecting} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "9px 20px",
            background: connecting ? "rgba(139,92,246,0.3)" : "linear-gradient(135deg,#8b5cf6,#3b82f6)",
            border: "none", borderRadius: 50,
            color: "#fff", fontSize: "0.875rem", fontWeight: 600,
            cursor: connecting ? "not-allowed" : "pointer",
            transition: "opacity 0.15s, transform 0.15s",
            boxShadow: "0 4px 16px rgba(139,92,246,0.35)",
            flexShrink: 0,
          }}
          onMouseEnter={e => { if (!connecting) (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
            {connecting ? (
              <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin-slow 0.7s linear infinite" }} />Connecting…</>
            ) : (
              <><span>🔗</span> Connect Wallet</>
            )}
          </button>
        )}
      </div>
    </nav>
  );
}
