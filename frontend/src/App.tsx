import  { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { toggleShowAddSong } from './features/songs/songsSlice';
import AddSong from './components/AddSong';
import SongList from './components/SongList';
import MusicPlayer from './components/MusicPlayer';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Preloader from './components/Preloader'; 

function App() {
  const dispatch = useDispatch();
  const showAddSong = useSelector((state: RootState) => state.songs.showAddSong);
  const selectedSong = useSelector((state: RootState) => state.songs.selectedSong); // Get selectedSong from the state
  const [searchQuery, setSearchQuery] = useState('');
  const [showLikedSongs, setShowLikedSongs] = useState(false);
  const [loading, setLoading] = useState(true);
  

  const handleLikedSongsClick = () => {
    setShowLikedSongs((prev) => !prev);
  };

  const closeAddSongModal = () => {
    dispatch(toggleShowAddSong());
  };

  //  Simulate a loading period
   useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000); // Simulate a 3-second loading time
  }, []);

  if (loading) {
    return <Preloader />; // Show the preloader while loading
  }

  return (
    <div className='grid grid-cols-12 bg-gray-900 gap-4'>
      <Header />
      <Sidebar onSearch={setSearchQuery} onLikedSongsClick={handleLikedSongsClick}/>
      <div className={`relative md:col-span-10 col-span-12`}>
        <AddSong isOpen={showAddSong} onClose={closeAddSongModal} selectedSong={selectedSong} /> {/* Pass selectedSong */}
        <SongList searchQuery={searchQuery} showLikedSongs={showLikedSongs}/>
      </div>
      <div className="col-span-12 sticky bottom-0 z-40">
        <MusicPlayer />
      </div>
    </div>
  );
}

export default App;
