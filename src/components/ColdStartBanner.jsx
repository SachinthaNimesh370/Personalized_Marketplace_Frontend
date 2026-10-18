import React from 'react';

export default function ColdStartBanner({ isColdStart, activeUser }) {
  if (!isColdStart) return null;

  return (
    <div className="cold-start-banner">
      <div className="banner-icon">❄️</div>
      <div className="banner-content">
        <h4>Cold Start Mode Active</h4>
        <p>
          No prior activity found for <strong>{activeUser?.name || 'this user'}</strong>. Displaying balanced, top-rated
          popular listings interleaved between properties and vehicles. Interact with listings below to start personalizing your feed!
        </p>
      </div>
    </div>
  );
}
