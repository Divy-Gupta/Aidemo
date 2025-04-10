"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const quotes = [
  "Your dream job is just one good answer away 💪",
  "The best way to predict your future is to create it.",
  "Every interview is a chance to showcase your unique value.",
  "Preparation meets opportunity equals success.",
  "The only limit to your impact is your imagination and commitment.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Your attitude determines your direction.",
  "The expert in anything was once a beginner.",
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, we could fetch from an API or use GPT to generate
    // For now, we'll use our predefined list
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

    // Simulate loading
    setTimeout(() => {
      setQuote(randomQuote)
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex flex-col items-center space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        ) : (
          <p className="text-lg font-medium text-emerald-800 dark:text-emerald-300 italic">"{quote}"</p>
        )}
      </CardContent>
    </Card>
  )
}
