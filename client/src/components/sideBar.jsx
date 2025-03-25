import React from 'react';
import { Link } from 'react-router-dom';

function SideBar({ items }) {
  return (
    <div className="h-screen w-64 bg-gradient-to-b from-blue-500/30 to-blue-900/10 backdrop-blur-xl text-black shadow-2xl rounded-lg border border-white/30">
   <Link to={"/"}>  <h2 className="text-3xl font-extrabold mb-8">DASHBOARD</h2> </Link>
      <nav className="space-y-4">
        {items.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="block px-4 py-3 rounded-lg hover:bg-white/50 transition"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default SideBar;
