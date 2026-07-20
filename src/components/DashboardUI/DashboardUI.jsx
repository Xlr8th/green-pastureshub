'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, Settings, Shield, BookOpen, 
  Users, Calendar, Edit2, Lock 
} from 'lucide-react';
import './DashboardUI.css';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../lib/ToastContext';

export default function DashboardUI({ 
  profile, 
  comments, 
  posts, 
  isOwner, 
  isAdmin, 
  subscribers 
}) {
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState(isAdmin ? 'admin' : 'activity');
    const [displayName, setDisplayName] = useState(profile.display_name || '');
    const [password, setPassword] = useState(''); const [savingName, setSavingName] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


  // Compute Post Stats
  const totalPosts = posts.length;
  const postsByCategory = posts.reduce((acc, curr) => {
    acc[curr.subCategory] = (acc[curr.subCategory] || 0) + 1;
    return acc;
  }, {});

  const handleDisplayNameUpdate = async (e) => {
    e.preventDefault();
    if(!displayName.trim()) {
        showToast('Please enter a valid display name', 'error');
        return;
    }
    setSavingName(true);
    try {    
        // Check if display name is already taken
        const { data: existing } = await supabase
            .from('profiles')
            .select('id')
            .eq('display_name', displayName.trim())
            .single()

        if (existing) {
            showToast('Display name is already taken', 'error');
            return;
        }
        // Proceed to update
        const {error: displayNameError} = await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('id', profile.id)

        if (displayNameError) {
            showToast(displayNameError.message, 'error')
            return;
        }else{
            showToast('Display Name Updated Successfully.', 'success');
        }
        setDisplayName(displayName.trim());

    }catch (error) {
        showToast(error.message || 'Something went wrong. Please try again later.', 'error')

    }
    finally {
        setSavingName(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
        showToast("Password must be at least 8 characters.", "error");
        return;
    }
    setSavingPassword(true);
    try {
        const { error } = await supabase.auth.updateUser({
      password: password});
      if (error) throw error;
      showToast('Password Updated Successfully.', 'success');
      setPassword('');

    }catch (error) {
        showToast(error.message || 'Something went wrong. Please try again later.', 'error')
    }
    finally {
        setSavingPassword(false);
    }

  }

  return (
    <div className="dashboard">
      
      {/* 1. Profile Header Hero */}
      <div className="headerHero">
        <div className="headerContainer">
          {/* Avatar */}
          <div className="avatar">
            {profile.display_name?.slice(0, 2) || "GP"}
          </div>

          {/* User Details */}
          <div className="profileDetails">
            <div className="nameRow">
              <h1 className="displayName">{profile.display_name}</h1>
              {isAdmin && isOwner && (
                <span className="adminBadge">
                  <Shield size={12} /> Admin
                </span>
              )}
            </div>
            <p className="joinDate">
              <Calendar size={16} /> Member since {new Date(profile.created_at).toLocaleDateString('us-en', { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Dashboard Layout Grid */}
      <div className={`mainGrid ${!(isOwner || isAdmin) ? 'no-sidebar' : ''}`}>
        
        {/* Sidebar Navigation (Visible to Owner or Admins) */}
        <div className={`sidebar${!(isOwner || isAdmin) ? 'no-sidebar' : ''}`}>
          {(isOwner || isAdmin) && (
            <>
              <p className="sidebarTitle">Dashboard</p>
              
              {isAdmin && (
                <button 
                  onClick={() => setActiveTab('admin')}
                  className={`navButton ${activeTab === 'admin' ? 'navButtonActive' : ''}`}
                >
                  <Shield size={16} /> Admin Console
                </button>
              )}

              <button 
                onClick={() => setActiveTab('activity')}
                className={`navButton ${activeTab === 'activity' ? 'navButtonActive' : ''}`}
              >
                <MessageSquare size={16} /> My Activity
              </button>

              {isOwner && (
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`navButton ${activeTab === 'settings' ? 'navButtonActive' : ''}`}
                >
                  <Settings size={16} /> Settings
                </button>
              )}
            </>
          )}
        </div>

        {/* 3. Main Content Panel */}
        <div className="contentArea">
          
          {/* TAB 1: ADMIN CONSOLE */}
          {activeTab === 'admin' && isAdmin && (
            <>
              {/* Admin KPI Summary Row */}
              <div className="statsRow adminStatsRow">
                <div className="card">
                  <div className="iconWrapperEmerald"><Users size={24} /></div>
                  <div>
                    <h3 className="cardLabel">Active Subscribers</h3>
                    <p className="cardValue">{subscribers.length}</p>
                  </div>
                </div>
                <div className="card">
                  <div className="iconWrapperAmber"><BookOpen size={24} /></div>
                  <div>
                    <h3 className="cardLabel">Global Comments</h3>
                    <p className="cardValue">{comments.length} <span style={{fontSize: '0.75rem', fontWeight: 'normal', color: '#94a3b8'}}>on profile</span></p>
                  </div>
                </div>
              </div>

              {/* Subscriber Management Table */}
              <div className="tableCard">
                <div className="tableHeader">
                  <h2 className="tableTitle">Active Email List</h2>
                  <span className="tableBadge">Live Connection</span>
                </div>
                <div className="tableResponsive">
                  <table className="customTable">
                    <thead>
                      <tr className="tableHeadRow">
                        <th>Subscribers</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((sub, i) => (
                        <tr key={i} className="tableBodyRow">
                          <td style={{fontWeight: '500', color: '#0f172a'}}>
                            <span className="activeDot"></span> {sub.email.split('@')[0]}
                          </td>
                          <td style={{color: '#94a3b8'}}>{new Date(sub.subscribed_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {(!subscribers || subscribers.length === 0) && (
                        <tr>
                          <td colSpan="3" className="emptyText">No active subscribers found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: USER PROFILE ACTIVITY */}
          {activeTab === 'activity' && (
            <>
              {/* Activity Stats Cards */}
              <div className="statsRow">
                <div className="card">
                  <div className="iconWrapperEmerald"><MessageSquare size={20} /></div>
                  <div>
                    <h4 className="cardLabel">Total Comments</h4>
                    <p className="cardValue">{comments.length}</p>
                  </div>
                </div>
                <div className="card">
                    <div className="iconWrapperEmerald"><BookOpen size={20} /></div>
                    <div>
                        <h4 className="cardLabel">Total Posts</h4>
                        <p className="cardValue">{totalPosts}</p>
                    </div>
                </div>
               
              </div>
              <div>
                <div className="categoryCard">
                    <h4 className="categoryTitle">Subcategory Spread</h4>
                    
                    {Object.keys(postsByCategory).length > 0 ? (() => {
                        // Define an array of nice colors for your subcategories
                        const colors = [
                            '#0ea5e9', '#10b981',
                            '#f59e0b', '#8b5cf6',
                            '#ec4899', '#ef4444', 
                            '#64748b'
                        ];
                        const totalEntries = Object.values(postsByCategory).reduce((a, b) => a + b, 0);
                        
                        let cumulativePercent = 0;
                        const gradientSlices = Object.entries(postsByCategory).map(([cat, count], index) => {
                        const percent = (count / totalEntries) * 100;
                        const color = colors[index % colors.length];
                        const slice = `${color} ${cumulativePercent}% ${(cumulativePercent + percent).toFixed(1)}%`;
                        cumulativePercent += percent;
                        return slice;
                        });

                        return (
                        <div className="chartFlexContainer">
                            {/* The Hollow Donut Chart View */}
                            <div 
                            className="donutChart" 
                            style={{ background: `conic-gradient(${gradientSlices.join(', ')})` }}
                            />

                            {/* The Legend & Text Figure Layout */}
                            <div className="chartLegend">
                            {Object.entries(postsByCategory).map(([cat, count], index) => {
                                const color = colors[index % colors.length];
                                return (
                                <div key={cat} className="legendItem">
                                    <div className="legendLabelGroup">
                                    <span className="colorIndicator" style={{ backgroundColor: color }} />
                                    <span className="categoryName">{cat}</span>
                                    </div>
                                    <span className="categoryCount">{count}</span>
                                </div>
                                );
                            })}
                            </div>
                        </div>
                        );
                    })() : (
                        <span className="emptyText" style={{ fontSize: '0.75rem' }}>No subcategory stats yet</span>
                    )}
                </div>
              </div>

              {/* Comment History Timeline */}
              <div className="timelineCard">
                <h3 className="timelineTitle">Comment Timeline</h3>
                <div className="timeline">
                  {comments.map((comment) => (
                    <div key={comment.id} className="timelineItem">
                      <div className="timelineIndicator" />
                      <p className="timelineMeta">
                        Commented on{" "}
                        <Link href={`/post/${comment.posts?.slug}`} className="postLink">
                          {comment.posts?.title}
                        </Link>{" "}
                        • {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                      <p className="commentBubble">
                        "{comment.content}"
                      </p>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="emptyText">No comments posted yet.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* TAB 3: ACCOUNT SETTINGS */}
          {activeTab === 'settings' && isOwner && (
            <div className="settingsCard">
              <h2 className="settingsTitle">Edit Profile Settings</h2>
              
              {/* Change Display Name Inline Form */}
              <form className="settingsForm" onSubmit={handleDisplayNameUpdate}>
                <div className="formGroup">
                  <label className="formLabel">Display Name</label>
                  <div className="inputWrapper">
                    <input 
                      type="text" 
                      value={displayName}
                      placeholder='Change Display Name'
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="formInput"
                    />
                    <Edit2 className="inputIcon" />
                  </div>
                </div>
                <button type="submit" className="submitBtnEmerald" disabled={savingName}>
                    {savingName
                    ? 'please wait...'
                    : 'Save Changes'}
                </button>
              </form>

              <hr className="divider" />

              {/* Change Password Form */}
              <form className="settingsForm" onSubmit={handlePasswordUpdate}>
                <div className="formGroup">
                  <label className="formLabel">New Password</label>
                  <div className="inputWrapper">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="formInput"
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(prev => !prev)}
                    >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                    <Lock className="inputIcon" />
                  </div>
                </div>
                <button type="submit" disabled={savingPassword} className="submitBtnSlate">
                    {savingPassword
                        ? 'Please wait...'
                        : 'Update Password'
                        }
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}