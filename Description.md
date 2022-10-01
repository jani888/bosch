# Our solution for Task1 and Task2:
The program sends across the given data in a pipeline consisting of 3 parts:
1. Deduplication section: Recognize objects based on the data collected by the sensors; filter the congruent measures
2. Prediction section: Predict the sequent position of the objects according to physics laws
3. Objection fusing section: Merge objects based on the predicted and measured data

## Software functions
There are several options can be found on the website:
### Sensor visualization:
Represents the sensors installed on the ego vehicle
### Video-display:
The video from the traffic, which the sensor data originated from.
### Vehicle tracking:
By clicking on a tile from the panels positioned to the left side, we can observe the path of the chosen object:
- measured positions -> red capsule
- computed positions -> blue capsule
### Object graph:
We can get feedback about the number of the recognized objects
### Blind spot detection:
The hideable red rectangles shows us the predicted blindspots of the driver.
When an objects enters the blind spot area, the location prediction continues, while the warning indicator turns orange and an audio signal is played. Next to the indicator, a logo belonging to the foreign object’s type appears.
### Playing speed:
Sets the simulations speed
### Dataset changing:
Sets the simulations dataset

## Tech stack:
- React
- node.js
- tree.js
- MongoDB
- Blender
- Premiere Pro

# Innovative solutions from our team (Task3)
## The world of connected vehicles:

For the 3rd part of the challenge, we came up with an innovative solution for road safety.


We took a look at the system from a step back, in a wider context. We came up with an idea of a network connecting vehicles (for example through a low latency 5G network), which can share information about the environment. This makes it possible for cars to make collision avoidance decisions together. It means, that if 2 cars with 5-5 sensors are driving in the same area, they can share their measurements, and each of them has the measurements of 10 sensors. The system would make it possible, to share information from CCTV cameras, or the Bluetooth signal of mobile phones.


In the model, we represent on the HFDN tab, the blue car trying to make a right turn, but the driver can't see the pedestrian on the road, but thanks to the “red” cars sensors, the “blue” car is informed about the pedestrian, so it can decrease its speed, or make an emergency stop, before actually observing the pedestrian. At the same time, the “red” car stops before the intersection.

> This system can also be extended with other smart traffic devices, which can broadcast information to nearby vehicles.

## Beyond our project
A supporting software to be considered for the companies like bosh
During the development we felt that software, like we produced, could be preciously helpful,  implemented with further functions. To demonstrate that, we ….
