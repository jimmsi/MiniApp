import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    // Lägg till fler fält beroende på vad ditt API returnerar
}

function CustomerDetail() {
    const { id } = useParams<{ id: string }>(); // Hämta ID från URL:en

    const { data, error, isLoading } = useQuery({
        queryKey: ["customer", id], // Dynamisk query key baserad på ID
        queryFn: () => fetch(`http://localhost:8080/v1/customer/${id}`, {
            credentials: 'include', // Include credentials like cookies
        }).then((res) => {
            if (!res.ok) return Promise.reject(res);
            return res.json();
        }),
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    if (!data) return <div>No customer found</div>;

    return (
        <div>
            <h1>Customer Detail</h1>
            <p>ID: {data.id}</p>
            <p>Name: {data.firstName} {data.lastName}</p>
            <p>Email: {data.email}</p>
        </div>
    );
}

export default CustomerDetail;
