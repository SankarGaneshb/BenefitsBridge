'use client';

import React from 'react';
import { Card, Button } from './UI';
import { CheckCircle2, Circle, AlertCircle, Download, Share2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReadinessResult {
  programName: string;
  status: 'ready' | 'partial' | 'missing';
  found: string[];
  missing: string[];
  percentage: number;
}

interface ReadinessSummaryProps {
  results: ReadinessResult[];
  onBack: () => void;
}

export const ReadinessSummary: React.FC<ReadinessSummaryProps> = ({ results, onBack }) => {
  return (
    <div className="space-y-12 max-w-4xl mx-auto animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-display font-black tracking-tight">Your Readiness Report</h2>
        <p className="text-white/40 max-w-xl mx-auto">We&apos;ve mapped your evidence against the requirements for these programs.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {results.map((result, idx) => (
          <motion.div
            key={result.programName}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="h-full flex flex-col space-y-6 border border-white/5 hover:border-indigo-500/20 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold font-display">{result.programName}</h3>
                  <p className="text-xs text-white/20 mt-1 uppercase tracking-widest font-bold">Standard Eligibility</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border
                  ${result.status === 'ready' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                    result.status === 'partial' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                    'bg-white/5 text-white/20 border-white/10'}
                `}>
                  {result.status}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase text-white/40">
                  <span>Progress</span>
                  <span>{result.percentage.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.percentage}%` }}
                    className={`h-full ${result.status === 'ready' ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/20">Evidence Found</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {result.found.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-emerald-400/80">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {result.missing.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/20">Missing Items</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {result.missing.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-white/60">
                          <Circle className="w-4 h-4 text-white/10" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-white/5">
                <Button className="w-full" variant={result.status === 'ready' ? 'primary' : 'secondary'}>
                  {result.status === 'ready' ? (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Get Application Package
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Check Requirements
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-white/5">
        <button onClick={onBack} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to review
        </button>
        <div className="flex gap-4">
          <Button variant="secondary">
            <Share2 className="w-4 h-4 mr-2" />
            Share Report
          </Button>
          <Button variant="primary">
            Finalize All Programs
          </Button>
        </div>
      </div>
    </div>
  );
};
