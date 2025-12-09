import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StepsSidebar, {Step, StepType} from './StepsSidebar';
import FileExplorer from './FileExplorer';
import { ArrowLeft, Download, Eye, Heading1, Share2 } from 'lucide-react';
import { BACKEND_URL } from '../config';
import axios from 'axios'
import {parseXml}  from '../steps';
import { prebootWebContainer, useWebContainer } from '../hooks/useWebContainer';
import {PreviewFrame}  from './PreviewFrame';
import { motion } from 'framer-motion';


export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  content?: string;
  path?: String
}

const GenerationPage: React.FC = () => {


  const location = useLocation();
  const navigate = useNavigate();
  const prompt = location.state?.prompt || 'Create a website';
  
  // track active view: 'code' or 'preview'
  const [activeView, setActiveView] = useState<'code' | 'preview'>('code');
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [chatResponseStatus, setChatResponseStatus] = useState(false);
  const { webcontainer, error: webcontainerError } = useWebContainer() as any;

  const [files, setFiles] = useState<FileItem[]>([ ])
  const [mountStructure, setMountStructure] = useState<Record<string, any> | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);


  
  
  useEffect(()=> {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        let finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            // final file
            let file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            let folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }

    })

    if (updateHappened) {

      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }
        
      }))
    }
    // console.log(files);
    // console.log(steps)
  },[steps, files])

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const processFile = (file: FileItem): any => {
        if (file.type === 'folder') {
          return {
            directory: Object.fromEntries((file.children || []).map(child => [child.name, processFile(child)]))
          };
        }

        // file
        return {
          file: {
            contents: file.content || ''
          }
        };
      };

      return Object.fromEntries(files.map(f => [f.name, processFile(f)]));
    };

    const mountStructure = createMountStructure(files);

    if (webcontainer && files.length) {
      try {
        webcontainer.mount(mountStructure);
        console.log('mounted files to webcontainer', mountStructure);
        setMountStructure(mountStructure);
      } catch (err) {
        console.error('mount failed', err);
      }
    }
  }, [files, webcontainer]);

  useEffect(() => {
    if (!webcontainer) return;
    try {
      const unsub = webcontainer.on('server-ready', (port: number, url: string) => {
        console.log('server-ready (page):', port, url);
        setServerUrl(url);
      });

      return () => {
        try { unsub(); } catch (e) {}
      };
    } catch (e) {
      // ignore
    }
  }, [webcontainer]);


  async function init() {
    
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: prompt.trim()
    })   
    const {prompts, uiPrompts} = response.data;

    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })))

    const stepResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map(content => ({
        role: "user",
        content
      }))
    })

    if (stepResponse.status === 200 && stepResponse.data && stepResponse.data.answer) {
      setChatResponseStatus(true);
    }

    const chatAnswer = stepResponse.data?.answer ?? '';
    setSteps(s => [...s, ...parseXml(chatAnswer).map(x => ({
      ...x,
      status: "pending" as "pending"
    }))]);
   
    setIsGenerating(false)
  }
  useEffect(() => {
    init();
  }, [])


  // view toggles handled inline via `setActiveView`

  return (
    <div className="min-h-screen bg-gradient-to-br max-h-screen h-full overflow-hidden from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </button>
              <div className="h-6 w-px bg-gray-600"></div>
              <h1 className="text-lg font-semibold text-white truncate max-w-md">
                {prompt}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveView('preview')} className={`flex items-center gap-2 px-4 py-2 ${activeView === 'preview' ? 'bg-gray-700' : 'bg-gray-800'} hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 border border-gray-600`}>
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button onClick={() => setActiveView('code')} className={`flex items-center gap-2 px-4 py-2 ${activeView === 'code' ? 'bg-gray-700' : 'bg-blue-600'} hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-lg`}>
                <Download className="w-4 h-4" />
                Code View
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 shadow-lg">
                <Share2 className="w-4 h-4" />
                Deploy
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Steps Sidebar */}
        <div className="w-80 bg-gray-900 border-r border-gray-700 flex-shrink-0">
          <StepsSidebar
            steps={steps}
            currentStep={currentStep}
            isGenerating={isGenerating}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* File Explorer */}
          <div className="w-80 bg-gray-800 border-r border-gray-700 flex-shrink-0">
            <FileExplorer
              files={files}
              onFileSelect={setSelectedFile}
            />
          </div>

          {/* Main Content Area - shows either Code View or Preview */}
          <div className="flex-1 overflow-hidden">
            {isGenerating ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center bg-gray-900"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse shadow-lg">
                    <div className="w-8 h-8 bg-white rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Generating your website...</h3>
                  <p className="text-gray-400">{steps[currentStep]?.description}</p>
                </div>
              </motion.div>
            ) : (
              activeView === 'code' ? (
                selectedFile ? (
                  <motion.div key="file-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full bg-gray-950 text-gray-100 overflow-auto">
                    <div className="p-4 border-b border-gray-800 bg-gray-900">
                      <h3 className="font-semibold text-white">{selectedFile.name}</h3>
                    </div>
                    <pre className="p-6 text-sm leading-relaxed overflow-auto h-full"><code>{selectedFile.content || '// File content will be generated...'}</code></pre>
                  </motion.div>
                ) : (
                  <motion.div key="no-selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex items-center justify-center bg-gray-900">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 mx-auto"><span className="text-2xl">📄</span></div>
                      <h3 className="text-lg font-semibold text-white mb-2">Select a file to view</h3>
                      <p className="text-gray-400">Choose a file from the explorer to see its content</p>
                    </div>
                  </motion.div>
                )
              ) : (
                <div className="h-full bg-gray-900 p-4 flex flex-col">
                  <div className="flex-1">
                    {!webcontainer && (
                      <div className="text-center text-gray-400">
                        <div>Web Container is not available</div>
                        {webcontainerError && (
                          <div className="text-xs text-red-400 mt-2">{webcontainerError}</div>
                        )}
                      </div>
                    )}
                    {webcontainer && <PreviewFrame webContainer={webcontainer} files={files} />}
                  </div>
                  <div className="mt-2 text-sm text-gray-300">
                    <button onClick={() => setShowDebug(s => !s)} className="px-3 py-1 bg-gray-800 rounded-md border border-gray-700">
                      {showDebug ? 'Hide' : 'Show'} debug
                    </button>
                    {showDebug && (
                      <div className="mt-2 bg-gray-800 p-3 rounded-md max-h-40 overflow-auto border border-gray-700 text-xs">
                        <div className="text-xs text-gray-400 mb-1">Server URL:</div>
                        <div className="text-green-300 break-words mb-2">{serverUrl || 'not ready'}</div>
                        <div className="text-xs text-gray-400 mb-1">Mount Structure:</div>
                        <pre className="text-xs text-gray-200 whitespace-pre-wrap">{mountStructure ? JSON.stringify(mountStructure, null, 2) : 'no mount yet'}</pre>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>


        </div>
      </div>
    </div>
  );
};

export default GenerationPage;
