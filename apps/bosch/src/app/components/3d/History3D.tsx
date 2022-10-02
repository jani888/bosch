import React, { ReactElement } from 'react';
import { HistoryItem } from '../View3D';

interface History3DProps {
  component: ReactElement;
  history: HistoryItem[];
}

export function History3D({ component, history }: History3DProps) {
  return (
    <>
      {history.map((historyItem, index) => (
        <group key={index} position={[historyItem.x, 0, historyItem.y]}>
          {React.cloneElement(component, {
            color:
              historyItem.itemType === 'measurement' ? '#E00420' : '#40A9FF',
            opacity: (index + 1) / (history.length + 1) + 0.5,
          })}
        </group>
      ))}
    </>
  );
}
