"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowRight, Video, Mic, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const interviewTypes = [
  { value: "technical", label: "Technical Interview" },
  { value: "behavioral", label: "Behavioral Interview" },
  { value: "mixed", label: "Mixed (Technical & Behavioral)" },
]

const domains = [
  { value: "frontend", label: "Frontend Development" },
  { value: "backend", label: "Backend Development" },
  { value: "fullstack", label: "Full Stack Development" },
  { value: "data-science", label: "Data Science" },
  { value: "machine-learning", label: "Machine Learning" },
  { value: "devops", label: "DevOps" },
  { value: "cloud", label: "Cloud Computing" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "hr", label: "Human Resources" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
]

export default function FullSimulationPage() {
  const router = useRouter()
  const [domain, setDomain] = useState("")
  const [interviewType, setInterviewType] = useState("")
  const [enableVideo, setEnableVideo] = useState(true)
  const [enableVoice, setEnableVoice] = useState(true)
  const [enablePersonalityAnalysis, setEnablePersonalityAnalysis] = useState(true)
  const [activeTab, setActiveTab] = useState("setup")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (domain && interviewType) {
      const queryParams = new URLSearchParams({
        type: "full-simulation",
        domain,
        interviewType,
        video: enableVideo.toString(),
        voice: enableVoice.toString(),
        personalityAnalysis: enablePersonalityAnalysis.toString(),
      })

      router.push(`/interview/session?${queryParams.toString()}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Full Interview Simulation</h1>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Complete Interview Experience</CardTitle>
          <CardDescription>
            Configure your full interview simulation with video, voice, and personality analysis
          </CardDescription>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="info">What to Expect</TabsTrigger>
          </TabsList>

          <TabsContent value="setup">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Select value={domain} onValueChange={setDomain} required>
                    <SelectTrigger id="domain">
                      <SelectValue placeholder="Select your domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {domains.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interview-type">Interview Type</Label>
                  <Select value={interviewType} onValueChange={setInterviewType} required>
                    <SelectTrigger id="interview-type">
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
                </div>

                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-medium">Features</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="video-analysis">Video Analysis</Label>
                      <p className="text-sm text-slate-500">Analyze facial expressions and body language</p>
                    </div>
                    <Switch id="video-analysis" checked={enableVideo} onCheckedChange={setEnableVideo} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="voice-recognition">Voice Recognition</Label>
                      <p className="text-sm text-slate-500">Speak your answers out loud</p>
                    </div>
                    <Switch id="voice-recognition" checked={enableVoice} onCheckedChange={setEnableVoice} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="personality-analysis">Personality Analysis</Label>
                      <p className="text-sm text-slate-500">Get feedback on confidence, tone, and delivery</p>
                    </div>
                    <Switch
                      id="personality-analysis"
                      checked={enablePersonalityAnalysis}
                      onCheckedChange={setEnablePersonalityAnalysis}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" className="w-full">
                  Start Full Simulation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="info">
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Video className="h-5 w-5 text-emerald-500" />
                  Video Analysis
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Our AI will analyze your facial expressions, eye contact, and body language during the interview.
                  You'll receive feedback on your non-verbal communication and suggestions for improvement.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Mic className="h-5 w-5 text-emerald-500" />
                  Voice Recognition
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Speak your answers out loud, and our system will transcribe them in real-time. You'll get feedback on
                  your verbal communication, including tone, clarity, and confidence.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-500" />
                  Detailed Feedback
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  After each answer, you'll receive comprehensive feedback on both the content and delivery of your
                  response. At the end of the interview, you'll get a detailed report with scores and suggestions for
                  improvement.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">Requirements</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-5">
                  <li>A working webcam (for video analysis)</li>
                  <li>A microphone (for voice recognition)</li>
                  <li>A quiet environment with good lighting</li>
                  <li>Browser permissions for camera and microphone access</li>
                </ul>
              </div>
            </CardContent>

            <CardFooter>
              <Button onClick={() => setActiveTab("setup")} className="w-full">
                Back to Setup
              </Button>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
