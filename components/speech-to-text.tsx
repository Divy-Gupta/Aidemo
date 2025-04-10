"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Edit, AlertCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SpeechToTextProps {
  onTranscriptChange: (transcript: string) => void
  onRecordingStateChange: (isRecording: boolean) => void
  disabled?: boolean
}

export default function SpeechToText({
  onTranscriptChange,
  onRecordingStateChange,
  disabled = false,
}: SpeechToTextProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editedTranscript, setEditedTranscript] = useState("")
  const [permissionError, setPermissionError] = useState<string | null>(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  const recognitionRef = useRef<any>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneStreamRef = useRef<MediaStream | null>(null)

  // Check if speech recognition is supported
  const isSpeechRecognitionSupported =
    typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore - SpeechRecognition is not in the TypeScript types yet
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = ""
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript
            } else {
              interimTranscript += event.results[i][0].transcript
            }
          }

          const fullTranscript = finalTranscript || interimTranscript
          setTranscript(fullTranscript)
          onTranscriptChange(fullTranscript)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error)
          if (event.error === "not-allowed") {
            setPermissionError(
              "Microphone access was denied. Please enable microphone permissions in your browser settings.",
            )
          }
          stopRecording()
        }
      }
    }

    return () => {
      stopRecording()
    }
  }, [onTranscriptChange])

  const requestMicrophonePermission = async () => {
    try {
      // First check if we already have permission
      const permissionStatus = await navigator.permissions.query({ name: "microphone" as PermissionName })

      if (permissionStatus.state === "granted") {
        return true
      } else if (permissionStatus.state === "prompt") {
        // We need to ask for permission
        try {
          // Just request access to see if user grants permission
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          // Stop the stream right away, we just needed to request permission
          stream.getTracks().forEach((track) => track.stop())
          return true
        } catch (err) {
          console.error("Error requesting microphone permission:", err)
          return false
        }
      } else {
        // Permission is denied
        setPermissionError("Microphone access is blocked. Please enable it in your browser settings.")
        return false
      }
    } catch (err) {
      // Some browsers might not support the permissions API
      // In that case, we'll just try to get the microphone directly
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        stream.getTracks().forEach((track) => track.stop())
        return true
      } catch (err) {
        console.error("Error requesting microphone permission:", err)
        return false
      }
    }
  }

  const startRecording = async () => {
    if (disabled) return
    setHasInteracted(true)

    // Clear any previous errors
    setPermissionError(null)

    // First, request permission
    const hasPermission = await requestMicrophonePermission()
    if (!hasPermission) {
      return
    }

    try {
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      microphoneStreamRef.current = stream

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start()
        setIsRecording(true)
        onRecordingStateChange(true)

        // Set up audio visualization (optional)
        setupAudioVisualization(stream)
      }
    } catch (error: any) {
      console.error("Error accessing microphone:", error)

      // Handle specific error types
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setPermissionError(
          "Microphone access was denied. Please enable microphone permissions in your browser settings.",
        )
      } else if (error.name === "NotFoundError") {
        setPermissionError("No microphone detected. Please connect a microphone and try again.")
      } else {
        setPermissionError(`Could not access microphone: ${error.message || "Unknown error"}`)
      }
    }
  }

  const stopRecording = () => {
    // Stop speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {
        // Ignore errors when stopping an already stopped recognition
      }
    }

    // Stop microphone stream
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach((track) => track.stop())
      microphoneStreamRef.current = null
    }

    // Clean up audio context
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close()
    }

    setIsRecording(false)
    onRecordingStateChange(false)
  }

  const setupAudioVisualization = (stream: MediaStream) => {
    // This is optional but could be used to visualize audio input
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      // Don't connect to destination to avoid feedback
    } catch (e) {
      console.error("Error setting up audio visualization:", e)
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      // Clear previous transcript when starting a new recording
      setTranscript("")
      onTranscriptChange("")
      startRecording()
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditedTranscript(transcript)
  }

  const handleSaveEdit = () => {
    setIsEditing(false)
    setTranscript(editedTranscript)
    onTranscriptChange(editedTranscript)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedTranscript(transcript)
  }

  const handleManualInput = () => {
    setIsEditing(true)
    setEditedTranscript(transcript)
  }

  // If speech recognition is not supported
  if (!isSpeechRecognitionSupported && !hasInteracted) {
    return (
      <div className="space-y-3">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Speech recognition not supported</AlertTitle>
          <AlertDescription>
            Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari, or type your answer
            manually.
          </AlertDescription>
        </Alert>
        <Button onClick={handleManualInput}>Type Answer Manually</Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {permissionError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Microphone Access Error</AlertTitle>
          <AlertDescription>{permissionError}</AlertDescription>
        </Alert>
      )}

      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editedTranscript}
            onChange={(e) => setEditedTranscript(e.target.value)}
            rows={5}
            className="w-full"
            placeholder="Type your answer here..."
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveEdit}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div
            className={`p-4 rounded-lg ${transcript ? "bg-slate-50 dark:bg-slate-800" : "bg-slate-50 dark:bg-slate-800 min-h-[80px] flex items-center justify-center"}`}
          >
            {transcript ? (
              <p>{transcript}</p>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-center">
                {isRecording
                  ? "Listening... Speak your answer"
                  : permissionError
                    ? "Please type your answer instead"
                    : "Click the microphone button to start recording your answer"}
              </p>
            )}
          </div>

          {transcript && !isRecording && (
            <Button size="sm" variant="ghost" className="absolute top-2 right-2" onClick={handleEdit}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <div className="flex justify-center gap-2">
        {!permissionError && (
          <Button
            variant={isRecording ? "destructive" : "default"}
            onClick={toggleRecording}
            disabled={disabled}
            className="flex items-center gap-2"
          >
            {isRecording ? (
              <>
                <MicOff className="h-4 w-4" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                {transcript ? "Record Again" : "Start Recording"}
              </>
            )}
          </Button>
        )}

        {(!isRecording || permissionError) && (
          <Button variant="outline" onClick={handleManualInput}>
            <Edit className="h-4 w-4 mr-2" />
            Type Answer
          </Button>
        )}
      </div>

      {isRecording && (
        <div className="flex justify-center items-center gap-2">
          <div className="relative">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute"></div>
            <div className="w-3 h-3 bg-red-500 rounded-full relative"></div>
          </div>
          <span className="text-sm">Recording in progress...</span>
        </div>
      )}
    </div>
  )
}
