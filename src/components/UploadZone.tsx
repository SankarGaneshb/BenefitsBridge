'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './UI';

interface FileStatus {
  id: string;
  file: File;
  status: 'uploading' | 'detecting' | 'extracting' | 'ready' | 'error';
  type?: string;
  confidence?: number;
}

export const UploadZone: React.FC = () => {
  const [extractionLogs, setExtractionLogs] = useState<{ id: string; text: string; confidence: number }[]>([]);

  const addLog = (text: string, confidence: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setExtractionLogs(prev => [ { id, text, confidence }, ...prev.slice(0, 4) ]);
  };

  const processFiles = (uploadedFiles: FileList | File[]) => {
    const newFiles = Array.from(uploadedFiles).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'uploading' as const,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate AI pipeline
    newFiles.forEach(fileObj => {
      setTimeout(() => {
        updateFileStatus(fileObj.id, 'detecting');
        addLog(`Analyzing ${fileObj.file.name}...`, 0.85);
        
        setTimeout(() => {
          updateFileStatus(fileObj.id, 'extracting');
          addLog("Found: Name 'Alex Johnson'", 0.99);
          
          setTimeout(() => {
            addLog("Found: Address '123 Recovery Way'", 0.95);
            updateFileStatus(fileObj.id, 'ready', 'ID Card', 0.98);
          }, 1500);
        }, 1500);
      }, 1000);
    });
  };

  const updateFileStatus = (id: string, status: FileStatus['status'], type?: string, confidence?: number) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status, type, confidence } : f));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 animate-fade-in">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative p-12 border-2 border-dashed rounded-3xl transition-all duration-300 flex flex-col items-center justify-center gap-4 bg-white/5 backdrop-blur-md
          ${isDragging ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' : 'border-white/20 hover:border-white/40'}
        `}
        style={{ minHeight: '300px' }}
      >
        <div className="p-4 bg-indigo-500/20 rounded-2xl">
          <Upload className="w-10 h-10 text-indigo-400" />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold font-display mb-2">Drop your records here</h3>
          <p className="text-white/60">Photos, Scans, or PDFs (ID, Utility Bills, Pay Stubs)</p>
        </div>
        <input 
          type="file" 
          multiple 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          onChange={(e) => e.target.files && processFiles(e.target.files)}
        />
        <button className="btn btn-primary mt-4">Select Files</button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <AnimatePresence>
          {files.length > 0 && (
            <div className="grid gap-4">
              <h4 className="font-display font-semibold text-white/40 uppercase tracking-widest text-xs">Processing Queue</h4>
              {files.map((fileStatus) => (
                <motion.div
                  key={fileStatus.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="flex items-center gap-4 py-4 px-6 border border-white/10 hover:border-white/20 transition-colors bg-white/[0.02]">
                    <div className={`p-2 rounded-xl ${fileStatus.status === 'ready' ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                      <FileText className={`w-6 h-6 ${fileStatus.status === 'ready' ? 'text-emerald-400' : 'text-white/40'}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{fileStatus.file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-white/40">{(fileStatus.file.size / 1024).toFixed(1)} KB</span>
                        {fileStatus.type && (
                          <>
                            <span className="text-white/10">•</span>
                            <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded-full">{fileStatus.type}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {fileStatus.status !== 'ready' && fileStatus.status !== 'error' && (
                        <div className="flex items-center gap-2 text-indigo-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-xs font-semibold capitalize">{fileStatus.status}...</span>
                        </div>
                      )}
                      {fileStatus.status === 'ready' && (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-xs font-semibold">Ready</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {extractionLogs.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-display font-semibold text-white/40 uppercase tracking-widest text-xs">AI Extraction Feed</h4>
              <div className="space-y-2 border-l border-white/10 pl-4 py-2">
                {extractionLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between group"
                  >
                    <span className="text-sm text-white/60 font-mono">{log.text}</span>
                    <span className="text-[10px] font-bold text-white/20 group-hover:text-indigo-400 transition-colors">
                      {Math.round(log.confidence * 100)}% CONF
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
