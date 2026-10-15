const API_BASE = 'https://moviesapi.ir/api/v1';

async function fetchAPI(endpoint) {
  const response = await fetch(API_BASE + endpoint);
  if (!response.ok) {
    throw new Error('Request failed');
  }
  return response.json();
}

export async function getPopularMovies(page = 1) {
  const data = await fetchAPI('/movies?page=' + page);
  return {
    results: data.data || [],
    page: data.metadata?.current_page || page,
    total_pages: data.metadata?.page_count || 1,
    total_results: data.metadata?.total_count || 0
  };
}

export async function searchMovies(query, page = 1) {
  const data = await fetchAPI('/movies?q=' + encodeURIComponent(query) + '&page=' + page);
  return {
    results: data.data || [],
    page: data.metadata?.current_page || page,
    total_pages: data.metadata?.page_count || 1,
    total_results: data.metadata?.total_count || 0
  };
}

export async function getMovieDetails(id) {
  return fetchAPI('/movies/' + id);
}

export async function getGenres() {
  const data = await fetchAPI('/genres');
  return data || [];
}

export async function getMoviesByGenre(genreId, page = 1) {
  const data = await fetchAPI('/genres/' + genreId + '/movies?page=' + page);
  return {
    results: data.data || [],
    page: data.metadata?.current_page || page,
    total_pages: data.metadata?.page_count || 1,
    total_results: data.metadata?.total_count || 0
  };
}
