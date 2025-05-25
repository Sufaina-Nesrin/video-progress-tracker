# Video Progress Tracker
A lightweight web application that tracks and saves users' progress while watching educational videos. It supports user login, progress tracking with segments, resuming playback from last watched position, and calculates overall completion percentage.

## Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Features](#features)
- [Design](#design)
- [Live Demo](#live-demo)

## Installation
1. Clone the repository:
```bash
 git clone https://github.com/Sufaina-Nesrin/video-progress-tracker.git
```

2. Install dependencies:
```bash
 npm install
 ```
 ## Configuration
Create a `.env` file in the root directory and add necessary variables:
```
PORT=
MONGO_URI=
```
 ## Usage
To run the project, use the following command:
```bash
npm start
```
## Features
- 👤 ```User Authentication```:
Simple local authentication using ```localStorage``` (demo purpose)and server-side user verification.
- 📈 ```Video Progress Tracking```:
Tracks watched segments ```(start-end)```.Calculates total watch time and percentage progress.
- 🔄 ```Auto Sync```:
Video progress is updated in real-time on play and pause events (only at ```1x``` playback speed).Allows resuming videos from the last watched point.
- 🔁 ```Segment Merging```:
Watched video segments are merged to avoid overlap and ensure accurate total time.
## Design
### ⏱️ Tracking Watched Intervals
When a user plays or pauses a video at normal speed ```(1x)```, the app records the start and end timestamps of each watched segment using ```video.currentTime```. These segments represent the actual intervals the user viewed.Each time a segment is recorded ```(on pause)```, it's sent to the backend via a ```POST``` request like:
``` 
{
  "start": 10,
  "end": 15,
  "duration": 30
}
```
This data is stored in a ```VideoProgress``` document under a ```segments``` array.
### 🧩 Merging Segments for Unique Progress
To avoid double-counting overlapping or repeated intervals (e.g., rewatching a part of the video), the backend runs a ```merge algorithm``` on the ```segments```.
The mergeSegments function:
1. Sorts all segments by start time.
2. Iterates through them, merging overlapping or adjacent segments into one.
3. Returns a clean list of non-overlapping intervals.

For example:
```
[
  { start: 10, end: 30 },
  { start: 25, end: 40 },
  { start: 50, end: 60 }
]
```
becomes:
```
[
  { start: 10, end: 40 },
  { start: 50, end: 60 }
]
```
- uses persistand storage for time sections, total watched time and progress.Here is an example:
```
{
  _id: ObjectId,
  userId: 1,            
  videoId: "intro-to-ai.mp4",  
  segments: [                  segments 
    { start: 10, end: 30 },
    { start: 50, end: 60 }
  ],
  duration: 300,               
  totalWatchedTime:30,
  progress: 10 //in percentage
}
```
## Live-Demo
👉 [Video Progress Tracker - Live Demo](https://video-progress-tracker-two.vercel.app/)


