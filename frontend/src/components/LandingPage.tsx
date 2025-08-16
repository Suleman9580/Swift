import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit =  (e: React.FormEvent) => {
    e.preventDefault();

    if(prompt.trim()){
      navigate('/generate', {state: {prompt}})
    }


  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            
            
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-12 ">
              Build Websites with
              <span className="block bg-gradient-to-r from-purple-400 to-blue-400 leading-[1.30] bg-clip-text text-transparent drop-shadow-lg">
                AI Magic
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Transform your ideas into stunning websites in minutes. Just describe what you want,
              and watch as we generate the perfect website for you.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="mb-12"
          >
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
              <div className="flex items-center mb-4">
                <Sparkles className="w-5 h-5 text-purple-300 mr-2" />
                <span className="text-purple-300 font-medium">Describe your website</span>
              </div>
              
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., Create a modern portfolio website with a dark theme, hero section, about me, projects gallery, and contact form..."
                  className="w-full h-32 bg-gray-900/50 border border-gray-600/50 rounded-xl px-6 py-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200"
                  disabled={isLoading}
                />
                
                <button
                  type="submit"
                  disabled={!prompt.trim() || isLoading}
                  className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <Zap className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Site
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid md:grid-cols-2 gap-4"
          >
            
            
            
          </motion.div>
        </div>
      </div>

      
    </div>
  );
};

export default LandingPage;