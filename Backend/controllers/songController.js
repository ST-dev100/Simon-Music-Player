const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Song = require('../models/Song');

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'imageFile') {
            cb(null, 'uploads/albumPhoto');
        } else if (file.fieldname === 'audioFile') {
            cb(null, 'uploads/audio');
        } else {
            cb(new Error('Invalid field name'), null);
        }
    },
    filename: function (req, file, cb) {
        // Get current date in YYYY-MM-DD format
        const currentDate = new Date().toISOString().split('T')[0];
        // Extract original file name and extension
        const originalName = path.basename(file.originalname, path.extname(file.originalname));
        const extension = path.extname(file.originalname);
        // Construct new file name
        const newFilename = `${originalName}-${currentDate}${extension}`;
        cb(null, newFilename);
    }
});

// Create multer instance with custom storage
const upload = multer({ storage: storage });

// @desc    Get all songs
// @route   GET /api/songs
// @access  Public
const getSongs = async (req, res) => {
    try {
        const songs = await Song.find().sort({ createdAt: -1 }); // Sort by createdAt in descending order
        res.status(200).json(songs); // Respond with the list of songs
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// @desc    Update a song
// @route   PUT /api/songs/:id
// @access  Public
const updateSong = async (req, res) => {
    upload.fields([{ name: 'imageFile' }, { name: 'audioFile' }])(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: err });
        }

        const { id } = req.params;
        const { title, artist, album, genre } = req.body;

        try {
            const song = await Song.findById(id);

            if (!song) {
                return res.status(404).json({ message: 'Song not found' });
            }
            console.log(req.files)
            // Update song fields
            song.title = title || song.title;
            song.artist = artist || song.artist;
            song.album = album || song.album;
            song.genre = genre || song.genre;

            // Update createdAt field to the current time (if needed)
            song.createdAt = new Date(); // Update to the current time

            // Handle image file replacement if a new one is uploaded
            if (req.files && req.files.imageFile) {
                const imageFile = req.files.imageFile[0];
                const albumPhotoUrl = `/uploads/albumPhoto/${imageFile.filename}`;

                // Remove the old album photo if it exists
                if (song.albumPhotoUrl) {
                    const oldImagePath = path.join(__dirname, '..', song.albumPhotoUrl);
                    fs.unlink(oldImagePath, (err) => {
                        if (err) {
                            console.error(`Failed to delete old image: ${oldImagePath}`, err);
                        }
                    });
                }

                // Update the albumPhotoUrl with the new file path
                song.albumPhotoUrl = albumPhotoUrl;
            }

            // Handle audio file replacement if a new one is uploaded
            if (req.files && req.files.audioFiles) {
                const audioFile = req.files.audioFiles[0];
                const audioUrl = `/uploads/audio/${audioFile.filename}`;

                // Remove the old audio file if it exists
                if (song.audioUrl) {
                    const oldAudioPath = path.join(__dirname, '..', song.audioUrl);
                    fs.unlink(oldAudioPath, (err) => {
                        if (err) {
                            console.error(`Failed to delete old audio: ${oldAudioPath}`, err);
                        }
                    });
                }

                // Update the audioUrl with the new file path
                song.audioUrl = audioUrl;
            }

            await song.save(); // Save the updated song
            res.status(200).json(song);
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    });
};


// @desc    Delete a song
// @route   DELETE /api/songs/:id
// @access  Public
const deleteSong = async (req, res) => {
    const { id } = req.params;

    try {
        const song = await Song.findById(id);

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        const audioPath = path.join(__dirname, '..', song.audioUrl); // Resolve the full path to the audio file
        const albumPhotoPath = path.join(__dirname, '..', song.albumPhotoUrl); // Resolve the full path to the album photo

        // Delete the audio file from the filesystem
        fs.unlink(audioPath, (err) => {
            if (err) {
                console.log({ message: 'Failed to delete audio file', error: err.message });
            }

            // Delete the album photo from the filesystem
            fs.unlink(albumPhotoPath, async (err) => {
                if (err) {
                    console.log({ message: 'Failed to delete album photo', error: err.message });
                }

                await Song.deleteOne({ _id: id }); // Remove the song from the database
                res.status(200).json({ message: 'Song and associated files removed' });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new song
// @route   POST /api/songs
// @access  Public
const addSong = async (req, res) => {
    upload.fields([{ name: 'imageFile' }, { name: 'audioFile' }])(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: err });
        }

        const { title, artist, album, genre } = req.body;

        if (!req.files || !req.files.audioFile) {
            return res.status(400).json({ message: 'Please upload an audio file' });
        }

        const audioFile = req.files.audioFile[0];
        const audioUrl = `/uploads/audio/${audioFile.filename}`; // Path to the uploaded audio file
        let albumPhotoUrl = '';

        if (req.files.imageFile) {
            const imageFile = req.files.imageFile[0];
            albumPhotoUrl = `/uploads/albumPhoto/${imageFile.filename}`; // Path to the uploaded image file
        }

        try {
            const song = new Song({
                title,
                artist,
                album,
                genre,
                audioUrl,
                albumPhotoUrl, // Save the album photo URL
            });

            await song.save();
            res.status(201).json(song);
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    });
};


// @desc    Get statistics about songs
// @route   GET /api/songs/stats
// @access  Public
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
