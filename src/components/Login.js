import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import _ from 'lodash'
export default function Login() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        email: '',
        password: '',
        serverErrors: null 
    })
    const handleSubmit = async (e) => {
        e.preventDefault() 
        const formData = _.pick(form, ['email', 'password'])
        try { 
            const response = await axios.post('http://localhost:3333/users/login', formData) 
            localStorage.setItem('token', response.data.token)
            navigate('/')
        } catch(err) {
            setForm({...form, serverErrors: err.response.data.errors })
        }
    }

    const handleChange = (e) => {
        const { value, name } = e.target 
        setForm({...form, [name]: value })
    }

    const displayErrors = () => {
        let result 
        if(typeof form.serverErrors == 'string') {
            result = <p> { form.serverErrors } </p>
        } else {
            result = (
                <div>
                    <h3>Theses errors prohibitted the form from being saved: </h3>
                    <ul>
                        { form.serverErrors.map((ele, i) => {
                            return <li key={i}> { ele.msg } </li>
                        })}
                    </ul>
                </div>
            )
        }
        return result 
    }
    
    return (
        <div>
            <h2>Login</h2>
            { form.serverErrors && displayErrors() } 
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Enter email</label><br />
                <input 
                    type="text" 
                    value={form.email} 
                    onChange={handleChange}
                    name="email" 
                    id="email"
                /> <br />

                <label htmlFor="password">Enter password</label><br />
                <input 
                    type="password" 
                    value={form.password} 
                    onChange={handleChange} 
                    name="password"
                    id="password"
                /> <br />

                <input type="submit" /> 
            </form>
        </div>
    )
}