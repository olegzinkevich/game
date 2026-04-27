import React from 'react';
import { LevelConfig } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { getLevelTranslation } from '../i18n/translations';

interface MenuProps {
  levels: LevelConfig[];
  completedLevels: Set<number>;
  onStartGame: (levelId: number) => void;
  onLevelSelect: (levelId: number) => void;
  onResumeGame?: () => void;
  hasSavedGame?: boolean;
}

export const Menu: React.FC<MenuProps> = ({ levels, completedLevels, onStartGame, onLevelSelect, onResumeGame, hasSavedGame }) => {
  const { t, translate, language } = useTranslation();

  // Filter levels: show only completed levels and the next available level
  const availableLevels = levels.filter(level => {
    // Level 1 is always available
    if (level.id === 1) return true;
    // Level is available if it's completed
    if (completedLevels.has(level.id)) return true;
    // Level is available if previous level is completed
    if (completedLevels.has(level.id - 1)) return true;
    return false;
  });

  // Find the next level to play (first non-completed available level)
  const nextLevelToPlay = availableLevels.find(level => !completedLevels.has(level.id))?.id || 1;

  const menuContainerStyle = `
    .menu-container {
      overflow: hidden !important;
    }
    .menu-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      height: 100%;
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      padding: 1vmin 2vmin;
      box-sizing: border-box;
    }
    .menu-title {
      font-size: clamp(2.2rem, 7vmin, 4rem);
      margin: 1.2vmin 0;
      flex-shrink: 1;
    }
    .menu-description {
      font-size: clamp(1.1rem, 3vmin, 1.5rem);
      margin-bottom: 2vmin;
      flex-shrink: 1;
      line-height: 1.4;
    }
    .menu-buttons {
      margin-bottom: 2vmin;
      flex-shrink: 0;
    }
    .menu-buttons button {
      padding: 1.5vmin 3vmin !important;
      font-size: clamp(1.2rem, 3vmin, 1.5rem) !important;
    }
    .menu-levels {
      flex: 1;
      min-height: 0;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      display: flex;
      flex-wrap: wrap;
      gap: 1vmin;
      justify-content: center;
      align-content: flex-start;
      padding: 0.5vmin;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 215, 0, 0.5) rgba(255, 255, 255, 0.1);
      -webkit-overflow-scrolling: touch;
      touch-action: pan-y;
    }
    .menu-levels::-webkit-scrollbar {
      width: 8px;
    }
    .menu-levels::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
    .menu-levels::-webkit-scrollbar-thumb {
      background: rgba(255, 215, 0, 0.5);
      border-radius: 4px;
    }
    .menu-levels::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 215, 0, 0.7);
    }
    .menu-level-card {
      padding: 1.5vmin 2vmin !important;
      min-width: 150px !important;
      max-width: 220px !important;
    }
    .menu-level-card h3 {
      font-size: clamp(1rem, 2.5vmin, 1.4rem) !important;
      margin: 0 0 0.5vmin 0 !important;
    }
    .menu-level-card .level-info {
      font-size: clamp(0.85rem, 1.8vmin, 1.1rem) !important;
    }
    .menu-footer {
      flex-shrink: 1;
      padding: 0.5vmin 0;
      font-size: clamp(0.85rem, 2vmin, 1.1rem) !important;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: menuContainerStyle }} />
      <div className="menu-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#000011',
        backgroundImage: `url(${process.env.PUBLIC_URL}/background/menu_bg.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}>
        <div className="menu-content">
          <h1 className="menu-title" style={{
            textAlign: 'center',
            color: '#FFD700',
            textShadow: '0 0 10px #FFD700',
          }}>
            {t.gameTitle}
          </h1>

          <p className="menu-description" style={{
            textAlign: 'center',
            maxWidth: '600px',
          }}>
            {t.gameDescription}
          </p>

          <div className="menu-buttons" style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {hasSavedGame && onResumeGame ? (
              <button
                onClick={onResumeGame}
                style={{
                  padding: '10px 20px',
                  fontSize: 'clamp(0.9rem, 2.5vmin, 1.1rem)',
                  backgroundColor: '#FF9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  fontWeight: 'bold',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F57C00'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF9800'}
              >
                {t.resumeGame}
              </button>
            ) : (
              <button
                onClick={() => onStartGame(nextLevelToPlay)}
                style={{
                  padding: '10px 20px',
                  fontSize: 'clamp(0.9rem, 2.5vmin, 1.1rem)',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
              >
                {completedLevels.size === 0 ? t.startGame : t.continueGame}
              </button>
            )}
          </div>

          <div className="menu-levels">
            {availableLevels.map((level) => {
              const isCompleted = completedLevels.has(level.id);
              const levelTrans = getLevelTranslation(language, level.id);
              return (
                <div
                  key={level.id}
                  className="menu-level-card"
                  onClick={() => onStartGame(level.id)}
                  style={{
                    padding: '10px 15px',
                    backgroundColor: isCompleted ? '#1a2e1a' : '#1a1a2e',
                    border: `1px solid ${isCompleted ? '#4CAF50' : '#333'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textAlign: 'center',
                    position: 'relative',
                    minWidth: '150px',
                    maxWidth: '200px',
                    flex: '1 1 150px',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = isCompleted ? '#2a3e2a' : '#2a2a3e';
                    e.currentTarget.style.borderColor = '#FFD700';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = isCompleted ? '#1a2e1a' : '#1a1a2e';
                    e.currentTarget.style.borderColor = isCompleted ? '#4CAF50' : '#333';
                  }}
                >
                  {isCompleted && (
                    <div style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      color: '#4CAF50',
                      fontSize: '1rem',
                    }}>
                      ✓
                    </div>
                  )}
                  <h3 style={{
                    margin: '0 0 5px 0',
                    color: '#FFD700',
                    fontSize: 'clamp(0.85rem, 2vmin, 1.1rem)',
                  }}>
                    {t.level} {level.id}: {levelTrans.name}
                  </h3>
                  <div className="level-info" style={{
                    fontSize: 'clamp(0.65rem, 1.5vmin, 0.8rem)',
                    color: '#888',
                  }}>
                    {level.orbits.length} {t.orbits} • {level.orbits.filter(o => o.isShield).length} {t.shields}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="menu-footer" style={{
            fontSize: 'clamp(0.7rem, 1.8vmin, 0.9rem)',
            color: '#666',
            textAlign: 'center',
          }}>
            <p style={{ margin: 0 }}>{t.controlsHint}</p>
          </div>
        </div>
      </div>
    </>
  );
};