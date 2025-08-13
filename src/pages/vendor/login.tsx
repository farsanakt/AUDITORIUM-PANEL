import React, { useState } from 'react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Login to your account</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="flex items-center mb-4">
          <input type="checkbox" className="mr-2" />
          <span>Remember me</span>
          <a href="#" className="ml-auto text-purple-600">Forgot your password?</a>
        </div>
        <button className="w-full bg-black text-white p-2 rounded">Login</button>
      </div>
    </div>
  );
};

export default Login;