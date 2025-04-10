"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"

interface TextToSpeechProps {
  text: string
  autoPlay?: boolean
  onComplete?: () => void
}

export default function TextToSpeech({ text, autoPlay = false, onComplete }: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis

      // Initialize voices
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = setupUtterance
      }

      setupUtterance()

      // Clean up
      return () => {
        if (synthRef.current) {
          synthRef.current.cancel()
        }
      }
    }
  }, [])

  // Re-setup when text changes
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setupUtterance()

      if (autoPlay) {
        setTimeout(() => {
          speak()
        }, 100)
      }
    }
  }, [text, autoPlay])

  const setupUtterance = () => {
    if (!synthRef.current) return

    const newUtterance = new SpeechSynthesisUtterance(text)

    // Get available voices and set a natural sounding one if available
    const voices = synthRef.current.getVoices()
    const preferredVoice = voices.find(
      (voice) =>
        voice.name.includes("Google") ||
        voice.name.includes("Natural") ||
        voice.name.includes("Samantha") ||
        voice.name.includes("Daniel"),
    )

    if (preferredVoice) {
      newUtterance.voice = preferredVoice
    }

    newUtterance.rate = 0.9 // Slightly slower for better comprehension
    newUtterance.pitch = 1.0

    // Add pauses for more natural speech
    newUtterance.text = text.replace(/\./g, ". ").replace(/,/g, ", ")

    newUtterance.onend = () => {
      setIsSpeaking(false)
      if (onComplete) onComplete()
    }

    utteranceRef.current = newUtterance
  }

  const speak = () => {
    if (!utteranceRef.current || !synthRef.current) return

    synthRef.current.cancel() // Cancel any ongoing speech
    synthRef.current.speak(utteranceRef.current)
    setIsSpeaking(true)
    setIsPaused(false)
  }

  const handleToggleSpeech = () => {
    if (!utteranceRef.current || !synthRef.current) return

    if (isSpeaking) {
      if (isPaused) {
        synthRef.current.resume()
        setIsPaused(false)
      } else {
        synthRef.current.pause()
        setIsPaused(true)
      }
    } else {
      speak()
    }
  }

  const handleStopSpeech = () => {
    if (isSpeaking && synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
      setIsPaused(false)
    }
  }

  // If speech synthesis is not available
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleToggleSpeech} className="flex items-center gap-1">
        {isSpeaking && !isPaused ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        {isSpeaking && !isPaused ? "Pause" : isSpeaking && isPaused ? "Resume" : "Listen"}
      </Button>

      {isSpeaking && (
        <Button variant="ghost" size="sm" onClick={handleStopSpeech}>
          Stop
        </Button>
      )}
    </div>
  )
}
