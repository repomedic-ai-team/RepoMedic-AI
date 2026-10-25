import React from 'react';
import { AlertCircle, CheckCircle2, Crosshair, Sparkles, Tag, GitCommit } from 'lucide-react';

export default function RootCauseCard({ analysis }) {
  if (!analysis) return null;

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '22px' }}>
      {/* Title & Metadata Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '16px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: '#38bdf8',
            padding: '6px',
            borderRadius: '8px'
          }}>
            <Crosshair size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
              Root Cause Diagnostics
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#38bdf8',
                background: 'rgba(59, 130, 246, 0.1)',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                fn: {analysis.faulty_function}()
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#f43f5e',
                background: 'rgba(244, 63, 94, 0.1)',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(244, 63, 94, 0.2)'
              }}>
                Line #{analysis.faulty_line}
              </span>
            </div>
          </div>
        </div>

        {/* Confidence Meter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Confidence Score
            </span>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fbbf24' }}>
              {Math.round(analysis.confidence_score * 100)}% Match
            </div>
          </div>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '2px solid rgba(251, 191, 36, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={18} color="#fbbf24" />
          </div>
        </div>
      </div>

      {/* Root Cause Summary statement */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        borderLeft: '4px solid #38bdf8',
        padding: '12px 16px',
        borderRadius: '0 8px 8px 0',
        marginBottom: '18px'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
          Isolated Failure Hypothesis:
        </div>
        <p style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.5 }}>
          {analysis.root_cause}
        </p>
      </div>

      {/* Expected vs Actual Behavior Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '14px',
        marginBottom: '18px'
      }}>
        {/* Expected Behavior */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '10px',
          padding: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <CheckCircle2 size={16} color="#34d399" />
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Expected Specification
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            {analysis.expected_behavior}
          </p>
        </div>

        {/* Actual Behavior */}
        <div style={{
          background: 'rgba(244, 63, 94, 0.08)',
          border: '1px solid rgba(244, 63, 94, 0.25)',
          borderRadius: '10px',
          padding: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <AlertCircle size={16} color="#fb7185" />
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fb7185', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Actual Runtime Defect
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            {analysis.actual_behavior}
          </p>
        </div>
      </div>

      {/* In-depth Explanation & Category Tags */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        paddingTop: '10px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Tag size={14} color="var(--text-dim)" />
          {analysis.tags && analysis.tags.map((tag, i) => (
            <span
              key={i}
              style={{
                fontSize: '0.7rem',
                background: 'rgba(30, 41, 59, 0.8)',
                color: '#94a3b8',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(148, 163, 184, 0.15)'
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
          Engine: {analysis.analysis_source}
        </span>
      </div>
    </div>
  );
}
