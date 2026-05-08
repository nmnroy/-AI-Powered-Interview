import { PrismaClient, Category, Difficulty } from '@prisma/client'

const prisma = new PrismaClient()

const questions = [
  // 10 DSA questions
  {
    text: `Explain the difference between BFS and DFS and when you would use each.`,
    category: Category.DSA,
    difficulty: Difficulty.EASY,
    tags: ['graph', 'traversal']
  },
  {
    text: `How would you find the two numbers in an array that sum to a target value? Explain your approach and its complexity.`,
    category: Category.DSA,
    difficulty: Difficulty.EASY,
    tags: ['array', 'two-sum', 'hashmap']
  },
  {
    text: `What is a binary search tree and how does insertion work?`,
    category: Category.DSA,
    difficulty: Difficulty.EASY,
    tags: ['trees', 'bst']
  },
  {
    text: `Describe how a heap works and how you would use it to find the k largest elements in a stream.`,
    category: Category.DSA,
    difficulty: Difficulty.MEDIUM,
    tags: ['heap', 'priority-queue']
  },
  {
    text: `Explain the sliding window technique and provide an example problem where it is appropriate.`,
    category: Category.DSA,
    difficulty: Difficulty.MEDIUM,
    tags: ['two-pointers', 'arrays']
  },
  {
    text: `How would you detect a cycle in a directed graph? Discuss algorithms and trade-offs.`,
    category: Category.DSA,
    difficulty: Difficulty.MEDIUM,
    tags: ['graph', 'cycle-detection']
  },
  {
    text: `Describe how dynamic programming differs from divide and conquer. Give an example DP problem and outline the state and transition.`,
    category: Category.DSA,
    difficulty: Difficulty.HARD,
    tags: ['dynamic-programming']
  },
  {
    text: `Explain suffix arrays or tries and a use case where they are preferable to naive approaches for string matching.`,
    category: Category.DSA,
    difficulty: Difficulty.HARD,
    tags: ['strings', 'tries', 'suffix-array']
  },
  {
    text: `How would you implement a lock-free concurrent queue? Discuss the challenges and high-level approach.`,
    category: Category.DSA,
    difficulty: Difficulty.HARD,
    tags: ['concurrency', 'data-structures']
  },
  {
    text: `Design an algorithm to merge k sorted linked lists. Explain time and space complexity and possible optimizations.`,
    category: Category.DSA,
    difficulty: Difficulty.MEDIUM,
    tags: ['linked-list', 'heap']
  },

  // 10 HR / Behavioral questions (mix of HR and BEHAVIORAL enum usage)
  {
    text: `Tell me about a time you disagreed with your team lead. How did you handle it?`,
    category: Category.BEHAVIORAL,
    difficulty: Difficulty.EASY,
    tags: ['communication', 'conflict']
  },
  {
    text: `Where do you see yourself in 3 years?`,
    category: Category.HR,
    difficulty: Difficulty.EASY,
    tags: ['career', 'goals']
  },
  {
    text: `Describe a project you are most proud of and why.`,
    category: Category.BEHAVIORAL,
    difficulty: Difficulty.EASY,
    tags: ['accomplishment', 'leadership']
  },
  {
    text: `How do you prioritize tasks when you have multiple high-priority deadlines? Give a concrete example.`,
    category: Category.HR,
    difficulty: Difficulty.MEDIUM,
    tags: ['time-management', 'prioritization']
  },
  {
    text: `Tell me about a time you failed. What happened and what did you learn?`,
    category: Category.BEHAVIORAL,
    difficulty: Difficulty.MEDIUM,
    tags: ['resilience', 'learning']
  },
  {
    text: `How do you handle receiving feedback that you disagree with? Provide an example.`,
    category: Category.HR,
    difficulty: Difficulty.MEDIUM,
    tags: ['feedback', 'communication']
  },
  {
    text: `Describe a time when you had to influence stakeholders without formal authority.`,
    category: Category.BEHAVIORAL,
    difficulty: Difficulty.MEDIUM,
    tags: ['influence', 'stakeholders']
  },
  {
    text: `How do you build and maintain trust within a team? Give concrete practices you follow.`,
    category: Category.HR,
    difficulty: Difficulty.EASY,
    tags: ['teamwork', 'culture']
  },
  {
    text: `Tell me about a time you had to make a difficult trade-off in a project. How did you decide?`,
    category: Category.BEHAVIORAL,
    difficulty: Difficulty.HARD,
    tags: ['decision-making', 'trade-offs']
  },
  {
    text: `How do you approach mentoring junior engineers? Provide an example of a mentoring success story.`,
    category: Category.HR,
    difficulty: Difficulty.MEDIUM,
    tags: ['mentoring', 'leadership']
  },

  // 10 System Design questions
  {
    text: `How would you design a URL shortener? Discuss data model, API, scaling, and limitations.`,
    category: Category.SYSTEM_DESIGN,
    difficulty: Difficulty.MEDIUM,
    tags: ['storage', 'scalability']
  },
  {
    text: `Design a notification system for a mobile app. Consider push notifications, batching, and delivery guarantees.`,
    category: Category.SYSTEM_DESIGN,
    difficulty: Difficulty.MEDIUM,
    tags: ['notifications', 'mobile']
  },
  {
    text: `How would you design a rate limiter for an API gateway? Discuss algorithms and trade-offs.`,
    category: Category.SYSTEM_DESIGN,
    difficulty: Difficulty.MEDIUM,
    tags: ['rate-limiting', 'api']
  },
  {
    text: `Design a highly available chat system for millions of users. Discuss data model, presence, and message delivery.`,
    category: Category.SYSTEM_DESIGN,
    difficulty: Difficulty.HARD,
    tags: ['chat', 'availability']
  },
  {
    text: `How would you design a search service for a large document corpus? Discuss indexing and query patterns.`,
    category: Category.SYSTEM_DESIGN,
    difficulty: Difficulty.HARD,
    tags: ['search', 'indexing']
  },
  {
    text: `Design an event-driven analytics pipeline for user events. Cover ingestion, processing, and storage choices.`,
    category: Category.SYSTEM_DESIGN,
    difficulty: Difficulty.HARD,
    tags: ['analytics', 'event-driven']
  },
  {
    text: `How would you design a video streaming service? Consider encoding, CDN, and scalability.`,
    category: Category.SYSTEM_DESIGN,
    difficulty: Difficulty.HARD,
    tags: ['media', 'cdn']
  },
  {
    text: `Design a service to recommend content to users in real-time. Discuss feature storage, model serving, and latency constraints.`,
    category: Category.SYSTEM_DESIGN,
    difficulty: Difficulty.HARD,
    tags: ['recommendation', 'ml']
  },
  {
    text: `How would you design a distributed job scheduler for background tasks? Discuss fault tolerance and worker coordination.`,
    category: Category.SYSTEM_DESIGN,
    difficulty: Difficulty.MEDIUM,
    tags: ['scheduler', 'distributed']
  },
  {
    text: `Design a system to store and query time-series metrics at high throughput. Discuss compression and retention.`,
    category: Category.SYSTEM_DESIGN,
    difficulty: Difficulty.MEDIUM,
    tags: ['timeseries', 'storage']
  }
]

async function main() {
  console.log(`Seeding ${questions.length} questions...`)

  for (const q of questions) {
    await prisma.question.create({ data: q })
  }

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
