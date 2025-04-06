import { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'user' && password === 'user') {
      onLogin();
    } else {
      setError('Invalid credentials. Use user/user to login.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-xl border border-neon-blue/20 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neon-blue">Welcome to SelfHelf</h2>
          <p className="mt-2 text-foreground/70">Sign in to manage your supplements</p>
        </div>
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-foreground/70">Email</label>
              <input
                id="email"
                type="email"
                className="mt-1 block w-full rounded-md border border-neon-blue/20 
                         bg-neon-darker text-foreground shadow-sm
                         focus:border-neon-blue focus:ring focus:ring-neon-blue/20"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-foreground/70">Password</label>
              <input
                id="password"
                type="password"
                className="mt-1 block w-full rounded-md border border-neon-blue/20 
                         bg-neon-darker text-foreground shadow-sm
                         focus:border-neon-blue focus:ring focus:ring-neon-blue/20"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="button"
            onClick={onLogin}
            className="w-full py-2 px-4 bg-neon-darker text-neon-blue border border-neon-blue/30 
                     rounded-md hover:bg-neon-blue/10 focus:outline-none focus:ring-2 
                     focus:ring-neon-blue/50 transition-all duration-200"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}; 