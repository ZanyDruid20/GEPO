'use client';

import { useState } from 'react';
import { useWrapped } from '@/hooks/userWrapped';
import Link from 'next/link';
import { AnimatePresence, motion, Variants } from 'framer-motion';

const BADGES = [
  { name: 'Committed', emoji: '💪', description: 'Active contributor' },
  { name: 'Polyglot', emoji: '🌍', description: 'Master of multiple languages' },
  { name: 'Open Source', emoji: '⭐', description: 'Contributions to community' },
  { name: 'Builder', emoji: '🔨', description: 'Created amazing projects' },
  { name: 'Consistent', emoji: '📈', description: 'Regular commits' },
  { name: 'Legend', emoji: '🏆', description: 'Developer extraordinaire' },
];

export default function WrappedReport() {
  const { wrapped, loading, error } = useWrapped();
  const [currentSlide, setCurrentSlide] = useState(0);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '18px'
      }}>
        Loading your all-time stats...
      </div>
    );
  }

  if (error || !wrapped) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '18px'
      }}>
        No wrapped data available
      </div>
    );
  }

  const slides = [
    { id: 'intro' },
    { id: 'commits' },
    { id: 'languages' },
    { id: 'score' },
    { id: 'languages-detail' },
    { id: 'badges' },
    { id: 'outro' },
  ];

  const slideVariants: Variants = {
    initial: { opacity: 0, y: 30, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -30, scale: 0.98, transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } },
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const IntroSlide = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      gap: '32px'
    }}>
      <style>{`
        @keyframes bounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .logo { animation: bounce 2s infinite; }
        .intro-text { animation: fadeInUp 0.8s ease-out; }
      `}</style>
      
      <div className="logo" style={{ fontSize: '80px' }}>🎉</div>
      <h1 className="intro-text" style={{ fontSize: '64px', fontWeight: 'bold', margin: 0, color: 'white' }}>
        Your All-Time
      </h1>
      <p className="intro-text" style={{ fontSize: '48px', margin: 0, color: 'rgba(255,255,255,0.8)' }}>
        GitHub Journey
      </p>
      <p className="intro-text" style={{ fontSize: '20px', color: 'rgba(255,255,255,0.6)', marginTop: '16px' }}>
        Complete profile breakdown
      </p>
    </div>
  );

  const CommitsSlide = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      gap: '32px'
    }}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); } }
        .stat-number { animation: slideIn 1s ease-out; font-size: 120px; font-weight: 800; background: linear-gradient(135deg, #60a5fa 0%, #34d399 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .stat-label { animation: slideIn 1.2s ease-out; }
      `}</style>
      
      <div style={{ fontSize: '64px' }}>⚡</div>
      <div className="stat-number">{wrapped.totalCommits.toLocaleString()}</div>
      <div className="stat-label" style={{ fontSize: '32px', color: 'rgba(255,255,255,0.9)' }}>Total Commits</div>
      <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', maxWidth: '600px' }}>
        That&apos;s a lot of code pushed to the world! 🚀
      </p>
    </div>
  );

  const LanguagesSlide = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      gap: '32px',
      padding: '40px'
    }}>
      <div style={{ fontSize: '64px' }}>💻</div>
      <h2 style={{ fontSize: '40px', margin: 0 }}>Top Language</h2>
      <div style={{
        fontSize: '72px',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #c084fc 0%, #60a5fa 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        {wrapped.languages?.[0]?.language || 'N/A'}
      </div>
      <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)' }}>
        {wrapped.languages?.[0]?.percentage.toFixed(1)}% of your code
      </p>
    </div>
  );

  const ScoreSlide = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      gap: '32px'
    }}>
      <div style={{ fontSize: '64px' }}>⭐</div>
      <h2 style={{ fontSize: '40px', margin: 0 }}>Your Score</h2>
      <div style={{
        fontSize: '120px',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        {wrapped.score}
      </div>
      <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)' }}>
        Across {wrapped.totalRepos} public repositories
      </p>
    </div>
  );

  const LanguagesDetailSlide = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '60px 40px',
      gap: '40px'
    }}>
      <h2 style={{ fontSize: '40px', margin: 0, marginBottom: '20px' }}>Your Language Arsenal</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        width: '100%',
        maxWidth: '700px'
      }}>
        {wrapped.languages?.slice(0, 4).map((lang, idx) => (
          <div key={idx} style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.2)',
            animation: `slideIn 0.5s ease-out ${idx * 0.1}s backwards`
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>
              {lang.language === 'JavaScript' && '🟨'}
              {lang.language === 'TypeScript' && '🟦'}
              {lang.language === 'Python' && '🐍'}
              {lang.language === 'Java' && '☕'}
              {lang.language === 'C++' && '⚙️'}
              {lang.language === 'Go' && '🐹'}
              {lang.language === 'Rust' && '🦀'}
              {!['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust'].includes(lang.language) && '💎'}
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>{lang.language}</div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>{lang.percentage.toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  );

  const BadgesSlide = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '60px 40px',
      gap: '40px'
    }}>
      <div style={{ fontSize: '64px' }}>🏆</div>
      <h2 style={{ fontSize: '40px', margin: 0 }}>Achievements Unlocked</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '20px',
        width: '100%',
        maxWidth: '900px'
      }}>
        {BADGES.map((badge, idx) => (
          <div key={idx} style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '28px 20px',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.2)',
            animation: `slideIn 0.5s ease-out ${idx * 0.1}s backwards`
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>{badge.emoji}</div>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{badge.name}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{badge.description}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const OutroSlide = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      gap: '32px'
    }}>
      <div style={{ fontSize: '80px' }}>✨</div>
      <h1 style={{ fontSize: '56px', margin: 0 }}>That&apos;s Your Journey!</h1>
      <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.8)', maxWidth: '600px' }}>
        Keep coding, keep building, and keep pushing the boundaries of what&apos;s possible.
      </p>
      <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
        <Link href="/dashboard" style={{
          padding: '12px 32px',
          background: 'white',
          color: '#667eea',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );

  const renderSlide = () => {
    switch(slides[currentSlide].id) {
      case 'intro': return <IntroSlide />;
      case 'commits': return <CommitsSlide />;
      case 'languages': return <LanguagesSlide />;
      case 'score': return <ScoreSlide />;
      case 'languages-detail': return <LanguagesDetailSlide />;
      case 'badges': return <BadgesSlide />;
      case 'outro': return <OutroSlide />;
      default: return <IntroSlide />;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden',
      color: 'white'
    }}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={slides[currentSlide].id}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ minHeight: '100vh' }}
        >
          {renderSlide()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Bottom */}
      <div style={{
        position: 'absolute',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '20px',
        alignItems: 'center'
      }}>
        <button onClick={handlePrev} style={{
          padding: '10px 20px',
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          color: 'white',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          ← Back
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          {slides.map((_, idx) => (
            <div key={idx} style={{
              width: idx === currentSlide ? '32px' : '8px',
              height: '8px',
              background: idx === currentSlide ? 'white' : 'rgba(255,255,255,0.3)',
              borderRadius: '4px',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }} onClick={() => setCurrentSlide(idx)} />
          ))}
        </div>

        <button onClick={handleNext} style={{
          padding: '10px 20px',
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          color: 'white',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          Next →
        </button>
      </div>

      {/* Counter */}
      <div style={{
        position: 'absolute',
        top: '24px',
        right: '24px',
        fontSize: '14px',
        color: 'rgba(255,255,255,0.6)'
      }}>
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
}
