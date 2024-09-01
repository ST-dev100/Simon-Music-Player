import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Statistics: React.FC = () => {
  const { songs } = useSelector((state: RootState) => state.songs);

  const totalSongs = songs.length;
  const artists = songs.map(song => song.artist);
  const mostFrequentArtist = artists.sort(
    (a, b) =>
      artists.filter(v => v === a).length - artists.filter(v => v === b).length
  ).pop();

  return (
    <div>
      <h2>Statistics</h2>
      <p>Total Songs: {totalSongs}</p>
      <p>Most Frequent Artist: {mostFrequentArtist}</p>
    </div>
  );
};

export default Statistics;
