import React from 'react'
import Dashboard from './Dashboard'
import {Routes, Route, BrowserRouter,Link,Outlet,useNavigate} from "react-router-dom"

function Layout() {
  return (
    <div className='flex bg-gradient-to-r from-indigo-500 via-slate-300 to-blue-500 '>
        <Dashboard />

        <div className='w-full bg-red-300 ml-64 bg-red-30'>    
              <Outlet />
            </div>


    </div>
  )
}

export default Layout