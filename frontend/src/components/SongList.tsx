// src/components/SongList.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSongsRequest, fetchStatsRequest, setCurrentPlayMusic, deleteSongRequest, setSelectedSong } from '../features/songs/songsSlice';
import { RootState } from '../store';
import styled from '@emotion/styled';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importing icons
import Skeleton from 'react-loading-skeleton';

interface Song {
  _id: string;
  title: string;
  artist: string;
  audioUrl: string;
  genre: string;
  album: string;
  albumPhotoUrl: string;
  createdAt: string;
  isFavorite?: boolean;
}

interface SongListProps {
  searchQuery: string;
  showLikedSongs: boolean;
}

const Container = styled.div`
  background-color: #181818;
  color: white;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Banner = styled.div`
  position: relative;
  background: url('music2.jpg') center center / cover no-repeat;
  height: 300px;
  display: flex;
  align-items: flex-end;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    height: 200px;
    padding: 15px;
  }
`;

const BannerText = styled.div`
  color: white;
  font-size: 24px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const StatsSection = styled.div`
  background-color: #282828;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;

  @media (max-width: 768px) {
    padding: 15px;
    flex-direction: column;
  }
`;

const StatItem = styled.div`
  text-align: center;
  margin: 10px;

  @media (max-width: 768px) {
    margin: 5px;
  }
`;

const StatTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 5px;
  color: #ffffff;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const StatValue = styled.p`
  font-size: 24px;
  margin: 0;
  color: #1db954;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const MostPlayedSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const ViewAll = styled.button`
  background: none;
  border: none;
  color: #1db954;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const SongsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding-bottom: 10px;

  @media (max-width: 768px) {
    gap: 15px;
  }
`;

const SongCard = styled.div`
  flex: 1 1 calc(20% - 20px);
  background-color: #282828;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    flex: 1 1 calc(50% - 15px);
  }

  @media (max-width: 480px) {
    flex: 1 1 calc(100% - 15px);
  }
`;

const AlbumImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;

  @media (max-width: 768px) {
    height: 120px;
  }
`;

const SongDetails = styled.div`
  padding: 10px;
`;

const SongTitle = styled.h3`
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  color: #ffffff;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const Artist = styled.p`
  font-size: 12px;
  margin: 5px 0 0;
  color: #b3b3b3;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const IconContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    top: 5px;
    right: 5px;
  }
`;

const EditIcon = styled(FaEdit)`
  color: #1db954;
  cursor: pointer;
`;

const DeleteIcon = styled(FaTrash)`
  color: #e74c3c;
  cursor: pointer;
`;

const SongList: React.FC<SongListProps> = ({ searchQuery, showLikedSongs }) => {
  const dispatch = useDispatch();
  const { songs, stats, loading, error } = useSelector((state: RootState) => state.songs);
  const [viewAll, setViewAll] = useState(false);

  useEffect(() => {
    dispatch(fetchSongsRequest());
    dispatch(fetchStatsRequest());
  }, [dispatch]);

  const filteredSongs = songs
    .filter(song => song.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(song => (showLikedSongs ? song.isFavorite : true));

  const songsToShow = viewAll ? filteredSongs : filteredSongs.slice(0, 4);

  const handleSongClick = (song: Song) => {
    dispatch(setCurrentPlayMusic(song));
  };

  const handleEditClick = (song: Song) => {
    dispatch(setSelectedSong(song)); // Dispatch setSelectedSong with the selected song
  };

  const handleDeleteClick = (id: string) => {
    dispatch(deleteSongRequest(id));
  };

  const toggleViewAll = () => {
    setViewAll((prevViewAll) => !prevViewAll);
  };

  if (loading) { return ( <Container>
    <Banner>
      <BannerText>
        <Skeleton width={200} height={40} />
        <br />
        <Skeleton width={150} height={30} />
      </BannerText>
    </Banner>

    <StatsSection>
      <StatItem>
        <StatTitle><Skeleton width={120} /></StatTitle>
        <StatValue><Skeleton width={80} /></StatValue>
      </StatItem>
      <StatItem>
        <StatTitle><Skeleton width={120} /></StatTitle>
        <StatValue><Skeleton width={80} /></StatValue>
      </StatItem>
      <StatItem>
        <StatTitle><Skeleton width={120} /></StatTitle>
        <StatValue><Skeleton width={80} /></StatValue>
      </StatItem>
      <StatItem>
        <StatTitle><Skeleton width={120} /></StatTitle>
        <StatValue><Skeleton width={80} /></StatValue>
      </StatItem>
    </StatsSection>

    <MostPlayedSection>
      <SectionTitle><Skeleton width={100} /></SectionTitle>
      <SongsContainer>
        {Array(4).fill(null).map((_, index) => (
          <SongCard key={index}>
            <Skeleton height={150} />
            <SongDetails>
              <Skeleton width={120} height={20} />
              <Skeleton width={80} height={15} />
            </SongDetails>
          </SongCard>
        ))}
      </SongsContainer>
    </MostPlayedSection>
  </Container>
);}
  if (error) return <p>Error: {error}</p>;

  return (
    <Container>
      <Banner>
        <BannerText>
          Happier Than Ever <br />
          Simon Tamene
        </BannerText>
      </Banner>

      {stats && (
        <StatsSection>
          <StatItem>
            <StatTitle>Total Songs</StatTitle>
            <StatValue>{stats.totalSongs}</StatValue>
          </StatItem>
          <StatItem>
            <StatTitle>Total Artists</StatTitle>
            <StatValue>{stats.totalArtists}</StatValue>
          </StatItem>
          <StatItem>
            <StatTitle>Total Albums</StatTitle>
            <StatValue>{stats.totalAlbums}</StatValue>
          </StatItem>
          <StatItem>
            <StatTitle>Total Genres</StatTitle>
            <StatValue>{stats.totalGenres}</StatValue>
          </StatItem>
        </StatsSection>
      )}

      <MostPlayedSection>
        <SectionTitle>{showLikedSongs ? 'Liked Songs' : 'Songs'}</SectionTitle>
        <ViewAll onClick={toggleViewAll}>
          {viewAll ? 'View less' : 'View all'}
        </ViewAll>
      </MostPlayedSection>

      <SongsContainer>
        {songsToShow.map((song) => (
          <SongCard key={song._id} onClick={() => handleSongClick(song)}>
            <AlbumImage src={`${song.albumPhotoUrl}`} alt={song.title} />
            <SongDetails>
              <SongTitle>{song.title}</SongTitle>
              <Artist>{song.artist}</Artist>
            </SongDetails>
            <IconContainer>
              <EditIcon onClick={(e) => { e.stopPropagation(); handleEditClick(song); }} />
              <DeleteIcon onClick={(e) => { e.stopPropagation(); handleDeleteClick(song._id); }} />
            </IconContainer>
          </SongCard>
        ))}
      </SongsContainer>
    </Container>
  );
};

export default SongList;
