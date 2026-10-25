import React, { useState } from 'react';
import { Terminal, CheckCircle2, XCircle, Clock, Copy, Check, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function TestConsole({ testResult, isVerifying, activeMode }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLogs = () => {
    if (!testResult) return;
    const log = `Pytest Output:\n${testResult.stdout}\n${testResult.stderr ? '\nErrors:\n' + testResult.stderr : ''}`;
    navigator.clipboard.writeText(log);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '22px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            color: 'var(--accent-blue)',
            padding: '6px',
            borderRadius: '8px'
          }}>
            <Terminal size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
              Pytest Sandbox Execution Engine
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Subprocess output executed directly in an isolated temporary environment
            </p>
          </div>
        </div>

        {testResult && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Mode badge: Buggy vs Fixed */}
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '6px',
              background: testResult.mode === 'fixed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: testResult.mode === 'fixed' ? '#34d399' : '#f87171',
              border: `1px solid ${testResult.mode === 'fixed' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
            }}>
              {testResult.mode === 'fixed' ? 'VERIFIED PATCH RUN' : 'BUGGY REPRODUCTION RUN'}
            </span>

            {/* Copy log button */}
            <button
              onClick={handleCopyLogs}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '6px',
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid var(--border-subtle)',
                color: copied ? '#34d399' : 'var(--text-main)',
                fontSize: '0.73rem',
                cursor: 'pointer'
              }}
            >
              {copied ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy Log'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Metrics Row if Test Has Run */}
      {testResult && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '10px',
          marginBottom: '14px'
        }}>
          {/* Status */}
          <div style={{
            background: testResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${testResult.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            padding: '10px 12px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {testResult.success ? <CheckCircle2 size={18} color="#34d399" /> : <XCircle size={18} color="#f87171 Gamboge" />}
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Result</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: testResult.success ? '#34d399' : '#f87171' }}>
                {testResult.success ? 'PASSED (0)' : `FAILED (${testResult.exit_code})`}
              </div>
            </div>
          </div>

          {/* Passed Count */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid var(--border-subtle)',
            padding: '10px 12px',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Tests Passed</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: testResult.passed_count > 0 ? '#34d399' : '#cbd5e1' }}>
              {testResult.passed_count}
            </div>
          </div>

          {/* Failed Count */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid var(--border-subtle)',
            padding: '10px 12px',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Tests Failed</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: testResult.failed_count > 0 ? '#f87171' : '#cbd5e1' }}>
              {testResult.failed_count}
            </div>
          </div>

          {/* Execution Time */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid var(--border-subtle)',
            padding: '10px 12px',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Latency</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}>
              {testResult.duration_ms} ms
            </div>
          </div>
        </div>
      )}

      {/* Terminal Display */}
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-dots">
            <span className="dot dot-red"></span>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
            pytest sandbox • {testResult ? (testResult.mode === 'fixed' ? 'fixed_build' : 'buggy_build') : 'idle'}
          </span>
          <span style={{ fontSize: '0.68rem', color: '#475569', fontFamily: 'var(--font-mono)' }}>
            exit: {testResult ? testResult.exit_code : 0}
          </span>
        </div>

        <div className="terminal-body">
          {isVerifying ? (
            <div style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="animate-spin-slow">⠋</span>
              <span>Spawning isolated tempdir and executing pytest subprocess...</span>
            </div>
          ) : testResult ? (
            <>
              {testResult.stdout ? (
                <div style={{ whiteSpace: 'pre-wrap', color: '#e2e8f0' }}>{testResult.stdout}</div>
              ) : null}
              {testResult.stderr ? (
                <div style={{ whiteSpace: 'pre-wrap', color: '#f87171', marginTop: '8px' }}>
                  {testResult.stderr}
                </div>
              ) : null}
            </>
          ) : (
            <div style={{ color: '#64748b' }}>
              <div>$ pytest -v test_suite.py</div>
              <div style={{ marginTop: '4px' }}>
                Waiting for execution. Click "Reproduce Bug (Pytest Fail)" to run against buggy code, or "Verify Fix Now" to run against verified patch.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
