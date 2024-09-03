import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface GenreStat {
  _id: string;
  count: number;
}

interface ArtistStat {
  _id: string;
  songCount: number;
  albums: string[];
}

interface Stats {
  totalSongs: number;
  totalArtists: number;
  totalAlbums: number;
  totalGenres: number;
  genreStats: GenreStat[];
  artistStats: ArtistStat[];
}

interface SongsState {
  songs: Song[];
  stats: Stats | null;
  loading: boolean;
  error: string | null;
  currentPlayMusic: Song | null;
  showAddSong: boolean;
  selectedSong: Song | null;
}

const initialState: SongsState = {
  songs: [],
  stats: null,
  loading: false,
  error: null,
  currentPlayMusic: null,
  showAddSong: false,
  selectedSong: null,
};

const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    fetchSongsRequest(state) {
      state.loading = true;
    },
    fetchSongsSuccess(state, action: PayloadAction<Song[]>) {
      state.songs = action.payload;
      state.loading = false;
    },
    fetchSongsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    fetchStatsRequest(state) {
      state.loading = true;
    },
    fetchStatsSuccess(state, action: PayloadAction<Stats>) {
      state.stats = action.payload;
      state.loading = false;
    },
    fetchStatsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    addSongRequest(state, _action: PayloadAction<Song>) { // Change FormData to Song
      state.loading = true;
    },
    addSongSuccess(state, action: PayloadAction<Song>) {
      state.songs.unshift(action.payload);
      state.loading = false;
    },
    updateSongRequest(state, _action: PayloadAction<Song>) { // Change FormData to Song
      state.loading = true;
    },
    updateSongSuccess(state, action: PayloadAction<Song>) {
      const index = state.songs.findIndex((song) => song._id === action.payload._id);
      if (index !== -1) {
        state.songs[index] = action.payload;
      }
      state.loading = false;
    },
    deleteSongRequest(state, _action: PayloadAction<string>) {
      state.loading = true;
    },
    deleteSongSuccess(state, action: PayloadAction<string>) {
      state.songs = state.songs.filter((song) => song._id !== action.payload);
      state.loading = false;
    },
    toggleFavoriteRequest(state, _action: PayloadAction<{ id: string; isFavorite: boolean }>) {
      state.loading = true;
    },
    toggleFavoriteSuccess(state, action: PayloadAction<Song>) {
      const index = state.songs.findIndex((song) => song._id === action.payload._id);
      if (index !== -1) {
        state.songs[index] = action.payload;
      }
      state.loading = false;
    },
    failure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    setCurrentPlayMusic(state, action: PayloadAction<Song>) {
      state.currentPlayMusic = action.payload;
    },
    playNextSong(state) {
      if (state.currentPlayMusic) {
        const currentIndex = state.songs.findIndex(song => song._id === state.currentPlayMusic!._id);
        if (currentIndex !== -1 && currentIndex < state.songs.length - 1) {
          state.currentPlayMusic = state.songs[currentIndex + 1];
        }
      }
    },
    playPreviousSong(state) {
      if (state.currentPlayMusic) {
        const currentIndex = state.songs.findIndex(song => song._id === state.currentPlayMusic!._id);
        if (currentIndex > 0) {
          state.currentPlayMusic = state.songs[currentIndex - 1];
        }
      }
    },
    toggleShowAddSong(state) {
      state.showAddSong = !state.showAddSong;
      if (!state.showAddSong) {
        state.selectedSong = null;
      }
    },
    setSelectedSong(state, action: PayloadAction<Song>) {
      state.selectedSong = action.payload;
      state.showAddSong = true;
    },
  },
});

export const {
  fetchSongsRequest,
  fetchSongsSuccess,
  fetchSongsFailure,
  fetchStatsRequest,
  fetchStatsSuccess,
  fetchStatsFailure,
  addSongRequest,
  addSongSuccess,
  updateSongRequest,
  updateSongSuccess,
  deleteSongRequest,
  deleteSongSuccess,
  toggleFavoriteRequest,
  toggleFavoriteSuccess,
  failure,
  playNextSong,
  playPreviousSong,
  setCurrentPlayMusic,
  toggleShowAddSong,
  setSelectedSong,
} = songsSlice.actions;

export default songsSlice.reducer;
