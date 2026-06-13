const axios = require('axios');
const CacheService = require('../services/CacheService');
const { MANGA, GENERAL } = require('../config/constants');

class MangaModel {
  constructor() {
    this.baseUrl = MANGA.MANGA_API_BASE_URL;
    this.coverUrl = MANGA.MANGA_COVER_BASE_URL;
    this.proxyUrl = GENERAL.BASE_PRODUCTION_URL
  }

  async getManga(limit = 10, offset = 0) {
    const cacheKey = `manga:${limit}:${offset}`;

    return CacheService.getOrSet(cacheKey, async () => {
      try {
        const response = await axios.get(`${this.baseUrl}/manga`, {
          params: {
            limit: Math.min(limit, 100),
            offset: offset,
            includes: ['cover_art'],
            order: {
              latestUploadedChapter: 'desc'
            }
          },
          headers: {
            'User-Agent': 'MangaDexApp/1.0'
          }
        });

        if (response.data.result !== 'ok') {
          throw new Error('MangaDex API returned error');
        }

        const getCoverUrl = (manga) => {
          const coverArt = manga.relationships?.find(rel => rel.type === 'cover_art');
          if (coverArt && coverArt.attributes?.fileName) {
            return `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}`;
          }
          return null;
        };

        const getTitle = (manga) => {
          const titles = manga.attributes.title;
          return titles.en || titles['ja-ro'] || titles.ja || Object.values(titles)[0] || 'Untitled';
        };

        const getDescription = (manga) => {
          const desc = manga.attributes.description;
          if (!desc) return '';
          
          let descriptionText = desc.en || desc.ja || '';
          descriptionText = descriptionText.replace(/<[^>]*>/g, '');
          if (descriptionText.length > 500) {
            descriptionText = descriptionText.substring(0, 500) + '...';
          }
          return descriptionText;
        };

        const formattedManga = response.data.data.map(manga => ({
          id: manga.id,
          title: getTitle(manga),
          image: { uri: getCoverUrl(manga) },
          rating: null,
          year: manga.attributes.year || null,
          description: getDescription(manga),
          type: "Manhwa"
        }));

        return {
          success: true,
          data: formattedManga,
          pagination: {
            limit: response.data.limit,
            offset: response.data.offset,
            total: response.data.total
          }
        };

      } catch (error) {
        return {
          success: false,
          error: error.message,
          data: []
        };
      }
    }, 300);
  }

  async getRandomManga() {
    const cacheKey = 'random:manga';

    return CacheService.getOrSet(cacheKey, async () => {
      try {
        const response = await axios.get(`${this.baseUrl}/manga/random`, {
          headers: {
            'User-Agent': 'MangaDexApp/1.0'
          }
        });

        if (response.data.result !== 'ok') {
          throw new Error('MangaDex API returned error');
        }

        const manga = response.data.data;
        
        const getCoverUrl = (manga) => {
          const coverArt = manga.relationships?.find(rel => rel.type === 'cover_art');
          if (coverArt && coverArt.attributes?.fileName) {
            return `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}`;
          }
          return null;
        };

        const getTitle = (manga) => {
          const titles = manga.attributes.title;
          return titles.en || titles['ja-ro'] || titles.ja || Object.values(titles)[0] || 'Untitled';
        };

        const getDescription = (manga) => {
          const desc = manga.attributes.description;
          if (!desc) return '';
          
          let descriptionText = desc.en || desc.ja || '';
          descriptionText = descriptionText.replace(/<[^>]*>/g, '');
          if (descriptionText.length > 500) {
            descriptionText = descriptionText.substring(0, 500) + '...';
          }
          return descriptionText;
        };

        const formattedManga = [{
          id: manga.id,
          title: getTitle(manga),
          image: { uri: getCoverUrl(manga) },
          rating: null,
          year: manga.attributes.year || null,
          description: getDescription(manga),
          type: "Manhwa"
        }];

        return {
          success: true,
          data: formattedManga,
          pagination: {
            limit: 1,
            offset: 0,
            total: 1
          }
        };

      } catch (error) {
        console.error('Error fetching random manga:', error.message);
        return {
          success: false,
          error: error.message,
          data: []
        };
      }
    }, 0);
  }

  async getMangaDetails(mangaId, limit = 100, offset = 0) {
    const cacheKey = `manga:details:${mangaId}:${limit}:${offset}`;

    return CacheService.getOrSet(cacheKey, async () => {
      try {
        const [mangaRes, chaptersRes] = await Promise.all([
          axios.get(`${this.baseUrl}/manga/${mangaId}`, {
            params: { includes: ['cover_art', 'author', 'artist'] },
            headers: { 'User-Agent': 'MangaDexApp/1.0' }
          }),
          axios.get(`${this.baseUrl}/manga/${mangaId}/feed`, {
            params: {
              limit: Math.min(limit, 500),
              offset: offset,
              'order[chapter]': 'asc',
              'translatedLanguage[]': ['en'],
              includes: ['scanlation_group']
            },
            headers: { 'User-Agent': 'MangaDexApp/1.0' }
          })
        ]);

        if (mangaRes.data.result !== 'ok') {
          throw new Error('MangaDex API returned error');
        }

        const manga = mangaRes.data.data;
        
        const coverRelation = manga.relationships.find(rel => rel.type === 'cover_art');
        const authorRelation = manga.relationships.find(rel => rel.type === 'author');
        const artistRelation = manga.relationships.find(rel => rel.type === 'artist');
        
        let coverFileName = null;
        if (coverRelation && coverRelation.attributes) {
          coverFileName = coverRelation.attributes.fileName;
        }

        const titleEn = manga.attributes.title?.en || 
                      Object.values(manga.attributes.title || {})[0] || 
                      'Untitled';

        const chapters = chaptersRes.data.data.map(chapter => {
          const scanGroupRelation = chapter.relationships.find(rel => rel.type === 'scanlation_group');
          
          return {
            id: chapter.id,
            volume: chapter.attributes.volume || null,
            chapter: chapter.attributes.chapter || null,
            title: chapter.attributes.title || null,
            translatedLanguage: chapter.attributes.translatedLanguage,
            pages: chapter.attributes.pages,
            publishAt: chapter.attributes.publishAt,
            scanlationGroup: scanGroupRelation?.attributes?.name || 'Unknown'
          };
        });

        return {
          success: true,
          data: {
            id: manga.id,
            title: titleEn,
            altTitles: manga.attributes.altTitles || [],
            description: manga.attributes.description?.en || 
                        manga.attributes.description?.ja || 
                        'No description available',
            status: manga.attributes.status,
            year: manga.attributes.year,
            contentRating: manga.attributes.contentRating,
            tags: manga.attributes.tags?.map(tag => 
              tag.attributes.name?.en || Object.values(tag.attributes.name || {})[0]
            ) || [],
            coverArt: coverFileName ? `${this.coverUrl}/covers/${manga.id}/${coverFileName}` : null,
            author: authorRelation?.attributes?.name || 'Unknown',
            artist: artistRelation?.attributes?.name || 'Unknown',
            createdAt: manga.attributes.createdAt,
            updatedAt: manga.attributes.updatedAt,
            availableLanguages: manga.attributes.availableTranslatedLanguages || [],
            links: manga.attributes.links || {},
            chapters: chapters,
            chaptersPagination: {
              limit: chaptersRes.data.limit,
              offset: chaptersRes.data.offset,
              total: chaptersRes.data.total
            }
          }
        };

      } catch (error) {
        console.error('Error fetching manga details:', error.message);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }
    }, 300);
  }

  async getMangaCover(chapterId, quality = 'dataSaver') {
    const cacheKey = `chapter:images:${chapterId}:${quality}`;

    return CacheService.getOrSet(cacheKey, async () => {
      try {
        const response = await axios.get(`${this.baseUrl}/at-home/server/${chapterId}`, {
          headers: { 'User-Agent': 'MangaDexApp/1.0' }
        });

        if (response.data.result !== 'ok') {
          throw new Error('MangaDex API returned error');
        }

        const baseUrl = response.data.baseUrl;
        const hash = response.data.chapter.hash;
        const filenames = quality === 'dataSaver' 
          ? response.data.chapter.dataSaver 
          : response.data.chapter.data;

        // Bumuo ng proxied URLs (sa iyong backend sa halip na direct MangaDex)
        const imageUrls = filenames.map((filename, index) => ({
          pageNumber: index + 1,
          url: `${this.proxyUrl}/api/manga/image-proxy?url=${encodeURIComponent(`${baseUrl}/${quality === 'dataSaver' ? 'data-saver' : 'data'}/${hash}/${filename}`)}`,
          filename: filename
        }));

        return {
          success: true,
          data: {
            chapterId: chapterId,
            hash: hash,
            quality: quality,
            totalPages: filenames.length,
            pages: imageUrls
          }
        };

      } catch (error) {
        console.error('Error fetching chapter images:', error.message);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }
    }, 300);
  }

  async searchManga(title, limit = 10, offset = 0) {
    const cacheKey = `manga:search:${title}:${limit}:${offset}`;

    return CacheService.getOrSet(cacheKey, async () => {
      try {
        const response = await axios.get(`${this.baseUrl}/manga`, {
          params: {
            title: title,
            limit: Math.min(limit, 100),
            offset: offset,
            includes: ['cover_art'],
            order: {
              latestUploadedChapter: 'desc'
            }
          },
          headers: {
            'User-Agent': 'MangaDexApp/1.0'
          }
        });

        if (response.data.result !== 'ok') {
          throw new Error('MangaDex API returned error');
        }

        const getCoverUrl = (manga) => {
          const coverArt = manga.relationships?.find(rel => rel.type === 'cover_art');
          if (coverArt && coverArt.attributes?.fileName) {
            return `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}`;
          }
          return null;
        };

        const getTitle = (manga) => {
          const titles = manga.attributes.title;
          return titles.en || titles['ja-ro'] || titles.ja || Object.values(titles)[0] || 'Untitled';
        };

        const getDescription = (manga) => {
          const desc = manga.attributes.description;
          if (!desc) return '';
          
          let descriptionText = desc.en || desc.ja || '';
          descriptionText = descriptionText.replace(/<[^>]*>/g, '');
          if (descriptionText.length > 500) {
            descriptionText = descriptionText.substring(0, 500) + '...';
          }
          return descriptionText;
        };

        const formattedManga = response.data.data.map(manga => ({
          id: manga.id,
          title: getTitle(manga),
          image: { uri: getCoverUrl(manga) },
          rating: null,
          year: manga.attributes.year || null,
          description: getDescription(manga),
          type: "Manhwa"
        }));

        return {
          success: true,
          data: formattedManga,
          pagination: {
            limit: response.data.limit,
            offset: response.data.offset,
            total: response.data.total
          }
        };

      } catch (error) {
        console.error('Error searching manga:', error.message);
        return {
          success: false,
          error: error.message,
          data: []
        };
      }
    }, 300);
  }
}

module.exports = new MangaModel();