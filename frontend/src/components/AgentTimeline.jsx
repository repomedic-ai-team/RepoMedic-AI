import React from 'react';
import { Search, BrainCircuit, Wrench, CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react';

export default function AgentTimeline({ currentStage, isAnalyzing, isVerifying, testResult }) {
  // Stages: 1=Inspect, 2=Diagnose, 3=Propose Fix, 4=Verify
  const stages = [
    {
      id: 'inspect',
      num: 1,
      title: 'Inspect',
      subtitle: 'Ingest CI failure & test trace',
      icon: Search,
      isActive: isAnalyzing && currentStage === 'inspect',
      isCompleted: currentStage === 'diagnose' || currentStage === 'propose' || currentStage === 'verify' || currentStage === 'done'
    },
    {
      id: 'diagnose',
      num: 2,
      title: 'Diagnose',
      subtitle: 'Isolate root cause & faulty line',
      icon: BrainCircuit,
      isActive: isAnalyzing && currentStage === 'diagnose',
      isCompleted: currentStage === 'propose' || currentStage === 'verify' || currentStage === 'done'
    },
    {
      id: 'propose',
      num: 3,
      title: 'Propose Fix',
      subtitle: 'Synthesize minimal diff patch',
      icon: Wrench,
      isActive: isAnalyzing && currentStage === 'propose',
      isCompleted: currentStage === 'verify' || currentStage === 'done'
    },
    {
      id: 'verify',
      num: 4,
      title: 'Verify Sandbox',
      subtitle: 'Execute real pytest runner',
      icon: testResult ? (testResult.success ? CheckCircle2 : XCircle) : CheckCircle2,
      isActive: isVerifying,
      isCompleted: currentStage === 'done' && testResult?.success,
      isFailed: currentStage === 'done' && testResult && !testResult.success
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isAnalyzing || isVerifying ? '#38bdf8' : (testResult?.success ? '#10b981' : '#64748b'),
            boxShadow: isAnalyzing || isVerifying ? '0 0 10px #38bdf8' : 'none'
          }} />
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#cbd5e1' }}>
            Agentic CI Investigation Pipeline
          </h2>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
          Autonomous Execution Loop
        </span>
      </div>

      {/* Responsive timeline flex row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        position: 'relative'
      }}>
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isDone = stage.isCompleted;
          const isCurrent = stage.isActive;
          const isFailed = stage.isFailed;

          let badgeBg = 'rgba(30, 41, 59, 0.4)';
          let badgeBorder = 'rgba(148, 163, 184, 0.2)';
          let iconColor = '#64748b';
          let textColor = '#94a3b8';

          if (isFailed) {
            badgeBg = 'rgba(239, 68, 68, 0.15)';
            badgeBorder = 'rgba(239, 68, 68, 0.4)';
            iconColor = '#f87171';
            textColor = '#f87171';
          } else if (isDone) {
            badgeBg = 'rgba(16, 185, 129, 0.12)';
            badgeBorder = 'rgba(16, 185, 129, 0.4)';
            iconColor = '#34d399';
            textColor = '#f8fafc';
          } else if (isCurrent) {
            badgeBg = 'rgba(59, 130, 246, 0.18)';
            badgeBorder = 'rgba(56, 189, 248, 0.6)';
            iconColor = '#38bdf8';
            textColor = '#f8fafc';
          }

          return (
            <div
              key={stage.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '10px',
                background: badgeBg,
                border: `1px solid ${badgeBorder}`,
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: isCurrent ? 'var(--accent-blue)' : 'rgba(15, 23, 42, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: isCurrent ? '#ffffff' : iconColor
              }}>
                {isCurrent ? (
                  <Loader2 size={16} className="animate-spin" style={{ animation: 'spinSlow 2s linear infinite' }} />
                ) : (
                  <Icon size={16} />
                )}
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600 }}>0{stage.num}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: textColor }}>
                    {stage.title}
                  </span>
                </div>
                <p style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-dim)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {isFailed ? 'Pytest failure detected' : stage.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
