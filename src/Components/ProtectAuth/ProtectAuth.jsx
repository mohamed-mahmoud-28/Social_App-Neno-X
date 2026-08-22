import { Navigate } from "react-router-dom"


export default function ProtectAuth({ children }) {
    if (!localStorage.getItem('token')) {
        return (children)
    } else {
        return <Navigate to="/home" />
    }
}
