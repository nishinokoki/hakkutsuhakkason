import React from 'react';

/**
 * ローディング表示コンポーネント
 */
export const LoadingIndicator = ({ show }) => {
  return (
    <div id="loading-indicator" className={show ? 'show' : ''}>
      <div className="loading-spinner"></div>
      <span>考え中...</span>
    </div>
  );
};
