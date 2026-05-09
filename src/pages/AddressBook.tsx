import { useState, useEffect, useMemo } from 'react';
import './AddressBook.css';

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
}

const AddressBook = () => {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('contacts');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'John Doe', phone: '+123456789', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', phone: '+987654321', email: 'jane@example.com' }
    ];
  });
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  const announce = (message: string) => {
    window.dispatchEvent(new CustomEvent('app-announce', { detail: message }));
  };

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const results = contacts.filter(c => 
      c.name.toLowerCase().includes(term) || 
      c.phone.includes(term) || 
      c.email.toLowerCase().includes(term)
    );
    
    if (term) {
      announce(results.length > 0 ? `Found ${results.length} contacts` : 'No contacts found');
    }
    
    return results;
  }, [contacts, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      setContacts(contacts.map(c => c.id === editingId ? { ...c, ...formData } : c));
      announce(`Contact ${formData.name} updated`);
      setEditingId(null);
    } else {
      const newContact = { id: Date.now(), ...formData };
      setContacts([...contacts, newContact]);
      announce(`Contact ${formData.name} added`);
      setIsAdding(false);
    }
    setFormData({ name: '', phone: '', email: '' });
  };

  const startEdit = (contact: Contact) => {
    setFormData({ name: contact.name, phone: contact.phone, email: contact.email });
    setEditingId(contact.id);
    setIsAdding(false);
  };

  const cancelAction = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', phone: '', email: '' });
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h1 className="page-title" tabIndex={-1}>Address <span className="gradient-text">Book</span></h1>
        <div className="header-actions">
          <div className="search-container" role="search">
            <input 
              type="text" 
              placeholder="Search contacts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              aria-label="Search contacts by name, phone or email"
            />
            <span className="search-icon" aria-hidden="true">🔍</span>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)} 
            className="btn btn-primary"
            aria-label={isAdding ? 'Cancel adding contact' : 'Add new contact'}
          >
            {isAdding ? 'Cancel' : 'Add Contact'}
          </button>
        </div>
      </div>

      {(isAdding || editingId !== null) && (
        <div className="contact-form-card fade-in" role="dialog" aria-labelledby="form-title">
          <h2 id="form-title">{editingId !== null ? 'Edit Contact' : 'New Contact'}</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="contact-name">Name</label>
              <input 
                id="contact-name"
                type="text" required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-phone">Phone</label>
              <input 
                id="contact-phone"
                type="tel" required 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-email">Email</label>
              <input 
                id="contact-email"
                type="email" required 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId !== null ? 'Update Contact' : 'Save Contact'}
              </button>
              <button type="button" onClick={cancelAction} className="btn btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="contacts-grid" role="list" aria-label="Contacts list">
        {filteredContacts.length === 0 ? (
          <p className="empty-state">No contacts found.</p>
        ) : (
          filteredContacts.map(contact => (
            <div key={contact.id} className="contact-card" role="listitem">
              <div className="contact-avatar" aria-hidden="true">{contact.name.charAt(0)}</div>
              <div className="contact-info">
                <h3>{contact.name}</h3>
                <p className="phone" aria-label={`Phone: ${contact.phone}`}>📞 {contact.phone}</p>
                <p className="email" aria-label={`Email: ${contact.email}`}>✉️ {contact.email}</p>
              </div>
              <div className="contact-actions">
                <button 
                  className="edit-btn" 
                  onClick={() => startEdit(contact)}
                  aria-label={`Edit contact: ${contact.name}`}
                >
                  Edit
                </button>
                <button 
                  className="delete-contact"
                  onClick={() => {
                    setContacts(contacts.filter(c => c.id !== contact.id));
                    announce('Contact removed');
                  }}
                  aria-label={`Delete contact: ${contact.name}`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddressBook;
