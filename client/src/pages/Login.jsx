import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login/Signup
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Sign Up Logic
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Success! Check your email to confirm account.");
      } else {
        // Login Logic
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/'); // Redirect to Home
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-white">
      <div className="w-full max-w-md bg-bg-card p-8 rounded-2xl border border-border-subtle shadow-xl">
        
        <h2 className="text-3xl font-bold mb-2 text-center">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-text-muted text-center mb-8">
            {isSignUp ? 'Join the sonic revolution.' : 'Login to continue listening.'}
        </p>

        {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md mb-4 text-sm">
                {error}
            </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-text-muted">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          </span>
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-white font-semibold hover:underline"
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;