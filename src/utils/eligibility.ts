export interface ProgramRequirement {
  id: string;
  label: string;
  description: string;
  fieldKeys: string[];
}

export interface ReadinessResult {
  programName: string;
  status: 'ready' | 'partial' | 'missing';
  found: string[];
  missing: string[];
  percentage: number;
  isAiRecommended?: boolean;
  aiReason?: string;
}

const PROGRAMS: ProgramRequirement[] = [
  {
    id: 'fema',
    label: 'FEMA Disaster Assistance',
    description: 'Requires proof of identity, primary residence, and disaster narrative.',
    fieldKeys: ['FullName', 'DateOfBirth', 'PrimaryAddress', 'SSN']
  },
  {
    id: 'snap',
    label: 'SNAP (Food Assistance)',
    description: 'Requires proof of identity, residency, and household income.',
    fieldKeys: ['FullName', 'PrimaryAddress', 'MonthlyIncome', 'HouseholdSize']
  }
];

export const mapEligibility = (extractedFields: { label: string; value: string }[]): ReadinessResult[] => {
  const mapped = PROGRAMS.map(program => {
    const found: string[] = [];
    const missing: string[] = [];

    program.fieldKeys.forEach(key => {
      // Map common labels to requirement keys
      const normalizedKey = key.toLowerCase();
      const match = extractedFields.find(f => f.label.toLowerCase().includes(normalizedKey) || normalizedKey.includes(f.label.toLowerCase()));
      
      if (match && match.value) {
        found.push(key);
      } else {
        missing.push(key);
      }
    });

    const percentage = (found.length / program.fieldKeys.length) * 100;
    let status: ReadinessResult['status'] = 'missing';
    if (percentage === 100) status = 'ready';
    else if (percentage > 0) status = 'partial';

    return {
      programName: program.label,
      status,
      found,
      missing,
      percentage
    };
  });

  // AI Logic: Recommend secondary programs based on data
  const incomeField = extractedFields.find(f => f.label.toLowerCase().includes('income'));
  const sizeField = extractedFields.find(f => f.label.toLowerCase().includes('size'));
  
  if (incomeField && sizeField) {
    const income = parseInt(incomeField.value.replace(/[^0-9]/g, '')) || 0;
    const size = parseInt(sizeField.value) || 0;

    if (size >= 3) {
      mapped.push({
        programName: 'WIC (Women, Infants, Children)',
        status: 'partial',
        found: ['HouseholdSize'],
        missing: ['MedicalRecords', 'ProofOfPregnancy'],
        percentage: 33,
        isAiRecommended: true,
        aiReason: 'Since your household size is 3 or more, you may qualify for supplemental nutritional support.'
      });
    }

    if (income < 3000) {
      mapped.push({
        programName: 'LIHEAP Utility Relief',
        status: 'partial',
        found: ['MonthlyIncome', 'PrimaryAddress'],
        missing: ['UtilityBill'],
        percentage: 66,
        isAiRecommended: true,
        aiReason: 'Based on your monthly income, you likely qualify for emergency utility assistance.'
      });
    }
  }

  return mapped;
};
