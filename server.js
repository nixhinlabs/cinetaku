const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors());

app.use(express.json());

// General
const VersionRoutes = require('./src/routes/VersionRoutes');
const ServerRoutes = require('./src/routes/ServerRoutes');
const SearchRoutes = require('./src/routes/SearchRoutes');
const DeviceRoutes = require('./src/routes/DeviceRoutes');
const ReviewRoutes = require('./src/routes/ReviewRoutes');

// Movies
const MovieRoutes = require('./src/routes/MovieRoutes');

// Shows
const ShowRoutes = require('./src/routes/ShowRoutes');

// Person
const PersonRoutes = require('./src/routes/PersonRoutes');

// Anime
const AnimeRoutes = require('./src/routes/AnimeRoutes');

// Manga
const MangaRoutes = require('./src/routes/MangaRoutes');

app.use('/api', VersionRoutes);
app.use('/api', ServerRoutes);
app.use('/api/search', SearchRoutes);
app.use('/api/device', DeviceRoutes);
app.use('/api/reviews', ReviewRoutes);
app.use('/api/movie', MovieRoutes);
app.use('/api/show', ShowRoutes);
app.use('/api/person', PersonRoutes);
app.use('/api/anime', AnimeRoutes);
app.use('/api/manga', MangaRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Backend is running on port: ${PORT}`);
});

module.exports = app;
