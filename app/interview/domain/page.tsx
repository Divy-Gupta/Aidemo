"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

const graduationStreams = [
  { value: "btech-cs", label: "B.Tech Computer Science" },
  { value: "btech-it", label: "B.Tech Information Technology" },
  { value: "bca", label: "BCA" },
  { value: "mca", label: "MCA" },
  { value: "bsc-cs", label: "B.Sc Computer Science" },
  { value: "mba", label: "MBA" },
  { value: "other", label: "Other" },
]

const domains = [
  { value: "frontend", label: "Frontend Development" },
  { value: "backend", label: "Backend Development" },
  { value: "fullstack", label: "Full Stack Development" },
  { value: "mobile", label: "Mobile Development" },
  { value: "data-science", label: "Data Science" },
  { value: "machine-learning", label: "Machine Learning" },
  { value: "devops", label: "DevOps" },
  { value: "cloud", label: "Cloud Computing" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "hr", label: "Human Resources" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "product-management", label: "Product Management" },
]

const experienceLevels = [
  { value: "entry", label: "Entry Level (0-2 years)" },
  { value: "mid", label: "Mid Level (3-5 years)" },
  { value: "senior", label: "Senior Level (5+ years)" },
]

export default function DomainInterviewPage() {
  const router = useRouter()
  const [stream, setStream] = useState("")
  const [domain, setDomain] = useState("")
  const [experience, setExperience] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, we would validate and then redirect to the interview session
    if (stream && domain && experience) {
      router.push(`/interview/session?type=domain&stream=${stream}&domain=${domain}&experience=${experience}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Domain-Based Interview</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Select Your Profile</CardTitle>
          <CardDescription>
            Choose your education background, domain, and experience level to get tailored interview questions
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="stream">Graduation Stream</Label>
              <Select value={stream} onValueChange={setStream} required>
                <SelectTrigger id="stream">
                  <SelectValue placeholder="Select your graduation stream" />
                </SelectTrigger>
                <SelectContent>
                  {graduationStreams.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
              <Label htmlFor="experience">Experience Level</Label>
              <Select value={experience} onValueChange={setExperience} required>
                <SelectTrigger id="experience">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
