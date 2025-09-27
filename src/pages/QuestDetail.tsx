import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/store/authStore";
import { useQuestStore } from "@/store/questStore";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  CheckCircle, 
  XCircle, 
  Trophy, 
  Timer,
  ArrowRight,
  Lightbulb,
  Play,
  Brain,
  Star
} from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Quiz questions for each quest
const questQuizzes: Record<string, QuizQuestion[]> = {
  'mulching-banana': [
    {
      id: 'q1',
      question: 'What is the primary benefit of mulching in banana cultivation?',
      options: [
        'Increases fruit size',
        'Retains soil moisture and suppresses weeds',
        'Changes banana color',
        'Makes harvesting easier'
      ],
      correctAnswer: 1,
      explanation: 'Mulching helps retain soil moisture, suppress weeds, regulate soil temperature, and gradually adds organic matter to improve soil health.'
    },
    {
      id: 'q2',
      question: 'What is the ideal thickness for mulch around banana plants?',
      options: ['1-2 inches', '3-4 inches', '6-8 inches', '10-12 inches'],
      correctAnswer: 1,
      explanation: '3-4 inches of mulch provides optimal weed suppression and moisture retention without creating pest harboring conditions.'
    },
    {
      id: 'q3',
      question: 'Which material is NOT suitable for banana mulching?',
      options: ['Dried banana leaves', 'Coconut coir', 'Fresh grass clippings', 'Plastic sheets'],
      correctAnswer: 3,
      explanation: 'Plastic sheets prevent air and water circulation to roots. Organic materials like dried leaves, coir, and grass clippings are better choices.'
    }
  ],
  'bio-pesticide': [
    {
      id: 'q1',
      question: 'What makes neem oil effective as a bio-pesticide?',
      options: [
        'It kills all insects instantly',
        'It disrupts insect growth and feeding',
        'It changes plant color',
        'It increases soil acidity'
      ],
      correctAnswer: 1,
      explanation: 'Neem oil contains azadirachtin which disrupts insect hormone systems, affecting their growth, feeding, and reproduction without harming beneficial insects when used properly.'
    },
    {
      id: 'q2',
      question: 'When is the best time to apply bio-pesticides?',
      options: ['Midday heat', 'Early morning or evening', 'During rain', 'Any time'],
      correctAnswer: 1,
      explanation: 'Early morning or evening application avoids UV degradation and reduces impact on beneficial insects that are less active during these times.'
    }
  ],
  'soil-health': [
    {
      id: 'q1',
      question: 'What pH range is ideal for most crops?',
      options: ['4.0-5.0', '6.0-7.0', '8.0-9.0', '9.0-10.0'],
      correctAnswer: 1,
      explanation: 'Most crops thrive in slightly acidic to neutral soil (pH 6.0-7.0) where nutrients are most available for plant uptake.'
    },
    {
      id: 'q2',
      question: 'What indicates healthy soil organic matter?',
      options: ['Hard, compacted soil', 'Dark color and good structure', 'Sandy texture only', 'Strong chemical smell'],
      correctAnswer: 1,
      explanation: 'Healthy soil with good organic matter has a dark color, crumbly structure, good water infiltration, and supports active microbial life.'
    }
  ],
  'mixed-cropping': [
    {
      id: 'q1',
      question: 'What is a key benefit of mixed cropping?',
      options: [
        'Easier harvesting',
        'Reduced biodiversity',
        'Natural pest control and improved soil health',
        'Single nutrient usage'
      ],
      correctAnswer: 2,
      explanation: 'Mixed cropping promotes biodiversity, provides natural pest control, improves soil health through varied root systems, and reduces the risk of total crop failure.'
    }
  ],
  'water-conservation': [
    {
      id: 'q1',
      question: 'Which irrigation method is most water-efficient?',
      options: ['Flood irrigation', 'Furrow irrigation', 'Drip irrigation', 'Overhead sprinklers'],
      correctAnswer: 2,
      explanation: 'Drip irrigation delivers water directly to plant roots with minimal evaporation, making it the most water-efficient irrigation method.'
    }
  ]
};

export default function QuestDetail() {
  const { questId } = useParams<{ questId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { quests, startQuest, updateQuestProgress } = useQuestStore();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);

  const quest = quests.find(q => q.id === questId);
  const quizQuestions = questId ? questQuizzes[questId] || [] : [];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  if (!user || !quest) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="farming-card text-center">
          <CardContent className="p-12">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Quest Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The quest you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/quests')} className="bg-gradient-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quests
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setTimerActive(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    setTimerActive(false);
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quizQuestions.length) * 100);
  };

  const handleStartQuest = () => {
    startQuest(quest.id, user.id);
    // Simulate completing first step after quiz
    if (quest.steps.length > 0) {
      updateQuestProgress(quest.id, quest.steps[0].id, 'Quiz completed successfully');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Quiz Results Screen
  if (showResults && quizStarted) {
    const score = calculateScore();
    const passed = score >= 70;

    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="farming-card text-center">
            <CardHeader>
              <div className="mx-auto mb-4">
                {passed ? (
                  <Trophy className="h-16 w-16 text-warning" />
                ) : (
                  <XCircle className="h-16 w-16 text-destructive" />
                )}
              </div>
              <CardTitle className="text-3xl text-gradient">
                {passed ? 'Quiz Passed! 🎉' : 'Quiz Failed 😔'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className={`text-4xl font-bold ${passed ? 'text-success' : 'text-destructive'}`}>
                  {score}%
                </div>
                <Progress value={score} className="w-full max-w-md mx-auto" />
                <p className="text-muted-foreground">
                  {passed 
                    ? `Great job! You can now start the ${quest.title} quest.`
                    : 'You need 70% or higher to pass. Try again!'
                  }
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Review Answers:</h3>
                {quizQuestions.map((question, index) => (
                  <Card key={question.id} className="text-left">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {selectedAnswers[index] === question.correctAnswer ? (
                          <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                        )}
                        <div className="space-y-2">
                          <div className="font-medium">{question.question}</div>
                          <div className="text-sm">
                            <span className="text-success">Correct: </span>
                            {question.options[question.correctAnswer]}
                          </div>
                          {selectedAnswers[index] !== question.correctAnswer && selectedAnswers[index] !== undefined && (
                            <div className="text-sm">
                              <span className="text-destructive">Your answer: </span>
                              {question.options[selectedAnswers[index]]}
                            </div>
                          )}
                          <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                            <Lightbulb className="h-4 w-4 inline mr-1" />
                            {question.explanation}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/quests')} variant="outline">
                  Back to Quests
                </Button>
                {passed ? (
                  <Button onClick={handleStartQuest} className="bg-gradient-primary">
                    Start Quest
                    <Star className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleStartQuiz} className="bg-gradient-primary">
                    Retake Quiz
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Quiz Question Screen
  if (quizStarted && quizQuestions.length > 0) {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="farming-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl text-gradient">
                    {quest.title} Quiz
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary">
                      Question {currentQuestionIndex + 1} of {quizQuestions.length}
                    </Badge>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      timeLeft < 60 ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      <Timer className="h-4 w-4" />
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{quest.points}</div>
                  <div className="text-sm text-muted-foreground">points</div>
                </div>
              </div>
              <Progress value={progress} className="mt-4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">{currentQuestion.question}</h3>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={selectedAnswers[currentQuestionIndex] === index ? "default" : "outline"}
                        className={`w-full text-left justify-start p-4 h-auto ${
                          selectedAnswers[currentQuestionIndex] === index ? "bg-gradient-primary" : ""
                        }`}
                        onClick={() => handleAnswerSelect(index)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold">
                            {String.fromCharCode(65 + index)}
                          </div>
                          {option}
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQuizStarted(false);
                      setTimerActive(false);
                    }}
                  >
                    Exit Quiz
                  </Button>
                  
                  <Button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswers[currentQuestionIndex] === undefined}
                    className="bg-gradient-primary"
                  >
                    {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Quest Overview Screen
  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* Back Button */}
      <Button 
        variant="outline" 
        onClick={() => navigate('/quests')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Quests
      </Button>

      {/* Quest Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="farming-card">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{quest.icon}</div>
                <div>
                  <CardTitle className="text-3xl text-gradient">{quest.title}</CardTitle>
                  <p className="text-muted-foreground mt-2">{quest.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{quest.points}</div>
                <div className="text-sm text-muted-foreground">points</div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-4">
              <Badge variant="secondary" className={`
                ${quest.difficulty === 'easy' ? 'bg-success/20 text-success border-success/30' : 
                  quest.difficulty === 'medium' ? 'bg-warning/20 text-warning border-warning/30' : 
                  'bg-destructive/20 text-destructive border-destructive/30'}
              `}>
                {quest.difficulty.toUpperCase()}
              </Badge>
              <Badge variant="outline">
                {quest.duration} days
              </Badge>
              <Badge variant="outline">
                {quest.category}
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Quiz Section */}
      {quizQuestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="farming-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6" />
                Knowledge Quiz
              </CardTitle>
              <p className="text-muted-foreground">
                Complete this quiz to demonstrate your understanding before starting the quest.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-sm">
                    <span><strong>{quizQuestions.length}</strong> questions</span>
                    <span><strong>5</strong> minutes</span>
                    <span><strong>70%</strong> to pass</span>
                  </div>
                </div>
                <Button onClick={handleStartQuiz} className="bg-gradient-primary">
                  <Play className="h-4 w-4 mr-2" />
                  Start Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quest Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="farming-card">
          <CardHeader>
            <CardTitle>Quest Steps</CardTitle>
            <p className="text-muted-foreground">
              Follow these steps to complete the quest and earn your rewards.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quest.steps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-4 p-4 rounded-lg border">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{step.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  </div>
                  {step.completed && (
                    <CheckCircle className="h-5 w-5 text-success" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Requirements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="farming-card">
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {quest.requirements.map((requirement, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  {requirement}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}