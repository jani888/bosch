import { Walktour } from 'walktour';
import { Typography } from '@mui/material';
import { WalktourFooter } from './WalktourFooter';
import React from 'react';

export function Tutorial() {
  return (
    <Walktour
      disableClose
      allowForeignTarget={false}
      customTitleRenderer={(title) => (
        <Typography variant="h5" fontWeight="bold">
          {title}
        </Typography>
      )}
      customFooterRenderer={(tourLogic) => (
        <WalktourFooter
          tourLogic={tourLogic}
          onSkip={() => tourLogic?.close()}
          onNext={() => tourLogic?.next()}
        />
      )}
      steps={[
        {
          selector: '#app',
          title: 'Welcome to our Code #LikeABosch demo',
          description:
            'This is a demo of our solution for the Bosch Code #LikeABosch software challenge',
        },
        {
          selector: '#dataset-selector',
          title: 'Choose the dataset',
          description: 'First of all, choose the dataset you want to use',
        },
        {
          selector: '#video-toggle',
          title: 'Toggle video visibility',
          description: "If you don't want to see the video, you can hide it",
        },
        {
          selector: '#playback-control',
          title: 'Playback control',
          description: 'You can control the simulation here',
        },
        {
          selector: '#speed-selector',
          title: 'Select the simulation speed',
          description:
            'You can change the simulation speed with this dropdown. 1x means 1 second in the simulation is 1 second in real time',
        },
        {
          selector: '#play-button',
          title: 'Start the simulation',
          description: 'You can start the simulation with this button',
        },
        {
          selector: '#dashboard',
          title: 'Car dashboard',
          description:
            "Here you can see the car's speed and the left and right blind spot sensors. These sensors will blink, when something is in the blind spot.",
        },
        {
          selector: '#object-list',
          title: 'Select an object',
          description:
            'You can select an object from the list to see its details',
          closeLabel: 'Okay, got it',
        },
      ]}
    />
  );
}
