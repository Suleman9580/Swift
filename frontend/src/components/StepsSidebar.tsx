import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Zap } from 'lucide-react';

export enum StepType {
  CreateFile,
  CreateFolder,
  EditFile,
  DeleteFile,
  RunScript
}


export interface Step {
  id: number;
  title: string;
  description: string;
  type: StepType;
  status: 'pending' | 'in-progress' | 'completed';
  code?: string;
  path?: string;
}

interface StepsSidebarProps {
  steps: Step[];
  currentStep: number;
  isGenerating: boolean;
}

const StepsSidebar: React.FC<StepsSidebarProps> = ({
  steps,
  currentStep,
  isGenerating
}) => {
  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep && isGenerating) return 'active';
    
    return 'pending';
  };

  return (
    <div className="h-full overflow-auto">
      
      
      <div className="p-6 space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex items-start gap-4 p-2 rounded-lg transition-all duration-200 ${
                status === 'active'
                  ? 'bg-blue-900/30 border-2 border-blue-500/50'
                  : status === 'completed'
                  ? 'bg-emerald-900/30 border border-emerald-500/50'
                  : 'bg-gray-800/50 border border-gray-600/50'
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  status === 'completed'
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : status === 'active'
                    ? 'bg-blue-600 border-blue-600 text-white animate-pulse'
                    : 'bg-gray-700 border-gray-600 text-gray-400'
                }`}
              >
                {status === 'completed' ? (
                  <Check className="w-4 h-4" />
                ) : status === 'active' ? (
                  <Zap className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-medium ${
                    status === 'active'
                      ? 'text-blue-300'
                      : status === 'completed'
                      ? 'text-emerald-300'
                      : 'text-gray-300'
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    status === 'active'
                      ? 'text-blue-400'
                      : status === 'completed'
                      ? 'text-emerald-400'
                      : 'text-gray-500'
                  }`}
                >
                  {step.description}
                </p>
                
                {status === 'active' && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-full h-1 bg-blue-900/50 rounded-full mt-2 overflow-hidden"
                  >
                    <motion.div
                      className="h-full bg-blue-500 rounded-full shadow-sm"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
        
        {!isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-emerald-900/30 border border-emerald-500/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <Check className="rounded-full w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-emerald-300">
                  Generation Complete!
                </h3>
                <p className="text-sm text-emerald-400">
                  Your website is ready for preview and download
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StepsSidebar;