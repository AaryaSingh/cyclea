import { useState } from 'react';
import { 
  BookOpen, Heart, Brain, Droplets, Apple, Pill, ChevronLeft, 
  ExternalLink, Clock, CheckCircle, Lock, Search, TrendingUp 
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ArticleViewer } from './ArticleViewer';
import { ARTICLES } from '../data/articles';

interface ExploreScreenProps {
  onBack: () => void;
  unlockedLessons?: string[];
  completedLessons?: string[];
  onCompleteLesson?: (lessonId: string) => void;
}

const LESSON_CATEGORIES = [
  {
    id: 'hormones',
    name: 'Understanding Your Hormones',
    icon: Heart,
    color: '#F487B6',
    lessons: [
      {
        id: 'cycle-basics',
        title: 'Your Menstrual Cycle: The Complete Guide',
        duration: '8 min read',
        level: 'Beginner',
        summary: 'Learn what happens in each phase and how hormones affect your body',
      },
      {
        id: 'estrogen-progesterone',
        title: 'Estrogen vs. Progesterone: What They Do',
        duration: '6 min read',
        level: 'Beginner',
        summary: 'Simple breakdown of your two main reproductive hormones',
      },
      {
        id: 'pms-vs-pmdd',
        title: 'PMS vs. PMDD: Understanding the Difference',
        duration: '7 min read',
        level: 'Intermediate',
        summary: 'When mood changes are more than just PMS',
      },
    ],
  },
  {
    id: 'gut-health',
    name: 'Gut Health & Your Cycle',
    icon: Apple,
    color: '#4FB0AE',
    lessons: [
      {
        id: 'gut-hormone-connection',
        title: 'The Gut-Hormone Connection',
        duration: '10 min read',
        level: 'Intermediate',
        summary: 'Why progesterone slows digestion and what to do about it',
      },
      {
        id: 'bloating-explained',
        title: 'Why You Bloat Before Your Period',
        duration: '5 min read',
        level: 'Beginner',
        summary: 'The science behind cycle-related bloating',
      },
      {
        id: 'ibs-and-cycle',
        title: 'IBS Symptoms and Your Menstrual Cycle',
        duration: '12 min read',
        level: 'Advanced',
        summary: 'How hormones trigger or worsen IBS symptoms',
      },
    ],
  },
  {
    id: 'vitamins',
    name: 'Vitamins & Supplements',
    icon: Pill,
    color: '#C59FA8',
    lessons: [
      {
        id: 'vitamin-d-guide',
        title: 'Vitamin D: The Mood & Energy Vitamin',
        duration: '7 min read',
        level: 'Beginner',
        summary: 'Why most women are deficient and how to fix it',
      },
      {
        id: 'magnesium-benefits',
        title: 'Magnesium: Your PMS Best Friend',
        duration: '6 min read',
        level: 'Beginner',
        summary: 'How magnesium reduces cramps, anxiety, and sleep issues',
      },
      {
        id: 'iron-fatigue',
        title: 'Iron Deficiency: Beyond Anemia',
        duration: '9 min read',
        level: 'Intermediate',
        summary: 'Why you can be tired even with normal blood tests',
      },
    ],
  },
  {
    id: 'mental-health',
    name: 'Mental Health & Hormones',
    icon: Brain,
    color: '#9E6B8E',
    lessons: [
      {
        id: 'gut-brain-axis',
        title: 'The Gut-Brain Axis',
        duration: '8 min read',
        level: 'Intermediate',
        summary: 'How your gut makes 90% of your serotonin',
      },
      {
        id: 'anxiety-and-cycle',
        title: 'Cycle-Related Anxiety',
        duration: '7 min read',
        level: 'Beginner',
        summary: 'Why anxiety spikes during certain cycle phases',
      },
      {
        id: 'sleep-hormones',
        title: 'Sleep & Hormonal Health',
        duration: '10 min read',
        level: 'Intermediate',
        summary: 'How poor sleep disrupts your entire hormone system',
      },
    ],
  },
  {
    id: 'conditions',
    name: 'Common Conditions',
    icon: Droplets,
    color: '#FFC0D3',
    lessons: [
      {
        id: 'pcos-explained',
        title: 'PCOS: Symptoms, Diagnosis & Management',
        duration: '15 min read',
        level: 'Intermediate',
        summary: 'Comprehensive guide to polycystic ovary syndrome',
      },
      {
        id: 'endometriosis-guide',
        title: 'Endometriosis: What You Need to Know',
        duration: '12 min read',
        level: 'Intermediate',
        summary: 'Understanding endo pain and treatment options',
      },
      {
        id: 'dysmenorrhea',
        title: 'Period Pain: When to See a Doctor',
        duration: '8 min read',
        level: 'Beginner',
        summary: 'Normal vs. concerning menstrual pain',
      },
    ],
  },
];

const QUICK_TIPS = [
  {
    title: 'Why tracking helps your OBGYN',
    content: 'Daily symptom data lets your doctor see if pain correlates with your cycle (suggesting endo) or random patterns (suggesting other causes). This reduces unnecessary referrals.',
    category: 'Clinical Insight',
  },
  {
    title: 'Red Flags: When to Call Your Doctor',
    content: 'Pain >7/10 that doesn\'t respond to NSAIDs, bleeding through pads hourly, sudden severe pain, pain with fever, or new symptoms that concern you.',
    category: 'Important',
  },
  {
    title: 'The 3-Month Rule',
    content: 'Track for at least 3 full cycles (about 90 days) before expecting clear patterns. Your brain needs data from all 4 cycle phases repeated multiple times.',
    category: 'Pro Tip',
  },
];

export function ExploreScreen({ 
  onBack, 
  unlockedLessons = [],
  completedLessons = [],
  onCompleteLesson 
}: ExploreScreenProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const isLessonCompleted = (lessonId: string) => completedLessons.includes(lessonId);
  const isLessonUnlocked = (lessonId: string) => true; // All lessons are now unlocked by default

  // Show article viewer if a lesson is selected and has article content
  if (selectedLesson && ARTICLES[selectedLesson]) {
    return (
      <ArticleViewer
        article={ARTICLES[selectedLesson]}
        onBack={() => setSelectedLesson(null)}
        onComplete={() => {
          onCompleteLesson?.(selectedLesson);
          setSelectedLesson(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF0F5] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#69C9C0] to-[#4FB0AE] text-white p-6">
        <div className="max-w-4xl mx-auto">
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
              <h1 className="text-white mb-2">Learn</h1>
              <p className="text-white/80">Evidence-based women's health education</p>
            </div>
            <BookOpen className="w-12 h-12 text-white/80" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search topics like 'bloating', 'vitamin D', 'PCOS'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick Tips */}
        <Card className="bg-gradient-to-r from-[#FFC0D3]/20 to-[#F487B6]/20 border-2 border-[#F487B6]/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#F487B6]" />
              Quick Clinical Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {QUICK_TIPS.map((tip, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border border-[#F487B6]/20">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                  <Badge variant="outline" className="bg-[#F487B6]/10 text-[#F487B6]">
                    {tip.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700">{tip.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Learning Categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Topics</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
          </TabsList>

          {/* All Topics */}
          <TabsContent value="all" className="space-y-4">
            {LESSON_CATEGORIES.map((category) => {
              const Icon = category.icon;

              return (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: category.color }} />
                      </div>
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="space-y-2">
                      {category.lessons.map((lesson) => {
                        const completed = isLessonCompleted(lesson.id);
                        const unlocked = isLessonUnlocked(lesson.id);

                        return (
                          <AccordionItem
                            key={lesson.id}
                            value={lesson.id}
                            className={`rounded-lg border-2 ${
                              completed
                                ? 'bg-green-50 border-green-200'
                                : unlocked
                                ? 'bg-white border-gray-200'
                                : 'bg-gray-50 border-gray-300 opacity-60'
                            }`}
                          >
                            <AccordionTrigger className="px-4 hover:no-underline">
                              <div className="flex items-center gap-3 text-left flex-1">
                                {completed ? (
                                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                ) : unlocked ? (
                                  <BookOpen className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                ) : (
                                  <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm font-medium text-gray-900">
                                      {lesson.title}
                                    </h4>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {lesson.duration}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${
                                        lesson.level === 'Beginner'
                                          ? 'bg-green-50 text-green-700'
                                          : lesson.level === 'Intermediate'
                                          ? 'bg-yellow-50 text-yellow-700'
                                          : 'bg-red-50 text-red-700'
                                      }`}
                                    >
                                      {lesson.level}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                              <p className="text-sm text-gray-700 mb-4">{lesson.summary}</p>
                              {unlocked ? (
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => setSelectedLesson(lesson.id)}
                                    className="bg-[#4FB0AE] hover:bg-[#4FB0AE]/90"
                                    size="sm"
                                  >
                                    {completed ? 'Read Again' : 'Start Reading'}
                                  </Button>
                                  {!completed && (
                                    <Button
                                      onClick={() => onCompleteLesson?.(lesson.id)}
                                      variant="outline"
                                      size="sm"
                                    >
                                      Mark Complete (+10 XP)
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                <div className="bg-gray-100 p-3 rounded-lg">
                                  <p className="text-sm text-gray-600">
                                    🔒 Complete more check-ins to unlock this lesson
                                  </p>
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })}

            {/* External Resources */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-900">Trusted External Resources</CardTitle>
                <CardDescription className="text-blue-700">
                  Learn more from reputable medical organizations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-between border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <span>ACOG: Women's Health Topics</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <span>NIH: Women's Health Research</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <span>Mayo Clinic: Women's Health</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Progress */}
          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Learning Progress</CardTitle>
                <CardDescription>
                  {completedLessons.length} lessons completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {completedLessons.length > 0 ? (
                  <div className="space-y-3">
                    {completedLessons.map((lessonId) => (
                      <div
                        key={lessonId}
                        className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-900">{lessonId}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No lessons completed yet</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Start learning to earn XP and unlock badges!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Achievement Card */}
            <Card className="bg-gradient-to-br from-[#F487B6]/20 to-[#FFC0D3]/20 border-2 border-[#F487B6]/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#F487B6]/20 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-[#F487B6]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Complete 10 Lessons
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Earn the "Health Scholar" badge
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#F487B6] h-full"
                          style={{ width: `${(completedLessons.length / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        {completedLessons.length}/10
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Medical Disclaimer */}
        <Card className="border-2 border-yellow-300 bg-yellow-50">
          <CardContent className="p-4">
            <p className="text-sm text-yellow-900">
              <strong>⚠️ Educational Content:</strong> All lessons are reviewed by board-certified OBGYNs and cite peer-reviewed research. This information is for education only and not a substitute for personalized medical advice. Always discuss new symptoms or treatment changes with your healthcare provider.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}