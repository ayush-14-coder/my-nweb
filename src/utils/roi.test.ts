import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRoi, formatCurrency, formatCompact } from './roi';

test('calculateRoi calculates current and projected metrics correctly', () => {
  const result = calculateRoi({
    monthlyVisitors: 50000,
    baselineConversionRate: 2.0,
    averageOrderValue: 100,
    liftPercentage: 50,
    estimatedRetainer: 5000,
  });

  // Current: 50,000 * 2% = 1,000 conversions. 1,000 * $100 = $100,000
  assert.equal(result.currentConversions, 1000);
  assert.equal(result.currentMonthlyRevenue, 100000);

  // Projected: 2.0% * (1 + 0.5) = 3.0%. 50,000 * 3.0% = 1,500 conversions. 1,500 * $100 = $150,000
  assert.equal(result.projectedConversionRate, 3.0);
  assert.equal(result.projectedConversions, 1500);
  assert.equal(result.projectedMonthlyRevenue, 150000);

  // Monthly gain: $50,000, Annual gain: $600,000
  assert.equal(result.monthlyGain, 50000);
  assert.equal(result.annualGain, 600000);

  // ROI on $5,000 retainer = (50,000 / 5,000) * 100 = 1000%
  assert.equal(result.roiPercentage, 1000);

  // Payback days: (5,000 / 50,000) * 30 = 3 days
  assert.equal(result.paybackDays, 3);
});

test('calculateRoi handles zero and boundary values gracefully', () => {
  const zeroResult = calculateRoi({
    monthlyVisitors: 0,
    baselineConversionRate: 0,
    averageOrderValue: 0,
    liftPercentage: 0,
    estimatedRetainer: 4000,
  });

  assert.equal(zeroResult.currentMonthlyRevenue, 0);
  assert.equal(zeroResult.projectedMonthlyRevenue, 0);
  assert.equal(zeroResult.monthlyGain, 0);
  assert.equal(zeroResult.annualGain, 0);
  assert.equal(zeroResult.roiPercentage, 0);
  assert.equal(zeroResult.paybackDays, 0);
});

test('formatting utilities produce clean human-readable strings', () => {
  assert.equal(formatCurrency(50000), '$50,000');
  assert.equal(formatCompact(1500000), '$1.5M');
  assert.equal(formatCompact(45000), '$45k');
});
