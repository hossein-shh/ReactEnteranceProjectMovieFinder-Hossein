import { getRoute, navigate, onRouteChange } from './router.js';
import {
  getPopularMovies,
  getMovieDetails,
  getGenres,
  getMoviesByGenre,
  getPosterUrl
} from './api.js';

const app = document.getElementById('app');
const genresBtn = document.getElementById('genres-btn');

let genresCache = null;

function showLoading() {
  if (!app) return;
  app.innerHTML = '<div class="state-message"><p>Loading...</p></div>';
}

function showError(message) {
  if (!app) return;
  app.innerHTML = '<div class="state-message"><h2>Something went wrong</h2><p>' + message + '</p></div>';
}

function attachCardClicks() {
  document.querySelectorAll('.movie-card[data-id], .genre-movie-card[data-id]').forEach(function (card) {
    card.addEventListener('click', function () {
      navigate('/movie/' + card.dataset.id);
    });
  });
}

async function loadGenres() {
  if (!genresCache) {
    genresCache = await getGenres();
  }
  return genresCache;
}

async function renderHome(page) {
  showLoading();
  try {
    const data = await getPopularMovies(page);
    const movies = data.results || [];
    let html = '<div class="container"><div class="movies-grid">';
    for (let i = 0; i < movies.length; i++) {
      const m = movies[i];
      const genres = Array.isArray(m.genres) ? m.genres.slice(0, 2).join(' / ') : '';
      const poster = getPosterUrl(m.poster);
      html += '<article class="movie-card" data-id="' + m.id + '">';
      html += '<div class="card-poster"><img src="' + poster + '" alt="" loading="lazy"></div>';
      html += '<div class="card-body">';
      html += '<div class="card-header">';
      html += '<h3 class="card-title">' + (m.title || '') + '</h3>';
      html += '<p class="card-genres">' + genres + '</p>';
      html += '</div>';
      html += '<div class="card-footer">';
      html += '<span class="card-rating">★ ' + (m.imdb_rating || '') + '</span>';
      html += '<button class="card-btn">View Info</button>';
      html += '</div></div></article>';
    }
    html += '</div></div>';
    app.innerHTML = html;
    attachCardClicks();
  } catch (err) {
    showError(err.message || 'Failed to load');
  }
}

async function renderMovie(id) {
  showLoading();
  try {
    const movie = await getMovieDetails(id);
    const poster = getPosterUrl(movie.poster);
    const genres = (movie.genres || []).map(function (g) {
      return '<span class="tag">' + g + '</span>';
    }).join('');

    let html = '<div class="detail-container">';
    html += '<div class="detail-top">';
    html += '<div class="detail-title-block">';
    html += '<h1 class="detail-title">' + (movie.title || '') + '</h1>';
    html += '<p class="detail-meta">';
    html += (movie.year || '');
    if (movie.rated) html += ' • ' + movie.rated;
    if (movie.runtime) html += ' • ' + movie.runtime;
    html += '</p></div>';
    html += '<div class="detail-rating-badge">';
    html += '<span class="star">★</span>';
    html += '<span>' + (movie.imdb_rating || 'N/A') + '/10</span>';
    if (movie.imdb_votes) html += '<span class="votes">(' + movie.imdb_votes + ')</span>';
    html += '</div></div>';

    html += '<div class="detail-main">';
    html += '<div class="detail-poster"><img src="' + poster + '" alt=""></div>';
    html += '<div class="detail-info">';
    html += '<div class="info-row"><span class="info-label">Genre</span><div class="info-tags">' + genres + '</div></div>';
    html += '<div class="info-row"><span class="info-label">Plot</span><p class="info-text">' + (movie.plot || '—') + '</p></div>';
    html += '<div class="info-row"><span class="info-label">Director</span><p class="info-text">' + (movie.director || '—') + '</p></div>';
    html += '<div class="info-row"><span class="info-label">Writers</span><p class="info-text">' + (movie.writer || '—') + '</p></div>';
    html += '<div class="info-row"><span class="info-label">Stars</span><p class="info-text">' + (movie.actors || '—') + '</p></div>';
    html += '</div></div>';

    html += '<section class="cast-section">';
    html += '<h2 class="cast-title"><span class="dot"></span> Cast</h2>';
    html += '<p style="color:var(--text-muted);font-size:14px">' + (movie.actors || '—') + '</p>';
    html += '</section></div>';

    app.innerHTML = html;
  } catch (err) {
    showError(err.message || 'Failed to load movie');
  }
}

async function renderGenre(genreId, page) {
  showLoading();
  try {
    const genres = await loadGenres();
    const data = await getMoviesByGenre(genreId, page);
    const movies = data.results || [];

    let html = '<div class="genres-layout">';
    html += '<aside class="genres-sidebar">';
    html += '<h2 class="sidebar-title"><span class="dot"></span> Genres</h2>';
    html += '<nav class="genres-list">';
    for (let i = 0; i < genres.length; i++) {
      const g = genres[i];
      const active = String(g.id) === String(genreId) ? ' active' : '';
      html += '<a href="#/genre/' + g.id + '" class="genre-item' + active + '">' + g.name + '</a>';
    }
    html += '</nav></aside>';

    html += '<section class="genres-content">';
    html += '<div class="genres-toolbar">';
    html += '<button class="sort-btn">Sort by: Ranking <span class="sort-icons">↑↓</span></button>';
    html += '<span class="titles-count">' + (data.total_results || movies.length) + ' titles</span>';
    html += '</div>';
    html += '<div class="genre-movie-list">';

    for (let i = 0; i < movies.length; i++) {
      const m = movies[i];
      const poster = getPosterUrl(m.poster);
      const tags = (m.genres || []).slice(0, 3).map(function (g) {
        return '<span class="tag">' + g + '</span>';
      }).join('');
      html += '<article class="genre-movie-card" data-id="' + m.id + '">';
      html += '<div class="g-poster"><img src="' + poster + '" alt="" loading="lazy"></div>';
      html += '<div class="g-info">';
      html += '<div class="g-top">';
      html += '<h3 class="g-title">' + (m.title || '') + '</h3>';
      html += '<div class="g-rating">★ ' + (m.imdb_rating || '') + '</div>';
      html += '</div>';
      html += '<p class="g-meta">' + (m.year || '') + '</p>';
      html += '<div class="g-tags">' + tags + '</div>';
      html += '<p class="g-plot">' + (m.plot || '') + '</p>';
      html += '<p class="g-credit"><strong>Director:</strong> ' + (m.director || '—') + '</p>';
      html += '<p class="g-credit"><strong>Stars:</strong> ' + (m.actors || '—') + '</p>';
      html += '<p class="g-votes">Votes: ' + (m.imdb_votes || '—') + '</p>';
      html += '</div></article>';
    }

    html += '</div></section></div>';
    app.innerHTML = html;
    attachCardClicks();
  } catch (err) {
    showError(err.message || 'Failed to load genre');
  }
}

if (genresBtn) {
  genresBtn.addEventListener('click', async function () {
    try {
      const genres = await loadGenres();
      if (genres.length > 0) {
        navigate('/genre/' + genres[0].id);
      }
    } catch (err) {}
  });
}

function handleRoute() {
  const route = getRoute();
  if (route.name === 'movie') {
    renderMovie(route.id);
  } else if (route.name === 'genre') {
    renderGenre(route.id, route.page || 1);
  } else {
    renderHome(route.page || 1);
  }
}

onRouteChange(handleRoute);
