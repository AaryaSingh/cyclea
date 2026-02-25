import { PeriodData } from '../components/PeriodTracker';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export function calculateCyclePhase(periodData: PeriodData | null): CyclePhase | null {
  if (!periodData || !periodData.lastPeriodStart) {
    return null;
  }

  const lastPeriodStart = new Date(periodData.lastPeriodStart);
  const today = new Date();
  const daysSinceLastPeriod = Math.floor(
    (today.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24)
  );

  const { periodLength, averageCycleLength } = periodData;

  // Normalize to current cycle (in case we're past the cycle length)
  const dayInCycle = daysSinceLastPeriod % averageCycleLength;

  // Menstrual phase: Days 1-5 (or periodLength)
  if (dayInCycle < periodLength) {
    return 'menstrual';
  }

  // Follicular phase: After period until ovulation
  // Typically days 6-13 (or periodLength + 1 to ovulation day)
  const ovulationDay = averageCycleLength - 14; // Ovulation typically occurs 14 days before next period
  
  if (dayInCycle < ovulationDay - 2) {
    return 'follicular';
  }

  // Ovulation: Around day 14 for a 28-day cycle (±2 days)
  // Typically lasts 3-4 days
  if (dayInCycle >= ovulationDay - 2 && dayInCycle <= ovulationDay + 2) {
    return 'ovulation';
  }

  // Luteal phase: After ovulation until next period
  // Typically days 15-28
  return 'luteal';
}

export function getNextPeriodDate(periodData: PeriodData | null): Date | null {
  if (!periodData || !periodData.lastPeriodStart) {
    return null;
  }

  const lastPeriodStart = new Date(periodData.lastPeriodStart);
  const nextPeriod = new Date(lastPeriodStart);
  nextPeriod.setDate(nextPeriod.getDate() + periodData.averageCycleLength);

  return nextPeriod;
}

export function getDaysUntilNextPeriod(periodData: PeriodData | null): number | null {
  const nextPeriod = getNextPeriodDate(periodData);
  if (!nextPeriod) {
    return null;
  }

  const today = new Date();
  const daysUntil = Math.floor(
    (nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysUntil;
}

export function getPredictionConfidence(periodData: PeriodData | null): string {
  if (!periodData) {
    return 'unknown';
  }

  // If user marked cycle as irregular, adjust confidence
  if (periodData.isIrregular) {
    switch (periodData.cycleVariability) {
      case 'consistent':
        return 'medium';
      case 'somewhat-variable':
        return 'low';
      case 'very-variable':
        return 'very-low';
      case 'unpredictable':
        return 'unpredictable';
      default:
        return 'low';
    }
  }

  // For regular cycles, return high confidence
  return 'high';
}

export function getPredictionMessage(periodData: PeriodData | null): string {
  const confidence = getPredictionConfidence(periodData);

  switch (confidence) {
    case 'high':
      return 'Based on your regular cycle';
    case 'medium':
      return 'Estimate based on your average cycle';
    case 'low':
      return 'Rough estimate - your cycle varies';
    case 'very-low':
      return 'Very rough estimate - cycle is highly variable';
    case 'unpredictable':
      return 'Prediction not reliable - cycle is unpredictable';
    default:
      return 'Track more cycles for better predictions';
  }
}
