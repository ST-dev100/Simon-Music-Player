const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors')

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors())     
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log(path.join(__dirname, 'uploads')) 
// Routes
app.use('/api/songs', require('./routes/songRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});   
 