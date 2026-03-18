import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import track1 from '../assets/MusicTrack1.mp3';
import track2 from '../assets/MusicTrack2.mp3';
import track3 from '../assets/MusicTrack3.mp3';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio());

  const tracks = [
    { id: 0, title: 'Music Track 1', taTitle: 'இசைத் தடம் 1', file: track1, durationStr: '4:04' },
    { id: 1, title: 'Music Track 2', taTitle: 'இசைத் தடம் 2', file: track2, durationStr: '3:58' },
    { id: 2, title: 'Music Track 3', taTitle: 'இசைத் தடம் 3', file: track3, durationStr: '3:28' },
];

  useEffect(() => {
    const audio = audioRef.current;
    if (currentTrackIndex !== null && !audio.src) {
      audio.src = tracks[currentTrackIndex].file;
    }
  }, [currentTrackIndex, tracks]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume; // volume state is already 0.0-1.0

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      const nextIndex = (currentTrackIndex + 1) % tracks.length;
      const audio = audioRef.current;
      audio.src = tracks[nextIndex].file;
      audio.play();
      setCurrentTrackIndex(nextIndex);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume]);

  const playTrack = (index) => {
    const audio = audioRef.current;
    if (currentTrackIndex === index) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    } else {
      audio.src = tracks[index].file;
      audio.play();
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (currentTrackIndex === null) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seekTo = (time) => {
    const audio = audioRef.current;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const nextTrack = () => {
    if (currentTrackIndex === null) return;
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    playTrack(nextIndex);
  };

  const prevTrack = () => {
    if (currentTrackIndex === null) return;
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrack(prevIndex);
  };

  const adjustVolume = (newVolume) => {
    const audio = audioRef.current;
    const normalizedVolume = Math.min(Math.max(newVolume / 250, 0), 1);
    audio.volume = normalizedVolume;
    setVolume(normalizedVolume);
  };

  return (
    <AudioContext.Provider value={{
      isPlaying,
      currentTrackIndex,
      currentTrack: currentTrackIndex !== null ? tracks[currentTrackIndex] : null,
      tracks,
      volume: volume * 250, // Expose volume as 0-250
      currentTime,
      duration,
      playTrack,
      togglePlay,
      nextTrack,
      prevTrack,
      seekTo,
      adjustVolume
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
