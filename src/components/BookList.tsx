import { useEffect, useState } from 'react';


interface Book {
    id: string;
    title: string;
    author: string;
    isbn?: string;
    available?: boolean;
}

export default function BookList() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch('http://localhost:8080/api/books', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    }
                });

                if (!response.ok) {
                    throw new Error('Αποτυχία φόρτωσης βιβλίων από τον server.');
                }

                const data = await response.json();
                setBooks(data);
            } catch (err: any) {
                setError(err.message || 'Κάτι πήγε στραβά κατά τη φόρτωση.');
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // Συνάρτηση για την πραγματοποίηση κράτησης
    const handleReserve = async (bookId: string) => {
        const token = localStorage.getItem('token');

        // Έλεγχος αν υπάρχει το token
        if (!token) {
            alert('Δεν έχετε συνδεθεί ή η συνεδρία σας έληξε. Παρακαλώ συνδεθείτε ξανά.');
            // Εδώ μπορείτε να τον κάνετε redirect στο /login αν θέλετε
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Αφού το ελέγξαμε, το βάζουμε άφοβα!
                },
                body: JSON.stringify({ bookId: bookId })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Η κράτηση απέτυχε.');
            }

            alert('Η κράτηση ολοκληρώθηκε επιτυχώς! Μπορείτε να τη δείτε στην καρτέλα σας.');
        } catch (err: any) {
            alert(`Σφάλμα κράτησης: ${err.message}`);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>Φόρτωση βιβλιοθήκης...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>Σφάλμα: {error}</div>;
    }

    return (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem', textAlign: 'center' }}>Διαθέσιμα Βιβλία</h2>

            {books.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666' }}>Δεν βρέθηκαν καταχωρημένα βιβλία στη βάση δεδομένων.</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                        <tr style={{ backgroundColor: '#3498db', color: 'white' }}>
                            <th style={{ padding: '0.75rem' }}>Τίτλος</th>
                            <th style={{ padding: '0.75rem' }}>Συγγραφέας</th>
                            <th style={{ padding: '0.75rem' }}>ISBN</th>
                            <th style={{ padding: '0.75rem', textAlign: 'center' }}>Ενέργειες</th>
                        </tr>
                        </thead>
                        <tbody>
                        {books.map((book, index) => (
                            <tr
                                key={book.id || index}
                                style={{
                                    borderBottom: '1px solid #dee2e6',
                                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white'
                                }}
                            >
                                <td style={{ padding: '0.75rem' }}>{book.title}</td>
                                <td style={{ padding: '0.75rem' }}>{book.author}</td>
                                <td style={{ padding: '0.75rem' }}>{book.isbn || '-'}</td>
                                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                    <button
                                        onClick={() => handleReserve(book.id)}
                                        style={{
                                            padding: '0.4rem 0.8rem',
                                            backgroundColor: '#2ecc71',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        Κράτηση
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}