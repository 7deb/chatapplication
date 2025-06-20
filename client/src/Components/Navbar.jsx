import React from 'react';
import { LogOut } from 'lucide-react';
import { Link } from 'react-router-dom'; // ✅ Import Link
import { useAuthStore } from '../Store/useAuthStore';

const Navbar = () => {
  const { logout, authUser, } = useAuthStore();

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="navbar-start">
        {/* Optional: logo or nav links */}
      </div>

      <div className="navbar-center">
        <Link to="/" className="text-xl font-semibold no-underline hover:opacity-80">
        BuddyLine
        </Link>
      </div>

      <div className="navbar-end flex items-center gap-2">
        {/* 🔍 Search */}
        <button className="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* ☰ Dropdown Menu */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/settings" className="text-primary font-medium">Settings</Link>
            </li>
            <li>
              <Link to="/profile" className="text-primary font-medium">profile</Link>
            </li>
          </ul>
        </div>

        {/* 🚪 Logout */}
        <button className="btn btn-ghost btn-circle" onClick={logout}>
          <LogOut className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
