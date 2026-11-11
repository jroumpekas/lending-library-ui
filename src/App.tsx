import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import BookList from './components/BookList';
import Reservations from './components/Reservation';


export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentView, setCurrentView] = useState<'login' | 'register'>('login');


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setCurrentView('login');
    };

    // Αν ΔΕΝ είναι συνδεδεμένος ο χρήστης, δείχνουμε Login ή Register
    if (!isAuthenticated) {
        return (
            <div style={{ padding: '2rem' }}>
                {currentView === 'login' ? (
                    <div>
                        <Login onLoginSuccess={() => setIsAuthenticated(true)} />
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <button
                                onClick={() => setCurrentView('register')}
                                style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Δεν έχετε λογαριασμό; Κάντε εγγραφή εδώ
                            </button>
                        </div>
                    </div>
                ) : (
                    <Register onRegisterSuccess={() => setCurrentView('login')} />
                )}
            </div>
        );
    }

    // Αν ΕΙΝΑI συνδεδεμένος, ενεργοποιούμε το Routing για να μπορεί να πλοηγείται
    return (
        <Router>
            <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>

                {/* Header & Navigation */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap', // Βοηθάει να πέφτει κάτω το μενού αν δε χωράει
                    gap: '1rem',
                    marginBottom: '2rem',
                    borderBottom: '1px solid #ddd',
                    paddingBottom: '1rem'
                }}>
                    <h1 style={{ fontSize: '1.8rem', margin: 0, color: '#2c3e50' }}>
                        Καλώς ήρθατε στη Βιβλιοθήκη!
                    </h1>

                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <Link
                            to="/"
                            style={{ textDecoration: 'none', color: '#3498db', fontWeight: 'bold', padding: '0.5rem' }}
                        >
                            Βιβλία
                        </Link>
                        <Link
                            to="/reservations"
                            style={{ textDecoration: 'none', color: '#3498db', fontWeight: 'bold', padding: '0.5rem' }}
                        >
                            Οι Κρατήσεις μου
                        </Link>

                        <button
                            onClick={handleLogout}
                            style={{ padding: '0.5rem 1rem', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Αποσύνδεση
                        </button>
                    </div>
                </div>

                {/* Routes Configuration */}
                <Routes>
                    <Route path="/" element={<BookList />} />
                    <Route path="/reservations" element={<Reservations />} />
                </Routes>
            </div>
        </Router>
    );
}