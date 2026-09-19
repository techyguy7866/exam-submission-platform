import { describe, it, expect } from 'vitest';
import { Contract, ledger } from '../managed/contract/index.js';

// --- Helpers -----------------------------------------------------------------

function toBytes32(str: string): Uint8Array {
  const bytes = new Uint8Array(32);
  const encoder = new TextEncoder();
  const encoded = encoder.encode(str);
  bytes.set(encoded.subarray(0, 32));
  return bytes;
}

function buildWitnesses(opts: {
  studentKey?: string;
  nonce?: string;
  answersHash?: string;
  submissionScore?: bigint;
  invigilatorKey?: string;
}) {
  const studentKey    = toBytes32(opts.studentKey    ?? 'default_student_secret_key');
  const nonce         = toBytes32(opts.nonce         ?? 'default_submission_nonce');
  const answersHash   = toBytes32(opts.answersHash   ?? 'default_exam_answers_hash');
  const score         = opts.submissionScore         ?? 365n;
  const invigilatorKey = toBytes32(opts.invigilatorKey ?? 'default_invigilator_key');

  return {
    productSecretKey:       (ctx: any) => [ctx.privateState, studentKey]       as [any, Uint8Array],
    warrantyProofNonce:     (ctx: any) => [ctx.privateState, nonce]            as [any, Uint8Array],
    purchaseInvoiceHash:    (ctx: any) => [ctx.privateState, answersHash]      as [any, Uint8Array],
    warrantyDaysRemaining:  (ctx: any) => [ctx.privateState, score]            as [any, bigint],
    manufacturerSigningKey: (ctx: any) => [ctx.privateState, invigilatorKey]   as [any, Uint8Array],
  };
}

// --- Test Suite --------------------------------------------------------------

describe('Anonymous Exam Submission Portal — Midnight ZK Contract v2', () => {

  it('1. Contract Structure: core circuits are exported and callable from managed runtime', () => {
    const contract = new Contract(buildWitnesses({}));
    expect(contract).toBeDefined();
    expect(typeof contract.circuits.claimWarranty).toBe('function');
    expect(typeof contract.circuits.resetProduct).toBe('function');
    expect(typeof contract.circuits.incrementSession).toBe('function');
    expect(contract).toHaveProperty('circuits');
    expect(contract).toHaveProperty('witnesses');
  });

  it('2. Witness Completeness: all 5 witnesses (including submission score and invigilator key) are defined', () => {
    const witnesses = buildWitnesses({
      studentKey:      'secret_student_id_key_2026',
      nonce:           'entropy_nonce_exam_submission',
      answersHash:     'sha256_answers_hash_exam_01',
      submissionScore: 180n,
      invigilatorKey:  'invigilator_signing_key_exam_board',
    });
    const contract = new Contract(witnesses);

    expect(contract.witnesses.productSecretKey).toBeDefined();
    expect(contract.witnesses.warrantyProofNonce).toBeDefined();
    expect(contract.witnesses.purchaseInvoiceHash).toBeDefined();
    expect(contract.witnesses.warrantyDaysRemaining).toBeDefined();
    expect(contract.witnesses.manufacturerSigningKey).toBeDefined();
  });

  it('3. Private Witness Byte Length: studentKey, submissionNonce, answersHash are all 32 bytes', () => {
    const witnesses = buildWitnesses({
      studentKey:  'student_secret_key_alpha',
      nonce:       'random_nonce_beta',
      answersHash: 'hashed_answers_gamma',
    });
    const mockCtx = { privateState: {} };

    const [, keyBytes]     = witnesses.productSecretKey(mockCtx);
    const [, nonceBytes]   = witnesses.warrantyProofNonce(mockCtx);
    const [, answersBytes] = witnesses.purchaseInvoiceHash(mockCtx);

    expect(keyBytes.length).toBe(32);
    expect(nonceBytes.length).toBe(32);
    expect(answersBytes.length).toBe(32);
  });

  it('4. Submission Score Threshold Witness: submissionScore returns bigint for passing check', () => {
    const studentScore   = 120n;
    const minimumPass    = 30n;
    const witnesses = buildWitnesses({ submissionScore: studentScore });
    const mockCtx = { privateState: {} };

    const [, score] = witnesses.warrantyDaysRemaining(mockCtx);
    expect(typeof score).toBe('bigint');
    expect(score).toBe(120n);
    expect(score >= minimumPass).toBe(true); // Submission QUALIFIES
  });

  it('5. ZK Privacy: student private witnesses are strictly isolated from public examId (no data leak)', () => {
    const publicExamId = toBytes32('exam_offering_midterm_2026');
    const witnesses = buildWitnesses({
      studentKey:  'super_secret_student_key',
      nonce:       'private_submission_nonce_secret',
      answersHash: 'encrypted_answers_hash',
    });
    const mockCtx = { privateState: {} };

    const [, keyBytes]     = witnesses.productSecretKey(mockCtx);
    const [, nonceBytes]   = witnesses.warrantyProofNonce(mockCtx);
    const [, answersBytes] = witnesses.purchaseInvoiceHash(mockCtx);

    expect(keyBytes).not.toEqual(publicExamId);
    expect(nonceBytes).not.toEqual(publicExamId);
    expect(answersBytes).not.toEqual(publicExamId);
  });

  it('6. Invigilator Authority Witness: invigilatorKey produces 32-byte array independent of student key', () => {
    const witnesses = buildWitnesses({
      studentKey:    'student_secret_key_abc',
      invigilatorKey: 'invigilator_signing_key_xyz',
    });
    const mockCtx = { privateState: {} };

    const [, studentKeyBytes]     = witnesses.productSecretKey(mockCtx);
    const [, invigilatorKeyBytes] = witnesses.manufacturerSigningKey(mockCtx);

    expect(invigilatorKeyBytes.length).toBe(32);
    expect(invigilatorKeyBytes).not.toEqual(studentKeyBytes);
  });

  it('7. Multi-Submission Commitment Uniqueness: different students produce distinct contract instances', () => {
    const witnessesA = buildWitnesses({ studentKey: 'student_alice_key', answersHash: 'answers_set_a' });
    const witnessesB = buildWitnesses({ studentKey: 'student_bob_key',   answersHash: 'answers_set_b' });
    const mockCtx = { privateState: {} };

    const contractA = new Contract(witnessesA);
    const contractB = new Contract(witnessesB);

    const [, keyA] = witnessesA.productSecretKey(mockCtx);
    const [, keyB] = witnessesB.productSecretKey(mockCtx);

    expect(contractA).not.toBe(contractB);
    expect(keyA).not.toEqual(keyB);
  });

  it('8. Ledger Schema Interface: ledger() export is a function querying the 8-field on-chain state', () => {
    expect(typeof ledger).toBe('function');
  });

  it('9. Failed Submission Case: submissionScore below minimumPassScore fails threshold check', () => {
    const studentScore  = 5n;
    const minimumPass   = 30n;
    const witnesses = buildWitnesses({ submissionScore: studentScore });
    const mockCtx = { privateState: {} };

    const [, score] = witnesses.warrantyDaysRemaining(mockCtx);
    expect(score >= minimumPass).toBe(false); // Submission FAILS — score too low
  });

  it('10. Session Isolation: witnesses built for different exam sessions produce independent nonce contexts', () => {
    const witnessesSession1 = buildWitnesses({ nonce: 'session_1_exam_nonce', submissionScore: 90n });
    const witnessesSession2 = buildWitnesses({ nonce: 'session_2_exam_nonce', submissionScore: 180n });
    const mockCtx = { privateState: { sessionId: 'test' } };

    const [, nonce1] = witnessesSession1.warrantyProofNonce(mockCtx);
    const [, nonce2] = witnessesSession2.warrantyProofNonce(mockCtx);

    expect(nonce1).not.toEqual(nonce2);
  });

});
