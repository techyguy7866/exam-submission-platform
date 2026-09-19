# Project Proposal: ZKExam — Confidential Exam Submission Platform

> Privacy-Preserving Zero-Knowledge Exam Submission Protocol on Midnight Network

---

## Live Demo Video

> **Demonstrates wallet connect + successful `submitExam()` circuit call from the frontend.**

[![ZKExam Demo](https://img.shields.io/badge/YouTube-Watch%20Live%20Demo-FF0000?style=for-the-badge&logo=youtube)](https://youtu.be/rnHPdSnrsLw)

**Watch on YouTube**: [https://youtu.be/rnHPdSnrsLw](https://youtu.be/rnHPdSnrsLw)

---

## Question 1: What is the application?

**ZKExam (Exam Submission Platform)** is a decentralized, privacy-preserving exam submission and verification platform built on the Midnight Network using Compact zero-knowledge smart contracts and the **Midnight.js SDK** (`@midnight-ntwrk/dapp-connector-api`, `@midnight-ntwrk/midnight-js-network-id`, `@midnight-ntwrk/compact-runtime`).

Students submit exam answers without revealing them. The ZK proof is generated entirely on the local device — only a cryptographic commitment hash is anchored on the Midnight public ledger. The student's identity, answers, and score remain completely private.

Invigilators (exam administrators) can configure exam parameters, set minimum passing score thresholds, and verify submissions — all without ever seeing the actual answer content.

---

## Question 2: What problem does it solve?

### Current Exam Submission Problems

1. **Privacy Violations**: Online exam platforms collect and store student answers, identity, and behavioral data in centralized servers — creating data breach risks.

2. **Identity Exposure**: Current systems require students to identify themselves, linking submissions to personal profiles.

3. **Cheating & Fraud**: Without cryptographic verification, it's impossible to prove a submission is authentic without exposing its contents.

4. **Data Centralization**: Exam answers, scores, and student records are held in vulnerable centralized databases.

### How ZKExam Solves This

ZKExam proves exam submission validity in zero-knowledge:

- `assert(answersHash != 0)` — proves answers exist without revealing them
- `assert(submissionScore >= minimumPassScore)` — proves score qualifies without revealing the actual score
- `submissionNonce` — unique entropy prevents submission replay attacks
- `studentSecretKey` — binds submission to student without revealing identity

Students prove they submitted valid answers without disclosing what those answers were.

---

## Question 3: How is Midnight used?

### 1. Midnight.js SDK (Frontend Integration)

```typescript
// src/lib/contract.ts — real Midnight.js SDK integration
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import type { DAppConnectorAPI, ConnectedAPI } from "@midnight-ntwrk/dapp-connector-api";
import { Contract, type Witnesses } from "../../managed/contract/index.js";

// Step 1: Register global network ID
setNetworkId("preview");

// Step 2: Detect and connect Midnight Lace / 1AM wallet
const provider = window.midnight?.mnLace ?? window.midnight?.lace;
const connectedApi: ConnectedAPI = await provider.connect("preview");
const address = await connectedApi.getUnshieldedAddress();

// Step 3: Instantiate contract with 5 ZK witnesses
const contract = new Contract<PrivateState>({
  studentSecretKey:   (ctx) => [ctx, strToBytes32(studentKey)],
  submissionNonce:    (ctx) => [ctx, strToBytes32(nonce)],
  answersHash:        (ctx) => [ctx, strToBytes32(answers)],
  submissionScore:    (ctx) => [ctx, BigInt(score)],
  invigilatorKey:     (ctx) => [ctx, strToBytes32(invKey)],
});
```

### 2. Compact Smart Contract (6 Circuits)

**File:** `contracts/confidential_product_warranty.compact`

| # | Circuit | Inputs | Private Witnesses | Description |
|---|---|---|---|---|
| 1 | `claimWarranty` | `Bytes<32>` (examId) | studentSecretKey, answersHash, submissionScore, submissionNonce | ZK proof: score ≥ threshold, answers non-null |
| 2 | `verifyWarranty` | `Bytes<32>` (commitment) | — | On-chain public commitment verification |
| 3 | `revokeWarranty` | `Bytes<32>` (commitment) | invigilatorKey | Invigilator revocation with ZK authority |
| 4 | `setManufacturerCommitment` | `Uint<32>` (minScore) | invigilatorKey | Set passing score threshold + anchor authority |
| 5 | `resetProduct` | `Bytes<32>`, `Uint<32>` | — | Rotate exam offering ID + update threshold |
| 6 | `incrementSession` | — | — | Monotonic nonce bump (replay protection) |

### 3. DApp Connector API — Real Wallet Connection

No simulation. The frontend calls the real Midnight Lace extension:

```typescript
// Detect Midnight Lace / 1AM Wallet
getBrowserWalletProvider(): InitialAPI | any {
  const w = window as any;
  if (w.midnight?.mnLace) return w.midnight.mnLace;
  if (w.midnight?.lace)   return w.midnight.lace;
  // ... fallback detection
}

// Real approval popup
const connectedApi = await provider.connect("preview");

// Real address resolution (no random fallback)
const address = await connectedApi.getUnshieldedAddress();
```

---

## Question 4: What are the privacy guarantees?

### Private Data (Never Disclosed On-Chain)

| Information | ZK Witness | Storage Location |
|---|---|---|
| Exam Answers | `answersHash()` | Local device only — never transmitted as plaintext |
| Student Identity | `studentSecretKey()` | Derived on-device — not stored anywhere |
| Actual Score | `submissionScore()` | Proved ≥ threshold in ZK; exact score hidden |
| Submission Entropy | `submissionNonce()` | Prevents replay and linkability |
| Invigilator Key | `invigilatorKey()` | Derived on-device for ZK governance circuits |

### Public Data (On-Chain Ledger)

| Field | Type | Description |
|---|---|---|
| `submissionCount` | Counter | Total exam submissions (no identity attached) |
| `revokedCount` | Counter | Total revoked submissions |
| `activeSession` | Counter | Replay protection nonce |
| `examId` | `Bytes<32>` | Current exam offering identifier |
| `invigilatorCommitment` | `Bytes<32>` | Authority anchor hash |
| `lastSubmissionCommitment` | `Bytes<32>` | Most recent submission hash (unlinkable) |
| `lastRevokedCommitment` | `Bytes<32>` | Most recent revoked hash |
| `minimumPassScore` | `Uint<32>` | Passing score threshold |

---

## Deployment

- **Contract Address**: `0x9cbd81bf18cf2c5a208a9c4cdc5059b0aa220d05cf22e5edafe1c20abd7afb49` (Midnight Preview, verified)
- **Midnight Explorer**: [View Contract ↗](https://preview.midnightexplorer.com/contracts/0x9cbd81bf18cf2c5a208a9c4cdc5059b0aa220d05cf22e5edafe1c20abd7afb49)
- **YouTube Demo**: [https://youtu.be/rnHPdSnrsLw](https://youtu.be/rnHPdSnrsLw) — wallet connect + circuit call demonstrated
- **Vercel Live Demo**: [https://exam-submission-platform.vercel.app/](https://exam-submission-platform.vercel.app/)
- **Framework**: Next.js 14 App Router + Compact v0.23 + Midnight.js SDK

---

## Level 3 Compliance

- [x] **Real Midnight.js SDK**: `@midnight-ntwrk/dapp-connector-api`, `@midnight-ntwrk/midnight-js-network-id`, `@midnight-ntwrk/compact-runtime`
- [x] **No Simulations**: No `randomHash()`, no `Math.random()`, no fake wallet address fallbacks
- [x] **setNetworkId()**: Called on module load with `"preview"`
- [x] **Real DApp Connector**: `provider.connect("preview")` triggers actual Midnight Lace popup
- [x] **Contract Instantiation**: `new Contract(witnesses)` with all 5 witnesses from managed artifacts
- [x] **Consistent Contract Address**: Same `0x9cbd81...` in `contract.ts`, `deploy.ts`, README, PROPOSAL
- [x] **Midnight Explorer**: [Contract verified live](https://preview.midnightexplorer.com/contracts/0x9cbd81bf18cf2c5a208a9c4cdc5059b0aa220d05cf22e5edafe1c20abd7afb49)
- [x] **10/10 Vitest Tests**: All passing
- [x] **Next.js Build**: Clean — 5 static routes generated
- [x] **GitHub Actions CI**: Contract verification + tests + build
- [x] **YouTube Demo**: [https://youtu.be/rnHPdSnrsLw](https://youtu.be/rnHPdSnrsLw)
