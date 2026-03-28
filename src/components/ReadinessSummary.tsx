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
  isAiRecommended?: boolean;
  aiReason?: string;
}

interface ReadinessSummaryProps {
  results: ReadinessResult[];
  onBack: () => void;
}

export const ReadinessSummary: React.FC<ReadinessSummaryProps> = ({ results, onBack }) => {
  const aiRecommended = results.filter(r => r.isAiRecommended);
  const standardPrograms = results.filter(r => !r.isAiRecommended);

  return (
    <div className="space-y-16 max-w-5xl mx-auto animate-fade-in pb-20">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-bold border border-indigo-500/20 mb-2">
          <Sparkles className="w-3 h-3" />
          <span>AI Analysis Generated</span>
        </div>
        <h2 className="text-5xl font-display font-black tracking-tight">Your Readiness Report</h2>
        <p className="text-white/40 max-w-xl mx-auto">We&apos;ve mapped your evidence against the requirements for these programs. Here is your transition plan.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 mb-4">Core Programs</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {standardPrograms.map((result, idx) => (
              <motion.div
                key={result.programName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full flex flex-col space-y-6 border border-white/5 hover:border-indigo-500/20 transition-all bg-white/[0.02] backdrop-blur-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold font-display leading-tight">{result.programName}</h3>
                      <p className="text-[10px] text-white/20 mt-1 uppercase tracking-widest font-black">Standard Eligibility</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border
                      ${result.status === 'ready' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        result.status === 'partial' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                        'bg-white/5 text-white/20 border-white/10'}
                    `}>
                      {result.status}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase text-white/40">
                      <span>Progress</span>
                      <span>{result.percentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${result.percentage}%` }}
                        className={`h-full ${result.status === 'ready' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-indigo-500'}`}
                      />
                    </div>
                  </div>

                  <div className="flex-1 space-y-6 overflow-hidden">
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Evidence Found</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {result.found.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-emerald-400/80">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="truncate">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {result.missing.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Missing Items</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {result.missing.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-white/40">
                              <Circle className="w-3.5 h-3.5 text-white/10" />
                              <span className="truncate">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <Button className="w-full text-xs font-bold uppercase tracking-widest py-3" variant={result.status === 'ready' ? 'primary' : 'secondary'}>
                      {result.status === 'ready' ? 'Download Package' : 'Resolve Gaps'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {aiRecommended.length > 0 && (
            <div className="space-y-6 pt-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400/50">AI Smart Recommendations</h3>
              <div className="grid gap-4">
                {aiRecommended.map((recommendation, idx) => (
                  <motion.div
                    key={recommendation.programName}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (idx * 0.1) }}
                  >
                    <Card className="bg-indigo-500/5 border border-indigo-500/10 p-6 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Sparkles className="w-12 h-12 text-indigo-500" />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2 flex-1">
                          <h4 className="text-lg font-bold font-display text-indigo-100">{recommendation.programName}</h4>
                          <p className="text-sm text-indigo-300/60 italic">&quot;{recommendation.aiReason}&quot;</p>
                        </div>
                        <Button variant="secondary" className="bg-indigo-500/10 border-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase py-2">
                          View details
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">Action Plan</h3>
          <Card className="bg-white/5 border border-white/10 p-8 space-y-8 sticky top-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-lg font-bold font-display">Immediate Steps</h4>
              </div>
              
              <ul className="space-y-6">
                {[
                  { text: "Download your FEMA readiness packet", status: "urgent" },
                  { text: "Locate a recent Utility Bill for LIHEAP", status: "pending" },
                  { text: "Schedule identity verification call", status: "pending" }
                ].map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="mt-1">
                      <div className={`w-2 h-2 rounded-full ${step.status === 'urgent' ? 'bg-rose-500 animate-pulse' : 'bg-white/20'}`} />
                    </div>
                    <div className="space-y-1">
                      <p className={`text-sm leading-snug ${step.status === 'urgent' ? 'font-bold text-white' : 'text-white/60'}`}>{step.text}</p>
                      <span className="text-[10px] font-black uppercase tracking-tighter text-white/20">{step.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 border-t border-white/5 space-y-4">
              <p className="text-[10px] text-white/40 italic text-center">
                AI Copilot has identified these tasks as critical for your recovery timeline.
              </p>
              <Button variant="primary" className="w-full shadow-lg shadow-indigo-500/20">
                Execute Action Plan
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex justify-between items-center py-8 border-t border-white/5">
        <button onClick={onBack} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" />
          Back to review
        </button>
        <div className="flex gap-4">
          <Button variant="secondary" className="px-6 text-xs font-bold uppercase tracking-widest">
            <Share2 className="w-4 h-4 mr-2" />
            Share Report
          </Button>
        </div>
      </div>
    </div>
  );
};
