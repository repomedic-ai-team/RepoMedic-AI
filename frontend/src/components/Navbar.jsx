import React from 'react';
import { ShieldCheck, Cpu, Terminal, RefreshCw, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Navbar({ backendStatus, onReset, onOpenDocs }) {
  const isHealthy = backendStatus?.status === 'ok';

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(7, 10, 18, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      {/* Brand logo & title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
        }}>
          <ShieldCheck size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
              RepoMedic <span style={{ color: 'var(--accent-cyan)' }}>AI</span>
            </h1>
            <span style={{
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid var(--border-highlight)',
              color: 'var(--accent-cyan)',
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              CI Agent
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Agentic CI Failure Investigator & Verified Regression Fixer
          </p>
        </div>
      </div>

      {/* Center Track Badge */}
      <div style={{
        display: 'none',
        padding: '4px 12px',
        borderRadius: '20px',
        background: 'rgba(30, 41, 59, 0.6)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        fontSize: '0.75rem',
        color: '#94a3b8'
      }} className="desktop-track-badge">
        <span style={{ color: '#38bdf8', fontWeight: 600 }}>Build With Nova</span> • Track 2: AI for Developers
      </div>

      {/* Right Actions & Health Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Backend health status badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.75rem',
          padding: '6px 12px',
          borderRadius: '8px',
          background: isHealthy ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          border: `1px solid ${isHealthy ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          color: isHealthy ? '#34d399' : '#f87171'
        }}>
          {isHealthy ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
          <span>{isHealthy ? 'Backend & Pytest Online' : 'Connecting Backend...'}</span>
        </div>

        {/* Documentation / Readme */}
        <button
          onClick={onOpenDocs}
          style={{
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-main)',
            padding: '7px 12px',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
          title="Architecture & Overview"
        >
          <FileText size={14} />
          <span>Docs</span>
        </button>

        {/* Reset Session */}
        <button
          onClick={onReset}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            padding: '7px 12px',
            borderRadius: '8px',
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
          title="Reset Dashboard State"
        >
          <RefreshCw size={14} />
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
}
