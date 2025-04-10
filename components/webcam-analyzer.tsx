"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Info } from "lucide-react"

interface WebcamAnalyzerProps {
  isActive: boolean
  onAnalysisUpdate?: (analysis: WebcamAnalysis) => void
}

export interface WebcamAnalysis {
  eyeContact: number
  facialExpression: string
  posture: number
  confidence: number
  attentiveness: number
  feedback: string[]
}

export default function WebcamAnalyzer({ isActive, onAnalysisUpdate }: WebcamAnalyzerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [analysis, setAnalysis] = useState<WebcamAnalysis>({
    eyeContact: 0,
    facialExpression: "Neutral",
    posture: 0,
    confidence: 0,
    attentiveness: 0,
    feedback: [],
  })

  const [facingCamera, setFacingCamera] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)
  const [lookingAway, setLookingAway] = useState(false)
  const [postureStraight, setPostureStraight] = useState(false)

  // Analysis intervals
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const faceCheckCounterRef = useRef(0)
  const lookAwayCounterRef = useRef(0)
  const postureCheckCounterRef = useRef(0)

  // Start webcam
  useEffect(() => {
    if (isActive) {
      startWebcam()
    } else {
      stopWebcam()
    }

    return () => {
      stopWebcam()
    }
  }, [isActive])

  // Start analysis when webcam is active
  useEffect(() => {
    if (stream && isActive) {
      startAnalysis()
    } else {
      stopAnalysis()
    }

    return () => {
      stopAnalysis()
    }
  }, [stream, isActive])

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }

      setStream(mediaStream)
    } catch (error) {
      console.error("Error accessing webcam:", error)
    }
  }

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const startAnalysis = () => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current)
    }

    // Run analysis every 1 second
    analysisIntervalRef.current = setInterval(() => {
      analyzeFrame()
    }, 1000)
  }

  const stopAnalysis = () => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current)
      analysisIntervalRef.current = null
    }
  }

  const analyzeFrame = () => {
    if (!videoRef.current || !canvasRef.current || !stream) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Simulate face detection (in a real app, you would use a face detection library)
    simulateFaceDetection(context, canvas)
  }

  const simulateFaceDetection = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // This is a simulation of face detection
    // In a real app, you would use a library like face-api.js, TensorFlow.js, or MediaPipe

    // Randomly determine if face is detected (biased toward true for demo)
    const randomFaceDetection = Math.random() > 0.2

    // Update face detection counter
    if (randomFaceDetection) {
      faceCheckCounterRef.current += 1
    } else {
      faceCheckCounterRef.current = Math.max(0, faceCheckCounterRef.current - 1)
    }

    // Only consider face detected if we have multiple positive checks
    const isFaceDetected = faceCheckCounterRef.current > 2
    setFaceDetected(isFaceDetected)

    if (isFaceDetected) {
      // Simulate looking away (random, but biased toward false)
      const randomLookingAway = Math.random() > 0.7

      // Update look away counter
      if (randomLookingAway) {
        lookAwayCounterRef.current += 1
      } else {
        lookAwayCounterRef.current = Math.max(0, lookAwayCounterRef.current - 1)
      }

      // Only consider looking away if we have multiple positive checks
      const isLookingAway = lookAwayCounterRef.current > 3
      setLookingAway(isLookingAway)

      // Simulate posture check (random, but biased toward true)
      const randomPostureStraight = Math.random() > 0.3

      // Update posture counter
      if (randomPostureStraight) {
        postureCheckCounterRef.current += 1
      } else {
        postureCheckCounterRef.current = Math.max(0, postureCheckCounterRef.current - 1)
      }

      // Only consider posture straight if we have multiple positive checks
      const isPostureStraight = postureCheckCounterRef.current > 2
      setPostureStraight(isPostureStraight)

      // Calculate metrics
      const eyeContactScore = isLookingAway ? Math.floor(Math.random() * 40) + 10 : Math.floor(Math.random() * 30) + 70
      const postureScore = isPostureStraight ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 40) + 30
      const confidenceScore = Math.floor(Math.random() * 50) + 50
      const attentivenessScore = isLookingAway
        ? Math.floor(Math.random() * 40) + 20
        : Math.floor(Math.random() * 30) + 70

      // Determine facial expression (random for demo)
      const expressions = ["Neutral", "Smiling", "Concerned", "Confused", "Focused"]
      const expressionIndex = Math.floor(Math.random() * expressions.length)
      const facialExpression = expressions[expressionIndex]

      // Generate feedback
      const feedback = []

      if (eyeContactScore < 50) {
        feedback.push("You're looking away from the camera too often. Try to maintain better eye contact.")
      }

      if (postureScore < 60) {
        feedback.push("Your posture needs improvement. Sit up straight and face the camera directly.")
      }

      if (confidenceScore < 60) {
        feedback.push("You appear nervous. Try to relax your facial muscles and speak with more confidence.")
      }

      if (facialExpression === "Neutral" && Math.random() > 0.5) {
        feedback.push("Your expression is very neutral. Try to appear more engaged and enthusiastic.")
      }

      if (facialExpression === "Concerned" || facialExpression === "Confused") {
        feedback.push("You appear confused or concerned. Try to project more confidence.")
      }

      // Update analysis state
      const newAnalysis = {
        eyeContact: eyeContactScore,
        facialExpression,
        posture: postureScore,
        confidence: confidenceScore,
        attentiveness: attentivenessScore,
        feedback,
      }

      setAnalysis(newAnalysis)

      // Notify parent component
      if (onAnalysisUpdate) {
        onAnalysisUpdate(newAnalysis)
      }
    } else {
      // No face detected
      setFacingCamera(false)

      const newAnalysis = {
        eyeContact: 0,
        facialExpression: "Not detected",
        posture: 0,
        confidence: 0,
        attentiveness: 0,
        feedback: ["No face detected. Please position yourself in front of the camera."],
      }

      setAnalysis(newAnalysis)

      if (onAnalysisUpdate) {
        onAnalysisUpdate(newAnalysis)
      }
    }
  }

  const getFeedbackBadge = (score: number) => {
    if (score >= 80) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
          Excellent
        </Badge>
      )
    } else if (score >= 60) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
          Good
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300">
          Needs Improvement
        </Badge>
      )
    }
  }

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden"
      />

      <canvas ref={canvasRef} className="hidden" />

      {isActive && (
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Real-time Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!faceDetected ? (
              <div className="flex items-center gap-2 text-amber-500">
                <AlertCircle className="h-5 w-5" />
                <p>No face detected. Please position yourself in front of the camera.</p>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span>Eye Contact</span>
                    {getFeedbackBadge(analysis.eyeContact)}
                  </div>
                  <Progress value={analysis.eyeContact} className="h-2" />
                  {lookingAway && <p className="text-xs text-red-500">You're looking away from the camera</p>}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span>Facial Expression</span>
                    <Badge variant="outline">{analysis.facialExpression}</Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span>Posture</span>
                    {getFeedbackBadge(analysis.posture)}
                  </div>
                  <Progress value={analysis.posture} className="h-2" />
                  {!postureStraight && <p className="text-xs text-red-500">Your posture needs improvement</p>}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span>Confidence</span>
                    {getFeedbackBadge(analysis.confidence)}
                  </div>
                  <Progress value={analysis.confidence} className="h-2" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span>Attentiveness</span>
                    {getFeedbackBadge(analysis.attentiveness)}
                  </div>
                  <Progress value={analysis.attentiveness} className="h-2" />
                </div>

                {analysis.feedback.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-1">
                      <Info className="h-4 w-4 text-blue-500" />
                      Real-time Feedback
                    </h4>
                    <ul className="text-sm space-y-1 pl-6 list-disc">
                      {analysis.feedback.map((item, index) => (
                        <li key={index} className="text-red-500">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
