import { useState } from 'react';
import { ChevronLeft, CheckCircle, XCircle, BookOpen, Award, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';

interface ArticleSection {
  type: 'text' | 'heading' | 'question';
  content?: string;
  heading?: string;
  question?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

interface Article {
  id: string;
  title: string;
  category: string;
  duration: string;
  sections: ArticleSection[];
  sources: string[];
}

interface ArticleViewerProps {
  article: Article;
  onBack: () => void;
  onComplete: () => void;
}

export function ArticleViewer({ article, onBack, onComplete }: ArticleViewerProps) {
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, number>>({});
  const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({});

  const questions = article.sections.filter(s => s.type === 'question');
  const allQuestionsAnswered = questions.length === Object.keys(answeredQuestions).length;

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setAnsweredQuestions(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleCheckAnswer = (questionIndex: number) => {
    setShowFeedback(prev => ({
      ...prev,
      [questionIndex]: true
    }));
  };

  const isAnswerCorrect = (questionIndex: number) => {
    const section = article.sections.filter(s => s.type === 'question')[questionIndex];
    if (!section.question) return false;
    return answeredQuestions[questionIndex] === section.question.correctAnswer;
  };

  let questionCounter = 0;

  return (
    <div className="min-h-screen bg-[#FFF0F5] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F487B6] to-[#FFC0D3] text-white p-6">
        <div className="max-w-3xl mx-auto">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/10 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Learn
          </Button>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Badge className="bg-white/20 text-white mb-2">
                {article.category}
              </Badge>
              <h1 className="text-white text-2xl mb-2">{article.title}</h1>
              <p className="text-white/80 text-sm">{article.duration}</p>
            </div>
            <BookOpen className="w-8 h-8 text-white/80 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {article.sections.map((section, index) => {
          if (section.type === 'heading') {
            return (
              <h2 key={index} className="text-2xl text-[#3C3C3C] mt-8 mb-4">
                {section.heading}
              </h2>
            );
          }

          if (section.type === 'text') {
            return (
              <p key={index} className="text-[#3C3C3C] leading-relaxed text-lg">
                {section.content}
              </p>
            );
          }

          if (section.type === 'question' && section.question) {
            const currentQuestionIndex = questionCounter++;
            const hasAnswered = answeredQuestions[currentQuestionIndex] !== undefined;
            const showingFeedback = showFeedback[currentQuestionIndex];
            const isCorrect = isAnswerCorrect(currentQuestionIndex);

            return (
              <Card
                key={index}
                className="border-2 border-[#4FB0AE]/30 bg-gradient-to-br from-[#4FB0AE]/5 to-[#69C9C0]/5"
              >
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#4FB0AE]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#4FB0AE] font-bold">?</span>
                    </div>
                    <span className="text-[#3C3C3C]">{section.question.question}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {section.question.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => {
                          if (!showingFeedback) {
                            handleAnswerSelect(currentQuestionIndex, optionIndex);
                            setShowFeedback(prev => ({
                              ...prev,
                              [currentQuestionIndex]: false
                            }));
                          }
                        }}
                        disabled={showingFeedback}
                        className={`w-full text-left flex items-start space-x-3 p-4 rounded-lg border-2 transition-all ${
                          showingFeedback
                            ? optionIndex === section.question!.correctAnswer
                              ? 'border-green-500 bg-green-50 cursor-default'
                              : optionIndex === answeredQuestions[currentQuestionIndex]
                              ? 'border-red-500 bg-red-50 cursor-default'
                              : 'border-gray-200 bg-white cursor-default'
                            : answeredQuestions[currentQuestionIndex] === optionIndex
                            ? 'border-[#4FB0AE] bg-[#4FB0AE]/10 cursor-pointer'
                            : 'border-gray-200 bg-white hover:border-[#4FB0AE]/50 hover:bg-[#4FB0AE]/5 cursor-pointer'
                        }`}
                      >
                        <span className="flex-1 text-[#3C3C3C]">
                          {option}
                        </span>
                        {showingFeedback && optionIndex === section.question!.correctAnswer && (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        )}
                        {showingFeedback &&
                          optionIndex === answeredQuestions[currentQuestionIndex] &&
                          optionIndex !== section.question!.correctAnswer && (
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                          )}
                      </button>
                    ))}
                  </div>

                  {!showingFeedback && hasAnswered && (
                    <Button
                      onClick={() => handleCheckAnswer(currentQuestionIndex)}
                      className="w-full bg-[#4FB0AE] hover:bg-[#4FB0AE]/90"
                    >
                      Check Answer
                    </Button>
                  )}

                  {showingFeedback && (
                    <div
                      className={`p-4 rounded-lg border-2 ${
                        isCorrect
                          ? 'bg-green-50 border-green-200'
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p
                            className={`font-semibold mb-2 ${
                              isCorrect ? 'text-green-900' : 'text-blue-900'
                            }`}
                          >
                            {isCorrect ? 'Correct! 🎉' : 'Not quite'}
                          </p>
                          <p className={isCorrect ? 'text-green-800' : 'text-blue-800'}>
                            {section.question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          }

          return null;
        })}

        {/* Sources */}
        <Card className="border-2 border-purple-200 bg-purple-50 mt-8">
          <CardHeader>
            <CardTitle className="text-purple-900">Evidence-Based Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {article.sources.map((source, index) => (
                <li key={index} className="text-sm text-purple-800">
                  {index + 1}. {source}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Finish Article Button */}
        <Card className={`border-2 ${
          allQuestionsAnswered 
            ? 'border-[#F487B6] bg-gradient-to-br from-[#F487B6]/10 to-[#FFC0D3]/10' 
            : 'border-gray-300 bg-gray-50'
        }`}>
          <CardContent className="p-6">
            {allQuestionsAnswered ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F487B6]/20 flex items-center justify-center">
                    <Award className="w-6 h-6 text-[#F487B6]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#3C3C3C]">Great work!</h3>
                    <p className="text-sm text-[#3C3C3C]/60">
                      You've completed all knowledge checks
                    </p>
                  </div>
                </div>
                <Button
                  onClick={onComplete}
                  className="bg-[#F487B6] hover:bg-[#F487B6]/90 w-full sm:w-auto"
                  size="lg"
                >
                  <Award className="w-5 h-5 mr-2" />
                  Finish Article (+10 XP)
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Almost there!</h3>
                    <p className="text-sm text-gray-600">
                      Answer all {questions.length} questions to finish ({Object.keys(answeredQuestions).length}/{questions.length} completed)
                    </p>
                  </div>
                </div>
                <Button
                  disabled
                  className="bg-gray-300 text-gray-500 cursor-not-allowed w-full sm:w-auto"
                  size="lg"
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Finish Article
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}