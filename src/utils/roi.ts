/**
 * Pure ROI and Growth Projection Calculations for Ayush Mogaveera's Showcase
 */

export interface RoiInputs {
  monthlyVisitors: number;
  baselineConversionRate: number; // in percent e.g. 2.0
  averageOrderValue: number; // in dollars
  liftPercentage: number; // in percent e.g. 55
  estimatedRetainer?: number; // agency investment benchmark in dollars
}

export interface RoiResults {
  currentConversions: number;
  currentMonthlyRevenue: number;
  projectedConversionRate: number;
  projectedConversions: number;
  projectedMonthlyRevenue: number;
  monthlyGain: number;
  annualGain: number;
  roiPercentage: number;
  paybackDays: number;
}

export function calculateRoi(inputs: RoiInputs): RoiResults {
  const visitors = Math.max(0, inputs.monthlyVisitors);
  const baselineRate = Math.max(0, inputs.baselineConversionRate);
  const aov = Math.max(0, inputs.averageOrderValue);
  const lift = Math.max(0, inputs.liftPercentage);
  const retainer = inputs.estimatedRetainer ?? 4500;

  const currentConversions = Math.round(visitors * (baselineRate / 100));
  const currentMonthlyRevenue = currentConversions * aov;

  const projectedConversionRate = Number((baselineRate * (1 + lift / 100)).toFixed(2));
  const projectedConversions = Math.round(visitors * (projectedConversionRate / 100));
  const projectedMonthlyRevenue = projectedConversions * aov;

  const monthlyGain = Math.max(0, projectedMonthlyRevenue - currentMonthlyRevenue);
  const annualGain = monthlyGain * 12;

  const roiPercentage = retainer > 0 ? Math.round((monthlyGain / retainer) * 100) : 0;
  const paybackDays = monthlyGain > 0 ? Math.max(1, Math.round((retainer / monthlyGain) * 30)) : 0;

  return {
    currentConversions,
    currentMonthlyRevenue,
    projectedConversionRate,
    projectedConversions,
    projectedMonthlyRevenue,
    monthlyGain,
    annualGain,
    roiPercentage,
    paybackDays,
  };
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatCompact(num: number): string {
  if (num >= 1000000) {
    return '$' + (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return '$' + (num / 1000).toFixed(0) + 'k';
  }
  return '$' + num.toString();
}
