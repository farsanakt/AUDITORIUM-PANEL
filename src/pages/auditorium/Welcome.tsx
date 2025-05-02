import React from 'react';


const WelcomePage: React.FC = () => {


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDF8F1] p-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold mb-2 text-black">Welcome</h1>
        <p className="text-xl text-[#78533F] mb-8">Start your journey with us today</p>
        
        <button 
      
          className="bg-[#ED695A] text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          Login to Continue
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;