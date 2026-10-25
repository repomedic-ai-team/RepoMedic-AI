import React, { useState } from 'react';
import { GitPullRequest, Copy, Check, ShieldCheck, FileCode, CheckCircle2 } from 'lucide-react';

export default function DiffViewer({ analysis, onVerifyFix, isVerifying, testResult }) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('diff'); // 'diff' | 'source'

  if (!analysis) return null;

  const handleCopy = () => {
    const textToCopy = viewMode === 'diff' ? analysis.diff : analysis.suggested_fix;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render colored unified diff lines
  const renderDiffLines = (diffStr) => {
    if (!diffStr) return <div>No diff available.</div>;

    const lines = diffStr.split('\n');
    return lines.map((line, idx) => {
      let className = 'diff-line diff-line-normal';
      let prefix = '';

      if (line.startsWith('+++') || line.startsWith('---')) {
        className = 'diff-line diff-line-meta';
      } else if (line.startsWith('@@')) {
        className = 'diff-line diff-line-meta';
      } else if (line.startsWith('+')) {
        className = 'diff-line diff-line-add';
        prefix = '+ ';
      } else if (line.startsWith('-')) {
        className = 'diff-line diff-line-del';
        prefix = '- ';
      }

      return (
        <div key={idx} className={className}>
          <span style={{ userSelect: 'none', width: '35px', color: '#475569', fontSize: '0.72rem' }}>
            {idx + 1}
          </span>
          <span>{line}</span>
        </div>
      );
    });
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '22px' }}>
      {/* Diff Card Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            padding: '6px',
            borderRadius: '8px'
          }}>
            <GitPullRequest size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
              Synthesized Regression Patch
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Automated minimal diff preserving API surface contracts
            </p>
          </div>
        </div>

        {/* View Mode & Copy Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '3px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setViewMode('diff')}
              style={{
                padding: '4px 10px',
                fontSize: '0.73rem',
                fontWeight: 600,
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: viewMode === 'diff' ? 'var(--accent-blue)' : 'transparent',
                color: viewMode === 'diff' ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              Unified Diff
            </button>
            <button
              onClick={() => setViewMode('source')}
              style={{
                padding: '4px 10px',
                fontSize: '0.73rem',
                fontWeight: 600,
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: viewMode === 'source' ? 'var(--accent-blue)' : 'transparent',
                color: viewMode === 'source' ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              Full Patch Code
            </button>
          </div>

          <button
            onClick={handleCopy}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid var(--border-subtle)',
              color: copied ? '#34d399' : 'var(--text-main)',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Code / Diff Container */}
      <div style={{
        background: '#090d16',
        borderRadius: '10px',
        border: '1px solid #1e293b',
        overflow: 'hidden',
        marginBottom: '16px'
      }}>
        <div style={{
          background: '#0f172a',
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1e293b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCode size={14} color="#38bdf8" />
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>
              patch_v1.diff
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            unified format
          </span>
        </div>

        <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '8px 0' }}>
          {viewMode === 'diff' ? (
            renderDiffLines(analysis.diff)
          ) : (
            <pre style={{
              padding: '12px 16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: '#cbd5e1',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap'
            }}>
              {analysis.suggested_fix}
            </pre>
          )}
        </div>
      </div>

      {/* Primary Verification Action */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'rgba(16, 185, 129, 0.06)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: '10px',
        padding: '12px 16px'
      }}>
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', marginBottom: '2px' }}>
            Verify Fix in Pytest Sandbox
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Applies patch to isolated sandbox and runs actual pytest runner with exit code assertion.
          </p>
        </div>

        <button
          onClick={onVerifyFix}
          disabled={isVerifying}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none',
            color: '#ffffff',
            padding: '9px 20px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: isVerifying ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)',
            transition: 'all 0.2s'
          }}
        >
          <ShieldCheck size={16} />
          <span>{isVerifying ? 'Running Pytest...' : 'Verify Fix Now'}</span>
        </button>
      </div>
    </div>
  );
}
