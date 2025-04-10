"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Info } from "lucide-react"
import TextToSpeech from "@/components/text-to-speech"
import { Button } from "@/components/ui/button"

interface InterviewFeedbackProps {
  question: string
  answer: string
  idealAnswer?: string
  contentScore?: number
  deliveryScore?: number
  strengths?: string[]
  improvements?: string[]
  onFeedbackComplete?: () => void
  onNextQuestion?: () => void
}

export default function InterviewFeedback({
  question,
  answer,
  idealAnswer,
  contentScore = 75,
  deliveryScore = 80,
  strengths = ["Good understanding of the core concepts", "Clear explanation of the main points"],
  improvements = ["Could provide more specific examples", "Consider mentioning alternative approaches"],
  onFeedbackComplete,
  onNextQuestion,
}: InterviewFeedbackProps) {
  // In a real app, this would be generated by GPT based on the question and answer

  const defaultIdealAnswer =
    "An ideal answer would explain the concept clearly, provide specific examples from your experience, and discuss potential trade-offs or alternative approaches. It would demonstrate both theoretical knowledge and practical application."

  const finalIdealAnswer = idealAnswer || defaultIdealAnswer

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">AI Feedback</CardTitle>
        <CardDescription>Analysis of your answer to help you improve</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
            Content: {contentScore}/100
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            Delivery: {deliveryScore}/100
          </Badge>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Strengths
            </h4>
            <ul className="text-sm space-y-1 pl-6 list-disc">
              {strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Areas for Improvement
            </h4>
            <ul className="text-sm space-y-1 pl-6 list-disc">
              {improvements.map((improvement, index) => (
                <li key={index}>{improvement}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
              <Info className="h-4 w-4 text-blue-500" />
              Ideal Answer
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{finalIdealAnswer}</p>
            <TextToSpeech text={finalIdealAnswer} onComplete={onFeedbackComplete} />
          </div>

          <div className="pt-4 flex justify-end">
            <Button onClick={onNextQuestion}>Next Question</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
