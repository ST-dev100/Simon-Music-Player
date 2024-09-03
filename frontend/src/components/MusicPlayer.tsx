import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store'; // Adjust the path as necessary
import { FaPlay, FaPause, FaBackward, FaForward, FaRandom, FaSync, FaHeart } from 'react-icons/fa';
import { FiVolume2 } from 'react-icons/fi';
import { toggleFavoriteRequest, setCurrentPlayMusic } from '../features/songs/songsSlice'; // Import the actions

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const dispatch = useDispatch();

  // Get the current playing song and the full list of songs from the Redux store
  const currentPlayMusic = useSelector((state: RootState) => state.songs.currentPlayMusic);
  const songs = useSelector((state: RootState) => state.songs.songs);

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
        isFavorite: newFavoriteStatus,
      }));
    }
  };

  // Play the next song in the list
  const handleNextSong = () => {
    if (currentPlayMusic && songs.length > 0) {
      const currentIndex = songs.findIndex(song => song._id === currentPlayMusic._id);
      const nextIndex = (currentIndex + 1) % songs.length;
      dispatch(setCurrentPlayMusic(songs[nextIndex]));
    }
  };

  // Play the previous song in the list
  const handlePreviousSong = () => {
    if (currentPlayMusic && songs.length > 0) {
      const currentIndex = songs.findIndex(song => song._id === currentPlayMusic._id);
      const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
      dispatch(setCurrentPlayMusic(songs[previousIndex]));
    }
  };

  useEffect(() => {
    // Reset player state when song changes
    setCurrentTime(0);
    
    // Update local favorite status
    if (currentPlayMusic) {
      setIsPlaying(true);
      setIsFavorite(currentPlayMusic.isFavorite ?? false);
    }
  }, [currentPlayMusic]);

  return (
    <div className="col-span-12 bg-gray-800 text-white flex items-center p-4 space-x-4 z-[35] w-full overflow-auto shadow-lg border-t border-gray-700">
      <button className="text-gray-400 hover:text-white transition-colors duration-300">
        <FaRandom className="md:text-xl text-sm" />
      </button>
      <button onClick={handlePreviousSong} className="text-gray-400 hover:text-white transition-colors duration-300">
        <FaBackward className="md:text-xl text-sm" />
      </button>
      <button onClick={togglePlayPause} className="text-white bg-green-500 p-2 rounded-full hover:bg-green-600 transition-colors duration-300">
        {isPlaying ? <FaPause className="md:text-2xl text-sm" /> : <FaPlay className="md:text-2xl text-sm" /> }
      </button>
      <button onClick={handleNextSong} className="text-gray-400 hover:text-white transition-colors duration-300">
        <FaForward className="md:text-xl text-sm" />
      </button>
      <button className="text-gray-400 hover:text-white transition-colors duration-300">
        <FaSync className="md:text-xl text-sm" />
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

      <button className="text-gray-400 hover:text-white transition-colors duration-300 md:text-lg text-sm">
        <FiVolume2 className="md:text-xl text-sm" />
      </button>

      {currentPlayMusic && (
        <div className="flex items-center space-x-4">
          <img
            src={currentPlayMusic.albumPhotoUrl}
            alt={`${currentPlayMusic.title} Album Cover`}
            className="md:w-16 md:h-16 w-6 h-6 object-cover rounded-full md:rounded-lg shadow-md"
          />
          <div className="flex flex-col">
            <span className="font-bold md:text-lg text-sm">{currentPlayMusic.title}</span>
            <span className="text-sm md:text-xs text-gray-400">{currentPlayMusic.artist}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleToggleFavorite}
        className={`text-xl ${isFavorite ? 'text-green-500' : 'text-gray-400'} hover:text-red-400 transition-colors duration-300 md:text-lg text-sm`}
      >
        <FaHeart />
      </button>

      {currentPlayMusic && (
        <audio
          ref={audioRef}
          src={currentPlayMusic.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          autoPlay={true}
        />
      )}
    </div>
  );
};

export default MusicPlayer;
