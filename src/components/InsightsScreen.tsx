import { useState, useMemo } from 'react';
import { 
  TrendingUp, AlertTriangle, Calendar, ChevronLeft, Download,
  Heart, Activity, Brain, Droplets, FileText
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CheckInData } from './DailyCheckIn';
import { PeriodData } from './PeriodTracker';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { calculateCyclePhase } from '../utils/cycleCalculations';

interface InsightsScreenProps {
  onBack: () => void;
  checkIns: CheckInData[];
  periodData: PeriodData | null;
  categories: string[];
}

export function InsightsScreen({ onBack, checkIns, periodData, categories }: InsightsScreenProps) {
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90' | 'all'>('30');

  // Filter check-ins by time range
  const filteredCheckIns = useMemo(() => {
    if (timeRange === 'all') return checkIns;
    
    const daysAgo = parseInt(timeRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
    
    return checkIns.filter(c => new Date(c.timestamp) >= cutoffDate);
  }, [checkIns, timeRange]);

  // Calculate cycle correlation data
  const cycleCorrelationData = useMemo(() => {
    if (!periodData || filteredCheckIns.length === 0) return [];
    
    const lastPeriodStart = new Date(periodData.lastPeriodStart);
    
    return filteredCheckIns.map((checkIn, index) => {
      const checkInDate = new Date(checkIn.timestamp);
      const daysSinceLastPeriod = Math.floor(
        (checkInDate.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      const cycleDay = (daysSinceLastPeriod % periodData.averageCycleLength) + 1;
      const phase = calculateCyclePhase({ 
        ...periodData,
        lastPeriodStart: lastPeriodStart.toISOString()
      });
      
      return {
        day: index + 1,
        cycleDay,
        phase,
        pain: checkIn.pain,
        energy: checkIn.energy,
        mood: checkIn.mood * 3, // Scale to 0-9
        bloating: checkIn.bloating === 'high' ? 8 : 
                 checkIn.bloating === 'medium' ? 5 :
                 checkIn.bloating === 'low' ? 2 : 0,
        date: checkInDate.toLocaleDateString(),
      };
    });
  }, [filteredCheckIns, periodData]);

  // Identify patterns for supportive wellness tips (not diagnostic)
  const wellnessTips = useMemo(() => {
    const tips: string[] = [];
    
    if (filteredCheckIns.length === 0) return tips;
    
    // High pain frequency - supportive tip
    const highPainDays = filteredCheckIns.filter(c => c.pain >= 7).length;
    const painPercentage = (highPainDays / filteredCheckIns.length) * 100;
    
    if (painPercentage > 50) {
      tips.push('💪 You\'ve been experiencing frequent discomfort. Heat therapy, gentle stretching, and anti-inflammatory foods may help. Consider chatting with your doctor about pain management options.');
    } else if (painPercentage > 30) {
      tips.push('🌿 Noticing regular discomfort? Try tracking which activities or foods might be connected. Yoga and meditation can also help manage pain perception.');
    }
    
    // Menstrual phase pain pattern - wellness focus
    if (periodData && cycleCorrelationData.length > 0) {
      const menstrualPhasePain = cycleCorrelationData
        .filter(d => d.phase === 'menstrual')
        .reduce((sum, d) => sum + d.pain, 0) / cycleCorrelationData.filter(d => d.phase === 'menstrual').length;
      
      if (menstrualPhasePain >= 7) {
        tips.push('🩸 It looks like your menstrual phase brings extra discomfort. Heating pads, magnesium supplements, and reducing caffeine during this time might help. Your doctor can offer more targeted solutions too!');
      }
      
      // Luteal phase GI symptoms - supportive approach
      const lutealBloating = cycleCorrelationData
        .filter(d => d.phase === 'luteal')
        .reduce((sum, d) => sum + d.bloating, 0) / cycleCorrelationData.filter(d => d.phase === 'luteal').length;
      
      if (lutealBloating >= 6) {
        tips.push('🌸 You may notice more bloating during your luteal phase! This is normal due to progesterone. Try reducing salt, staying hydrated, and eating smaller meals. Ginger tea can also soothe your gut.');
      }
    }
    
    // Poor sleep - encouraging tip
    const poorSleepDays = filteredCheckIns.filter(c => (c.sleepQuality || 0) < 5).length;
    if (poorSleepDays > filteredCheckIns.length * 0.5) {
      tips.push('😴 Sleep seems challenging lately. Good sleep hygiene can make a big difference: try keeping your room cool, avoiding screens before bed, and establishing a calming bedtime routine. Quality sleep helps with pain and mood!');
    }
    
    // Low mood - supportive approach
    const lowMoodDays = filteredCheckIns.filter(c => c.mood === 1).length;
    if (lowMoodDays > filteredCheckIns.length * 0.4) {
      tips.push('💗 You\'ve had some tough days recently. Remember, you\'re not alone! Light exercise, time outdoors, and connecting with friends can help lift your spirits. If this continues, talking to a therapist or counselor can be really helpful.');
    }
    
    // Positive reinforcement if no concerning patterns
    if (tips.length === 0) {
      tips.push('✨ Your symptoms look manageable overall! Keep tracking to spot patterns and celebrate your good days. You\'re doing great!');
    }
    
    return tips;
  }, [filteredCheckIns, periodData, cycleCorrelationData]);

  // Calculate pattern analysis based on actual check-in data
  const patternAnalysis = useMemo(() => {
    const patterns: { title: string; description: string; severity?: 'info' | 'warning' | 'alert' }[] = [];
    
    if (filteredCheckIns.length < 7) {
      patterns.push({
        title: 'Insufficient Data',
        description: 'Keep tracking for at least 7 days to see meaningful patterns.',
        severity: 'info'
      });
      return patterns;
    }
    
    // Cycle-based pattern analysis
    if (periodData && cycleCorrelationData.length > 0) {
      const phaseData = {
        menstrual: cycleCorrelationData.filter(d => d.phase === 'menstrual'),
        follicular: cycleCorrelationData.filter(d => d.phase === 'follicular'),
        ovulation: cycleCorrelationData.filter(d => d.phase === 'ovulation'),
        luteal: cycleCorrelationData.filter(d => d.phase === 'luteal'),
      };
      
      // Bloating patterns by phase
      const avgBloatingByPhase = {
        menstrual: phaseData.menstrual.length > 0 ? phaseData.menstrual.reduce((sum, d) => sum + d.bloating, 0) / phaseData.menstrual.length : 0,
        follicular: phaseData.follicular.length > 0 ? phaseData.follicular.reduce((sum, d) => sum + d.bloating, 0) / phaseData.follicular.length : 0,
        ovulation: phaseData.ovulation.length > 0 ? phaseData.ovulation.reduce((sum, d) => sum + d.bloating, 0) / phaseData.ovulation.length : 0,
        luteal: phaseData.luteal.length > 0 ? phaseData.luteal.reduce((sum, d) => sum + d.bloating, 0) / phaseData.luteal.length : 0,
      };
      
      // Find phase with highest bloating
      const maxBloatingPhase = Object.entries(avgBloatingByPhase).reduce((max, [phase, value]) => 
        value > max.value ? { phase, value } : max, { phase: '', value: 0 }
      );
      
      if (maxBloatingPhase.value >= 5 && phaseData[maxBloatingPhase.phase as keyof typeof phaseData].length >= 2) {
        patterns.push({
          title: 'Bloating Pattern Identified',
          description: `You experience more bloating during your ${maxBloatingPhase.phase} phase (avg ${maxBloatingPhase.value.toFixed(1)}/10). This pattern appears in ${phaseData[maxBloatingPhase.phase as keyof typeof phaseData].length} recorded days.`,
          severity: maxBloatingPhase.value >= 7 ? 'warning' : 'info'
        });
      }
      
      // Pain frequency during menstruation
      if (phaseData.menstrual.length >= 2) {
        const menstrualPainDays = phaseData.menstrual.filter(d => d.pain >= 5).length;
        const avgMenstrualPain = phaseData.menstrual.reduce((sum, d) => sum + d.pain, 0) / phaseData.menstrual.length;
        
        if (avgMenstrualPain >= 5) {
          patterns.push({
            title: 'Menstrual Pain Pattern',
            description: `You have abdominal pain ${menstrualPainDays} out of ${phaseData.menstrual.length} days tracked during menstruation (avg pain: ${avgMenstrualPain.toFixed(1)}/10).`,
            severity: avgMenstrualPain >= 7 ? 'alert' : 'warning'
          });
        }
      }
      
      // Energy dips by phase
      const avgEnergyByPhase = {
        menstrual: phaseData.menstrual.length > 0 ? phaseData.menstrual.reduce((sum, d) => sum + d.energy, 0) / phaseData.menstrual.length : 0,
        follicular: phaseData.follicular.length > 0 ? phaseData.follicular.reduce((sum, d) => sum + d.energy, 0) / phaseData.follicular.length : 0,
        ovulation: phaseData.ovulation.length > 0 ? phaseData.ovulation.reduce((sum, d) => sum + d.energy, 0) / phaseData.ovulation.length : 0,
        luteal: phaseData.luteal.length > 0 ? phaseData.luteal.reduce((sum, d) => sum + d.energy, 0) / phaseData.luteal.length : 0,
      };
      
      const minEnergyPhase = Object.entries(avgEnergyByPhase).reduce((min, [phase, value]) => 
        value > 0 && value < min.value ? { phase, value } : min, { phase: '', value: 100 }
      );
      
      if (minEnergyPhase.value < 40 && phaseData[minEnergyPhase.phase as keyof typeof phaseData].length >= 2) {
        patterns.push({
          title: 'Energy Level Pattern',
          description: `Your energy is lowest during your ${minEnergyPhase.phase} phase (${minEnergyPhase.value.toFixed(0)}% average). Consider planning lighter activities during this time.`,
          severity: 'info'
        });
      }
    }
    
    // Non-cycle specific patterns
    // Consistent GI symptoms
    const daysWithGISymptoms = filteredCheckIns.filter(c => 
      c.symptoms?.some(s => ['Bloating', 'Constipation', 'Diarrhea', 'Nausea'].includes(s))
    ).length;
    
    if (daysWithGISymptoms > filteredCheckIns.length * 0.5) {
      patterns.push({
        title: 'Frequent GI Symptoms',
        description: `GI symptoms reported on ${daysWithGISymptoms} out of ${filteredCheckIns.length} days (${((daysWithGISymptoms / filteredCheckIns.length) * 100).toFixed(0)}%). Consider food tracking to identify triggers.`,
        severity: daysWithGISymptoms > filteredCheckIns.length * 0.7 ? 'warning' : 'info'
      });
    }
    
    // Pain frequency overall
    const painDays = filteredCheckIns.filter(c => c.pain >= 5).length;
    if (painDays > filteredCheckIns.length * 0.4) {
      patterns.push({
        title: 'Pain Frequency',
        description: `Moderate to severe pain (≥5/10) reported on ${painDays} out of ${filteredCheckIns.length} days tracked (${((painDays / filteredCheckIns.length) * 100).toFixed(0)}%).`,
        severity: painDays > filteredCheckIns.length * 0.6 ? 'alert' : 'warning'
      });
    }
    
    // Sleep quality pattern
    const poorSleepDays = filteredCheckIns.filter(c => (c.sleepQuality || 5) < 5).length;
    if (poorSleepDays > filteredCheckIns.length * 0.5) {
      patterns.push({
        title: 'Sleep Quality Concerns',
        description: `Poor sleep quality (<5/10) on ${poorSleepDays} out of ${filteredCheckIns.length} days. Poor sleep can worsen pain and mood symptoms.`,
        severity: 'info'
      });
    }
    
    // If no significant patterns, add positive message
    if (patterns.length === 0) {
      patterns.push({
        title: 'No Significant Patterns',
        description: 'Your symptoms appear manageable with no strong correlations detected. Continue tracking to monitor changes over time.',
        severity: 'info'
      });
    }
    
    return patterns;
  }, [filteredCheckIns, periodData, cycleCorrelationData]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (filteredCheckIns.length === 0) {
      return {
        avgPain: 0,
        avgEnergy: 0,
        avgSleep: 0,
        avgMood: 0,
        totalDays: 0,
        highPainDays: 0,
      };
    }
    
    return {
      avgPain: (filteredCheckIns.reduce((sum, c) => sum + c.pain, 0) / filteredCheckIns.length).toFixed(1),
      avgEnergy: Math.round(filteredCheckIns.reduce((sum, c) => sum + c.energy, 0) / filteredCheckIns.length),
      avgSleep: (filteredCheckIns.reduce((sum, c) => sum + (c.sleepQuality || 5), 0) / filteredCheckIns.length).toFixed(1),
      avgMood: (filteredCheckIns.reduce((sum, c) => sum + c.mood, 0) / filteredCheckIns.length).toFixed(1),
      totalDays: filteredCheckIns.length,
      highPainDays: filteredCheckIns.filter(c => c.pain >= 7).length,
    };
  }, [filteredCheckIns]);

  // Prepare chart data
  const timelineData = useMemo(() => {
    return filteredCheckIns.map((checkIn, index) => ({
      day: index + 1,
      date: new Date(checkIn.timestamp).toLocaleDateString(),
      pain: checkIn.pain,
      energy: checkIn.energy,
      mood: checkIn.mood * 3, // Scale to 0-9
      sleep: checkIn.sleepQuality || 5,
    }));
  }, [filteredCheckIns]);

  const handleExportReport = () => {
    alert('Export report for OBGYN - would generate PDF with all graphs and clinical insights');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0F5] to-white pb-20 sm:pb-6">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-sm z-10 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          <Button onClick={onBack} variant="ghost" size="sm" className="p-2">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg sm:text-xl">Your Trends</h1>
          <Button variant="ghost" size="sm" className="p-2">
            <Download className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="px-3 py-4 space-y-4 max-w-6xl mx-auto sm:px-4 sm:py-6 sm:space-y-6">
        {/* Summary Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 sm:gap-2">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                Avg Pain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl">{summaryStats.avgPain}</div>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">/10 scale</p>
              {parseFloat(summaryStats.avgPain) >= 6 && (
                <Badge variant="destructive" className="mt-1 sm:mt-2 text-[10px] sm:text-xs">Elevated</Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 sm:gap-2">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                Avg Energy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl">{summaryStats.avgEnergy}%</div>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Energy level</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 sm:gap-2">
                <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
                Avg Mood
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl">{summaryStats.avgMood}</div>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">/3 scale</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 sm:gap-2">
                <Droplets className="w-3 h-3 sm:w-4 sm:h-4" />
                High Pain Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl">{summaryStats.highPainDays}</div>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Pain &gt;7/10</p>
            </CardContent>
          </Card>
        </div>

        {/* Pattern Analysis */}
        {patternAnalysis.length > 0 && (
          <Card className="border-l-4 border-l-[#F487B6]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#4A3541]">
                <TrendingUp className="w-5 h-5 text-[#F487B6]" />
                Pattern Analysis
              </CardTitle>
              <CardDescription className="text-gray-700">
                Data-driven insights from {summaryStats.totalDays} days of tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {patternAnalysis.map((pattern, idx) => {
                  const severityColors = {
                    info: 'bg-blue-50 border-blue-200',
                    warning: 'bg-yellow-50 border-yellow-200',
                    alert: 'bg-red-50 border-red-200'
                  };
                  const severityTextColors = {
                    info: 'text-blue-900',
                    warning: 'text-yellow-900',
                    alert: 'text-red-900'
                  };
                  const severityIcons = {
                    info: <TrendingUp className="w-4 h-4" />,
                    warning: <AlertTriangle className="w-4 h-4" />,
                    alert: <AlertTriangle className="w-4 h-4" />
                  };
                  
                  return (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-lg border ${severityColors[pattern.severity || 'info']}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={severityTextColors[pattern.severity || 'info']}>
                          {severityIcons[pattern.severity || 'info']}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold mb-1 ${severityTextColors[pattern.severity || 'info']}`}>
                            {pattern.title}
                          </h4>
                          <p className={`text-sm ${severityTextColors[pattern.severity || 'info']}`}>
                            {pattern.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts */}
        <Tabs defaultValue="timeline">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="cycle">Cycle Correlation</TabsTrigger>
          </TabsList>

          {/* Timeline Chart */}
          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Health Metrics</CardTitle>
                <CardDescription>Track your symptoms over time</CardDescription>
              </CardHeader>
              <CardContent>
                {timelineData.length > 0 ? (
                  <div className="h-[250px] sm:h-[300px] w-full overflow-x-auto">
                    <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                      <LineChart data={timelineData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="day" 
                          tick={{ fontSize: 11 }}
                          interval="preserveStartEnd"
                        />
                        <YAxis 
                          tick={{ fontSize: 11 }}
                        />
                        <Tooltip 
                          contentStyle={{ fontSize: '12px' }}
                        />
                        <Line type="monotone" dataKey="pain" stroke="#9E6B8E" name="Pain" strokeWidth={2} />
                        <Line type="monotone" dataKey="mood" stroke="#C59FA8" name="Mood" strokeWidth={2} />
                        <Line type="monotone" dataKey="energy" stroke="#4FB0AE" name="Energy" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No data for selected time range. Start tracking!
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cycle Correlation Chart */}
          <TabsContent value="cycle" className="space-y-4">
            {periodData ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Pain vs. Cycle Day</CardTitle>
                    <CardDescription>
                      Identifies cycle-dependent pain patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {cycleCorrelationData.length > 0 ? (
                      <div className="h-[250px] sm:h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                          <ScatterChart margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="cycleDay" 
                              type="number"
                              domain={[1, periodData.averageCycleLength]}
                              label={{ value: 'Cycle Day', position: 'insideBottom', offset: -5, fontSize: 11 }}
                              tick={{ fontSize: 11 }}
                            />
                            <YAxis 
                              domain={[0, 10]}
                              label={{ value: 'Pain Level', angle: -90, position: 'insideLeft', fontSize: 11 }}
                              tick={{ fontSize: 11 }}
                            />
                            <Tooltip 
                              cursor={{ strokeDasharray: '3 3' }}
                              contentStyle={{ fontSize: '12px' }}
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-white p-3 border rounded shadow-lg">
                                      <p className="font-semibold">{data.phase}</p>
                                      <p className="text-sm">Day {data.cycleDay} of cycle</p>
                                      <p className="text-sm">Pain: {data.pain}/10</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Scatter 
                              data={cycleCorrelationData} 
                              fill="#F487B6"
                              shape={(props: any) => {
                                const { cx, cy, payload } = props;
                                const colors: Record<string, string> = {
                                  'menstrual': '#9E6B8E',
                                  'follicular': '#69C9C0',
                                  'ovulation': '#C59FA8',
                                  'luteal': '#F487B6'
                                };
                                return (
                                  <circle 
                                    cx={cx} 
                                    cy={cy} 
                                    r={6} 
                                    fill={colors[payload.phase as string] || '#F487B6'}
                                    opacity={0.7}
                                  />
                                );
                              }}
                            />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        Not enough data yet. Keep tracking!
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Interpretation Guide */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-900 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      How Your Doctor Interprets This
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-blue-900">
                      <li>• <strong>Pain clustered on days 1-7:</strong> Likely dysmenorrhea (period pain) - first-line treatment is NSAIDs + heat</li>
                      <li>• <strong>Pain scattered throughout cycle:</strong> May suggest endometriosis or other non-hormonal causes - needs further workup</li>
                      <li>• <strong>Pain around day 14:</strong> Could be mittelschmerz (ovulation pain) - usually benign</li>
                      <li>• <strong>Bloating in days 15-28:</strong> Progesterone-related GI symptoms - dietary changes or hormonal management</li>
                    </ul>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">
                    Add period tracking to see cycle correlations
                  </p>
                  <Button className="bg-[#F487B6]">
                    Start Period Tracking
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Time Range Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4 px-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            <span className="text-xs sm:text-sm text-gray-600">View:</span>
          </div>
          {(['7', '30', '60', '90', 'all'] as const).map((range) => (
            <Button
              key={range}
              onClick={() => setTimeRange(range as '7' | '30' | '90' | 'all')}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              className={`text-xs sm:text-sm px-2 sm:px-3 ${timeRange === range ? 'bg-[#F487B6]' : ''}`}
            >
              {range === 'all' ? 'All' : `${range}d`}
            </Button>
          ))}
        </div>

        {/* Clinical Note */}
        <Card className="border-2 border-purple-300 bg-purple-50">
          <CardContent className="p-4">
            <p className="text-sm text-purple-900">
              <strong>📋 For Your OBGYN:</strong> This data helps your doctor differentiate between cycle-dependent (hormonal) vs. cycle-independent (structural/other) issues, reducing the need for multiple specialist referrals. Bring this report to your appointments!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}