import { useParams } from "react-router-dom"
import axios from '../config/axios'
import { useState, useEffect }  from 'react' 
export default function SingleApplication(){
    const jobStatuses = ['submitted', 'under-review', 'accepted', 'rejected']
    const [application, setApplication] = useState(null) 
    const { id, appId } = useParams()

    useEffect(() => {
        (async () => {
            const response = await axios.get(`/api/jobs/${id}/applications/${appId}`, { 
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            setApplication(response.data)
        })();   
    }, [])

    const handleChange = async (e) => {
        const value = e.target.value 
        const response = await axios.put(`/api/jobs/${id}/applications/${appId}`, { status: value }, { 
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
        setApplication(response.data)
    }

    return (
        <div>
            <h2>Single Application</h2>
            { application && (
                <div>
                    <p>Job - { application.job.title }  </p>
                    <p>Candidate - { application.candidate.username }</p>
                    <p>Status - 
                        <select value={application.status} onChange={handleChange}>
                            <option value="">select</option>
                            { jobStatuses.map((ele, i) => {
                                return <option value={ele} key={i}>{ele}</option>
                            })}
                        </select>
                    
                    </p>
                </div> 
            )}
            
        </div>
    )
}