import {Link} from "react-router-dom";

function About() {
    return (
        <div>
            <h1>About Us</h1>
            <p>This is the about page.</p>
            <Link to="/home">Go to Home</Link>
        </div>
    );
}

export default About;
