import React from 'react'
import Dashboard from './Dashboard'
import {Outlet} from "react-router-dom"
// bg-gradient-to-r from-slate-300 to-slate-500
function Layout() {
  return (
    <div className='flex fixed  overflow-y-auto w-screen bg-gradient-to-r from-indigo-500 via-slate-300 to-blue-500 '>
        <Dashboard />

        <div className='w-full overflow-y-auto  ml-64 '>    
              <Outlet />
            </div>
            
    </div>
  )
}

export default Layout