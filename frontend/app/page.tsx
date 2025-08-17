'use client';

import React from 'react'
import AMapRoute from '../components/AMapRoute'
import LoginForm from '../components/auth/LoginForm';
const ShowMap:React.FC = () => {
  return (
    <div>
      <LoginForm></LoginForm>
      <AMapRoute></AMapRoute>
    </div>
  )
}
 
export default ShowMap
