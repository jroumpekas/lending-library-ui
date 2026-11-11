import React, { useState } from 'react';

export default function Login({ onLoginSuccess }: { onLoginSuccess: () => void }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log("-> Προσπάθεια σύνδεσης για τον χρήστη:", username);

            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            console.log("<- Status απάντησης server:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Σφάλμα από backend:", errorText);
                throw new Error('Αποτυχία σύνδεσης. Ελέγξτε τα στοιχεία σας.');
            }

            const data = await response.json();
            console.log("<- Δεδομένα login που ελήφθησαν:", data);

            const token = data.token || data.accessToken;

            if (token) {
                localStorage.setItem('token', token);
                onLoginSuccess();
            } else {
                throw new Error('Δεν βρέθηκε token στην απάντηση του server.');
            }
        } catch (err: any) {
            console.error("Σφάλμα στο catch:", err);
            setError(err.message || 'Κάτι πήγε στραβά.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '1.5rem' }}>Σύνδεση Χρήστη</h2>

            {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '0.75rem',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginTop: '1rem'
                    }}
                >
                    {loading ? 'Σύνδεση...' : 'Είσοδος'}
                </button>
            </form>
        </div>
    );
}