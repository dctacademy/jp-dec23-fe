import { useState } from 'react'
import { Link } from 'react-router-dom'
import validator from 'validator'
import { useNavigate } from 'react-router-dom'
import axios from '../config/axios'
import _ from 'lodash'
import { useAuth } from '../context/AuthContext'
export default function Login() {
    const navigate = useNavigate()
    // const { handleLogin } = useAuth() // useContext(AuthContext) -> { user, handleLogin, handleLogout}
    const { dispatch } = useAuth() 

    const [form, setForm] = useState({
        email: '',
        password: '',
        serverErrors: null, 
        clientErrors: {}
    })

    const errors = {}

    const runValidations = () => {
        if(form.email.trim().length == 0) {
            errors.email = 'email is required'
        } else if(!validator.isEmail(form.email)) {
            errors.email = 'invalid email format'
        }

        if(form.password.trim().length == 0) {
            errors.password = 'password is required'
        } else if(form.password.trim().length < 8 || form.password.trim().length > 128) {
            errors.password = 'invalid password length'
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault() 
        const formData = _.pick(form, ['email', 'password'])

        runValidations()

        if(Object.keys(errors).length == 0 ) {
            try { 
                const response = await axios.post('http://localhost:3333/users/login', formData) 
                localStorage.setItem('token', response.data.token)
                const userResponse = await axios.get('http://localhost:3333/users/account', { 
                    headers : {
                        Authorization: localStorage.getItem('token')
                    }
                })
                console.log(userResponse.data)
                dispatch({ type: "LOGIN", payload: { account: userResponse.data } })
                // let url 
                // if(userResponse.data.role == 'candidate') {
                //     url = 'http://localhost:3333/api/candidates/profile'
                // } else {
                //     url = 'http://localhost:3333/api/recruiter/profile'
                // }
                // const profileResponse = await axios.get(url, { 
                //     headers: {
                //         Authorization: localStorage.getItem('token')
                //     }
                // })
                // // console.log(profileResponse.data)
                // dispatch({ type: "LOGIN", payload: { account: userResponse.data, profile: profileResponse.data } })
                navigate('/')
            } catch(err) {
                setForm({...form, serverErrors: err.response.data.errors, clientErrors: {} })
            }
        } else {
            setForm({...form, clientErrors: errors})
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
                />
                { form.clientErrors.email && <span> { form.clientErrors.email } </span>}
                 <br />

                <label htmlFor="password">Enter password</label><br />
                <input 
                    type="password" 
                    value={form.password} 
                    onChange={handleChange} 
                    name="password"
                    id="password"
                /> 
                { form.clientErrors.password && <span> { form.clientErrors.password } </span> }
                <br />

                <input type="submit" /> 
            </form>

            <Link to="/register">Create an account</Link>
        </div>
    )
}