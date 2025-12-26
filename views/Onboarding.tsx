
import React, { useState } from 'react';

const Onboarding: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: "Welcome to AdVault",
      desc: "The premium destination for smart earners. Watch ads, grow your balance, and withdraw instantly.",
      icon: "fa-bolt",
      color: "from-blue-600 to-indigo-600"
    },
    {
      title: "Watch & Earn",
      desc: "Get paid for every ad you watch. Complete your daily quota of 100 ads to maximize your daily income.",
      icon: "fa-play",
      color: "from-purple-600 to-pink-600"
    },
    {
      title: "Refer Friends",
      desc: "Share your code and get a $1 bonus instantly for every friend who joins your network.",
      icon: "fa-users",
      color: "from-orange-600 to-red-600"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center">
      <div className={`mb-12 flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br ${slides[step].color} shadow-2xl shadow-blue-500/20`}>
        <i className={`fa-solid ${slides[step].icon} text-5xl text-white`}></i>
      </div>

      <h1 className="mb-4 text-3xl font-black text-white">{slides[step].title}</h1>
      <p className="mb-12 max-w-xs text-gray-400">{slides[step].desc}</p>

      <div className="mb-8 flex gap-2">
        {slides.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-blue-500' : 'w-2 bg-gray-800'}`}></div>
        ))}
      </div>

      <button
        onClick={() => {
          if (step < slides.length - 1) setStep(step + 1);
          else onComplete();
        }}
        className="w-full max-w-xs rounded-2xl bg-white py-4 font-bold text-black transition-transform active:scale-95"
      >
        {step === slides.length - 1 ? "Get Started" : "Continue"}
      </button>
    </div>
  );
};

export default Onboarding;
