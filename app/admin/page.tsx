'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiLogOut, FiMail, FiPhone, FiUser, FiBriefcase, FiCheckCircle, FiClock, FiMessageSquare, FiX } from 'react-icons/fi';
import '@/styles/admin.css';

interface Contact {
  _id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  employees: string;
  product: string;
  message?: string;
  isContacted: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<{ contact: string; message: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/contacts');
      if (response.ok) {
        setIsLoggedIn(true);
        await fetchContacts();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        await fetchContacts();
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContacts = async () => {
    setIsLoadingContacts(true);
    try {
      const response = await fetch('/api/admin/contacts');
      const data = await response.json();

      if (response.ok) {
        setContacts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const toggleContacted = async (contactId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isContacted: !currentStatus }),
      });

      if (response.ok) {
        setContacts(contacts.map(contact =>
          contact._id === contactId
            ? { ...contact, isContacted: !currentStatus }
            : contact
        ));
      }
    } catch (error) {
      console.error('Failed to update contact:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsLoggedIn(false);
      setContacts([]);
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div>
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <div className="login-icon">
                <FiUser />
              </div>
              <h1 className="login-title">Admin Portal</h1>
              <p className="login-subtitle">Sign in to manage contacts</p>
            </div>
            <form onSubmit={handleLogin} className="login-form">
              {loginError && (
                <div className="login-error">
                  <p className="login-error-title">Error</p>
                  <p className="login-error-text">{loginError}</p>
                </div>
              )}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input form-input-with-icon"
                    placeholder="admin@bharatcover.net"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="login-button"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const contactedCount = contacts.filter(c => c.isContacted).length;
  const pendingCount = contacts.length - contactedCount;

  return (
    <div className="admin-container">
      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card stat-card-blue">
            <div className="stat-card-content">
              <p className="stat-label">Total Contacts</p>
              <p className="stat-value">{contacts.length}</p>
            </div>
            <div className="stat-icon-wrapper stat-icon-blue">
              <FiBriefcase />
            </div>
          </div>

          <div className="stat-card stat-card-green">
            <div className="stat-card-content">
              <p className="stat-label">Contacted</p>
              <p className="stat-value">{contactedCount}</p>
            </div>
            <div className="stat-icon-wrapper stat-icon-green">
              <FiCheckCircle />
            </div>
          </div>

          <div className="stat-card stat-card-yellow">
            <div className="stat-card-content">
              <p className="stat-label">Pending</p>
              <p className="stat-value">{pendingCount}</p>
            </div>
            <div className="stat-icon-wrapper stat-icon-yellow">
              <FiClock />
            </div>
          </div>
        </div>

        <div className="contacts-card">
          <div className="contacts-header">
            <h2 className="contacts-title">Contact Submissions</h2>
          </div>

          {isLoadingContacts ? (
            <div className="contacts-loading">
              <div className="loading-spinner"></div>
              <p className="contacts-loading-text">Loading contacts...</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="contacts-empty">
              <FiBriefcase className="contacts-empty-icon" />
              <p className="contacts-empty-title">No contacts found</p>
              <p className="contacts-empty-text">Contact submissions will appear here</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="contacts-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Company</th>
                    <th>Contact Person</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Product</th>
                    <th>Employees</th>
                    <th>Message</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact._id}>
                      <td>
                        {new Date(contact.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td>
                        <div className="table-cell-flex">
                          <FiBriefcase className="table-icon" />
                          <span className="company-name">{contact.companyName}</span>
                        </div>
                      </td>
                      <td>
                        <div className="table-cell-flex">
                          <FiUser className="table-icon" />
                          <span>{contact.contactPerson}</span>
                        </div>
                      </td>
                      <td>
                        <div className="table-cell-flex">
                          <FiMail className="table-icon" />
                          <span>{contact.email}</span>
                        </div>
                      </td>
                      <td>
                        <div className="table-cell-flex">
                          <FiPhone className="table-icon" />
                          <span>{contact.phone}</span>
                        </div>
                      </td>
                      <td>
                        <span className="product-badge">{contact.product}</span>
                      </td>
                      <td className="employees-cell">{contact.employees}</td>
                      <td>
                        {contact.message && contact.message.trim() ? (
                          <button
                            onClick={() => setSelectedMessage({
                              contact: contact.companyName,
                              message: contact.message || ''
                            })}
                            className="message-view-button"
                          >
                            <FiMessageSquare />
                            View
                          </button>
                        ) : (
                          <span className="no-message">N/A</span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => toggleContacted(contact._id, contact.isContacted)}
                          className={`status-button ${
                            contact.isContacted ? 'status-contacted' : 'status-pending'
                          }`}
                        >
                          {contact.isContacted ? (
                            <>
                              <FiCheckCircle />
                              Contacted
                            </>
                          ) : (
                            <>
                              <FiClock />
                              Pending
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <FiMessageSquare className="modal-icon" />
                Message from {selectedMessage.contact}
              </h3>
              <button
                className="modal-close"
                onClick={() => setSelectedMessage(null)}
              >
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <p>{selectedMessage.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Logout Button */}
      <button onClick={handleLogout} className="floating-logout-button" title="Logout">
        <FiLogOut />
      </button>
    </div>
  );
}
