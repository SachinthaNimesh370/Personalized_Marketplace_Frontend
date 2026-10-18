import React from 'react';

export default function ListingModal({ listing, onClose, onSave, onContact }) {
  if (!listing) return null;

  const isVehicle = listing.category === 'vehicle';
  const formattedPrice = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(listing.price);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} title="Close modal">
          ✕
        </button>

        <div className="modal-header">
          <span className="modal-category">
            {isVehicle ? '🚗 Vehicle' : '🏡 Property'} • ID: {listing.listingId}
          </span>
          <h2 className="modal-title">{listing.title}</h2>
          <div className="modal-price-location">
            <span className="modal-price">{formattedPrice}</span>
            <span className="modal-location">📍 {listing.location}, Sri Lanka</span>
          </div>
        </div>

        {listing.imageUrl && (
          <div className="modal-image-container">
            <img src={listing.imageUrl} alt={listing.title} className="modal-image" />
          </div>
        )}

        <div className="modal-details-grid">
          <div className="detail-item">
            <span className="detail-label">Category:</span>
            <span className="detail-value">{listing.category.toUpperCase()}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{listing.location}</span>
          </div>
          {isVehicle ? (
            <>
              <div className="detail-item">
                <span className="detail-label">Make:</span>
                <span className="detail-value">{listing.attributes?.make}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Model:</span>
                <span className="detail-value">{listing.attributes?.model}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Year:</span>
                <span className="detail-value">{listing.attributes?.year}</span>
              </div>
            </>
          ) : (
            <>
              <div className="detail-item">
                <span className="detail-label">Property Type:</span>
                <span className="detail-value">{listing.attributes?.propertyType}</span>
              </div>
              {listing.attributes?.bedrooms && (
                <div className="detail-item">
                  <span className="detail-label">Bedrooms:</span>
                  <span className="detail-value">{listing.attributes?.bedrooms}</span>
                </div>
              )}
              {listing.attributes?.perches && (
                <div className="detail-item">
                  <span className="detail-label">Land Size:</span>
                  <span className="detail-value">{listing.attributes?.perches} Perches</span>
                </div>
              )}
            </>
          )}
        </div>

        {listing.reasons && listing.reasons.length > 0 && (
          <div className="modal-reasons">
            <h4>Recommendation Signals</h4>
            <ul>
              {listing.reasons.map((r, i) => (
                <li key={i}>✓ {r}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-save"
            onClick={() => {
              onSave(listing);
              onClose();
            }}
          >
            ⭐ Save Listing
          </button>
          <button
            type="button"
            className="btn btn-contact"
            onClick={() => {
              onContact(listing);
              onClose();
            }}
          >
            💬 Contact Seller Directly
          </button>
        </div>
      </div>
    </div>
  );
}
