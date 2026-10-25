import React from 'react';
import { X, ShieldCheck, CheckCircle2, Terminal, AlertTriangle, Layers, Award } from 'lucide-react';

export default function DocsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(3, 7, 18, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#0d1322',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '16px',
        maxWidth: '720px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
        padding: '24px'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(148, 163, 184, 0.15)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb, #38bdf8)', padding: '6px', borderRadius: '8px' }}>
              <Award size={20} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                RepoMedic AI — Architecture & Guide
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Build With Nova Hackathon • Track 2: AI for Developers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8', marginBottom: '4px' }}>
              🎯 Problem Statement
            </h3>
            <p>
              Developers spend up to 30% of their coding sprint diagnosing failed CI/CD builds, wading through verbose test traces, locating the exact line number, and validating regression safety.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399', marginBottom: '4px' }}>
              ⚡ The Solution
            </h3>
            <p>
              RepoMedic AI acts as an autonomous CI/CD failure investigator. It ingests test failures, diagnoses root causes down to the faulty line, produces minimal regression patches, and verifies the fix using real, sandboxed pytest execution.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fbbf24', marginBottom: '6px' }}>
              🛡️ Safety & Execution Architecture
            </h3>
            <div style={{
              background: '#090d16',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #1e293b',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: '#94a3b8'
            }}>
              <div>1. Web UI &rarr; Selects Bug &rarr; POST /analyze</div>
              <div>2. Deterministic AST Parser isolates function & line</div>
              <div>3. Minimal Patch Synthesizer builds unified diff</div>
              <div>4. Sandboxed Subprocess: isolated tempdir &rarr; python3 -m pytest -v</div>
              <div>5. Real stdout/stderr parsed & verified (Zero fabricated tests)</div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
              🚀 Built-in Failure Scenarios
            </h3>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li><strong>Off-by-One in API Paginator:</strong> 1-indexed to 0-indexed slice mismatch causing AssertionError.</li>
              <li><strong>Unchecked List Indexing in Telemetry:</strong> Cold-start empty event stream throwing unhandled IndexError.</li>
              <li><strong>ZeroDivisionError in SLA Monitor:</strong> Newly provisioned cluster with zero checks crashing with division by zero.</li>
              <li><strong>Mutable Default Argument Leak:</strong> Default list parameter in security audit logger persisting state across calls.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              background: 'var(--accent-blue)',
              color: '#ffffff',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
