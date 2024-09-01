import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store'; // Adjust the path as necessary
import { FaPlay, FaPause, FaBackward, FaForward, FaRandom, FaSync, FaHeart } from 'react-icons/fa';
import { FiVolume2 } from 'react-icons/fi';
import { toggleFavoriteRequest } from '../features/songs/songsSlice'; // Import the action

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false); // Ensure isFavorite is always a boolean
  const audioRef = useRef<HTMLAudioElement>(null);
  const dispatch = useDispatch();

  // Get the current playing song from the Redux store
  const currentPlayMusic = useSelector((state: RootState) => state.songs.currentPlayMusic);

  // Toggle play/pause state
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update current time and duration
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(current);
      setDuration(dur);
    }
  };

  // Seek to a different time in the audio
  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(event.target.value);
    }
  };

  // Format time in minutes:seconds
  const formatTime = (time: number) => {
    if (isNaN(time) || time < 0) {
      return '0:00';
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Toggle favorite status
  const handleToggleFavorite = () => {
    if (currentPlayMusic) {
      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);
      dispatch(toggleFavoriteRequest({
        id: currentPlayMusic._id,
        isFavorite: newFavoriteStatus
      }));
    }
  };

  useEffect(() => {
    // Reset player state when song changes
    setIsPlaying(false);
    setCurrentTime(0);

    // Update local favorite status
    if (currentPlayMusic) {
      setIsFavorite(currentPlayMusic.isFavorite ?? false); // Default to false if isFavorite is undefined
    }
  }, [currentPlayMusic]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white flex items-center p-4 space-x-4 z-[35]">
      <button className="text-gray-400 hover:text-white">
        <FaRandom />
      </button>
      <button className="text-gray-400 hover:text-white">
        <FaBackward />
      </button>
      <button onClick={togglePlayPause} className="text-white bg-green-500 p-2 rounded-full">
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <button className="text-gray-400 hover:text-white">
        <FaForward />
      </button>
      <button className="text-gray-400 hover:text-white">
        <FaSync />
      </button>

      <div className="flex items-center space-x-2 flex-grow">
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full"
        />
        <span>{formatTime(duration)}</span>
      </div>

      <button className="text-gray-400 hover:text-white">
        <FiVolume2 />
      </button>

      {currentPlayMusic && (
        <>
          <img
            src={`https://simon-music-player-backend.vercel.app${currentPlayMusic.albumPhotoUrl}`}
            alt={`${currentPlayMusic.title} Album Cover`}
            className="w-12 h-12 object-cover rounded-lg"
          />
          <div className="flex flex-col">
            <span className="font-bold">{currentPlayMusic.title}</span>
            <span className="text-sm text-gray-400">{currentPlayMusic.artist}</span>
          </div>
        </>
      )}

      <button
        onClick={handleToggleFavorite}
        className={`text-${isFavorite ? 'green-500' : 'gray-400'} hover:text-${isFavorite ? 'red-400' : 'white'}`}
      >
        <FaHeart />
      </button>

      {currentPlayMusic && (
        <audio
          ref={audioRef}
          src={`https://simon-music-player-backend.vercel.app${currentPlayMusic.audioUrl}`}
          onTimeUpdate={handleTimeUpdate}
        />
      )}
    </div>
  );
};

export default MusicPlayer;
