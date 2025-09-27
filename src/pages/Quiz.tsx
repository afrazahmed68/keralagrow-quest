import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Timer,
  ArrowRight,
  Lightbulb
} from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in minutes
  questions: Question[];
  points: number;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const mockQuizzes: Quiz[] = [
  {
    id: 'soil-health-quiz',
    title: 'Soil Health & Management',
    description: 'Test your knowledge about soil health, nutrients, and sustainable soil management practices.',
    category: 'soil',
    difficulty: 'medium',
    timeLimit: 15,
    points: 100,
    questions: [
      {
        id: 'q1',
        question: 'What is the ideal pH range for most crops?',
        options: ['5.0 - 5.5', '6.0 - 7.0', '7.5 - 8.0', '8.5 - 9.0'],
        correctAnswer: 1,
        explanation: 'Most crops grow best in slightly acidic to neutral soil with pH 6.0-7.0, as nutrients are most available in this range.'
      },
      {
        id: 'q2',
        question: 'Which practice helps improve soil organic matter?',
        options: ['Excessive tillage', 'Burning crop residues', 'Adding compost', 'Using only chemical fertilizers'],
        correctAnswer: 2,
        explanation: 'Adding compost increases organic matter, improves soil structure, and enhances nutrient retention.'
      },
      {
        id: 'q3',
        question: 'What indicates healthy soil?',
        options: ['Hard, compacted texture', 'Good water infiltration', 'No earthworms present', 'Strong chemical smell'],
        correctAnswer: 1,
        explanation: 'Healthy soil has good water infiltration, proper drainage, and active biological life.'
      }
    ]
  },
  {
    id: 'organic-farming-quiz',
    title: 'Organic Farming Practices',
    description: 'Learn about organic farming methods, pest control, and sustainable agriculture.',
    category: 'organic',
    difficulty: 'easy',
    timeLimit: 10,
    points: 75,
    questions: [
      {
        id: 'q1',
        question: 'Which is an organic pest control method?',
        options: ['Chemical pesticides', 'Neem oil spray', 'Synthetic fertilizers', 'GMO seeds'],
        correctAnswer: 1,
        explanation: 'Neem oil is a natural, organic pest control method that is safe for beneficial insects when used properly.'
      },
      {
        id: 'q2',
        question: 'What is crop rotation beneficial for?',
        options: ['Reducing soil fertility', 'Breaking pest cycles', 'Increasing chemical use', 'Compacting soil'],
        correctAnswer: 1,
        explanation: 'Crop rotation breaks pest and disease cycles, improves soil health, and reduces the need for chemical inputs.'
      }
    ]
  },
  {
    id: 'water-management-quiz',
    title: 'Water Conservation & Management',
    description: 'Test your understanding of efficient irrigation and water conservation techniques.',
    category: 'water',
    difficulty: 'hard',
    timeLimit: 20,
    points: 150,
    questions: [
      {
        id: 'q1',
        question: 'Which irrigation method is most water-efficient?',
        options: ['Flood irrigation', 'Furrow irrigation', 'Drip irrigation', 'Sprinkler irrigation'],
        correctAnswer: 2,
        explanation: 'Drip irrigation delivers water directly to plant roots, minimizing evaporation and water waste.'
      },
      {
        id: 'q2',
        question: 'What is mulching primarily used for?',
        options: ['Increasing water evaporation', 'Conserving soil moisture', 'Attracting pests', 'Hardening soil surface'],
        correctAnswer: 1,
        explanation: 'Mulching conserves soil moisture, suppresses weeds, and regulates soil temperature.'
      },
      {
        id: 'q3',
        question: 'When is the best time to water plants?',
        options: ['Midday when it\'s hottest', 'Early morning', 'Late afternoon', 'Any time is fine'],
        correctAnswer: 1,
        explanation: 'Early morning watering reduces evaporation losses and allows plants to absorb water before the heat of the day.'
      }
    ]
  }
];

export default function Quiz() {
  const { user } = useAuthStore();
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  if (!user) return null;

  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setTimeLeft(quiz.timeLimit * 60); // Convert to seconds
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedQuiz!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    if (!selectedQuiz) return 0;
    let correct = 0;
    selectedQuiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / selectedQuiz.questions.length) * selectedQuiz.points);
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-destructive';
  };

  if (showResults && selectedQuiz) {
    const score = calculateScore();
    const maxScore = selectedQuiz.points;
    const percentage = Math.round((score / maxScore) * 100);

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
                <Trophy className="h-16 w-16 text-warning" />
              </div>
              <CardTitle className="text-3xl text-gradient">
                Quiz Complete! 🎉
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className={`text-4xl font-bold ${getScoreColor(score, maxScore)}`}>
                  {score} / {maxScore} points
                </div>
                <div className="text-xl text-muted-foreground">
                  {percentage}% Score
                </div>
                <Progress value={percentage} className="w-full max-w-md mx-auto" />
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-success">
                    {selectedAnswers.filter((answer, index) => answer === selectedQuiz.questions[index].correctAnswer).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-destructive">
                    {selectedAnswers.filter((answer, index) => answer !== selectedQuiz.questions[index].correctAnswer).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-info">
                    {selectedQuiz.questions.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Review Answers:</h3>
                {selectedQuiz.questions.map((question, index) => (
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
                          {selectedAnswers[index] !== question.correctAnswer && (
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
                <Button onClick={() => setSelectedQuiz(null)} variant="outline">
                  Back to Quizzes
                </Button>
                <Button onClick={() => handleQuizSelect(selectedQuiz)} className="bg-gradient-primary">
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (selectedQuiz) {
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100;

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
                    {selectedQuiz.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary">
                      Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Timer className="h-4 w-4" />
                      {selectedQuiz.timeLimit} min limit
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{selectedQuiz.points}</div>
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
                    onClick={() => setSelectedQuiz(null)}
                  >
                    Exit Quiz
                  </Button>
                  
                  <Button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswers[currentQuestionIndex] === undefined}
                    className="bg-gradient-primary"
                  >
                    {currentQuestionIndex === selectedQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
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

  return (
    <div className="container mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">
          Knowledge Quiz 🧠
        </h1>
        <p className="text-muted-foreground text-lg">
          Test your farming knowledge and earn points
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockQuizzes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="farming-card hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Brain className="h-8 w-8 text-primary" />
                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      variant="secondary"
                      className={
                        quiz.difficulty === 'easy' 
                          ? 'bg-success/20 text-success border-success/30'
                          : quiz.difficulty === 'medium'
                          ? 'bg-warning/20 text-warning border-warning/30'
                          : 'bg-destructive/20 text-destructive border-destructive/30'
                      }
                    >
                      {quiz.difficulty.toUpperCase()}
                    </Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{quiz.points}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-xl">{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    {quiz.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1">
                      <Timer className="h-4 w-4" />
                      {quiz.timeLimit} minutes
                    </div>
                    <div>
                      {quiz.questions.length} questions
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-primary"
                    onClick={() => handleQuizSelect(quiz)}
                  >
                    Start Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}