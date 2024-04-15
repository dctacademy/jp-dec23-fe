import { useState } from 'react' 
import { useNavigate } from 'react-router-dom'
import axios from 'axios' 
export default function Register() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('') 
    const [serverErrors, setServerErrors] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const formData = {
            username: username, 
            email: email,
            password: password, 
            role: role 
        }
        // TODO - client side validation 
        try {
            const response = await axios.post('http://localhost:3333/users/register', formData) 
            navigate('/login')
        } catch(err) {
            setServerErrors(err.response.data.errors)
        }
    }

    return (
        <div>
            <h2>Register With us</h2>

            { serverErrors && (
                <div>
                    <h3>Theses errors prohibitted the form from being saved: </h3>
                    <ul>
                        { serverErrors.map((ele, i) => {
                            return <li key={i}> { ele.msg } </li>
                        })}
                    </ul>
                </div> 
            )}


            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Enter username</label><br />
                <input 
                    type="text" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    id="username"
                /> <br />
                <label htmlFor="email">Enter email</label><br />
                <input 
                    type="text" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    id="email"
                /> <br />
                <label htmlFor="password">Enter Password</label><br />
                <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    id="password"
                /> <br />
                <label>Select Role</label> <br /> 
                <input 
                    type="radio" 
                    value="candidate" 
                    onChange={e => setRole(e.target.value)} 
                    checked={role == 'candidate'}  
                    id="candidate" 
                    name="role" 
                /> 
                <label htmlFor="candidate">Candidate</label>

                <input 
                    type="radio" 
                    value="recruiter" 
                    onChange={e => setRole(e.target.value)} 
                    checked={role == 'recruiter'}  
                    id="recruiter" 
                    name="role" 
                /> 
                <label htmlFor="recruiter">Recruiter</label>
                <br /> 
                <input type="submit" />
            </form>
        </div>
    )
}