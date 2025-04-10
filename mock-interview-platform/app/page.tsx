import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Briefcase, FileText, Mic, Video } from "lucide-react"
import MotivationalQuote from "@/components/motivational-quote"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">AI Interview Coach</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
            Prepare for your dream job with our AI-powered mock interview platform
          </p>

          <div className="mt-8 w-full max-w-md">
            <MotivationalQuote />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Domain-Based Interview
              </CardTitle>
              <CardDescription>Practice interviews based on your field and expertise</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Select your graduation stream, domain, and experience level to get tailored interview questions specific
                to your field.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/interview/domain" className="w-full">
                <Button className="w-full">
                  Start Domain Interview
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Job-Specific Interview
              </CardTitle>
              <CardDescription>Practice for a specific job or company</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Upload a job description or paste a job link to get questions tailored to that specific role and company
                requirements.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/interview/job-specific" className="w-full">
                <Button className="w-full">
                  Start Job-Specific Interview
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Voice Interview
              </CardTitle>
              <CardDescription>Practice speaking your answers out loud</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Engage in a realistic interview where you speak your answers and receive feedback on both content and
                delivery.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/interview/voice" className="w-full">
                <Button className="w-full">
                  Start Voice Interview
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Full Interview Simulation
              </CardTitle>
              <CardDescription>Complete interview with video and voice analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Our most comprehensive option with webcam-based personality analysis, voice recognition, and detailed
                feedback.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/interview/full-simulation" className="w-full">
                <Button className="w-full">
                  Start Full Simulation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Resume Analysis</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Upload your resume to get personalized interview questions and identify skill gaps
          </p>
          <Link href="/resume-upload">
            <Button size="lg">
              Upload Resume
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
