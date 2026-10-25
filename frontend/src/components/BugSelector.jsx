import React, { useState } from 'react';
import { Bug, Code, Play, FileCode, AlertOctagon, Sparkles, Terminal, Edit3 } from 'lucide-react';

export default function BugSelector({
  examples,
  selectedExampleId,
  onSelectExample,
  isAnalyzing,
  isVerifying,
  onAnalyze,
  onRunReproduce,
  customCode,
  setCustomCode,
  customTest,
  setCustomTest,
  customError,
  setCustomError,
  isCustomMode,
  setIsCustomMode
}) {
  const [activeCodeTab, setActiveCodeTab] = useState('buggy'); // 'buggy' | 'test' | 'error'

  const selectedExample = examples.find(e => e.id === selectedExampleId) || examples[0];

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '22px' }}>
      {/* Header with Mode Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bug size={18} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
            Select Failure Scenario
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', background: 'rgba(30, 41, 59, 0.7)', padding: '2px 8px', borderRadius: '4px' }}>
            {examples.length} Built-in Reproductions
          </span>
        </div>

        {/* Mode switch: Built-in vs Custom */}
        <div style={{
          display: 'flex',
          background: 'rgba(15, 23, 42, 0.8)',
          padding: '3px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setIsCustomMode(false)}
            style={{
              padding: '5px 12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: !isCustomMode ? 'var(--accent-blue)' : 'transparent',
              color: !isCustomMode ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            Predefined Bug Scenarios
          </button>
          <button
            onClick={() => setIsCustomMode(true)}
            style={{
              padding: '5px 12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: isCustomMode ? 'var(--accent-blue)' : 'transparent',
              color: isCustomMode ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            Paste Custom Code
          </button>
        </div>
      </div>

      {!isCustomMode ? (
        <>
          {/* Example Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '10px',
            marginBottom: '18px'
          }}>
            {examples.map((ex) => {
              const isSelected = ex.id === selectedExampleId;
              return (
                <div
                  key={ex.id}
                  onClick={() => onSelectExample(ex.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                    border: `1px solid ${isSelected ? 'var(--accent-blue)' : 'rgba(59, 130, 246, 0.1)'}`,
                    boxShadow: isSelected ? '0 0 15px rgba(59, 130, 246, 0.2)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                      color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)'
                    }}>
                      {ex.category}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      {ex.code_filename}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: isSelected ? '#ffffff' : '#cbd5e1', marginBottom: '4px' }}>
                    {ex.title}
                  </h3>
                  <p style={{
                    fontSize: '0.73rem',
                    color: 'var(--text-dim)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {ex.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Code Viewer Sub-tabs */}
          {selectedExample && (
            <div style={{
              background: '#090d16',
              borderRadius: '10px',
              border: '1px solid #1e293b',
              overflow: 'hidden',
              marginBottom: '16px'
            }}>
              {/* Tab selector bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #1e293b',
                background: '#0f172a',
                padding: '4px 12px'
              }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => setActiveCodeTab('buggy')}
                    style={{
                      background: activeCodeTab === 'buggy' ? '#1e293b' : 'transparent',
                      border: 'none',
                      color: activeCodeTab === 'buggy' ? '#38bdf8' : '#94a3b8',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FileCode size={14} />
                    <span>{selectedExample.code_filename} (Buggy)</span>
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('test')}
                    style={{
                      background: activeCodeTab === 'test' ? '#1e293b' : 'transparent',
                      border: 'none',
                      color: activeCodeTab === 'test' ? '#38bdf8' : '#94a3b8',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Terminal size={14} />
                    <span>{selectedExample.test_filename} (Pytest Suite)</span>
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('error')}
                    style={{
                      background: activeCodeTab === 'error' ? '#1e293b' : 'transparent',
                      border: 'none',
                      color: activeCodeTab === 'error' ? '#f43f5e' : '#94a3b8',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <AlertOctagon size={14} />
                    <span>CI Failure Trace</span>
                  </button>
                </div>

                <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                  Python 3.14
                </span>
              </div>

              {/* Code display area */}
              <pre style={{
                padding: '14px 18px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: activeCodeTab === 'error' ? '#fb7185' : '#cbd5e1',
                lineHeight: 1.5,
                maxHeight: '260px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap'
              }}>
                {activeCodeTab === 'buggy' && selectedExample.buggy_code}
                {activeCodeTab === 'test' && selectedExample.test_code}
                {activeCodeTab === 'error' && selectedExample.expected_error}
              </pre>
            </div>
          )}
        </>
      ) : (
        /* Custom Code Mode Input */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Python Implementation Code:
            </label>
            <textarea
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="def calculate_discount(price, rate):&#10;    return price - (price * rate / 100)"
              style={{
                width: '100%',
                height: '180px',
                background: '#090d16',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                color: '#f8fafc',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                padding: '12px',
                resize: 'vertical'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              CI Error Log / Traceback:
            </label>
            <textarea
              value={customError}
              onChange={(e) => setCustomError(e.target.value)}
              placeholder="ZeroDivisionError: division by zero&#10;  File 'discount.py', line 2, in calculate_discount"
              style={{
                width: '100%',
                height: '180px',
                background: '#090d16',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                color: '#fb7185',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                padding: '12px',
                resize: 'vertical'
              }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        paddingTop: '6px'
      }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Step 1: Inspect failure &rarr; Step 2: Diagnose root cause &rarr; Step 3: Run regression verification
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Run Failing Test Button (Reproduce bug in real pytest!) */}
          {!isCustomMode && (
            <button
              onClick={onRunReproduce}
              disabled={isAnalyzing || isVerifying}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#f87171',
                padding: '9px 16px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: isAnalyzing || isVerifying ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              title="Execute pytest on original buggy code to observe real failure output"
            >
              <Terminal size={15} />
              <span>Reproduce Bug (Pytest Fail)</span>
            </button>
          )}

          {/* Analyze Failure Button */}
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing}
            style={{
              background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
              border: 'none',
              color: '#ffffff',
              padding: '9px 20px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.2s'
            }}
          >
            <Sparkles size={16} />
            <span>{isAnalyzing ? 'Investigating CI Trace...' : 'Analyze Failure'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
