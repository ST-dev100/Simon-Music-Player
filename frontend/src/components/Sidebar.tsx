import React, { useState } from 'react';
import { useSelector} from 'react-redux';
import { FaHome, FaUserFriends, FaPodcast, FaPlus, FaSearch, FaTimes } from 'react-icons/fa';
import { MdFavorite } from 'react-icons/md';
import { RootState } from '../store'; // Adjust the path as necessary


interface SidebarProps {
  onSearch: (query: string) => void;
  onLikedSongsClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSearch, onLikedSongsClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  
  const { stats } = useSelector((state: RootState) => state.songs);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleSidebarToggle = () => {
    setSidebarVisible(prev => !prev);
  };

  const toggleSection = (section: string) => {
    setActiveSection(prev => (prev === section ? null : section));
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-gray-300 h-full col-span-2 p-4 flex flex-col fixed top-0 left-0 transition-transform duration-300 ease-in-out ${
          isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0  z-30`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-0 text-gray-500 md:hidden"
          onClick={() => setSidebarVisible(false)}
        >
          <FaTimes />
        </button>

        {/* Search Input */}
        <div className="mt-3 md:mb-6">
          <div className="bg-gray-800 flex items-center rounded-md py-2 px-3">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="space-y-2">
            <li className="flex items-center space-x-3 py-2 px-3 rounded hover:bg-gray-800">
              <FaHome />
              <span>Home</span>
            </li>
            <li className="flex items-center space-x-3 py-2 px-3 rounded hover:bg-gray-800">
              <FaUserFriends />
              <span>Following</span>
            </li>
            <li className="flex items-center space-x-3 py-2 px-3 rounded hover:bg-gray-800">
              <FaPodcast />
              <span>Podcast</span>
            </li>
          </ul>
        </nav>

        {/* Playlist */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Playlist</span>
            <FaPlus className="cursor-pointer" />
          </div>
          <ul className="space-y-2">
            <li
              className="flex items-center space-x-3 py-2 px-3 rounded hover:bg-gray-800 cursor-pointer"
              onClick={onLikedSongsClick}
            >
              <MdFavorite className="text-green-500" />
              <span>Liked Songs</span>
            </li>
          </ul>
        </div>

        {/* Artists */}
        <div className="mt-6">
          <div
            className="flex items-center justify-between text-sm mb-2 cursor-pointer"
            onClick={() => toggleSection('artists')}
          >
            <span>Artists</span>
            <FaPlus className={`transition-transform ${activeSection === 'artists' ? 'rotate-45' : ''}`} />
          </div>
          {activeSection === 'artists' && (
            <ul className="space-y-2">
              {stats?.artistStats.map((artist) => (
                <li key={artist._id} className="py-2 px-3">
                  {artist._id}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Albums */}
        <div className="mt-6">
          <div
            className="flex items-center justify-between text-sm mb-2 cursor-pointer"
            onClick={() => toggleSection('albums')}
          >
            <span>Albums</span>
            <FaPlus className={`transition-transform ${activeSection === 'albums' ? 'rotate-45' : ''}`} />
          </div>
          {activeSection === 'albums' && (
            <ul className="space-y-2">
              {stats?.artistStats.flatMap((artist) => artist.albums.map((album) => (
                <li key={album} className="py-2 px-3">
                  {album}
                </li>
              )))}
            </ul>
          )}
        </div>

        {/* Genres */}
        <div className="mt-6">
          <div
            className="flex items-center justify-between text-sm mb-2 cursor-pointer"
            onClick={() => toggleSection('genres')}
          >
            <span>Genres</span>
            <FaPlus className={`transition-transform ${activeSection === 'genres' ? 'rotate-45' : ''}`} />
          </div>
          {activeSection === 'genres' && (
            <ul className="space-y-2">
              {stats?.genreStats.map((genre) => (
                <li key={genre._id} className="py-2 px-3">
                  {genre._id}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        className="fixed top-12 left-4 md:hidden text-white z-20"
        onClick={handleSidebarToggle}
      >
        <FaHome />
      </button>
    </>
  );
};

export default Sidebar;
