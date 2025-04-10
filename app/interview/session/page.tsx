"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Video, VideoOff, ChevronLeft, Download, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import InterviewFeedback from "@/components/interview-feedback"
import WebcamAnalyzer, { type WebcamAnalysis } from "@/components/webcam-analyzer"
import TextToSpeech from "@/components/text-to-speech"
import SpeechToText from "@/components/speech-to-text"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Mock interview questions based on domain
const mockQuestions = {
  frontend: [
    "Explain the difference between localStorage and sessionStorage.",
    "What is the virtual DOM in React and how does it work?",
    "Explain CSS specificity and how it's calculated.",
    "What are closures in JavaScript and how would you use them?",
    "Describe the concept of responsive design and how you implement it.",
    "What is the difference between == and === in JavaScript?",
    "Explain how event delegation works in JavaScript.",
    "What are React hooks and why were they introduced?",
    "Describe the CSS box model and its components.",
    "What is the purpose of the 'key' prop in React lists?",
  ],
  backend: [
    "Explain RESTful API design principles.",
    "What are the differences between SQL and NoSQL databases?",
    "Describe how you would handle authentication in a web application.",
    "Explain the concept of middleware in Express.js or similar frameworks.",
    "How would you optimize database queries for performance?",
    "What is the difference between authentication and authorization?",
    "Explain the concept of database normalization.",
    "What are microservices and what are their advantages?",
    "How would you implement error handling in a REST API?",
    "Explain the concept of database indexing and its benefits.",
  ],
  "data-science": [
    "Explain the difference between supervised and unsupervised learning.",
    "What is overfitting and how can you prevent it?",
    "Describe the process of feature selection in machine learning.",
    "Explain the concept of cross-validation.",
    "How would you handle imbalanced datasets?",
    "What is the difference between correlation and causation?",
    "Explain the bias-variance tradeoff in machine learning.",
    "What is regularization and why is it important?",
    "Describe the steps in a typical data science project.",
    "What is the curse of dimensionality and how does it affect machine learning?",
  ],
  default: [
    "Tell me about yourself and your background.",
    "What are your greatest strengths and weaknesses?",
    "Why are you interested in this role?",
    "Describe a challenging situation you faced and how you resolved it.",
    "Where do you see yourself in five years?",
    "How do you handle stress and pressure?",
    "Describe a time when you had to work with a difficult team member.",
    "What motivates you in your work?",
    "How do you prioritize your tasks when you have multiple deadlines?",
    "What questions do you have for me?",
  ],
}

// Mock ideal answers
const mockIdealAnswers = {
  frontend: [
    "localStorage and sessionStorage are both web storage APIs in browsers. localStorage persists data indefinitely until explicitly cleared, even after the browser is closed. sessionStorage stores data only for the duration of the page session, and data is cleared when the page session ends (when the tab is closed). Both have a storage limit of about 5-10MB and are synchronous, which can block the main thread if overused.",
    "The Virtual DOM is a lightweight copy of the actual DOM in memory. React uses it to improve performance by minimizing direct manipulation of the real DOM. When state changes, React creates a new Virtual DOM tree, compares it with the previous one (diffing), identifies the minimum changes needed, and then updates only those specific parts in the real DOM (reconciliation). This process is more efficient than directly manipulating the DOM for every small change.",
    "CSS specificity determines which CSS rule applies when multiple rules target the same element. It's calculated as a four-part value: inline styles (1,0,0,0), IDs (0,1,0,0), classes/attributes/pseudo-classes (0,0,1,0), and elements/pseudo-elements (0,0,0,1). The rule with the highest specificity wins. If specificities are equal, the last rule defined takes precedence. The !important declaration overrides normal specificity calculations.",
    "Closures in JavaScript occur when a function retains access to its lexical scope even when executed outside that scope. They're useful for data encapsulation, creating private variables, and maintaining state between function calls. For example, I would use closures to create factory functions, implement the module pattern, or set up event handlers that need access to variables from their containing scope.",
    "Responsive design is an approach to web design that makes web pages render well on various devices and window/screen sizes. I implement it using: 1) Fluid grid layouts with relative units like percentages instead of fixed pixels; 2) Flexible images and media that scale with the viewport; 3) CSS media queries to apply different styles based on device characteristics; 4) Mobile-first approach, designing for mobile devices first and then enhancing for larger screens; and 5) Testing across multiple devices and screen sizes to ensure consistency.",
  ],
  default: [
    "I'm a passionate professional with experience in [relevant field]. My background includes [education] and [key experiences]. I've developed strong skills in [key skills] through my work at [previous companies/projects]. I'm particularly interested in [specific aspects of the field] and have a track record of [achievements]. Outside of work, I enjoy [relevant hobbies/interests] which help me maintain a good work-life balance and bring fresh perspectives to my professional work.",
    "My greatest strength is my ability to [specific strength with example]. I'm also skilled at [another strength] which has helped me [specific achievement]. As for weaknesses, I sometimes [honest weakness] but I've been working to improve by [specific action taken]. I believe in continuous growth and regularly seek feedback to identify areas where I can develop further.",
    "I'm interested in this role because it aligns perfectly with my skills in [relevant skills] and my passion for [relevant aspect of the industry/role]. I've been following [company name]'s work on [specific project/product] and am impressed by [specific aspect of company]. This position would allow me to contribute my expertise in [specific area] while growing in [learning opportunity]. I'm particularly excited about the opportunity to [specific responsibility mentioned in job description].",
    "In my previous role at [company/project], I faced a challenging situation where [describe problem]. The stakes were high because [explain impact]. I approached it by first [first step], then [second step]. I collaborated with [relevant stakeholders] to [action taken]. We encountered [obstacle] along the way, but I [how you overcame it]. Ultimately, we [positive outcome] and I learned [lesson learned] from the experience, which I've applied to subsequent challenges.",
    "In five years, I see myself having grown into a [target role] where I can leverage my expertise in [skill area] to [impact you want to make]. I'm committed to continuing to develop my skills in [relevant areas], and I hope to have taken on increasing responsibility in [specific area of interest]. I'm also interested in [emerging trend/technology in your field] and hope to have contributed to projects in that area. Ultimately, I want to be in a position where I can [long-term career goal] while continuing to learn and grow professionally.",
  ],
}

type InterviewMode = "questions" | "duration"

export default function InterviewSessionPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const isMobile = useMobile()

  const type = searchParams.get("type") || "domain"
  const domain = searchParams.get("domain") || "default"
  const numQuestionsParam = searchParams.get("numQuestions")
  const durationParam = searchParams.get("duration")

  // Interview configuration
  const [interviewMode, setInterviewMode] = useState<InterviewMode>("questions")
  const [numQuestions, setNumQuestions] = useState(numQuestionsParam ? Number.parseInt(numQuestionsParam) : 5)
  const [duration, setDuration] = useState(durationParam ? Number.parseInt(durationParam) : 30) // in minutes
  const [configComplete, setConfigComplete] = useState(false)

  // Interview state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questions, setQuestions] = useState<string[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [isAnswering, setIsAnswering] = useState(false)
  const [videoActive, setVideoActive] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [speakingQuestion, setSpeakingQuestion] = useState(false)
  const [interviewComplete, setInterviewComplete] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [webcamAnalysis, setWebcamAnalysis] = useState<WebcamAnalysis | null>(null)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Load questions based on interview type and domain
  useEffect(() => {
    // In a real app, we would fetch questions from an API based on the interview parameters
    // For now, we'll use our mock questions
    const domainQuestions = mockQuestions[domain as keyof typeof mockQuestions] || mockQuestions.default

    // Limit to the number of questions specified
    const limitedQuestions = domainQuestions.slice(0, Math.min(numQuestions, 50))
    setQuestions(limitedQuestions)

    // Initialize answers array with empty strings
    setAnswers(new Array(limitedQuestions.length).fill(""))
  }, [domain, numQuestions])

  // Start interview timer when config is complete
  useEffect(() => {
    if (configComplete && interviewMode === "duration" && duration > 0) {
      const totalSeconds = duration * 60
      setRemainingTime(totalSeconds)

      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            // Time's up
            clearInterval(timerRef.current as NodeJS.Timeout)
            setInterviewComplete(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [configComplete, duration, interviewMode])

  // Handle webcam analysis update
  const handleWebcamAnalysisUpdate = (analysis: WebcamAnalysis) => {
    setWebcamAnalysis(analysis)
  }

  // Handle transcript change from speech-to-text
  const handleTranscriptChange = (transcript: string) => {
    setCurrentAnswer(transcript)

    // Update the answers array
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = transcript
    setAnswers(newAnswers)
  }

  // Handle recording state change
  const handleRecordingStateChange = (isRecording: boolean) => {
    setIsAnswering(isRecording)
  }

  // Generate feedback using GPT (simulated)
  const generateFeedback = () => {
    // In a real app, this would call the OpenAI API to analyze the answer
    // For now, we'll simulate the response

    // Get the current question
    const question = questions[currentQuestionIndex]
    const answer = currentAnswer

    // Get the ideal answer if available
    const domainAnswers = mockIdealAnswers[domain as keyof typeof mockIdealAnswers] || mockIdealAnswers.default
    const idealAnswer = domainAnswers[currentQuestionIndex % domainAnswers.length]

    // Simulate content score (random for demo)
    const contentScore = Math.floor(Math.random() * 30) + 70

    // Use webcam analysis for delivery score if available
    const deliveryScore = webcamAnalysis
      ? Math.floor((webcamAnalysis.eyeContact + webcamAnalysis.posture + webcamAnalysis.confidence) / 3)
      : Math.floor(Math.random() * 30) + 70

    // Simulate strengths (random selection for demo)
    const allStrengths = [
      "Good understanding of core concepts",
      "Clear explanation of main points",
      "Well-structured response",
      "Good use of examples",
      "Logical flow of ideas",
      "Demonstrated technical knowledge",
      "Concise and to the point",
      "Addressed all parts of the question",
    ]

    const numStrengths = Math.floor(Math.random() * 3) + 1
    const strengths = []
    for (let i = 0; i < numStrengths; i++) {
      const randomIndex = Math.floor(Math.random() * allStrengths.length)
      strengths.push(allStrengths[randomIndex])
      allStrengths.splice(randomIndex, 1)
    }

    // Simulate improvements (random selection for demo)
    const allImprovements = [
      "Could provide more specific examples",
      "Consider mentioning alternative approaches",
      "Explanation could be more concise",
      "Some technical details were missing",
      "Could improve the structure of your answer",
      "Try to speak more confidently",
      "Maintain better eye contact",
      "Avoid technical jargon without explanation",
    ]

    const numImprovements = Math.floor(Math.random() * 3) + 1
    const improvements = []
    for (let i = 0; i < numImprovements; i++) {
      const randomIndex = Math.floor(Math.random() * allImprovements.length)
      improvements.push(allImprovements[randomIndex])
      allImprovements.splice(randomIndex, 1)
    }

    // Add webcam-based feedback if available
    if (webcamAnalysis && webcamAnalysis.feedback.length > 0) {
      improvements.push(...webcamAnalysis.feedback.slice(0, 2))
    }

    // Show feedback
    setShowFeedback(true)
  }

  // Handle navigation between questions
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowFeedback(false)
      setCurrentAnswer("")

      // Speak the next question
      setSpeakingQuestion(true)
    } else {
      // Interview complete
      setInterviewComplete(true)

      // Stop the timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setShowFeedback(false)
      setCurrentAnswer(answers[currentQuestionIndex - 1] || "")

      // Speak the previous question
      setSpeakingQuestion(true)
    }
  }

  // Handle question speech completion
  const handleQuestionSpeechComplete = () => {
    setSpeakingQuestion(false)
  }

  // Generate PDF report
  const generateReport = () => {
    // In a real app, we would generate a PDF report with the interview results
    toast({
      title: "Report generated",
      description: "Your interview report has been downloaded.",
    })
  }

  // Format remaining time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // If configuration is not complete, show the configuration screen
  if (!configComplete) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Configure Your Interview</CardTitle>
            <CardDescription>Choose how you want to conduct your interview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={interviewMode}
              onValueChange={(value) => setInterviewMode(value as InterviewMode)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="questions" id="questions" />
                <Label htmlFor="questions">Set number of questions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="duration" id="duration" />
                <Label htmlFor="duration">Set interview duration</Label>
              </div>
            </RadioGroup>

            {interviewMode === "questions" && (
              <div>
                <Label htmlFor="num-questions">Number of Questions (max 50)</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    id="num-questions"
                    min={1}
                    max={50}
                    step={1}
                    value={[numQuestions]}
                    onValueChange={(value) => setNumQuestions(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{numQuestions}</span>
                </div>
              </div>
            )}

            {interviewMode === "duration" && (
              <div>
                <Label htmlFor="duration">Interview Duration (minutes)</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    id="duration"
                    min={5}
                    max={120}
                    step={5}
                    value={[duration]}
                    onValueChange={(value) => setDuration(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{duration}</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={() => setConfigComplete(true)} className="w-full">
              Start Interview
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{interviewComplete ? "Interview Complete" : "Interview Session"}</h1>

        {!interviewComplete && interviewMode === "duration" && remainingTime > 0 && (
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className="font-mono">{formatTime(remainingTime)}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel - Video feed */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Video Analysis</CardTitle>
              <CardDescription>We'll analyze your facial expressions and body language</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-full mb-4">
                {videoActive ? (
                  <WebcamAnalyzer isActive={videoActive} onAnalysisUpdate={handleWebcamAnalysisUpdate} />
                ) : (
                  <div className="relative w-full aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-center h-full">
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Camera is off</p>
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant={videoActive ? "default" : "outline"}
                size="sm"
                onClick={() => setVideoActive(!videoActive)}
                className="mb-4"
              >
                {videoActive ? (
                  <>
                    <VideoOff className="mr-2 h-4 w-4" />
                    Turn Off Camera
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-4 w-4" />
                    Turn On Camera
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Center panel - Questions and answers */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{interviewComplete ? "Interview Complete" : "Interview Session"}</CardTitle>
                <Badge variant="outline">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Badge>
              </div>
              <CardDescription>
                {interviewComplete
                  ? "Congratulations on completing your interview! Here's your summary."
                  : "Answer each question to the best of your ability"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {interviewComplete ? (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Interview Summary</h3>

                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <p className="font-medium mb-2">Q: {question}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          A: {answers[index] || "No answer provided"}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                          >
                            Content: 8/10
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          >
                            Delivery: 7/10
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Overall Performance</h4>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Technical Knowledge</span>
                          <span>8/10</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Communication</span>
                          <span>7/10</span>
                        </div>
                        <Progress value={70} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Body Language</span>
                          <span>9/10</span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Question:</h3>
                    <p className="text-lg">{questions[currentQuestionIndex]}</p>
                    <div className="mt-2">
                      <TextToSpeech
                        text={questions[currentQuestionIndex]}
                        autoPlay={speakingQuestion}
                        onComplete={handleQuestionSpeechComplete}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Your Answer:</h3>
                    {showFeedback ? (
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <p>{currentAnswer}</p>
                      </div>
                    ) : (
                      <SpeechToText
                        onTranscriptChange={handleTranscriptChange}
                        onRecordingStateChange={handleRecordingStateChange}
                        disabled={speakingQuestion}
                      />
                    )}
                  </div>

                  {!showFeedback && currentAnswer && !isAnswering && (
                    <div className="flex justify-end">
                      <Button onClick={generateFeedback}>Submit Answer</Button>
                    </div>
                  )}

                  {showFeedback && (
                    <InterviewFeedback
                      question={questions[currentQuestionIndex]}
                      answer={currentAnswer}
                      idealAnswer={
                        mockIdealAnswers[domain as keyof typeof mockIdealAnswers]?.[currentQuestionIndex % 5]
                      }
                      contentScore={Math.floor(Math.random() * 30) + 70}
                      deliveryScore={
                        webcamAnalysis
                          ? Math.floor((webcamAnalysis.eyeContact + webcamAnalysis.posture) / 2)
                          : Math.floor(Math.random() * 30) + 70
                      }
                      strengths={["Good understanding of core concepts", "Clear explanation of main points"]}
                      improvements={[
                        ...(webcamAnalysis?.feedback || []).slice(0, 2),
                        "Could provide more specific examples",
                      ]}
                      onNextQuestion={goToNextQuestion}
                    />
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between">
              {interviewComplete ? (
                <div className="w-full flex justify-center">
                  <Button onClick={generateReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Full Report
                  </Button>
                </div>
              ) : (
                !showFeedback && (
                  <div className="w-full flex justify-between">
                    <Button
                      variant="outline"
                      onClick={goToPreviousQuestion}
                      disabled={currentQuestionIndex === 0 || isAnswering || speakingQuestion}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                  </div>
                )
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
