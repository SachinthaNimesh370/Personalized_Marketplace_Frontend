import React, { useState } from 'react';
import ListingCard from './ListingCard';
import ColdStartBanner from './ColdStartBanner';

export default function Feed({
  listings,
  loading,
  activeUser,
  isColdStart,
  onView,
  onSave,
  onContact,
  actionLoadingId,
  savedListingIds,
}) {
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredListings = listings.filter((l) => {
    if (filterCategory === 'all') return true;
    return l.category === filterCategory;
  });

  return (
    <div className="feed-container">
      {/* Cold Start Indicator */}
      <ColdStartBanner isColdStart={isColdStart} activeUser={activeUser} />

      {/* Feed Controls */}
      <div className="feed-controls">
        <div className="category-filter-tabs">
          <button
            className={`tab-btn ${filterCategory === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            All Feed ({listings.length})
          </button>
          <button
            className={`tab-btn ${filterCategory === 'vehicle' ? 'active' : ''}`}
            onClick={() => setFilterCategory('vehicle')}
          >
            🚗 Vehicles ({listings.filter((l) => l.category === 'vehicle').length})
          </button>
          <button
            className={`tab-btn ${filterCategory === 'property' ? 'active' : ''}`}
            onClick={() => setFilterCategory('property')}
          >
            🏡 Properties ({listings.filter((l) => l.category === 'property').length})
          </button>
        </div>

        <div className="feed-info">
          <span>Showing <strong>{filteredListings.length}</strong> personalized recommendations</span>
        </div>
      </div>

      {/* Feed Content */}
      {loading ? (
        <div className="feed-loading">
          <div className="spinner"></div>
          <p>Calculating personalized rankings for {activeUser?.name}...</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="feed-empty">
          <p>No listings available for this filter.</p>
        </div>
      ) : (
        <div className="listings-grid">
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.listingId}
              listing={listing}
              onView={onView}
              onSave={onSave}
              onContact={onContact}
              isActionLoading={actionLoadingId === listing.listingId}
              isSaved={Boolean(savedListingIds ? savedListingIds.has(listing.listingId) : listing.isSaved)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
