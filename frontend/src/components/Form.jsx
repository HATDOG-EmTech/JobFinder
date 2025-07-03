import {useState} from 'react'
import api from '../api'
import {useNavigate} from 'react-router-dom'
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../constants'
import '../styles/Form.css'
import LoadingIndicator from './LoadingIndicator'

function Form({route, method}) {
    const [username, setUsername] = useState("");
    const [email, setUseremail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setloading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register"

    const handleSubmit = async (e) => {
        setloading(true);
        e.preventDefault();

        const apiRoute = route.endsWith("/") ? route : route + "/";

        try { 
            const res = await api.post(apiRoute,{username, email, password});
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) { 
            alert(error)
        } finally {
            setloading(false);
        }
    };

    return <form onSubmit={handleSubmit} className="form-container">
        <h1>{name}</h1>
        <input
            className = "form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"

        />
        <input
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setUseremail(e.target.value)}
            placeholder="Email"
        />
        <input
            className = "form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"

        />
        {loading && <LoadingIndicator />}
        <button className="form-button" type="submit" disabled={loading}>
            {loading ? "Loading..." : name}
        </button>
    </form>
}

export default Form