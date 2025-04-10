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
  const [aiThinking, setAiThinking] = useState(false)
  const [aiResponse, setAiResponse] = useState<string | null>(null)

  const recognitionRef = useRef<any>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneStreamRef = useRef<MediaStream | null>(null)

  const isSpeechRecognitionSupported =
    typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)

  useEffect(() => {
    if (typeof window !== "undefined") {
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
            setPermissionError("Microphone access was denied. Please enable microphone permissions in your browser settings.")
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
      const permissionStatus = await navigator.permissions.query({ name: "microphone" as PermissionName })
      if (permissionStatus.state === "granted") return true
      if (permissionStatus.state === "prompt") {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          stream.getTracks().forEach((track) => track.stop())
          return true
        } catch {
          return false
        }
      }
      setPermissionError("Microphone access is blocked. Please enable it in your browser settings.")
      return false
    } catch {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        stream.getTracks().forEach((track) => track.stop())
        return true
      } catch {
        return false
      }
    }
  }

  const startRecording = async () => {
    if (disabled) return
    setHasInteracted(true)
    setPermissionError(null)

    const hasPermission = await requestMicrophonePermission()
    if (!hasPermission) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      microphoneStreamRef.current = stream
      if (recognitionRef.current) {
        recognitionRef.current.start()
        setIsRecording(true)
        onRecordingStateChange(true)
        setupAudioVisualization(stream)
      }
    } catch (error: any) {
      setPermissionError("Microphone error: " + error.message)
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop()
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach((track) => track.stop())
      microphoneStreamRef.current = null
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close()
    }
    setIsRecording(false)
    onRecordingStateChange(false)
  }

  const setupAudioVisualization = (stream: MediaStream) => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
    } catch {}
  }

  const toggleRecording = () => {
    if (isRecording) stopRecording()
    else {
      setTranscript("")
      setAiResponse(null)
      onTranscriptChange("")
      startRecording()
    }
  }

  const handleSubmitAnswer = () => {
    stopRecording()
    setAiThinking(true)
    setTimeout(() => {
      const trimmed = transcript.trim().toLowerCase()
      if (!trimmed || trimmed.length < 5) {
        setAiResponse("Answer not valid. Marks: 0")
      } else {
        setAiResponse("✅ Answer looks great! Marks: 10")
      }
      setAiThinking(false)
    }, 2000)
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

      <div className="relative">
        <div className={`p-4 rounded-lg ${transcript ? "bg-slate-50 dark:bg-slate-800" : "bg-slate-50 dark:bg-slate-800 min-h-[80px] flex items-center justify-center"}`}>
          {transcript ? (
            <p>{transcript}</p>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-center">
              {isRecording ? "🎙️ AI is listening..." : aiThinking ? "🤖 AI is analyzing your answer..." : "Click 'Start Recording' or type your answer."}
            </p>
          )}
        </div>
        {transcript && !isRecording && (
          <Button size="sm" variant="ghost" className="absolute top-2 right-2" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isEditing && (
        <div className="space-y-2">
          <Textarea
            value={editedTranscript}
            onChange={(e) => setEditedTranscript(e.target.value)}
            rows={4}
            placeholder="Type your answer here..."
          />
          <div className="flex gap-2">
            <Button onClick={() => {
              setTranscript(editedTranscript)
              setIsEditing(false)
              onTranscriptChange(editedTranscript)
            }}>Save</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
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
            {isRecording ? <><MicOff className="h-4 w-4" />Stop Recording</> : <><Mic className="h-4 w-4" />Start Recording</>}
          </Button>
        )}
        {(!isRecording || permissionError) && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />Type Answer
          </Button>
        )}
        {transcript && !isRecording && (
          <Button variant="secondary" onClick={handleSubmitAnswer} disabled={aiThinking}>
            Submit Answer
          </Button>
        )}
      </div>

      {aiResponse && (
        <div className="text-center text-green-600 font-medium">
          {aiResponse}
        </div>
      )}
    </div>
  )
}
