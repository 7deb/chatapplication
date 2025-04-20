import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../Store/useAuthStore';
import { User, Eye, EyeOff } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setformData] = useState({
    email: "",
    password: ""
  });

  const { login, isLoggingin, authUser } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
       
    await login(formData);
  };

  useEffect(()=>{
    if(authUser){
      navigate("/")
    }
  },[authUser,navigate]);

  return (
    <div>
      <div className="min-h-screen flex justify-center items-center ">
        <form onSubmit={handleSubmit} className="skeleton space-y-6 bg-grey-100 p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className=" text-2xl font-bold text-center text-blue-500">Login</h2>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <div className="relative">
              <input
                type="email"
                className="input input-bordered w-full pl-10"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setformData({ ...formData, email: e.target.value })}
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-600">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pl-10 pr-10"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setformData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-full" disabled={isLoggingin}>
            {isLoggingin ? "Logging in..." : "Log In"}
          </button>

          {/* Signup Redirect */}
          <p className="text-sm text-center mt-4 text-green-400">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
