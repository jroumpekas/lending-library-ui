import { useState } from 'react';
import Login from '../components/Login';
import BookList from '../components/BookList';
import UserList from '../components/UserList';

// Βοηθητική συνάρτηση ελέγχου ρόλου (Admin check) από το JWT token
function checkIsAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        const decoded = JSON.parse(jsonPayload);
        const roles = decoded.roles || decoded.authorities || [];
        return roles.includes('ROLE_ADMIN') || roles.includes('ADMIN');
    } catch (e) {
        return false;
    }
}

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
    const isAdmin = checkIsAdmin();

    // State για την εναλλαγή καρτελών (tabs) αν ο χρήστης είναι admin: 'books' ή 'users'
    const [activeTab, setActiveTab] = useState<'books' | 'users'>('books');

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    // Αν δεν είναι συνδεδεμένος, δείχνουμε αποκλειστικά τη φόρμα Login
    if (!isAuthenticated) {
        return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
            {/* Header */}
            <header style={{ backgroundColor: '#282c34', padding: '1rem 2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Ηλεκτρονική Βιβλιοθήκη</h1>
                    <span style={{ fontSize: '0.85rem', color: isAdmin ? '#2ecc71' : '#a0aec0' }}>
                        {isAdmin ? '👑 Ρόλος: Διαχειριστής (Admin)' : '👤 Ρόλος: Απλός Χρήστης (Member)'}
                    </span>
                </div>
                <button
                    onClick={handleLogout}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Αποσύνδεση (Logout)
                </button>
            </header>

            {/* Admin Navigation Tabs (Εμφανίζονται μόνο αν είναι Admin) */}
            {isAdmin && (
                <nav style={{ display: 'flex', gap: '1rem', padding: '1rem 2rem', backgroundColor: '#ffffff', borderBottom: '1px solid #dee2e6' }}>
                    <button
                        onClick={() => setActiveTab('books')}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: activeTab === 'books' ? '#3498db' : 'transparent',
                            color: activeTab === 'books' ? 'white' : '#333',
                            border: '1px solid #3498db',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        📚 Διαχείριση Βιβλίων
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: activeTab === 'users' ? '#e67e22' : 'transparent',
                            color: activeTab === 'users' ? 'white' : '#333',
                            border: '1px solid #e67e22',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        👥 Διαχείριση Χρηστών
                    </button>
                </nav>
            )}

            {/* Main Content Area */}
            <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                {!isAdmin ? (
                    <BookList />
                ) : (
                    <div>
                        {activeTab === 'books' && <BookList />}
                        {activeTab === 'users' && <UserList />}
                    </div>
                )}
            </main>
        </div>
    );
}