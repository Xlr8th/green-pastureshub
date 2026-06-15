'use client'
import { useAuth } from "../lib/AuthContext"

const AdminViews = ({views}) => {
    const { isAdmin } = useAuth()

 return (
    <>
        {isAdmin && (
            <div className="post-view-meta-item">
                <span><i className="bi bi-eye icon-faint"></i></span>
                <span>{views.toLocaleString()} views</span>
            </div>
        )}
    </>
)}

export default AdminViews;
