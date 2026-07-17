'use client'
import { useAuth } from "../lib/AuthContext"
import DashboardUI from "../components/DashboardUI/DashboardUI"

const ProfileClient = ({profile, comments, subscribers, posts}) => {
    const { isAdmin, user } = useAuth()
    const isOwner = user && user.id === profile.id;

  return (
    <>
        <DashboardUI
            profile={profile}
            comments={comments}
            posts={posts}
            isAdmin={isAdmin}
            subscribers={subscribers}
            isOwner={isOwner}
        />
    </>
  )
}

export default ProfileClient
