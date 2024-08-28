import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true); // Starta laddningsprocessen
        setError(null); // Rensa tidigare fel

        fetch('http://localhost:8080/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) {
                    return response.json().then(data => {
                        console.log('Login success:', data);
                        onLoginSuccess(); // Anropa success-callback
                        navigate('/home');
                    });
                } else {
                    return response.json().then(errorData => {
                        setError(errorData.message || 'Something went wrong...'); // Visa felmeddelande
                        return Promise.reject(errorData); // Skicka fel vidare om nödvändigt
                    });
                }
            })
            .catch(error => {
                setError(error.message || 'Network error...'); // Hantera nätverksfel
            })
            .finally(() => {
                setLoading(false); // Avsluta laddningsprocessen
            });
    };


    if (loading) return <div>Loading...</div>; // Laddningsvy
    if (error) return <div>Error: {error}</div>; // Felvy

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
