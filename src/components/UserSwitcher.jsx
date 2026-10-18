import React from 'react';

export default function UserSwitcher({ users, activeUser, onSelectUser }) {
  return (
    <div className="user-switcher-container">
      <div className="user-switcher-label">
        <span className="user-icon">👤</span>
        <span className="label-text">Browsing as:</span>
      </div>
      <div className="user-dropdown-wrapper">
        <select
          id="user-select"
          className="user-select"
          value={activeUser ? activeUser._id : ''}
          onChange={(e) => {
            const selected = users.find((u) => u._id === e.target.value);
            if (selected) onSelectUser(selected);
          }}
        >
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.label} ({u._id})
            </option>
          ))}
        </select>
      </div>
      {activeUser && (
        <span className="user-badge" title={`User ID: ${activeUser._id}`}>
          Active: <strong>{activeUser.name}</strong>
        </span>
      )}
    </div>
  );
}
