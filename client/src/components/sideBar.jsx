import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
function SideBar({ items }) {

const location = useLocation();



  return (
    <div className="h-screen w-64 bg-gradient-to-b from-blue-500/30 to-blue-900/10 backdrop-blur-xl text-black shadow-2xl rounded-lg border border-white/30">
   <Link to={"/"}>  <h2 className="text-3xl font-extrabold mb-8">DASHBOARD</h2> </Link>
    <h3 className="text-2xl font-extrabold  mb-8 text- ">{items.name  && items.name    }</h3>

      <nav className="space-y-4">
        {items.arr.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={ `block ${location.pathname == item.path ? "bg-white/50":""} px-4 py-3 rounded-lg hover:bg-blue-300transition`}
          >
            {item.label}
            {console.log("path " +  item.path)}
           { console.log(location.pathname)}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default SideBar;
