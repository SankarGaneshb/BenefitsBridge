'use client';

import React, { useState } from 'react';
import { Card, Button } from './UI';
import { Edit2, AlertTriangle, ChevronRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExtractedField {
  label: string;
  value: string;
  confidence: number;
  id: string;
}

interface ExtractionReviewProps {
  fields: ExtractedField[];
  onConfirm: (fields: ExtractedField[]) => void;
}

export const ExtractionReview: React.FC<ExtractionReviewProps> = ({ fields: initialFields, onConfirm }) => {
  const [fields, setFields] = useState(initialFields);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleUpdate = (id: string, newValue: string) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, value: newValue } : f));
    setEditingId(null);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold">Review Extracts</h2>
          <p className="text-white/40">Verify the information we found in your records.</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
            98% Overall Confidence
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {fields.map((field) => (
          <motion.div key={field.id} layout>
            <Card className={`group flex items-center gap-4 transition-all ${editingId === field.id ? 'ring-2 ring-indigo-500/50' : 'hover:border-white/20'}`}>
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/20">
                <FileText className="w-5 h-5" />
              </div>
              
              <div className="flex-1">
                <label className="text-xs font-bold uppercase tracking-wider text-white/20 block mb-1">
                  {field.label}
                </label>
                {editingId === field.id ? (
                  <input
                    autoFocus
                    className="bg-transparent border-b border-indigo-500 text-lg outline-none w-full py-1"
                    defaultValue={field.value}
                    onBlur={(e) => handleUpdate(field.id, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdate(field.id, e.currentTarget.value)}
                  />
                ) : (
                  <p className="text-lg font-medium">{field.value || <span className="text-white/10 italic">Not found</span>}</p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-1 justify-end">
                    <span className={`text-xs font-bold ${field.confidence > 0.9 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {(field.confidence * 100).toFixed(0)}%
                    </span>
                    {field.confidence < 0.9 && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                  </div>
                  <div className="w-16 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                    <div 
                      className={`h-full ${field.confidence > 0.9 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                      style={{ width: `${field.confidence * 100}%` }} 
                    />
                  </div>
                </div>
                <button 
                  onClick={() => setEditingId(field.id)}
                  className="p-2 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="pt-8 flex justify-end gap-4">
        <Button variant="secondary">Cancel</Button>
        <Button onClick={() => onConfirm(fields)}>
          Confirm Details
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
