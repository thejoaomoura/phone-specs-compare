const GSMARENA_ORIGIN = 'https://www.gsmarena.com';

const REQUEST_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
};

const buildTargetUrl = (requestUrl) => {
  const currentUrl = new URL(requestUrl, 'http://localhost');
  const path = currentUrl.searchParams.get('path');

  if (!path || !path.startsWith('/') || path.startsWith('//')) {
    return null;
  }

  return new URL(path, GSMARENA_ORIGIN);
};

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const targetUrl = buildTargetUrl(request.url);

  if (!targetUrl) {
    return response.status(400).json({ error: 'Invalid GSMArena path' });
  }

  try {
    const upstreamResponse = await fetch(targetUrl, {
      headers: REQUEST_HEADERS,
    });
    const body = await upstreamResponse.text();
    const contentType = upstreamResponse.headers.get('content-type') || 'text/plain; charset=utf-8';

    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    response.setHeader('Content-Type', contentType);
    return response.status(upstreamResponse.status).send(body);
  } catch (error) {
    console.error('GSMArena proxy error:', error);
    return response.status(502).json({ error: 'Failed to fetch GSMArena data' });
  }
}
