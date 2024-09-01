const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String },
    genre: { type: String },
    audioUrl: { type: String, required: true },
    albumPhotoUrl: { type: String },
    createdAt: { type: Date, default: Date.now }, // Add this field to store creation time
    isFavorite: { type: Boolean, default: false } // New field for favorite status
});

module.exports = mongoose.model('Song', songSchema);
