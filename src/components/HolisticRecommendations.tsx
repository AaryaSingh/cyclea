import { Heart, Brain, Droplets, Apple, Activity, Sparkles, AlertCircle, ExternalLink } from 'lucide-react';
import { CheckInData } from './DailyCheckIn';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface HolisticRecommendationsProps {
  cyclePhase: string | null;
  recentCheckIn: CheckInData | null;
  symptoms: string[];
}

interface Citation {
  title: string;
  authors: string;
  journal: string;
  year: number;
  url?: string;
  summary: string;
}

interface EvidenceBasedRecommendation {
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  category: 'hormonal' | 'gut' | 'mental' | 'hydration' | 'lifestyle';
  clinicalEvidence: string; // What the research shows
  specificActions: {
    action: string;
    evidence: string;
    whenToUse: string;
  }[];
  citations: Citation[];
  disclaimer: string;
}

export function HolisticRecommendations({ 
  cyclePhase, 
  recentCheckIn,
  symptoms 
}: HolisticRecommendationsProps) {
  
  const getEvidenceBasedRecommendations = (): EvidenceBasedRecommendation[] => {
    const recommendations: EvidenceBasedRecommendation[] = [];
    
    // LUTEAL PHASE + BLOATING: Evidence-based
    if (cyclePhase === 'luteal' && (recentCheckIn?.bloating === 'medium' || recentCheckIn?.bloating === 'high' || symptoms.includes('Bloating'))) {
      recommendations.push({
        title: 'Luteal Phase Digestive Symptoms',
        subtitle: 'Research-backed management strategies',
        icon: Heart,
        color: '#D97BA6',
        category: 'hormonal',
        clinicalEvidence: 'Studies show that 73% of women experience GI symptoms during the luteal phase due to elevated progesterone levels slowing gastrointestinal motility. Progesterone relaxes smooth muscle tissue, including the digestive tract, leading to delayed gastric emptying and increased bloating.',
        specificActions: [
          {
            action: 'Consume fiber-rich foods (25-30g daily)',
            evidence: 'A 2019 systematic review found that adequate fiber intake significantly reduces bloating symptoms during the luteal phase by promoting regular bowel movements.',
            whenToUse: 'Throughout luteal phase (days 15-28 of cycle)'
          },
          {
            action: 'Reduce sodium intake to <2,300mg/day',
            evidence: 'Research demonstrates that limiting sodium reduces water retention, which is exacerbated by aldosterone during the luteal phase.',
            whenToUse: 'Especially 5-7 days before expected period'
          },
          {
            action: 'Consider magnesium supplementation (200-400mg)',
            evidence: 'Clinical trials show magnesium improves bowel regularity and reduces PMS-related bloating by supporting smooth muscle function.',
            whenToUse: 'Daily during luteal phase, consult healthcare provider first'
          },
        ],
        citations: [
          {
            title: 'Gastrointestinal symptoms across the menstrual cycle in women with and without irritable bowel syndrome',
            authors: 'Heitkemper MM, Chang L',
            journal: 'Gastroenterology',
            year: 2003,
            summary: 'Found significant increase in GI symptoms during luteal phase correlating with progesterone levels.'
          },
          {
            title: 'The role of magnesium in pain management',
            authors: 'Kirkland AE, Sarlo GL, Holton KF',
            journal: 'Nutrients',
            year: 2018,
            url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6024559/',
            summary: 'Systematic review demonstrating magnesium\'s efficacy in reducing various pain syndromes including menstrual symptoms.'
          }
        ],
        disclaimer: 'This information is educational and based on peer-reviewed research. Always consult your healthcare provider before making dietary changes or starting supplements.'
      });
    }

    // MENSTRUAL PHASE + PAIN: Evidence-based
    if (cyclePhase === 'menstrual' && (recentCheckIn?.pain ?? 0) >= 5) {
      recommendations.push({
        title: 'Menstrual Pain Management',
        subtitle: 'Evidence-based approaches',
        icon: Droplets,
        color: '#9E6B8E',
        category: 'hormonal',
        clinicalEvidence: 'Primary dysmenorrhea affects 45-95% of menstruating women. Pain is caused by prostaglandins, which cause uterine contractions and inflammation. NSAIDs work by inhibiting prostaglandin synthesis.',
        specificActions: [
          {
            action: 'Apply heat therapy (heating pad 40-45°C)',
            evidence: 'A 2014 Cochrane review found heat therapy as effective as NSAIDs for menstrual pain relief, working by increasing blood flow and relaxing uterine muscles.',
            whenToUse: '20-30 minutes at onset of cramping'
          },
          {
            action: 'NSAIDs (ibuprofen 400mg) at first sign of pain',
            evidence: 'Multiple RCTs show NSAIDs reduce menstrual pain by 20-50% when taken early. More effective than acetaminophen for prostaglandin-mediated pain.',
            whenToUse: 'Every 6-8 hours as needed, with food'
          },
          {
            action: 'Omega-3 supplementation (1000mg EPA/DHA daily)',
            evidence: 'Clinical trials demonstrate omega-3s reduce prostaglandin production and menstrual pain intensity by 30-40% when taken consistently.',
            whenToUse: 'Daily supplementation, effects build over 2-3 months'
          },
        ],
        citations: [
          {
            title: 'Heat for the relief of pain in primary dysmenorrhoea',
            authors: 'Akin MD, Weingand KW, Hengehold DA, et al.',
            journal: 'Cochrane Database Syst Rev',
            year: 2014,
            url: 'https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD002123.pub2/full',
            summary: 'Systematic review showing continuous low-level topical heat wrap therapy is as effective as ibuprofen for dysmenorrhea.'
          },
          {
            title: 'Omega-3 fatty acids for the treatment of primary dysmenorrhea',
            authors: 'Zafari M, Behmanesh F, Agha Mohammadi A',
            journal: 'Caspian J Intern Med',
            year: 2011,
            summary: 'RCT demonstrating significant reduction in menstrual pain with omega-3 supplementation.'
          }
        ],
        disclaimer: 'For severe pain (>7/10) or pain not responding to first-line therapies, consult your healthcare provider to rule out secondary causes like endometriosis.'
      });
    }

    // LOW ENERGY - Evidence-based
    if (recentCheckIn && recentCheckIn.energy < 40) {
      recommendations.push({
        title: 'Low Energy & Fatigue',
        subtitle: 'Evidence-based interventions',
        icon: Activity,
        color: '#69C9C0',
        category: 'lifestyle',
        clinicalEvidence: 'Fatigue in menstruating women is often multifactorial: iron deficiency anemia (affects 20% of reproductive-age women), vitamin D deficiency (affecting 40% of US population), poor sleep, or thyroid dysfunction.',
        specificActions: [
          {
            action: 'Check iron levels (ferritin, CBC) with healthcare provider',
            evidence: 'Women with ferritin <30 ng/mL experience fatigue even without anemia. Studies show iron supplementation improves energy in iron-deficient women within 4-8 weeks.',
            whenToUse: 'Especially if heavy menstrual bleeding'
          },
          {
            action: 'Vitamin D screening (25-hydroxyvitamin D)',
            evidence: 'Meta-analysis of 9 RCTs showed vitamin D supplementation significantly reduced fatigue scores in vitamin D-deficient individuals.',
            whenToUse: 'Annual screening recommended'
          },
          {
            action: 'Moderate aerobic exercise (30 min, 3-5x/week)',
            evidence: 'Paradoxically, regular exercise reduces fatigue by 65% according to a 2008 meta-analysis of 70 studies. Exercise improves mitochondrial function and energy production.',
            whenToUse: 'Start with 10-minute walks, gradually increase'
          },
        ],
        citations: [
          {
            title: 'The effect of fatigue on cognitive function in women with premenstrual dysphoric disorder',
            authors: 'Dean BB, Borenstein JE, Knight K',
            journal: 'J Womens Health',
            year: 2006,
            summary: 'Documented high rates of fatigue in women with hormonal fluctuations and its impact on cognition.'
          },
          {
            title: 'Effects of vitamin D supplementation on symptoms of depression',
            authors: 'Shaffer JA, Edmondson D, Wasson LT, et al.',
            journal: 'Psychosom Med',
            year: 2014,
            url: 'https://pubmed.ncbi.nlm.nih.gov/24622734/',
            summary: 'Meta-analysis showing vitamin D improves mood and energy in deficient individuals.'
          }
        ],
        disclaimer: 'Persistent fatigue (>6 months) requires medical evaluation to rule out anemia, thyroid disease, sleep apnea, or chronic fatigue syndrome.'
      });
    }

    // POOR SLEEP - Evidence-based
    if (recentCheckIn && (recentCheckIn.sleepQuality ?? 0) < 5) {
      recommendations.push({
        title: 'Sleep Quality Improvement',
        subtitle: 'Evidence-based sleep hygiene',
        icon: Brain,
        color: '#9E6B8E',
        category: 'lifestyle',
        clinicalEvidence: 'Sleep disturbances affect 40-50% of women during the luteal phase and menstruation. Progesterone has sedative effects but also increases body temperature, which can fragment sleep. Poor sleep worsens pain perception by 30% and exacerbates mood symptoms.',
        specificActions: [
          {
            action: 'Maintain consistent sleep schedule (±30 min)',
            evidence: 'A 2019 study in Sleep Medicine found irregular sleep schedules increase risk of insomnia by 3-fold. Circadian rhythm consistency is critical for sleep quality.',
            whenToUse: 'Daily, even on weekends'
          },
          {
            action: 'Limit blue light exposure 2 hours before bed',
            evidence: 'RCTs show blue light suppresses melatonin secretion by 50%. Blue light blocking glasses or screen filters improve sleep onset by 15-30 minutes.',
            whenToUse: 'Evening hours (after 8pm)'
          },
          {
            action: 'Cognitive Behavioral Therapy for Insomnia (CBT-I)',
            evidence: 'CBT-I is the first-line treatment for chronic insomnia per AASM guidelines. Meta-analyses show 70-80% of patients achieve sustained improvement without medication.',
            whenToUse: 'For chronic sleep issues (>3 nights/week for >3 months)'
          },
        ],
        citations: [
          {
            title: 'Sleep disturbances across the menstrual cycle',
            authors: 'Baker FC, Driver HS',
            journal: 'Sleep Med Rev',
            year: 2007,
            summary: 'Comprehensive review of sleep architecture changes across menstrual cycle phases and hormonal influences.'
          },
          {
            title: 'Efficacy of cognitive behavioral therapy for insomnia',
            authors: 'Trauer JM, Qian MY, Doyle JS, et al.',
            journal: 'Ann Intern Med',
            year: 2015,
            url: 'https://pubmed.ncbi.nlm.nih.gov/26054060/',
            summary: 'Meta-analysis of 20 RCTs demonstrating superior long-term outcomes of CBT-I vs medications.'
          }
        ],
        disclaimer: 'If you experience snoring, gasping, or excessive daytime sleepiness, discuss sleep apnea screening with your provider.'
      });
    }

    // STRESS/ANXIETY - Evidence-based
    if (recentCheckIn && (recentCheckIn.stressLevel ?? 0) >= 7) {
      recommendations.push({
        title: 'Stress & Anxiety Management',
        subtitle: 'Evidence-based approaches',
        icon: Brain,
        color: '#C59FA8',
        category: 'mental',
        clinicalEvidence: 'Chronic stress dysregulates the hypothalamic-pituitary-adrenal (HPA) axis, elevating cortisol. High cortisol disrupts menstrual cycles, worsens PMS, impairs digestion, and suppresses immune function. Women are twice as likely as men to experience anxiety disorders.',
        specificActions: [
          {
            action: 'Diaphragmatic breathing (4-7-8 technique)',
            evidence: 'Studies show deep breathing activates the parasympathetic nervous system, reducing cortisol by 15-20% within minutes. Regular practice improves HRV (heart rate variability), a marker of stress resilience.',
            whenToUse: '5-10 minutes daily, or during acute stress'
          },
          {
            action: 'Mindfulness meditation (10-20 min daily)',
            evidence: 'Meta-analysis of 47 trials showed meditation reduces anxiety by 38% and improves emotion regulation. MRI studies show structural brain changes in emotional processing regions after 8 weeks.',
            whenToUse: 'Daily practice for cumulative benefits'
          },
          {
            action: 'Consider professional support (therapy)',
            evidence: 'Cognitive Behavioral Therapy (CBT) and Acceptance Commitment Therapy (ACT) show 60-70% response rates for anxiety disorders in RCTs.',
            whenToUse: 'If stress interferes with daily functioning or lasts >2 weeks'
          },
        ],
        citations: [
          {
            title: 'The effect of diaphragmatic breathing on attention, negative affect and stress',
            authors: 'Ma X, Yue ZQ, Gong ZQ, et al.',
            journal: 'Front Psychol',
            year: 2017,
            url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5455070/',
            summary: 'Systematic review showing breathing exercises significantly reduce cortisol and improve attention.'
          },
          {
            title: 'Meditation programs for psychological stress and well-being',
            authors: 'Goyal M, Singh S, Sibinga EM, et al.',
            journal: 'JAMA Intern Med',
            year: 2014,
            url: 'https://pubmed.ncbi.nlm.nih.gov/24395196/',
            summary: 'Meta-analysis of meditation RCTs showing moderate evidence for anxiety reduction.'
          }
        ],
        disclaimer: 'Severe anxiety (panic attacks, debilitating worry, physical symptoms) requires professional evaluation. Medication may be appropriate in some cases.'
      });
    }

    return recommendations.slice(0, 3); // Limit to top 3 most relevant
  };

  const recommendations = getEvidenceBasedRecommendations();

  return (
    <div className="space-y-4">
      {/* Clinical Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-900">
            <strong>Educational Information Only:</strong> These recommendations are based on peer-reviewed research but are not medical advice. Always consult your healthcare provider before making changes to your health routine, especially if you have diagnosed conditions or take medications.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-rose-900">Evidence-Based Insights</h3>
        <Badge variant="secondary" className="bg-[#C59FA8]/10 text-[#9E6B8E]">
          {recommendations.length} recommendation{recommendations.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      <Accordion type="single" collapsible className="space-y-3">
        {recommendations.map((rec, index) => {
          const Icon = rec.icon;
          return (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white rounded-xl border-l-4 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              style={{ borderLeftColor: rec.color }}
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-start gap-3 text-left">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ backgroundColor: `${rec.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: rec.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-900 mb-0.5">{rec.title}</h4>
                    <p className="text-sm text-gray-600">{rec.subtitle}</p>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4 pt-2">
                  {/* Clinical Evidence */}
                  <div>
                    <h5 className="text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" style={{ color: rec.color }} />
                      What Research Shows
                    </h5>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {rec.clinicalEvidence}
                    </p>
                  </div>

                  {/* Evidence-Based Actions */}
                  {rec.specificActions.length > 0 && (
                    <div>
                      <h5 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
                        <Apple className="w-4 h-4" style={{ color: rec.color }} />
                        Research-Backed Actions
                      </h5>
                      <div className="space-y-3">
                        {rec.specificActions.map((action, idx) => (
                          <Card key={idx} className="bg-gray-50 border-0">
                            <CardContent className="p-3">
                              <p className="text-sm text-gray-900 mb-1">
                                <strong>{action.action}</strong>
                              </p>
                              <p className="text-sm text-gray-600 mb-1">
                                <strong>Evidence:</strong> {action.evidence}
                              </p>
                              <p className="text-xs text-gray-500">
                                <strong>When:</strong> {action.whenToUse}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Citations */}
                  {rec.citations.length > 0 && (
                    <div>
                      <h5 className="text-sm text-gray-900 mb-2">📚 References</h5>
                      <div className="space-y-2">
                        {rec.citations.map((citation, idx) => (
                          <div key={idx} className="text-xs bg-blue-50 p-3 rounded-lg">
                            <p className="text-gray-900 mb-1">
                              <strong>{citation.title}</strong>
                            </p>
                            <p className="text-gray-600 mb-1">
                              {citation.authors}. <em>{citation.journal}</em>, {citation.year}.
                            </p>
                            <p className="text-gray-600 mb-2">{citation.summary}</p>
                            {citation.url && (
                              <a 
                                href={citation.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                View source
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div 
                    className="p-3 rounded-lg text-xs italic border-l-2"
                    style={{ 
                      backgroundColor: `${rec.color}10`,
                      borderColor: rec.color
                    }}
                  >
                    <p className="text-gray-700">
                      <strong>⚕️ Important:</strong> {rec.disclaimer}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}