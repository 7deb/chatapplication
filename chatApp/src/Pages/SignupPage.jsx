import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../Store/useAuthStore';
import { MessageSquare, User, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; 
import toast from 'react-hot-toast';


const SignupPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmedPassword: ""
  });

  const { signup, isSigningUp, authUser } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.password.length < 6 ){
      toast.error("password must be atleast 6 characters")
    }
    if (formData.password !== formData.confirmedPassword) {
      toast.error("passwords do not match");
      return ;
    }
    if(!formData.username){
      toast.error("username is required!");
      return;
    }
    if(!formData.email){
      toast.error("email is required");
      return;
    }
    await signup(formData);
  };

  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  return (

    <div className="min-h-screen grid lg:grid-cols-2 p-10">
      {/* Left Side Intro */}
      <div className="text-center mb-8 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-2 group">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <MessageSquare className="size-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mt-2">Create Account</h1>
          <p className="text-base-content/60">Have fun make</p>
        </div>
      </div>

      {/* Right Side Form */}
      <form onSubmit={handleSubmit} className="skeleton space-y-6  p-4 rounded-lg shadow-md max-w-md ">
        {/* Username */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Username</span>
          </label>
          <div className="relative">
            <User className="absolute  top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              className="input input-bordered w-full "
              placeholder="John Doe"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
        </div>

        {/* Email */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Email</span>
          </label>
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        {/* Password */}
        <div className="form-control relative">
          <label className="label">
            <span className="label-text font-medium">Password</span>
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className="input input-bordered w-full pr-10"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button
            type="button"
            className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Confirm Password</span>
          </label>
          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="••••••••"
            value={formData.confirmedPassword}
            onChange={(e) => setFormData({ ...formData, confirmedPassword: e.target.value })}
          />
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
          {isSigningUp ? "Creating..." : "Sign Up"}
        </button>

        {/* Login Redirect */}
        <p className="text-sm text-center mt-4 text-yellow-400">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </p>
      </form>
    </div>

  );
};

export default SignupPage;
