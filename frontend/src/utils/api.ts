import axios from 'axios';

const API_URL = 'http://localhost:5000/api/songs'; // Adjust to your backend API URL

// Fetch all songs
export const fetchSongsApi = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Add a new song
export const addSongApi = async (songData: FormData) => {
  const response = await axios.post(API_URL, songData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update a song
export const updateSongApi = async (id: string, songData: FormData) => {
  const response = await axios.put(`${API_URL}/${id}`, songData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Delete a song
export const deleteSongApi = async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
};

// Fetch statistics
export const fetchStatsApi = async () => {
  const response = await axios.get(`${API_URL}/stats`);
  return response.data;
};
