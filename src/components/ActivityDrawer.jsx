import React, { useState, useEffect } from 'react';
import { fetchUserInteractions } from '../api';

export default function ActivityDrawer({ activeUser, refreshTrigger }) {
  const [isOpen, setIsOpen] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeUser || !isOpen) return;

    let isMounted = true;
    setLoading(true);
    fetchUserInteractions(activeUser._id)
      .then((data) => {
        if (isMounted) setInteractions(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeUser, isOpen, refreshTrigger]);

  return (
    <div className={`activity-drawer ${isOpen ? 'open' : ''}`}>
      <button
        className="activity-drawer-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="View recorded interaction log in MongoDB"
      >
        <span>{isOpen ? '✕ Close Log' : '📊 View Activity Log'}</span>
        {interactions.length > 0 && <span className="log-count-badge">{interactions.length}</span>}
      </button>

      {isOpen && (
        <div className="activity-drawer-body">
          <div className="drawer-header">
            <h3>Activity Log for {activeUser?.name}</h3>
            <span className="drawer-sub">Stored in MongoDB Atlas</span>
          </div>

          {loading ? (
            <p className="drawer-loading">Loading interactions...</p>
          ) : interactions.length === 0 ? (
            <p className="drawer-empty">No interactions recorded yet for this user.</p>
          ) : (
            <div className="interactions-timeline">
              {interactions.map((item, idx) => (
                <div key={idx} className={`timeline-entry type-${item.type}`}>
                  <span className="timeline-badge">
                    {item.type === 'view' ? '👁 View' : item.type === 'save' ? '⭐ Save' : '💬 Contact'}
                  </span>
                  <div className="timeline-details">
                    <span className="timeline-listing">Listing ID: <strong>{item.listingId}</strong></span>
                    <span className="timeline-time">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
