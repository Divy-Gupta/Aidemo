"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ArrowRight, LinkIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function JobSpecificInterviewPage() {
  const router = useRouter()
  const [jobUrl, setJobUrl] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [activeTab, setActiveTab] = useState("url")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (activeTab === "url" && jobUrl) {
      // In a real app, we would validate the URL
      router.push(`/interview/session?type=job-specific&method=url&jobUrl=${encodeURIComponent(jobUrl)}`)
    } else if (activeTab === "description" && jobDescription) {
      // In a real app, we would validate the description
      router.push(
        `/interview/session?type=job-specific&method=description&jobDescription=${encodeURIComponent(jobDescription)}`,
      )
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Job-Specific Interview</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Provide Job Details</CardTitle>
          <CardDescription>
            Enter a job posting URL or paste the job description to get tailored interview questions
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">Job URL</TabsTrigger>
                <TabsTrigger value="description">Job Description</TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="job-url">Job Posting URL</Label>
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="h-5 w-5 text-slate-400" />
                    <Input
                      id="job-url"
                      placeholder="https://example.com/job-posting"
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                      required={activeTab === "url"}
                    />
                  </div>
                  <p className="text-sm text-slate-500">
                    Paste the full URL of the job posting you want to prepare for
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="description" className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="job-description">Job Description</Label>
                  <Textarea
                    id="job-description"
                    placeholder="Paste the job description here or type a brief description like 'Frontend Developer role with React + JavaScript'"
                    rows={8}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    required={activeTab === "description"}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full">
              Start Interview
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
