import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import TrailingCursor from './GhostCursor';
import BallCursor from './BallCursor';

const CursorSwitcher: React.FC = () => {
  const { theme } = useTheme();

  return (
    <>
      {theme === 'dark' ? <BallCursor /> : <TrailingCursor />}
    </>
  );
};

export default CursorSwitcher;
