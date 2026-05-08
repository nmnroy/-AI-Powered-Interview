import { createId } from "@paralleldrive/cuid2";

const questions = [
  // DSA Questions
  { text: "Explain the difference between BFS and DFS. When would you use each?", category: "DSA", difficulty: "EASY", tags: ["graphs", "traversal"] },
  { text: "How would you find two numbers in an array that sum to a target value? What is the time complexity?", category: "DSA", difficulty: "EASY", tags: ["arrays", "hashmap"] },
  { text: "What is a binary search tree? How does insertion and deletion work?", category: "DSA", difficulty: "MEDIUM", tags: ["trees", "BST"] },
  { text: "Explain dynamic programming. Solve the coin change problem.", category: "DSA", difficulty: "HARD", tags: ["dp", "recursion"] },
  { text: "What is the difference between a stack and a queue? Give real-world examples.", category: "DSA", difficulty: "EASY", tags: ["stack", "queue"] },
  { text: "How does QuickSort work? What is its average and worst case complexity?", category: "DSA", difficulty: "MEDIUM", tags: ["sorting"] },
  { text: "What is a hash table? How do you handle collisions?", category: "DSA", difficulty: "MEDIUM", tags: ["hashing"] },
  { text: "Explain the concept of a sliding window. Solve: find the longest substring without repeating characters.", category: "DSA", difficulty: "MEDIUM", tags: ["sliding window", "strings"] },
  { text: "What is a linked list? How does it differ from an array?", category: "DSA", difficulty: "EASY", tags: ["linked list"] },
  { text: "Explain recursion with an example. What is a base case?", category: "DSA", difficulty: "EASY", tags: ["recursion"] },

  // HR Questions
  { text: "Tell me about yourself. Walk me through your background and why you are applying.", category: "HR", difficulty: "EASY", tags: ["introduction"] },
  { text: "Tell me about a time you disagreed with a team member. How did you handle it?", category: "HR", difficulty: "MEDIUM", tags: ["conflict", "teamwork"] },
  { text: "What is your greatest weakness? How are you working on it?", category: "HR", difficulty: "MEDIUM", tags: ["self-awareness"] },
  { text: "Where do you see yourself in 3 years?", category: "HR", difficulty: "EASY", tags: ["career goals"] },
  { text: "Describe a project you are most proud of and why.", category: "HR", difficulty: "EASY", tags: ["projects"] },
  { text: "How do you handle working under pressure and tight deadlines?", category: "HR", difficulty: "MEDIUM", tags: ["pressure", "time management"] },
  { text: "Tell me about a time you failed. What did you learn?", category: "HR", difficulty: "HARD", tags: ["failure", "growth"] },
  { text: "Why do you want to work at this company specifically?", category: "HR", difficulty: "MEDIUM", tags: ["motivation"] },
  { text: "How do you prioritize tasks when everything seems urgent?", category: "HR", difficulty: "MEDIUM", tags: ["prioritization"] },
  { text: "Describe a situation where you had to learn something new very quickly.", category: "HR", difficulty: "MEDIUM", tags: ["learning", "adaptability"] },

  // System Design Questions
  { text: "How would you design a URL shortener like bit.ly?", category: "SYSTEM_DESIGN", difficulty: "MEDIUM", tags: ["system design", "scalability"] },
  { text: "Design a notification system for a mobile app with millions of users.", category: "SYSTEM_DESIGN", difficulty: "HARD", tags: ["notifications", "scalability"] },
  { text: "How would you design a chat application like WhatsApp?", category: "SYSTEM_DESIGN", difficulty: "HARD", tags: ["real-time", "websockets"] },
  { text: "Design a rate limiter. What algorithms would you use?", category: "SYSTEM_DESIGN", difficulty: "MEDIUM", tags: ["rate limiting", "algorithms"] },
  { text: "How would you design a caching system? Explain LRU cache.", category: "SYSTEM_DESIGN", difficulty: "MEDIUM", tags: ["caching", "LRU"] },
  { text: "Design a file storage system like Google Drive.", category: "SYSTEM_DESIGN", difficulty: "HARD", tags: ["storage", "cloud"] },
  { text: "How would you design a search autocomplete feature?", category: "SYSTEM_DESIGN", difficulty: "MEDIUM", tags: ["search", "trie"] },
  { text: "Explain the difference between SQL and NoSQL databases. When to use each?", category: "SYSTEM_DESIGN", difficulty: "EASY", tags: ["databases"] },
  { text: "What is a load balancer? How does it work?", category: "SYSTEM_DESIGN", difficulty: "EASY", tags: ["load balancing", "infrastructure"] },
  { text: "How would you design a leaderboard system for a gaming app?", category: "SYSTEM_DESIGN", difficulty: "MEDIUM", tags: ["leaderboard", "redis"] },
];

function escapeSql(str: string) {
  return str.replace(/'/g, "''");
}

function generateSql() {
  console.log('-- Run this in Supabase SQL Editor to seed Questions\n');
  
  for (const q of questions) {
    const id = createId();
    // Tags as PostgreSQL text array
    const tagsSql = `ARRAY[${q.tags.map(t => `'${escapeSql(t)}'`).join(', ')}]::text[]`;
    const now = new Date().toISOString();
    
    console.log(
      `INSERT INTO "Question" (id, text, category, difficulty, tags, "createdAt") ` +
      `VALUES ('${id}', '${escapeSql(q.text)}', '${q.category}', '${q.difficulty}', ${tagsSql}, '${now}');`
    );
  }
}

generateSql();
