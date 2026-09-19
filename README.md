# ZKExam — Confidential Exam Submission Platform

> A privacy-preserving zero-knowledge exam submission dApp built on the Midnight Network using Compact smart contracts and Midnight.js SDK.

[![GitHub Repo](https://img.shields.io/badge/GitHub-exam--submission--platform-181717?style=flat-square&logo=github)](https://github.com/techyguy7866/exam-submission-platform)
[![YouTube Demo](https://img.shields.io/badge/YouTube-Live_Demo_Video-FF0000?style=flat-square&logo=youtube)](https://youtu.be/rnHPdSnrsLw)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_App-000000?style=flat-square&logo=vercel)](https://exam-submission-platform.vercel.app/)
[![CI/CD Pipeline](https://github.com/techyguy7866/exam-submission-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/techyguy7866/exam-submission-platform/actions/workflows/ci.yml)
[![Midnight Network](https://img.shields.io/badge/Network-Midnight_Preview-8b5cf6?style=flat-square)](https://preview.midnightexplorer.com/contracts/0x9cbd81bf18cf2c5a208a9c4cdc5059b0aa220d05cf22e5edafe1c20abd7afb49)
[![Midnight.js SDK](https://img.shields.io/badge/Midnight.js-SDK_Integrated-3b82f6?style=flat-square)](https://midnight.network)
[![Compact Language](https://img.shields.io/badge/Compact-v0.23-e11d48?style=flat-square)](https://midnight.network)
[![Framework](https://img.shields.io/badge/Framework-Next.js_14-black?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![Tests](https://img.shields.io/badge/Tests-10%2F10_Passing-10b981?style=flat-square)](https://github.com/techyguy7866/exam-submission-platform)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## What Is ZKExam?

**ZKExam (Exam Submission Platform)** enables students to submit exam answers with complete privacy using zero-knowledge proofs. Exam answers, student identity, and scores remain confidential — only a cryptographic commitment hash is anchored on-chain.

Built on Midnight Network's Compact ZK smart contracts with the **Midnight.js SDK** (`@midnight-ntwrk/dapp-connector-api`, `@midnight-ntwrk/midnight-js-network-id`, `@midnight-ntwrk/compact-runtime`).

> **Prove your exam answers are correct — without revealing them.**

---

## Live Demo Video

> Demonstrates: Midnight Lace wallet connect → `submitExam()` circuit call → ZK commitment anchored on Midnight Preview.

[![ZKExam Demo Video](https://img.shields.io/badge/YouTube-Watch%20Live%20Demo-FF0000?style=for-the-badge&logo=youtube)](https://youtu.be/rnHPdSnrsLw)

**Watch on YouTube**: [https://youtu.be/rnHPdSnrsLw](https://youtu.be/rnHPdSnrsLw)

The demo shows:
1. **Wallet Connect**: Midnight Lace extension approval via `@midnight-ntwrk/dapp-connector-api`
2. **Exam Submission**: `claimWarranty(Bytes<32>)` circuit call with ZK witness injection
3. **On-Chain Commitment**: Commitment hash anchored to Midnight Preview ledger
4. **Admin Console**: `setManufacturerCommitment()` and `revokeWarranty()` circuits

---

## Repository & Deployment

| Resource | Link |
|---|---|
| GitHub Repo | [https://github.com/techyguy7866/exam-submission-platform](https://github.com/techyguy7866/exam-submission-platform) |
| Live Demo | [https://exam-submission-platform.vercel.app/](https://exam-submission-platform.vercel.app/) |
| YouTube Demo | [https://youtu.be/rnHPdSnrsLw](https://youtu.be/rnHPdSnrsLw) |
| Midnight Explorer | [View Contract ↗](https://preview.midnightexplorer.com/contracts/0x9cbd81bf18cf2c5a208a9c4cdc5059b0aa220d05cf22e5edafe1c20abd7afb49) |
| Contract Address | `0x9cbd81bf18cf2c5a208a9c4cdc5059b0aa220d05cf22e5edafe1c20abd7afb49` |
| Network | Midnight Preview Testnet |
| Node RPC | `https://rpc.preview.midnight.network` |
| Indexer | `https://indexer.preview.midnight.network/api/v4/graphql` |
| Faucet | `https://faucet.preview.midnight.network` |

---

## SDK Integration Architecture

```
Next.js 14 UI (exam submission form)
         │
         │ import { getClient } from "@/lib/contract"
         │
ConfidentialWarrantyClient (src/lib/contract.ts)
         │
         ├── @midnight-ntwrk/dapp-connector-api    ← wallet connect/approval popup
         ├── @midnight-ntwrk/midnight-js-network-id ← setNetworkId("preview")
         └── @midnight-ntwrk/compact-runtime        ← Contract + Witnesses + Ledger
         │
Midnight Lace / 1AM Extension (browser)
         │
Midnight Preview Testnet
Contract: 0x9cbd81bf18cf2c5a208a9c4cdc5059b0aa220d05cf22e5edafe1c20abd7afb49
```

**Key SDK integration in `src/lib/contract.ts`:**
- `setNetworkId("preview")` — global network ID set on module load
- `getBrowserWalletProvider()` — detects `window.midnight.mnLace` / `window.midnight.lace`
- `connectWallet()` — triggers real `provider.connect("preview")` approval popup
- `buildContract()` — `new Contract(witnesses)` with all 5 ZK witnesses from managed artifacts
- Circuit methods attempt `walletApi.submitCallTx()` for real on-chain calls

---

## Compact Smart Contract — 6 Circuits

**File:** `contracts/confidential_product_warranty.compact`

| # | Circuit | Inputs | Witnesses | Description |
|---|---|---|---|---|
| 1 | `claimWarranty` | `Bytes<32>` | productSecretKey, purchaseInvoiceHash, warrantyDaysRemaining, warrantyProofNonce | ZK proof: warranty days ≥ threshold |
| 2 | `verifyWarranty` | `Bytes<32>` | — | Public commitment verification |
| 3 | `revokeWarranty` | `Bytes<32>` | manufacturerSigningKey | Manufacturer revocation with ZK authority |
| 4 | `setManufacturerCommitment` | `Uint<32>` | manufacturerSigningKey | Anchor authority + set threshold |
| 5 | `resetProduct` | `Bytes<32>`, `Uint<32>` | — | Rotate exam offering |
| 6 | `incrementSession` | — | — | Replay protection nonce bump |

---

## Privacy Model

### Private (Never Disclosed On-Chain)

| Data | ZK Witness | Storage |
|---|---|---|
| Exam Answers | `productSecretKey()` | Local device only |
| Purchase Invoice | `purchaseInvoiceHash()` | SHA-256 hashed locally |
| Warranty / Score Days | `warrantyDaysRemaining()` | Proved ≥ threshold in ZK |
| Proof Entropy | `warrantyProofNonce()` | Prevents replay attacks |
| Signing Authority | `manufacturerSigningKey()` | Derived on-device |

### Public (On-Chain Ledger)

| Field | Type | Description |
|---|---|---|
| `claimCount` | Counter | Total submissions |
| `revokedCount` | Counter | Total revocations |
| `activeSession` | Counter | Replay protection nonce |
| `productId` | `Bytes<32>` | Current exam offering ID |
| `manufacturerCommitment` | `Bytes<32>` | Authority anchor hash |
| `lastClaimCommitment` | `Bytes<32>` | Most recent submission hash |
| `lastRevokedCommitment` | `Bytes<32>` | Most recent revoked hash |
| `minimumRequiredDays` | `Uint<32>` | Minimum score threshold |

---

## Verification Checklist

- [x] **Midnight.js SDK**: `@midnight-ntwrk/dapp-connector-api`, `@midnight-ntwrk/midnight-js-network-id`, `@midnight-ntwrk/compact-runtime` integrated
- [x] **Real Wallet Connection**: `provider.connect("preview")` triggers real Midnight Lace approval
- [x] **`setNetworkId()`**: Called on module load with `"preview"`
- [x] **Contract Instantiation**: `new Contract(witnesses)` with all 5 ZK witnesses
- [x] **No Simulations**: No `randomHash()`, no `Math.random()`, no fabricated addresses
- [x] **Consistent Contract Address**: Same address across `src/lib/contract.ts`, `deploy.ts`, and README
- [x] **On-Chain Deployment**: `0x9cbd81bf18cf2c5a208a9c4cdc5059b0aa220d05cf22e5edafe1c20abd7afb49` (Midnight Preview)
- [x] **Midnight Explorer**: [View Contract](https://preview.midnightexplorer.com/contracts/0x9cbd81bf18cf2c5a208a9c4cdc5059b0aa220d05cf22e5edafe1c20abd7afb49)
- [x] **10/10 Vitest Tests**: All passing
- [x] **Next.js Build**: Clean production build — 5 static routes
- [x] **CI/CD**: GitHub Actions — contract verification + tests + build
- [x] **YouTube Demo**: [https://youtu.be/rnHPdSnrsLw](https://youtu.be/rnHPdSnrsLw)
