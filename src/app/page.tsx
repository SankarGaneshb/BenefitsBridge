'use client';

import React, { useState } from 'react';
import { UploadZone } from '@/components/UploadZone';
import { ExtractionReview } from '@/components/ExtractionReview';
import { ReadinessSummary } from '@/components/ReadinessSummary';
import { Card } from '@/components/UI';
import { ShieldCheck, Zap, Heart, Sparkles } from 'lucide-react';
import { mapEligibility, ReadinessResult } from '@/utils/eligibility';
import { motion, AnimatePresence } from 'framer-motion';

type FlowStage = 'upload' | 'review' | 'result';

interface ExtractedField {
  label: string;
  value: string;
  confidence: number;
  id: string;
}

const MOCK_EXTRACTS: ExtractedField[] = [
  { id: '1', label: 'FullName', value: 'Alex Johnson', confidence: 0.99 },
  { id: '2', label: 'PrimaryAddress', value: '123 Recovery Way, Houston, TX', confidence: 0.95 },
  { id: '3', label: 'MonthlyIncome', value: '$2,400', confidence: 0.88 },
  { id: '4', label: 'HouseholdSize', value: '3', confidence: 0.92 },
  { id: '5', label: 'SSN', value: '***-**-6789', confidence: 0.99 },
];

export default function Home() {
  const [stage, setStage] = useState<FlowStage>('upload');
  const [extracts, setExtracts] = useState<ExtractedField[]>([]);
  const [results, setResults] = useState<ReadinessResult[]>([]);

  const handleUploadComplete = () => {
    // In a real app, this would be triggered by the UploadZone finishing its AI pipeline
    setExtracts(MOCK_EXTRACTS);
    setTimeout(() => setStage('review'), 4000); 
  };

  const handleConfirmReview = (confirmedFields: ExtractedField[]) => {
    setExtracts(confirmedFields);
    const mapped = mapEligibility(confirmedFields);
    setResults(mapped);
    setStage('result');
  };

  return (
    <main className="min-h-screen py-12 px-6 overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]" />
      </div>

      <nav className="max-w-6xl mx-auto mb-16 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-display font-black tracking-tight tracking-[-0.04em]">
            BenefitsBridge
          </span>
        </div>
        <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
          {['Intake', 'Review', 'Readiness'].map((s, i) => (
            <div 
              key={s} 
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all
                ${(stage === 'upload' && i === 0) || (stage === 'review' && i === 1) || (stage === 'result' && i === 2) 
                  ? 'bg-indigo-500 text-white shadow-md' 
                  : 'text-white/40'}
              `}
            >
              {s}
            </div>
          ))}
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {stage === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-24"
          >
            {/* Hero Section */}
            <section className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-full font-semibold text-sm border border-indigo-500/20">
                <Zap className="w-4 h-4" />
                <span>AI-Powered Crisis Intake</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] text-gradient">
                From Chaos <br/>to Clarity.
              </h1>
              
              <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
                BenefitsBridge transforms messy personal records into structured, program-ready application packets in seconds.
              </p>
            </section>

            <section className="relative z-10">
              <UploadZone />
              <div className="mt-8 text-center">
                <button 
                  onClick={handleUploadComplete}
                  className="text-xs text-white/20 hover:text-white/40 transition-colors uppercase tracking-widest font-bold font-display"
                >
                  Simulate AI Detection for Demo
                </button>
              </div>
            </section>

            <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
              {[
                { icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />, title: "Privacy First", desc: "Your records are processed within the session. We prioritize data privacy during your most vulnerable moments." },
                { icon: <Zap className="w-8 h-8 text-indigo-400" />, title: "Instant extraction", desc: "No more manual data entry. We automatically pull IDs, addresses, and income from your messy scans." },
                { icon: <Heart className="w-8 h-8 text-rose-400" />, title: "Compassionate Tech", desc: "Designed for crisis. We highlight what's missing so you can focus on what matters most: recovery." }
              ].map((feature, i) => (
                <Card key={i} className="space-y-4 border border-white/5">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold font-display">{feature.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
                </Card>
              ))}
            </section>
          </motion.div>
        )}

        {stage === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <ExtractionReview 
              fields={extracts} 
              onConfirm={handleConfirmReview} 
            />
          </motion.div>
        )}

        {stage === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <ReadinessSummary 
              results={results} 
              onBack={() => setStage('review')} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="max-w-4xl mx-auto mt-40 pb-20 text-center border-t border-white/5 pt-12 text-white/20 text-xs">
        BenefitsBridge © 2026 • AI-Assisted Disaster Recovery & Social Safety Net Integration
      </footer>
    </main>
  );
}
