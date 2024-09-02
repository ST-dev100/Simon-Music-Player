// src/components/Header.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { MdAdd } from 'react-icons/md';
import { toggleShowAddSong } from '../features/songs/songsSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch();

  const openAddSongModal = () => {
    dispatch(toggleShowAddSong());
  };

  return (
    <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center col-span-12">
      <div className="text-green-400 font-bold text-lg md:text-2xl">
        SIMON MUSIC
      </div>
      <button
        onClick={openAddSongModal}
        className="flex items-center justify-center p-3 md:p-4 rounded-full bg-green-600 text-white transition-transform duration-300 transform hover:scale-110 hover:shadow-lg focus:outline-none"
      >
        <MdAdd className="text-xl md:text-3xl" />
      </button>
    </header>
  );
};

export default Header;
