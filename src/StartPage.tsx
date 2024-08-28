import {Link, useNavigate} from 'react-router-dom';
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

interface Customer {
    firstName: string;
    id: number;
    // Lägg till fler fält beroende på vad ditt API returnerar
}

function StartPage() {

    const navigate = useNavigate();

    const {data: data, error: error, isLoading: isLoading} = useQuery({
        queryKey: ["customer"],
        queryFn: () => fetch('http://localhost:8080/v1/customer', {
            credentials: 'include', // Include credentials like cookies
        }).then((res) => {
            if (!res.ok) return Promise.reject(res);
            return res.json(); // Här returneras JSON-innehållet som en Promise
        }).then((data) => {
            console.log('Data fetch success:', data); // Logga den faktiska datan
            return data; // Returnera datan för att useQuery ska kunna använda den
        }),
    });

    function handleClick(id: number) {
        navigate(`/${id}`);
    }

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>

    return (
        <>
            <h1>Welcome to the Start Page</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/home">Go to Home</Link>
                    </li>
                    <li>
                        <Link to="/about">Go to About</Link>
                    </li>
                </ul>
            </nav>
            <div>
                <h1>Customer List</h1>
                <ul>
                    {data.customers.map((customer: Customer) => (
                        <li key={customer.id}>
                            <button onClick={() => handleClick(customer.id)}>
                                {customer.firstName}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default StartPage;
