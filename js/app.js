import { getRoute, onRouteChange } from './router.js';
import { getPopularMovies } from './api.js';

const app = document.getElementById('app');

function showLoading() {
  if (!app) return;
  app.innerHTML = '<div class="state-message"><p>Loading...</p></div>';
}

function showError(message) {
  if (!app) return;
  app.innerHTML = '<div class="state-message"><h2>Something went wrong</h2><p>' + message + '</p></div>';
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
      html += '<article class="movie-card" data-id="' + m.id + '">';
      html += '<div class="card-poster"></div>';
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
  } catch (err) {
    showError(err.message || 'Failed to load');
  }
}

function handleRoute() {
  const route = getRoute();
  if (route.name === 'home') {
    renderHome(route.page || 1);
  }
}

onRouteChange(handleRoute);
