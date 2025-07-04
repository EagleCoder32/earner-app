// src/lib/api.js

/**
 * apiPost
 * A thin wrapper around fetch for POST requests with JSON payloads,
 * centralizing headers, credentials, error parsing, and JSON parsing.
 *
 * @param {string} path   — the URL path to POST to (e.g. '/api/withdrawal/request')
 * @param {object} body   — the data object to JSON.stringify() into the request body
 * @returns {Promise<any>} — resolves with parsed JSON on 2xx, rejects with Error on non‑2xx
 */
export async function apiPost(path, body) {
  const res = await fetch(path, {
    method:      'POST',
    credentials: 'same-origin',
    headers:     { 'Content-Type': 'application/json' },
    body:        JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Unknown error occurred');
  }
  return data;
}

/**
 * apiGet
 * A thin wrapper around fetch for GET requests,
 * centralizing credentials, error parsing, and JSON parsing.
 *
 * @param {string} path   — the URL path to GET (e.g. '/api/withdrawal/history')
 * @returns {Promise<any>} — resolves with parsed JSON on 2xx, rejects with Error on non‑2xx
 */
export async function apiGet(path) {
  const res = await fetch(path, {
    method:      'GET',
    credentials: 'same-origin',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Unknown error occurred');
  }
  return data;
}