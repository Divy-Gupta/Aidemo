"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ArrowRight, FileText, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"

export default function ResumeUploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile) {
      // Check if file is PDF
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a PDF file")
        setFile(null)
        return
      }

      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB")
        setFile(null)
        return
      }

      setFile(selectedFile)
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a resume file")
      return
    }

    setUploading(true)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    // Simulate upload delay
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)

      // In a real app, we would upload the file to a server
      // and then redirect to the next page with the resume ID

      setTimeout(() => {
        setUploading(false)
        router.push(`/interview/session?type=resume&resumeId=sample-resume-id`)
      }, 500)
    }, 3000)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Resume Upload</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload Your Resume
          </CardTitle>
          <CardDescription>
            Upload your resume to get personalized interview questions based on your skills and experience
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="resume">Resume (PDF)</Label>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Upload className="h-10 w-10 text-slate-400" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Drag and drop your resume here or click to browse
                  </p>
                  <p className="text-xs text-slate-500">PDF only, max 5MB</p>

                  <Input id="resume" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("resume")?.click()}
                  >
                    Browse Files
                  </Button>
                </div>
              </div>

              {file && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <FileText className="h-4 w-4" />
                  <span>{file.name}</span>
                </div>
              )}

              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={!file || uploading}>
              {uploading ? "Uploading..." : "Upload and Continue"}
              {!uploading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
