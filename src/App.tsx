import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {useState, useEffect} from 'react';
import Login from './Login';
import StartPage from './StartPage';
import About from './About';
import CustomerDetail from './CustomerDetail.tsx';

const queryClient = new QueryClient();

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // Funktion för att verifiera användaren
    const verifyUser = async () => {
        const response = await fetch('http://localhost:8080/v1/auth/verify',
            {
                method: 'GET',
                credentials: 'include',
            });
        if (!response.ok) {
            throw new Error('Verification failed');
        }
    };

    // Använd `useEffect` för att göra verifieringsanropet när komponenten laddas
    useEffect(() => {
        verifyUser()
            .then(() => {
                setIsLoggedIn(true);
                console.log('verification succeeded');
            })
            .catch(() => setIsLoggedIn(false))  // Uppdatera till utloggad om verifiering misslyckas
            .finally(() => setIsAuthLoading(false));  // Sluta ladda oavsett resultat
    }, []); // Lägg till tom beroende-array för att köra endast en gång vid montering

    if (isAuthLoading) {
        return <div>Loading...</div>; // Visa en laddningsindikator medan verifieringen pågår
    }

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={isLoggedIn ? <StartPage/> : <Login onLoginSuccess={() => setIsLoggedIn(true)}/>}
                    />
                    <Route path="/home" element={<StartPage/>}/>
                    <Route path="/login" element={<Login onLoginSuccess={() => setIsLoggedIn(true)}/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/:id" element={<CustomerDetail/>}/>
                </Routes>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
