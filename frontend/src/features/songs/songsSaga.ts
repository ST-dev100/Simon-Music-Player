import { call, put, takeEvery, CallEffect, PutEffect } from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';
import {
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
} from './songsSlice';

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

type FetchSongsResponse = Song[];
type FetchStatsResponse = Stats;
type AddSongResponse = Song;
type UpdateSongResponse = Song;

const API_BASE_URL = 'https://simon-music-player-backend.vercel.app';

function* fetchSongs(): Generator<
  CallEffect | PutEffect<{ type: string; payload: any }>,
  void,
  AxiosResponse<FetchSongsResponse>
> {
  try {
    const response: AxiosResponse<FetchSongsResponse> = yield call(axios.get, `${API_BASE_URL}/api/songs`);
    yield put(fetchSongsSuccess(response.data));
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      yield put(fetchSongsFailure(error.message));
    } else if (error instanceof Error) {
      yield put(fetchSongsFailure(error.message));
    } else {
      yield put(fetchSongsFailure('An unexpected error occurred'));
    }
  }
}

function* fetchStats(): Generator<
  CallEffect | PutEffect<{ type: string; payload: any }>,
  void,
  AxiosResponse<FetchStatsResponse>
> {
  try {
    const response: AxiosResponse<FetchStatsResponse> = yield call(axios.get, `${API_BASE_URL}/api/songs/status`);
    yield put(fetchStatsSuccess(response.data));
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      yield put(fetchStatsFailure(error.message));
    } else if (error instanceof Error) {
      yield put(fetchStatsFailure(error.message));
    } else {
      yield put(fetchStatsFailure('An unexpected error occurred'));
    }
  }
}

function* addSong(
  action: ReturnType<typeof addSongRequest>
): Generator<CallEffect | PutEffect<{ type: string; payload: any }>, void, AxiosResponse<AddSongResponse>> {
  try {
    const songData = action.payload; // Expect Song JSON
    const response: AxiosResponse<AddSongResponse> = yield call(axios.post, `${API_BASE_URL}/api/songs`, songData, {
      headers: {
        'Content-Type': 'application/json', // Set to application/json for JSON payload
      },
    });
    yield put(addSongSuccess(response.data));
    yield put(fetchStatsRequest()); // Trigger stats update after adding a song
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      yield put(failure(error.message));
    } else if (error instanceof Error) {
      yield put(failure(error.message));
    } else {
      yield put(failure('An unexpected error occurred'));
    }
  }
}

function* updateSong(
  action: ReturnType<typeof updateSongRequest>
): Generator<CallEffect | PutEffect<{ type: string; payload: any }>, void, AxiosResponse<UpdateSongResponse>> {
  try {
    const songData = action.payload; // Expect Song JSON
    const id = songData._id;

    if (!id) {
      throw new Error('Song ID is missing');
    }

    const response: AxiosResponse<UpdateSongResponse> = yield call(axios.put, `${API_BASE_URL}/api/songs/${id}`, songData, {
      headers: {
        'Content-Type': 'application/json', // Set to application/json for JSON payload
      },
    });

    yield put(updateSongSuccess(response.data));
    yield put(fetchStatsRequest()); // Trigger stats update after updating a song
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      yield put(failure(error.message));
    } else if (error instanceof Error) {
      yield put(failure(error.message));
    } else {
      yield put(failure('An unexpected error occurred'));
    }
  }
}

function* deleteSong(
  action: ReturnType<typeof deleteSongRequest>
): Generator<CallEffect | PutEffect<{ type: string; payload: any }>, void, void> {
  try {
    yield call(axios.delete, `${API_BASE_URL}/api/songs/${action.payload}`);
    yield put(deleteSongSuccess(action.payload));
    yield put(fetchStatsRequest()); // Trigger stats update after deleting a song
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      yield put(failure(error.message));
    } else if (error instanceof Error) {
      yield put(failure(error.message));
    } else {
      yield put(failure('An unexpected error occurred'));
    }
  }
}

function* toggleFavorite(
  action: ReturnType<typeof toggleFavoriteRequest>
): Generator<CallEffect | PutEffect<{ type: string; payload: any }>, void, AxiosResponse<Song>> {
  try {
    const { id, isFavorite } = action.payload;
    const response: AxiosResponse<Song> = yield call(axios.patch, `${API_BASE_URL}/api/songs/favorite/${id}`, {
      isFavorite,
    }, {
      headers: {
        'Content-Type': 'application/json', // Set to application/json for JSON payload
      },
    });
    yield put(toggleFavoriteSuccess(response.data));
    yield put(fetchStatsRequest()); // Trigger stats update after toggling favorite
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      yield put(failure(error.message));
    } else if (error instanceof Error) {
      yield put(failure(error.message));
    } else {
      yield put(failure('An unexpected error occurred'));
    }
  }
}

export default function* songsSaga() {
  yield takeEvery(fetchSongsRequest.type, fetchSongs);
  yield takeEvery(fetchStatsRequest.type, fetchStats);
  yield takeEvery(addSongRequest.type, addSong);
  yield takeEvery(updateSongRequest.type, updateSong);
  yield takeEvery(deleteSongRequest.type, deleteSong);
  yield takeEvery(toggleFavoriteRequest.type, toggleFavorite);
}
