const express = require('express');
const {
    getSongs,
    addSong,
    updateSong,
    deleteSong,
    getStats,
    toggleFavorite
} = require('../controllers/songController');

const router = express.Router();

router.route('/').get(getSongs).post(addSong);
router.route('/:id').put(updateSong).delete(deleteSong);
router.route('/status').get(getStats);
router.route('/favorite/:id').patch(toggleFavorite);

module.exports = router;
