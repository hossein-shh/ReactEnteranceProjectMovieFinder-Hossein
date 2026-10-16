import { getRoute, navigate, onRouteChange } from './router.js';
import {
  getPopularMovies,
  getMovieDetails,
  getPosterUrl
} from './api.js';

const app = document.getElementById('app');

function showLoading() {
  if (!app) return;
  app.innerHTML = '<div class="state-message"><p>Loading...</p></div>';
}

function showError(message) {
  if (!app) return;
  app.innerHTML = '<div class="state-message"><h2>Something went wrong</h2><p>' + message + '</p></div>';
}

function attachCardClicks() {
  document.querySelectorAll('.movie-card[data-id]').forEach(function (card) {
    card.addEventListener('click', function () {
      navigate('/movie/' + card.dataset.id);
    });
  });
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

function handleRoute() {
  const route = getRoute();
  if (route.name === 'movie') {
    renderMovie(route.id);
  } else {
    renderHome(route.page || 1);
  }
}

onRouteChange(handleRoute);
