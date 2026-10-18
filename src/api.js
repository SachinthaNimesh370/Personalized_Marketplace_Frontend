// API Client for PrimeMarket.lk Backend

const API_BASE = import.meta.env.VITE_API_URL || '';

export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/api/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function fetchRecommendations(userId) {
  if (!userId) return [];
  const res = await fetch(`${API_BASE}/api/recommendations?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  return res.json();
}

export async function fetchAllListings() {
  const res = await fetch(`${API_BASE}/api/listings`);
  if (!res.ok) throw new Error('Failed to fetch listings');
  return res.json();
}

export async function recordInteraction(userId, listingId, type) {
  const res = await fetch(`${API_BASE}/api/interactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, listingId, type }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to record interaction');
  }
  return res.json();
}

export async function fetchUserInteractions(userId) {
  if (!userId) return [];
  const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(userId)}/interactions`);
  if (!res.ok) throw new Error('Failed to fetch user interactions');
  return res.json();
}

export async function fetchSavedListingIds(userId) {
  if (!userId) return [];
  const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(userId)}/saved`);
  if (!res.ok) {
    const interactions = await fetchUserInteractions(userId);
    return interactions.filter((i) => i.type === 'save').map((i) => i.listingId);
  }
  return res.json();
}
