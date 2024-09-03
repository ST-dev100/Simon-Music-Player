import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addSongRequest, updateSongRequest } from '../features/songs/songsSlice';
import { uploadAudioToCloudinary, uploadImageToCloudinary } from '../utils/cloudinary';
import { FaTimes } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';

interface Song {
  _id: string;
  title: string;
  artist: string;
  audioUrl: string;
  album: string;
  genre: string;
  albumPhotoUrl: string;
  createdAt: string;
  isFavorite?: boolean;
}

interface AddSongProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSong: Song | null;
}

const AddSong: React.FC<AddSongProps> = ({ isOpen, onClose, selectedSong }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Loading state

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedSong) {
      setTitle(selectedSong.title);
      setArtist(selectedSong.artist);
      setAlbum(selectedSong.album);
      setGenre(selectedSong.genre);
      setAudioPreview(`${selectedSong.audioUrl}`);
      setImagePreview(`${selectedSong.albumPhotoUrl}`);
    } else {
      setTitle('');
      setArtist('');
      setAlbum('');
      setGenre('');
      setImageFile(null);
      setAudioFile(null);
      setImagePreview(null);
      setAudioPreview(null);
    }
  }, [selectedSong]);

  useEffect(() => {
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach((audio) => {
      if (isOpen) {
        (audio as HTMLAudioElement).pause();
      }
    });
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setAudioFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAudioPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true

    if (!title || !artist) {
      alert('Please fill out all required fields and upload an audio file.');
      setLoading(false); // Set loading to false if validation fails
      return;
    }

    let imageUrl = imagePreview || '';
    let audioUrl = audioPreview || '';

    if (imageFile) {
      imageUrl = await uploadImageToCloudinary(imageFile);
    }

    if (audioFile) {
      audioUrl = await uploadAudioToCloudinary(audioFile);
    }

    const songData = {
      title,
      artist,
      album,
      genre,
      albumPhotoUrl: imageUrl,
      audioUrl,
      createdAt: new Date().toISOString(),
      _id: selectedSong ? selectedSong._id : "k",
    };

    try {
      if (selectedSong) {
        await dispatch(updateSongRequest({ ...songData, _id: selectedSong._id }));
      } else {
        await dispatch(addSongRequest(songData));
      }
      onClose();
    } finally {
      setLoading(false); // Set loading to false after submission
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 overflow-auto transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-transform transform ${isOpen ? 'scale-100' : 'scale-95'}`}>
      <div className="bg-gradient-to-r border-4  from-indigo-500 dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-lg relative max-h-screen overflow-auto transition-transform transform scale-100 opacity-100 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <FaTimes className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-semibold text-center text-white dark:text-gray-100 mb-6">
          {selectedSong ? 'Edit Song' : 'Add New Song'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Song Title"
              className="w-full p-4 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 transition-shadow shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Artist"
              className="w-full p-4 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 transition-shadow shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
            <input
              type="text"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              placeholder="Album"
              className="w-full p-4 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 transition-shadow shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Genre"
              className="w-full p-4 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 transition-shadow shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-white">Album Photo</label>
            <label className="flex items-center justify-center w-full p-4 border border-gray-300 rounded-lg cursor-pointer dark:border-gray-700 dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={loading}
              />
              <span className="text-white">Choose Image</span>
            </label>
            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-full h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-600" />}
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-white dark:text-gray-400">Audio File</label>
            <label className="flex items-center justify-center w-full p-4 border border-gray-300 rounded-lg cursor-pointer dark:border-gray-700 dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioChange}
                className="hidden"
                disabled={loading}
              />
              <span className="text-white">Choose Audio</span>
            </label>
            {audioPreview && (
              <div className="mt-2 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <audio controls src={audioPreview} className="w-full"></audio>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg transition-colors hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              selectedSong ? 'Update Song' : 'Add Song'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSong;
