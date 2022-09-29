import React from 'react';
import { PlaybackContext } from '../app';

export function usePlayback() {
  return React.useContext(PlaybackContext);
}
