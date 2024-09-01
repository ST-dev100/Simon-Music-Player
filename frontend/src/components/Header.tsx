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
    <header className="bg-gray-900 text-white py-2 px-4 flex justify-between items-center col-span-12">
      <div className="text-green-400 font-bold md:text-xl text-sm">SIMON MUSIC</div>
      <div className="flex items-center space-x-4">
        <button
          onClick={openAddSongModal}
          className="fixed z-[80] right-0 top-0 flex items-center justify-center p-4 rounded-full bg-green-600 text-white transition-transform duration-300 transform hover:scale-110 hover:shadow-lg"
        >
          <MdAdd className="md:text-2xl text-sm" />
        </button>
      </div>
    </header>
  );
};

export default Header;
