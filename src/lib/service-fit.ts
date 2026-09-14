export type FitAnswer = 'yes' | 'no' | 'unsure';
export type FitResult = 'emergency' | 'outside' | 'clarify' | 'possible';

// Service routing only: never determine medical fitness or insurance eligibility.
export function assessServiceFit(answers: readonly FitAnswer[]): FitResult | null {
  if (answers[0] === 'yes') return 'emergency';
  if (answers[0] === 'unsure') return 'clarify';
  if (answers[1] === 'no' || answers[2] === 'yes') return 'outside';
  if (answers.includes('unsure')) return 'clarify';
  if (answers.length < 4) return null;
  if (answers[3] === 'no') return 'clarify';
  return 'possible';
}
