import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import songsReducer from './features/songs/songsSlice';
import songsSaga from './features/songs/songsSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    songs: songsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore specific paths in the action or state tree
        ignoredActions: ['songs/addSongRequest', 'songs/updateSongRequest'],
        ignoredPaths: ['payload.formData'],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(songsSaga);

export type RootState = ReturnType<typeof store.getState>;
export default store;
