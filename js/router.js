export function getRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const [path, queryString] = hash.split('?');
  const params = new URLSearchParams(queryString || '');

  const movieMatch = path.match(/^\/movie\/(\d+)$/);
  if (movieMatch) {
    return { name: 'movie', id: movieMatch[1] };
  }

  const genreMatch = path.match(/^\/genre\/(\d+)$/);
  if (genreMatch) {
    return {
      name: 'genre',
      id: genreMatch[1],
      page: parseInt(params.get('page') || '1', 10)
    };
  }

  if (path === '/search') {
    return {
      name: 'search',
      query: params.get('q') || '',
      page: parseInt(params.get('page') || '1', 10)
    };
  }

  return { name: 'home', page: parseInt(params.get('page') || '1', 10) };
}

export function navigate(to) {
  window.location.hash = to;
}

export function onRouteChange(callback) {
  window.addEventListener('hashchange', callback);
  callback();
}
