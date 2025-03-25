import React from 'react'
import Dashboard from './Dashboard'
import {Routes, Route, BrowserRouter,Link,Outlet,useNavigate} from "react-router-dom"

function Layout() {
  return (
    <div className='flex  '>
        <Dashboard />

        <div className='w-full bg-red-300 ml-64 bg-red-30'>    
              <Outlet />
            </div>


    </div>
  )
}

export default Layout