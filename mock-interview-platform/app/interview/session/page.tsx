"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, Video, VideoOff, ChevronLeft, ChevronRight, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import InterviewFeedback from "@/components/interview-feedback"

// Mock interview questions based on domain
const mockQuestions = {
  frontend: [
    "Explain the difference between localStorage and sessionStorage.",
    "What is the virtual DOM in React and how does it work?",
    "Explain CSS specificity and how it's calculated.",
    "What are closures in JavaScript and how would you use them?",
    "Describe the concept of responsive design and how you implement it.",
  ],
  backend: [
    "Explain RESTful API design principles.",
    "What are the differences between SQL and NoSQL databases?",
    "Describe how you would handle authentication in a web application.",
    "Explain the concept of middleware in Express.js or similar frameworks.",
    "How would you optimize database queries for performance?",
  ],
  "data-science": [
    "Explain the difference between supervised and unsupervised learning.",
    "What is overfitting and how can you prevent it?",
    "Describe the process of feature selection in machine learning.",
    "Explain the concept of cross-validation.",
    "How would you handle imbalanced datasets?",
  ],
  default: [
    "Tell me about yourself and your background.",
    "What are your greatest strengths and weaknesses?",
    "Why are you interested in this role?",
    "Describe a challenging situation you faced and how you resolved it.",
    "Where do you see yourself in five years?",
  ],
}

export default function InterviewSessionPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const isMobile = useMobile()

  const type = searchParams.get("type") || "domain"
  const domain = searchParams.get("domain") || "default"

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questions, setQuestions] = useState<string[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [isAnswering, setIsAnswering] = useState(false)
  const [micActive, setMicActive] = useState(false)
  const [videoActive, setVideoActive] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [interviewComplete, setInterviewComplete] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Load questions based on interview type and domain
  useEffect(() => {
    // In a real app, we would fetch questions from an API based on the interview parameters
    // For now, we'll use our mock questions
    const domainQuestions = mockQuestions[domain as keyof typeof mockQuestions] || mockQuestions.default
    setQuestions(domainQuestions)

    // Initialize answers array with empty strings
    setAnswers(new Array(domainQuestions.length).fill(""))
  }, [domain])

  // Handle microphone access
  const toggleMicrophone = async () => {
    try {
      if (micActive) {
        // Stop recording
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop()
        }
        setMicActive(false)
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        // In a real app, we would send this audio to a speech-to-text service
        // For now, we'll simulate a response
        setIsAnswering(false)

        // Simulate processing delay
        setTimeout(() => {
          const simulatedTranscript =
            "This is a simulated answer transcript. In a real application, this would be the text converted from your spoken answer using a speech-to-text service."

          // Update the answers array
          const newAnswers = [...answers]
          newAnswers[currentQuestionIndex] = simulatedTranscript
          setAnswers(newAnswers)
          setCurrentAnswer(simulatedTranscript)

          // Show feedback
          setShowFeedback(true)
        }, 1500)
      }

      mediaRecorder.start()
      setMicActive(true)
      setIsAnswering(true)

      toast({
        title: "Microphone activated",
        description: "You can now speak your answer. Click the microphone button again when you're done.",
      })
    } catch (error) {
      console.error("Error accessing microphone:", error)
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use this feature.",
        variant: "destructive",
      })
    }
  }

  // Handle webcam access
  const toggleWebcam = async () => {
    try {
      if (videoActive) {
        // Stop video stream
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream
          stream.getTracks().forEach((track) => track.stop())
          videoRef.current.srcObject = null
        }
        setVideoActive(false)
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setVideoActive(true)

      toast({
        title: "Webcam activated",
        description: "Your webcam is now active for personality analysis.",
      })
    } catch (error) {
      console.error("Error accessing webcam:", error)
      toast({
        title: "Webcam access denied",
        description: "Please allow webcam access to use this feature.",
        variant: "destructive",
      })
    }
  }

  // Handle navigation between questions
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowFeedback(false)
      setCurrentAnswer("")
    } else {
      // Interview complete
      setInterviewComplete(true)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setShowFeedback(false)
      setCurrentAnswer(answers[currentQuestionIndex - 1] || "")
    }
  }

  // Generate PDF report
  const generateReport = () => {
    // In a real app, we would generate a PDF report with the interview results
    toast({
      title: "Report generated",
      description: "Your interview report has been downloaded.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel - Video feed */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Video Analysis</CardTitle>
              <CardDescription>We'll analyze your facial expressions and body language</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative w-full aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden mb-4">
                {videoActive ? (
                  <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Camera is off</p>
                  </div>
                )}
              </div>

              <Button variant={videoActive ? "default" : "outline"} size="sm" onClick={toggleWebcam} className="mb-4">
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

              {videoActive && (
                <div className="w-full space-y-2 text-sm">
                  <p className="font-medium">Real-time Analysis:</p>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Eye Contact</span>
                      <span>Good</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Facial Expression</span>
                      <span>Neutral</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Posture</span>
                      <span>Excellent</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                </div>
              )}
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
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Your Answer:</h3>
                    {isAnswering ? (
                      <div className="flex items-center justify-center h-20 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute"></div>
                            <div className="w-3 h-3 bg-red-500 rounded-full relative"></div>
                          </div>
                          <span>Recording your answer...</span>
                        </div>
                      </div>
                    ) : currentAnswer ? (
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <p>{currentAnswer}</p>
                      </div>
                    ) : answers[currentQuestionIndex] ? (
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <p>{answers[currentQuestionIndex]}</p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-20 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="text-slate-500 dark:text-slate-400">
                          Click the microphone button to start recording your answer
                        </p>
                      </div>
                    )}
                  </div>

                  {showFeedback && (
                    <InterviewFeedback question={questions[currentQuestionIndex]} answer={currentAnswer} />
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
                <>
                  <div>
                    <Button
                      variant="outline"
                      onClick={goToPreviousQuestion}
                      disabled={currentQuestionIndex === 0 || isAnswering}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={micActive ? "destructive" : "outline"}
                      onClick={toggleMicrophone}
                      disabled={isAnswering && !micActive}
                    >
                      {micActive ? (
                        <>
                          <MicOff className="mr-2 h-4 w-4" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Mic className="mr-2 h-4 w-4" />
                          Record Answer
                        </>
                      )}
                    </Button>

                    <Button onClick={goToNextQuestion} disabled={isAnswering}>
                      {currentQuestionIndex < questions.length - 1 ? (
                        <>
                          Next
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        "Complete Interview"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
