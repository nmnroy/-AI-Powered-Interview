import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    
    const where: any = {}
    if (category && category !== 'ALL') {
      where.category = category
    }
    if (difficulty && difficulty !== 'ALL') {
      where.difficulty = difficulty
    }
    
    const count = await prisma.question.count({ where })
    
    if (count === 0) {
      return NextResponse.json(
        { error: 'No questions found. Database may be empty.' },
        { status: 404 }
      )
    }
    
    const skip = Math.floor(Math.random() * count)
    const question = await prisma.question.findFirst({
      where,
      skip,
    })
    
    return NextResponse.json(question)
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch question', 
        message: error?.message },
      { status: 500 }
    )
  }
}
