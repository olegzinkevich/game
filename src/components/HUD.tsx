import React from 'react';
import { LevelConfig } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { getLevelTranslation } from '../i18n/translations';

interface HUDProps {
  level: LevelConfig;
  elapsedTime: number;
  isPaused: boolean;
  onPause: () => void;
  onMenu: () => void;
}

export const HUD: React.FC<HUDProps> = ({ level, elapsedTime, isPaused, onPause, onMenu }) => {
  const { t, language } = useTranslation();
  const levelTrans = getLevelTranslation(language, level.id);
  const remainingTime = Math.max(0, level.durationToSurvive - elapsedTime);
  const progressPercent = (elapsedTime / level.durationToSurvive) * 100;

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Responsive styles
  const responsiveStyles = `
    .hud-container {
      position: absolute;
      top: 10px;
      left: 10px;
      right: 320px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
      font-family: Arial, sans-serif;
      font-size: 14px;
      z-index: 10;
      padding: 10px 12px;
      background: linear-gradient(90deg, rgba(10, 12, 30, 0.7), rgba(10, 12, 30, 0.35));
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(6px);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
    }

    /* Mobile phones - compact single line */
    @media (max-width: 767px) {
      .hud-container {
        left: 5px;
        right: 5px;
        top: 5px;
        flex-direction: row !important;
        gap: 8px;
        padding: 8px 10px;
        font-size: 11px;
        justify-content: space-between;
        align-items: center;
      }
      .hud-level-info {
        font-size: 12px !important;
        font-weight: bold;
        margin-bottom: 0 !important;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        min-width: 0;
      }
      .hud-timer {
        font-size: 18px !important;
        font-weight: bold;
        margin-bottom: 0 !important;
      }
      .hud-timer-container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .hud-progress-bar {
        width: 70px !important;
        height: 4px !important;
      }
      .hud-controls {
        display: flex !important;
        gap: 6px;
        text-align: right;
        margin-bottom: 0 !important;
      }
      .hud-button {
        padding: 8px 12px !important;
        font-size: 16px !important;
        white-space: nowrap;
        min-width: 44px;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .hud-description {
        display: none !important;
      }
      .hud-left-section {
        flex: 1;
        min-width: 0;
        overflow: hidden;
      }
      .hud-center-section {
        flex-shrink: 0;
      }
      .hud-right-section {
        flex-shrink: 0;
      }
    }

    /* Tablets */
    @media (min-width: 768px) and (max-width: 1024px) {
      .hud-container {
        right: 280px;
        font-size: 13px;
      }
      .hud-level-info {
        font-size: 16px !important;
      }
      .hud-button {
        padding: 6px 12px !important;
        font-size: 13px !important;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: responsiveStyles }} />
      <div className="hud-container">
        {/* Left side - Level info */}
        <div className="hud-left-section">
          <div className="hud-level-info" style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
            {t.level} {level.id}: {levelTrans.name}
          </div>
          <div className="hud-description" style={{ color: '#ccc' }}>
            {level.orbits.length} {t.orbits} • {level.orbits.filter(o => o.isShield).length} {t.shields}
          </div>
        </div>

      {/* Center - Timer and progress */}
      <div className="hud-center-section hud-timer-container" style={{ textAlign: 'center' }}>
        <div className="hud-timer" style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: remainingTime < 10 ? '#FF4444' : '#FFD700',
          marginBottom: '5px',
          textShadow: '0 0 10px rgba(255, 200, 120, 0.6)',
        }}>
          {formatTime(remainingTime)}
        </div>

        {/* Progress bar */}
        <div className="hud-progress-bar" style={{
          width: '200px',
          maxWidth: '100%',
          height: '8px',
          backgroundColor: '#333',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${Math.min(100, progressPercent)}%`,
            height: '100%',
            backgroundColor: progressPercent >= 100 ? '#4CAF50' : '#FFD700',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Right side - Controls */}
      <div className="hud-right-section">
        <div className="hud-controls" style={{ display: 'flex', gap: '8px', marginBottom: '5px' }}>
          <button
            onClick={onPause}
            className="hud-button"
            style={{
              padding: '8px 16px',
              backgroundColor: isPaused ? '#FF9800' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            {isPaused ? '▶' : '⏸'}
          </button>

          <button
            onClick={onMenu}
            className="hud-button"
            style={{
              padding: '8px 16px',
              backgroundColor: '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            {t.menu}
          </button>
        </div>

        {/* <div className="hud-description" style={{ fontSize: '12px', color: '#ccc', marginTop: '5px' }}>
          {t.clickOrbitsHint}
        </div> */}
      </div>

      {/* Pause overlay */}
      {isPaused && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: '20px',
          }}>
            <div style={{
              fontSize: '48px',
              color: 'white',
              fontWeight: 'bold',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
            }}>
              {t.paused}
            </div>
            <button
              onClick={onPause}
              style={{
                padding: '15px 40px',
                fontSize: '20px',
                backgroundColor: '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(255, 152, 0, 0.4)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#F57C00';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#FF9800';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {t.continue}
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
};