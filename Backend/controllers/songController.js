const cloudinary = require('../config/config')
const Song = require('../models/Song');

// @desc Get all songs
// @route GET /api/songs
// @access Public
const getSongs = async (req, res) => {
    try {
        const songs = await Song.find().sort({ createdAt: -1 });
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc Update a song
// @route PUT /api/songs/:id
// @access Public
const updateSong = async (req, res) => {
        const { id } = req.params;
        const { title, artist, album, genre,audioUrl,albumPhotoUrl} = req.body;

        try {
            const song = await Song.findById(id);
            if (!song) {
                return res.status(404).json({ message: 'Song not found' });
            }

            // Update song fields
            song.title = title || song.title;
            song.artist = artist || song.artist;
            song.album = album || song.album;
            song.genre = genre || song.genre;
            song.createdAt = new Date(); // Update the timestamp
            song.audioUrl = audioUrl || song.audioUrl;
            song.albumPhotoUrl = albumPhotoUrl || song.albumPhotoUrl;
            await song.save(); // Save the updated song
            res.status(200).json(song);
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
   
};

// @desc Delete a song
// @route DELETE /api/songs/:id
// @access Public
const deleteSong = async (req, res) => {
    const { id } = req.params;

    try {
        const song = await Song.findById(id);
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        // Delete the audio file from Cloudinary
        if (song.audioUrl) {
            const audioPublicId = song.audioUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(audioPublicId, { resource_type: 'video' });
        }

        // Delete the album photo from Cloudinary
        if (song.albumPhotoUrl) {
            const imagePublicId = song.albumPhotoUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imagePublicId, { resource_type: 'image' });
        }

        // Remove the song from the database
        await Song.deleteOne({ _id: id });
        res.status(200).json({ message: 'Song and associated files removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc Create a new song
// @route POST /api/songs
// @access Public
const addSong = async (req, res) => {
    
        console.log("body",req.body)

        const { title, artist, album, genre,audioUrl,albumPhotoUrl} = req.body;
        try {
            const song = new Song({
                title,
                artist,
                album,
                genre,
                audioUrl,
                albumPhotoUrl,
            });

            await song.save();
            res.status(201).json(song);
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
   
};

// @desc Get statistics about songs
// @route GET /api/songs/stats
// @access Public
const getStats = async (req, res) => {
    try {
        const totalSongs = await Song.countDocuments();

        // Count distinct artists, albums, and genres
        const distinctArtists = await Song.distinct('artist');
        const distinctAlbums = await Song.distinct('album');
        const distinctGenres = await Song.distinct('genre');

        const totalArtists = distinctArtists.length;
        const totalAlbums = distinctAlbums.length;
        const totalGenres = distinctGenres.length;

        // Number of songs in each genre
        const genreStats = await Song.aggregate([
            { $group: { _id: '$genre', count: { $sum: 1 } } }
        ]);

        // Number of songs and albums each artist has
        const artistStats = await Song.aggregate([
            { $group: { _id: '$artist', songCount: { $sum: 1 }, albums: { $addToSet: '$album' } } }
        ]);

        res.status(200).json({
            totalSongs,
            totalArtists,
            totalAlbums,
            totalGenres,
            genreStats,
            artistStats,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Toggle the `isFavorite` status of a song by its _id
const toggleFavorite = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        // Toggle the `isFavorite` status
        song.isFavorite = !song.isFavorite;
        await song.save();

        res.status(200).json(song);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSongs,
    addSong,
    updateSong,
    deleteSong,
    getStats,
    toggleFavorite
};

