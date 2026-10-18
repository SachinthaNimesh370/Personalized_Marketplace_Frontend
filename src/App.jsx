import React, { useState, useEffect, useCallback } from 'react';
import { fetchUsers, fetchRecommendations, recordInteraction } from './api';
import UserSwitcher from './components/UserSwitcher';
import Feed from './components/Feed';
import ListingModal from './components/ListingModal';
import ActivityDrawer from './components/ActivityDrawer';
import './App.css';

const LOCAL_STORAGE_KEY = 'primemarket_selected_user_id';

export default function App() {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [activeModalListing, setActiveModalListing] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 1. Fetch test users on initial mount
  useEffect(() => {
    let isMounted = true;
    fetchUsers()
      .then((data) => {
        if (!isMounted || !data || data.length === 0) return;
        setUsers(data);

        // Check localStorage for previously remembered user session
        const savedUserId = localStorage.getItem(LOCAL_STORAGE_KEY);
        const matched = data.find((u) => u._id === savedUserId);
        const selected = matched || data[0];

        setActiveUser(selected);
        localStorage.setItem(LOCAL_STORAGE_KEY, selected._id);
      })
      .catch((err) => {
        console.error('Failed to load users:', err);
        showToast('Error connecting to backend API');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch personalized recommendations whenever active user changes or refreshTrigger increments
  const loadRecommendations = useCallback(async (user) => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchRecommendations(user._id);
      setListings(data);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
      showToast('Error loading personalized feed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeUser) {
      loadRecommendations(activeUser);
    }
  }, [activeUser, loadRecommendations, refreshTrigger]);

  // Handle user switch
  const handleSelectUser = (user) => {
    setActiveUser(user);
    localStorage.setItem(LOCAL_STORAGE_KEY, user._id);
    showToast(`Switched active profile to ${user.name}`);
  };

  // Action: View Listing
  const handleView = async (listing) => {
    setActiveModalListing(listing);
    if (!activeUser) return;

    try {
      await recordInteraction(activeUser._id, listing.listingId, 'view');
      // Silently refresh feed in background so viewed penalty applies to future rankings
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('View logging failed:', err);
    }
  };

  // Action: Save Listing
  const handleSave = async (listing) => {
    if (!activeUser) return;
    setActionLoadingId(listing.listingId);
    try {
      await recordInteraction(activeUser._id, listing.listingId, 'save');
      showToast(`⭐ Saved "${listing.title}". Feed updated!`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('Save failed:', err);
      showToast('Failed to save listing');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Action: Contact Seller
  const handleContact = async (listing) => {
    if (!activeUser) return;
    setActionLoadingId(listing.listingId);
    try {
      await recordInteraction(activeUser._id, listing.listingId, 'contact');
      showToast(`💬 Inquired for "${listing.title}". Feed updated!`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('Contact failed:', err);
      showToast('Failed to record inquiry');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Detect Cold Start: If feed has items and reasons is "Popular right now"
  const isColdStart =
    listings.length > 0 &&
    listings.slice(0, 3).every((l) => l.reasons?.includes('Popular right now'));

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-logo">
            <span className="logo-icon">💎</span>
            <div className="brand-titles">
              <h1 className="logo-text">PrimeMarket<span className="logo-domain">.lk</span></h1>
              <span className="logo-badge">Personalized Feed</span>
            </div>
          </div>

          <UserSwitcher
            users={users}
            activeUser={activeUser}
            onSelectUser={handleSelectUser}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="intro-section">
          <h2>Personalized Real Estate & Vehicle Marketplace</h2>
          <p>
            Powered by intelligent multi-attribute ranking, anti-spam diminishing returns, and private S3 media delivery.
          </p>
        </div>

        <Feed
          listings={listings}
          loading={loading}
          activeUser={activeUser}
          isColdStart={isColdStart}
          onView={handleView}
          onSave={handleSave}
          onContact={handleContact}
          actionLoadingId={actionLoadingId}
        />
      </main>

      {/* Detailed View Modal */}
      {activeModalListing && (
        <ListingModal
          listing={activeModalListing}
          onClose={() => setActiveModalListing(null)}
          onSave={handleSave}
          onContact={handleContact}
        />
      )}

      {/* Activity History Drawer */}
      <ActivityDrawer
        activeUser={activeUser}
        refreshTrigger={refreshTrigger}
      />

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <p>PrimeMarket.lk Technical Assessment • MERN + AWS S3 Architecture</p>
          <div className="footer-tags">
            <span className="status-pill green">MongoDB Atlas Online</span>
            <span className="status-pill blue">Private S3 Presigned URLs</span>
            <span className="status-pill purple">Pure Ranking Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
