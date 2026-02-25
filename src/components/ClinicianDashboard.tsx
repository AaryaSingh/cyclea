import { useState, useMemo } from 'react';
import { 
  Download, FileText, Calendar, TrendingUp, AlertCircle,
  Activity, Heart, Brain, Droplets, ChevronLeft, Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CheckInData } from './DailyCheckIn';
import { PeriodData } from './PeriodTracker';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

interface ClinicianDashboardProps {
  onBack: () => void;
  userData: {
    checkIns: CheckInData[];
    periodData: PeriodData | null;
  };
  patientName?: string;
}

interface CorrelationData {
  day: number;
  pain: number;
  bloating: number;
  mood: number;
  cycleDay: number | null;
  phase: string | null;
}

export function ClinicianDashboard({
  onBack,
  userData,
  patientName = 'Patient'
}: ClinicianDashboardProps) {
  const [timeRange, setTimeRange] = useState<'30' | '90' | 'all'>('90');
  
  const patientCheckIns = userData.checkIns;
  const patientPeriodData = userData.periodData;
  
  // Calculate cycle day for each check-in
  const correlationData = useMemo((): CorrelationData[] => {
    if (!patientPeriodData || patientCheckIns.length === 0) return [];
    
    const lastPeriodStart = new Date(patientPeriodData.lastPeriodStart);
    
    return patientCheckIns.map((checkIn, index) => {
      const checkInDate = new Date(checkIn.timestamp);
      const daysSinceLastPeriod = Math.floor(
        (checkInDate.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      const cycleDay = (daysSinceLastPeriod % patientPeriodData.averageCycleLength) + 1;
      
      // Determine phase
      let phase: string;
      const ovulationDay = patientPeriodData.averageCycleLength - 14;
      
      if (cycleDay <= patientPeriodData.periodLength) {
        phase = 'Menstrual';
      } else if (cycleDay < ovulationDay - 2) {
        phase = 'Follicular';
      } else if (cycleDay >= ovulationDay - 2 && cycleDay <= ovulationDay + 2) {
        phase = 'Ovulation';
      } else {
        phase = 'Luteal';
      }
      
      // Convert bloating to number
      const bloatingValue = checkIn.bloating === 'high' ? 8 : 
                           checkIn.bloating === 'medium' ? 5 :
                           checkIn.bloating === 'low' ? 2 : 0;
      
      return {
        day: index + 1,
        pain: checkIn.pain,
        bloating: bloatingValue,
        mood: checkIn.mood * 3, // Scale to 0-9
        cycleDay,
        phase
      };
    });
  }, [patientCheckIns, patientPeriodData]);

  // Clinical summary statistics
  const clinicalSummary = useMemo(() => {
    if (patientCheckIns.length === 0) {
      return {
        avgPain: 0,
        avgSleep: 0,
        symptomsCount: 0,
        highPainDays: 0,
        totalDays: 0,
        commonSymptoms: [],
        periodsTracked: 0
      };
    }

    const total = patientCheckIns.length;
    const avgPain = patientCheckIns.reduce((sum, c) => sum + c.pain, 0) / total;
    const avgSleep = patientCheckIns.reduce((sum, c) => sum + (c.sleepQuality || 5), 0) / total;
    const highPainDays = patientCheckIns.filter(c => c.pain >= 7).length;
    
    // Count symptom frequencies
    const symptomCounts: Record<string, number> = {};
    patientCheckIns.forEach(c => {
      c.symptoms.forEach(symptom => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      });
    });
    
    const commonSymptoms = Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([symptom, count]) => ({ symptom, count, percentage: (count / total) * 100 }));

    return {
      avgPain: avgPain.toFixed(1),
      avgSleep: avgSleep.toFixed(1),
      symptomsCount: Object.keys(symptomCounts).length,
      highPainDays,
      totalDays: total,
      commonSymptoms,
      periodsTracked: patientPeriodData ? 1 : 0
    };
  }, [patientCheckIns, patientPeriodData]);

  // Identify potential correlations
  const clinicalInsights = useMemo(() => {
    const insights: string[] = [];
    
    if (correlationData.length === 0) return insights;
    
    // Check for cycle-related pain patterns
    const menstrualPhaseData = correlationData.filter(d => d.phase === 'Menstrual');
    const lutealPhaseData = correlationData.filter(d => d.phase === 'Luteal');
    
    if (menstrualPhaseData.length > 0) {
      const menstrualPain = menstrualPhaseData.reduce((sum, d) => sum + d.pain, 0) / menstrualPhaseData.length;
      if (menstrualPain >= 6) {
        insights.push('⚠️ Elevated pain levels during menstruation (avg ' + menstrualPain.toFixed(1) + '/10). Consider evaluation for dysmenorrhea or endometriosis.');
      }
    }
    
    if (lutealPhaseData.length > 0) {
      const lutealBloating = lutealPhaseData.reduce((sum, d) => sum + d.bloating, 0) / lutealPhaseData.length;
      if (lutealBloating >= 5) {
        insights.push('📊 Consistent GI symptoms during luteal phase. May indicate hormone-related IBS or PMDD component.');
      }
    }
    
    // Check for chronic pain pattern
    const chronicPainDays = correlationData.filter(d => d.pain >= 5).length;
    if (chronicPainDays / correlationData.length > 0.5) {
      insights.push('🔴 Pain reported on >50% of days. Chronic pelvic pain workup recommended.');
    }
    
    // Check for sleep-pain correlation
    const poorSleepDays = patientCheckIns.filter(c => (c.sleepQuality || 0) < 5);
    if (poorSleepDays.length > patientCheckIns.length * 0.4) {
      insights.push('💤 Poor sleep quality on 40%+ of days. Sleep disruption may be exacerbating pain and mood symptoms.');
    }
    
    return insights;
  }, [correlationData, patientCheckIns]);

  const handleExportPDF = () => {
    alert('PDF export functionality - would generate clinical summary report for EMR');
  };

  const handleExportCSV = () => {
    alert('CSV export functionality - would download raw data for analysis');
  };

  return (
    <div className="min-h-screen bg-[#FFF0F5] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4FB0AE] to-[#69C9C0] text-white p-6">
        <div className="max-w-6xl mx-auto">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/10 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white mb-2">Clinician Dashboard</h1>
              <p className="text-white/80">Patient: {patientName} • {clinicalSummary.totalDays} days tracked</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleExportPDF}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button
                onClick={handleExportCSV}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Raw Data (CSV)
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Clinical Insights Alert */}
        {clinicalInsights.length > 0 && (
          <Card className="border-l-4 border-l-amber-500 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <AlertCircle className="w-5 h-5" />
                Clinical Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {clinicalInsights.map((insight, idx) => (
                  <li key={idx} className="text-sm text-amber-900">
                    {insight}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Clinical Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Average Pain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl">{clinicalSummary.avgPain}</span>
                <span className="text-gray-500">/10</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {clinicalSummary.highPainDays} high pain days (&gt;7/10)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Sleep Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl">{clinicalSummary.avgSleep}</span>
                <span className="text-gray-500">/10</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Average across {clinicalSummary.totalDays} nights
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Unique Symptoms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{clinicalSummary.symptomsCount}</div>
              <p className="text-xs text-gray-500 mt-1">
                Reported over tracking period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Cycle Tracked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{patientPeriodData ? '✓' : '✗'}</div>
              <p className="text-xs text-gray-500 mt-1">
                {patientPeriodData ? `${patientPeriodData.averageCycleLength} day cycle` : 'Not tracking'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="correlation" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="correlation">Cycle Correlation</TabsTrigger>
            <TabsTrigger value="symptoms">Symptom Frequency</TabsTrigger>
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          </TabsList>

          {/* Cycle Correlation Tab */}
          <TabsContent value="correlation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pain vs. Cycle Day</CardTitle>
                <CardDescription>
                  Identifies cycle-dependent pain patterns (e.g., dysmenorrhea, mittelschmerz)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {correlationData.length > 0 ? (
                  <div className="h-[300px] w-full min-h-[300px]">
                    <ResponsiveContainer width="100%" height={300} minHeight={300}>
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="cycleDay" 
                          type="number" 
                          domain={[1, patientPeriodData?.averageCycleLength || 28]}
                          label={{ value: 'Cycle Day', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          label={{ value: 'Pain Level', angle: -90, position: 'insideLeft' }}
                          domain={[0, 10]}
                        />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white p-3 border rounded shadow-lg">
                                  <p className="font-semibold">{data.phase}</p>
                                  <p className="text-sm">Cycle Day: {data.cycleDay}</p>
                                  <p className="text-sm">Pain: {data.pain}/10</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Scatter 
                          data={correlationData} 
                          fill="#F487B6"
                          shape={(props: any) => {
                            const { cx, cy, payload } = props;
                            const colors: Record<string, string> = {
                              'Menstrual': '#9E6B8E',
                              'Follicular': '#69C9C0',
                              'Ovulation': '#C59FA8',
                              'Luteal': '#F487B6'
                            };
                            return (
                              <circle 
                                cx={cx} 
                                cy={cy} 
                                r={6} 
                                fill={colors[payload.phase] || '#F487B6'}
                                opacity={0.7}
                              />
                            );
                          }}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-12">
                    Insufficient data for correlation analysis. Need cycle tracking data.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>GI Symptoms vs. Cycle Phase</CardTitle>
                <CardDescription>
                  Bloating patterns across menstrual cycle phases
                </CardDescription>
              </CardHeader>
              <CardContent>
                {correlationData.length > 0 ? (
                  <div className="h-[300px] w-full min-h-[300px]">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={correlationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" label={{ value: 'Day', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Bloating Severity', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="bloating" stroke="#4FB0AE" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-12">No GI symptom data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Symptom Frequency Tab */}
          <TabsContent value="symptoms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Common Symptoms</CardTitle>
                <CardDescription>
                  Frequency analysis for differential diagnosis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {clinicalSummary.commonSymptoms.length > 0 ? (
                  <div className="space-y-3">
                    {clinicalSummary.commonSymptoms.map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">{item.symptom}</span>
                          <span className="text-sm text-gray-600">
                            {item.count} days ({item.percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#4FB0AE] h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-12">No symptom data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Tracking Timeline</CardTitle>
                <CardDescription>
                  Comprehensive view of all tracked parameters over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {correlationData.length > 0 ? (
                  <div className="h-[400px] w-full min-h-[400px]">
                    <ResponsiveContainer width="100%" height={400} minHeight={400}>
                      <LineChart data={correlationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="pain" stroke="#9E6B8E" name="Pain" />
                        <Line type="monotone" dataKey="bloating" stroke="#4FB0AE" name="Bloating" />
                        <Line type="monotone" dataKey="mood" stroke="#C59FA8" name="Mood" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-12">No tracking data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Diagnostic Recommendations */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Suggested Workup Based on Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {clinicalSummary.highPainDays >= 7 && (
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                  <p>
                    <strong>Consider:</strong> Pelvic ultrasound to evaluate for structural causes (endometriosis, fibroids)
                  </p>
                </div>
              )}
              {correlationData.some(d => d.bloating >= 5) && (
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                  <p>
                    <strong>Consider:</strong> GI referral for IBS evaluation, possible low-FODMAP trial
                  </p>
                </div>
              )}
              {parseFloat(clinicalSummary.avgSleep) < 6 && (
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                  <p>
                    <strong>Consider:</strong> Sleep study if insomnia persists; rule out sleep apnea
                  </p>
                </div>
              )}
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                <p>
                  <strong>Labs to consider:</strong> CBC, ferritin, TSH, vitamin D, vitamin B12
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}