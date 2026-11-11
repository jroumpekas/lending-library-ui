import { useEffect, useState } from "react";
import AIRecommendations from "./AIRecommendations"; // 1. Κάνε import το component σου

interface Reservation {
    id: string;
    bookTitle: string;
    username: string;
    reservationDate: string;
    dueDate: string;
    status: string;
}

export default function Reservations() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('http://localhost:8080/api/reservations/my', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Αποτυχία φόρτωσης κρατήσεων');
                }
                return response.json();
            })
            .then(data => {
                setReservations(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ padding: '20px' }}>Φόρτωση κρατήσεων...</div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}>Σφάλμα: {error}</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Οι Κρατήσεις μου</h2>
            {reservations.length === 0 ? (
                <p>Δεν έχετε ενεργές κρατήσεις.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Βιβλίο</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Ημερομηνία Κράτησης</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Λήξη</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Κατάσταση</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reservations.map(res => (
                        <tr key={res.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>{res.bookTitle}</td>
                            <td style={{ padding: '10px' }}>{new Date(res.reservationDate).toLocaleDateString()}</td>
                            <td style={{ padding: '10px' }}>{new Date(res.dueDate).toLocaleDateString()}</td>
                            <td style={{ padding: '10px' }}>
                  <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: res.status === 'ACTIVE' ? '#e1f5fe' : '#ffebee',
                      color: res.status === 'ACTIVE' ? '#0288d1' : '#c62828',
                      fontWeight: 'bold'
                  }}>
                    {res.status}
                  </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* 2. Εμφανίζουμε τις έξυπνες προτάσεις AI ακριβώς κάτω από τον πίνακα */}
            <AIRecommendations />
        </div>
    );
}