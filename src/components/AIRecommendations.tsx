import { useEffect, useState } from "react";

interface Recommendation {
    id: string;
    title: string;
    reason: string;
}

export default function AIRecommendations() {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        // Καλούμε το Spring Boot endpoint μας
        fetch('http://localhost:8080/api/reservations/ai/recommendations', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setRecommendations(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching AI recommendations:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ padding: '10px' }}>Φόρτωση έξυπνων προτάσεων AI...</div>;

    return (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>✨ Έξυπνες Προτάσεις Βιβλίων (AI Microservice)</h3>
            {recommendations.length === 0 ? (
                <p>Δεν υπάρχουν διαθέσιμες προτάσεις αυτή τη στιγμή.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {recommendations.map(rec => (
                        <li key={rec.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                            <strong>📚 {rec.title}</strong>
                            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                                <em>Αιτιολογία:</em> {rec.reason}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}