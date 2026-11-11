import React, { useState } from 'react';

export default function Register({ onRegisterSuccess }: { onRegisterSuccess: () => void }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('ROLE_MEMBER'); // <--- ΔΙΟΡΘΩΘΗΚΕ ΕΔΩ

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    firstName,
                    lastName,
                    role
                }),
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || 'Αποτυχία εγγραφής. Ελέγξτε τα στοιχεία σας.');
            }

            setSuccess('Η εγγραφή ολοκληρώθηκε με επιτυχία! Μετάβαση στη σύνδεση...');
            setTimeout(() => {
                onRegisterSuccess(); // Επιστροφή στη φόρμα login
            }, 1500);

        } catch (err: any) {
            setError(err.message || 'Κάτι πήγε στραβά στην εγγραφή.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '450px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '1.5rem' }}>Εγγραφή Νέου Χρήστη</h2>

            {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{success}</div>}

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="π.χ. Test1234!"
                        style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <small style={{ color: '#666', fontSize: '0.75rem' }}>
                        Min 8 χαρακτήρες, 1 κεφαλαίο, 1 πεζό, 1 ψηφίο, 1 σύμβολο.
                    </small>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Όνομα (First Name):</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Επώνυμο (Last Name):</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Ρόλος (Role):</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="ROLE_MEMBER">ROLE_MEMBER</option>
                        <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                        <option value="ROLE_LIBRARIAN">ROLE_LIBRARIAN</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '0.75rem',
                        backgroundColor: '#2ecc71',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginTop: '0.5rem'
                    }}
                >
                    {loading ? 'Εγγραφή...' : 'Εγγραφή'}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                    onClick={onRegisterSuccess}
                    style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Έχετε ήδη λογαριασμό; Συνδεθείτε
                </button>
            </div>
        </div>
    );
}