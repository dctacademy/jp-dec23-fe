import { useAuth } from "../context/AuthContext"
export default function Home() {
    const { user } = useAuth() // useContext(AuthContext)
    return (
        <div>
            <h2>Home Component</h2>
            { user && <p>Welcome { user.username } </p>}
        </div>
    )
}