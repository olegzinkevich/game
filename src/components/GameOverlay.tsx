import React from 'react';
import { LevelConfig } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { getLevelTranslation } from '../i18n/translations';

interface GameOverlayProps {
  level: LevelConfig;
  gameWon: boolean;
  gameLost: boolean;
  onRetry: () => void;
  onNextLevel?: () => void;
  onBackToMenu: () => void;
  onReplayLevel: () => void;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({
  level,
  gameWon,
  gameLost,
  onRetry,
  onNextLevel,
  onBackToMenu,
  onReplayLevel,
}) => {
  const { t, translate, language } = useTranslation();

  if (!gameWon && !gameLost) return null;

  const isWin = gameWon;
  const isGameCompleted = isWin && !onNextLevel; // Last level completed
  const levelTrans = getLevelTranslation(language, level.id);

  const title = isGameCompleted
    ? t.gameCompleted
    : (isWin ? t.levelComplete : t.collision);

  const message = isGameCompleted
    ? t.gameCompletedMessage
    : (isWin
      ? translate('congratulations', { id: level.id, name: levelTrans.name })
      : translate('levelFailed', { id: level.id }));

  const responsiveStyles = `
    .game-overlay-title {
      font-size: 2rem;
      margin-bottom: 15px;
    }
    .game-overlay-message {
      font-size: 1.1rem;
      margin-bottom: 25px;
      line-height: 1.5;
    }

    @media (max-width: 767px) {
      .game-overlay-title {
        font-size: 1.5rem;
      }
      .game-overlay-message {
        font-size: 0.95rem;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: responsiveStyles }} />
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}>
        <div style={{
          backgroundColor: '#1a1a2e',
          border: `2px solid ${isGameCompleted ? '#FFD700' : (isWin ? '#4CAF50' : '#F44336')}`,
          borderRadius: '12px',
          padding: '30px',
          textAlign: 'center',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          maxWidth: '400px',
          width: '100%',
        }}>
          <h2 className="game-overlay-title" style={{
            color: isGameCompleted ? '#FFD700' : (isWin ? '#4CAF50' : '#F44336'),
          }}>
            {title}
          </h2>

          <p className="game-overlay-message">
            {message}
          </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          {gameLost && (
            <button
              onClick={onRetry}
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
                backgroundColor: '#F44336',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#D32F2F'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F44336'}
            >
              {t.retryLevel}
            </button>
          )}

          {gameWon && onNextLevel && (
            <button
              onClick={onNextLevel}
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#388E3C'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
            >
              {t.nextLevel}
            </button>
          )}

          <button
            onClick={onBackToMenu}
            style={{
              padding: '10px 20px',
              fontSize: '0.9rem',
              backgroundColor: 'transparent',
              color: '#ccc',
              border: '1px solid #555',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#333';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#ccc';
            }}
          >
            {t.backToMenu}
          </button>
        </div>

        {isWin && (
          <div style={{
            marginTop: '20px',
            fontSize: '0.9rem',
            color: isGameCompleted ? '#FFD700' : '#888',
          }}>
            {isGameCompleted ? '🏆🎉🏆' : `${translate('levelCompleted', { id: level.id })} 🎉`}
          </div>
        )}
        </div>
      </div>
    </>
  );
};