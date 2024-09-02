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
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex items-center p-4 space-x-4 z-[35] w-full overflow-auto shadow-lg border-t border-gray-700">
      <button className="text-gray-400 hover:text-white transition-colors duration-300">
        <FaRandom className="text-xl" />
      </button>
      <button className="text-gray-400 hover:text-white transition-colors duration-300">
        <FaBackward className="text-xl" />
      </button>
      <button onClick={togglePlayPause} className="text-white bg-green-500 p-2 rounded-full hover:bg-green-600 transition-colors duration-300">
        {isPlaying ? <FaPause className="text-2xl" /> : <FaPlay className="text-2xl" />}
      </button>
      <button className="text-gray-400 hover:text-white transition-colors duration-300">
        <FaForward className="text-xl" />
      </button>
      <button className="text-gray-400 hover:text-white transition-colors duration-300">
        <FaSync className="text-xl" />
      </button>

      <div className="flex items-center space-x-2 flex-grow">
        <span className="text-sm">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full accent-green-500"
        />
        <span className="text-sm">{formatTime(duration)}</span>
      </div>

      <button className="text-gray-400 hover:text-white transition-colors duration-300">
        <FiVolume2 className="text-xl" />
      </button>

      {currentPlayMusic && (
        <div className="flex items-center space-x-4">
          <img
            src={currentPlayMusic.albumPhotoUrl}
            alt={`${currentPlayMusic.title} Album Cover`}
            className="w-16 h-16 object-cover rounded-lg shadow-md"
          />
          <div className="flex flex-col">
            <span className="font-bold text-lg">{currentPlayMusic.title}</span>
            <span className="text-sm text-gray-400">{currentPlayMusic.artist}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleToggleFavorite}
        className={`text-xl ${isFavorite ? 'text-red-500' : 'text-gray-400'} hover:text-red-400 transition-colors duration-300`}
      >
        <FaHeart />
      </button>

      {currentPlayMusic && (
        <audio
          ref={audioRef}
          src={currentPlayMusic.audioUrl}
          onTimeUpdate={handleTimeUpdate}
        />
      )}
    </div>
  );
};

export default MusicPlayer;
