import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { prebootWebContainer } from '../hooks/useWebContainer';

const LandingPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit =  (e: React.FormEvent) => {
    e.preventDefault();

    if(prompt.trim()){
      // begin booting the WebContainer while we navigate so preview is ready quicker
      try { prebootWebContainer().catch(() => {}); } catch (e) {}
      navigate('/generate', {state: {prompt}})
    }


  };


  return (
    <div className=" bg-gradient-to-br max-h-screen from-gray-900 via-gray-800 to-black relative overflow-hidden py-20 w-full">

      
        <div className="mx-auto text-center max-w-2xl flex flex-col gap-40">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold text-white  ">
              Build Websites with
              <span className="block bg-gradient-to-r from-purple-400 to-blue-400 leading-[1.30] bg-clip-text text-transparent drop-shadow-lg">
                AI Magic
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Transform your ideas into stunning websites in minutes. Just describe what you want,
              and watch as we generate the perfect website for you.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            
          >
            

             <div className='flex items-center gap-2 mb-2'>

                <Sparkles className="w-5 h-5 text-purple-300 " />
                <span className="text-purple-300 font-medium">Describe your website</span>
             </div>
             
              
              <div className="relative ">
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
            
          </motion.form>

          
            
            
            
         
        </div>
      

      
    </div>
  );
};

export default LandingPage;