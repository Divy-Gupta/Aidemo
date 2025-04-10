"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Mic } from "lucide-react"
import { useRouter } from "next/navigation"

const difficultyLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
]

const interviewTypes = [
  { value: "technical", label: "Technical Interview" },
  { value: "behavioral", label: "Behavioral Interview" },
  { value: "mixed", label: "Mixed (Technical & Behavioral)" },
]

export default function VoiceInterviewPage() {
  const router = useRouter()
  const [difficulty, setDifficulty] = useState("")
  const [type, setType] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, we would validate and then redirect to the interview session
    if (difficulty && type) {
      router.push(`/interview/session?type=voice&difficulty=${difficulty}&interviewType=${type}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Voice Interview</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Interview Setup
          </CardTitle>
          <CardDescription>
            Configure your voice interview session where you'll speak your answers out loud
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={setDifficulty} required>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyLevels.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-slate-500">
                Choose the difficulty level of questions you want to practice with
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Interview Type</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent>
                  {interviewTypes.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-slate-500">
                Choose whether you want to practice technical questions, behavioral questions, or a mix of both
              </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">Voice Interview Tips</h3>
              <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1 list-disc pl-5">
                <li>Make sure you're in a quiet environment</li>
                <li>Speak clearly and at a moderate pace</li>
                <li>Use a good quality microphone if available</li>
                <li>Allow the system to finish asking the question before answering</li>
              </ul>
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full">
              Start Voice Interview
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
