import React from 'react';

export default function ListingCard({
  listing,
  onView,
  onSave,
  onContact,
  isActionLoading,
  isSaved,
}) {
  const isVehicle = listing.category === 'vehicle';
  const formattedPrice = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(listing.price);

  return (
    <div className={`listing-card ${isVehicle ? 'type-vehicle' : 'type-property'} ${isSaved ? 'is-saved' : ''}`}>
      {/* Card Header & Media */}
      <div className="card-media">
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="listing-image"
            loading="lazy"
          />
        ) : (
          <div className="image-placeholder">
            <span className="placeholder-icon">{isVehicle ? '🚗' : '🏡'}</span>
            <span className="placeholder-text">
              {isVehicle ? 'Vehicle Photo' : 'Property Photo'}
            </span>
          </div>
        )}
        <div className="category-tag">
          {isVehicle ? '🚗 Vehicle' : '🏡 Property'}
        </div>
        {typeof listing.score === 'number' && (
          <div className="score-tag" title="Recommendation Score">
            Match: {(listing.score * 10).toFixed(0)}%
          </div>
        )}
        {isSaved && (
          <div className="saved-badge" title="Saved to your favorites">
            <span>✓ Saved</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="card-body">
        <div className="price-location-row">
          <span className="price-tag">{formattedPrice}</span>
          <span className="location-tag">📍 {listing.location}</span>
        </div>

        <h3 className="listing-title" title={listing.title}>
          {listing.title}
        </h3>

        {/* Dynamic Attributes */}
        <div className="attributes-grid">
          {isVehicle ? (
            <>
              <span className="attribute-pill">
                <strong>Make:</strong> {listing.attributes?.make}
              </span>
              <span className="attribute-pill">
                <strong>Model:</strong> {listing.attributes?.model}
              </span>
              <span className="attribute-pill">
                <strong>Year:</strong> {listing.attributes?.year}
              </span>
            </>
          ) : (
            <>
              <span className="attribute-pill">
                <strong>Type:</strong> {listing.attributes?.propertyType}
              </span>
              {listing.attributes?.bedrooms && (
                <span className="attribute-pill">
                  <strong>Beds:</strong> {listing.attributes?.bedrooms}
                </span>
              )}
              {listing.attributes?.perches && (
                <span className="attribute-pill">
                  <strong>Land:</strong> {listing.attributes?.perches} Perches
                </span>
              )}
            </>
          )}
        </div>

        {/* Reasons Badge */}
        {listing.reasons && listing.reasons.length > 0 && (
          <div className="reasons-wrapper">
            <span className="reasons-label">💡 Why recommended:</span>
            <div className="reasons-tags">
              {listing.reasons.map((reason, idx) => (
                <span key={idx} className="reason-chip">
                  {reason}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="card-actions">
        <button
          type="button"
          className="btn btn-view"
          onClick={() => onView(listing)}
          disabled={isActionLoading}
          title="View full details (logs View)"
        >
          👁 View
        </button>
        <button
          type="button"
          className={`btn btn-save ${isSaved ? 'saved' : ''}`}
          onClick={() => onSave(listing)}
          disabled={isActionLoading || isSaved}
          title={isSaved ? 'Saved to favorites' : 'Save to favorites (logs Save)'}
          aria-label={isSaved ? 'Saved' : 'Save'}
        >
          {isSaved ? 'Saved' : '⭐ Save'}
        </button>
        <button
          type="button"
          className="btn btn-contact"
          onClick={() => onContact(listing)}
          disabled={isActionLoading}
          title="Contact seller (logs Contact)"
        >
          💬 Contact
        </button>
      </div>
    </div>
  );
}
