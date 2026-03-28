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
  return PROGRAMS.map(program => {
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
};
