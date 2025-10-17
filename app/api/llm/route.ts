import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  const body = await req.json()
  const { messages, model, temperature } = body

  const completion = await client.chat.completions.create({
    model,
    temperature,
    messages,
  })

  const reply = completion.choices[0].message.content
  return NextResponse.json({ reply })
}
