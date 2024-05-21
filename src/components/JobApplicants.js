import { useParams, Link } from "react-router-dom"
import axios from '../config/axios'
import { useState, useEffect } from 'react' 
export default function JobApplications(){ 
    const [ applications, setApplications] = useState([])
    const { id } = useParams()

    useEffect(() => {
        (async() => {
            const response = await axios.get(`/api/jobs/${id}/applications`, { 
                headers: {
                    'authorization' : localStorage.getItem('token')
                }
            })
           setApplications(response.data)
        })();
    }, [])

    return (
        <div>
            <h2>Job Applicants - { id } </h2>
            { applications.length == 0 ? <p>No Applications submitted </p> : (
                <ul>
                    { applications.map((ele) => {
                        return <li key={ele._id}>{ ele?.candidate?.username } <Link to={`/jobs/${id}/single-application/${ele._id}`}>See More Details</Link></li>
                    })}
                </ul>
            )}
        </div>
    )
}