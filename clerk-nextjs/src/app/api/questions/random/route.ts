import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const fallbackQuestions = [
  // DSA - EASY
  { id: "dsa_e_1", category: "DSA", difficulty: "EASY", text: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution." },
  { id: "dsa_e_2", category: "DSA", difficulty: "EASY", text: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid." },
  { id: "dsa_e_3", category: "DSA", difficulty: "EASY", text: "Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists." },
  { id: "dsa_e_4", category: "DSA", difficulty: "EASY", text: "Given an array of size n, find the majority element. The majority element is the element that appears more than ⌊ n/2 ⌋ times." },
  { id: "dsa_e_5", category: "DSA", difficulty: "EASY", text: "Reverse a singly linked list." },
  
  // DSA - MEDIUM
  { id: "dsa_m_1", category: "DSA", difficulty: "MEDIUM", text: "Given a string s, find the length of the longest substring without repeating characters." },
  { id: "dsa_m_2", category: "DSA", difficulty: "MEDIUM", text: "Given an array of strings strs, group the anagrams together. You can return the answer in any order." },
  { id: "dsa_m_3", category: "DSA", difficulty: "MEDIUM", text: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0." },
  { id: "dsa_m_4", category: "DSA", difficulty: "MEDIUM", text: "You are given an m x n integer grid accounts where accounts[i][j] is the amount of money the i​​​​​​​​​​​th​​​​ customer has in the j​​​​​​​​​​​th​​​​ bank. Return the wealth that the richest customer has." },
  { id: "dsa_m_5", category: "DSA", difficulty: "MEDIUM", text: "Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated." },

  // DSA - HARD
  { id: "dsa_h_1", category: "DSA", difficulty: "HARD", text: "Given an unsorted integer array nums, return the smallest missing positive integer in O(n) time and O(1) space." },
  { id: "dsa_h_2", category: "DSA", difficulty: "HARD", text: "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram." },
  { id: "dsa_h_3", category: "DSA", difficulty: "HARD", text: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it." },
  { id: "dsa_h_4", category: "DSA", difficulty: "HARD", text: "Given a string s, return the longest palindromic substring in s." },
  { id: "dsa_h_5", category: "DSA", difficulty: "HARD", text: "Find the median of two sorted arrays of different sizes in O(log(min(m,n))) time." },

  // SYSTEM DESIGN - EASY/MEDIUM
  { id: "sys_0a", category: "SYSTEM_DESIGN", difficulty: "EASY", text: "Explain the difference between SQL and NoSQL databases. When would you choose one over the other?" },
  { id: "sys_0b", category: "SYSTEM_DESIGN", difficulty: "EASY", text: "What is a load balancer and why is it used in web architecture?" },
  { id: "sys_1", category: "SYSTEM_DESIGN", difficulty: "MEDIUM", text: "How would you design a URL shortener like bit.ly? Walk through the full system architecture, components, and trade-offs." },
  { id: "sys_2", category: "SYSTEM_DESIGN", difficulty: "MEDIUM", text: "Design a rate limiter for an API. What algorithms would you use and how would you implement it in a distributed environment?" },
  { id: "sys_3", category: "SYSTEM_DESIGN", difficulty: "MEDIUM", text: "Design a key-value store. Discuss data partitioning, replication, and handling node failures." },
  { id: "sys_4", category: "SYSTEM_DESIGN", difficulty: "HARD", text: "How would you design Twitter (X)? Focus on the timeline generation and high-throughput tweet ingestion." },
  { id: "sys_5", category: "SYSTEM_DESIGN", difficulty: "HARD", text: "Design WhatsApp or a similar chat application. Discuss message delivery guarantees, offline status, and group chats." },
  { id: "sys_6", category: "SYSTEM_DESIGN", difficulty: "HARD", text: "Design Uber or Lyft. Focus on the dispatcher system, matching riders to drivers, and location tracking." },
  { id: "sys_7", category: "SYSTEM_DESIGN", difficulty: "MEDIUM", text: "Design an autocomplete/typeahead suggestion system for a search engine." },

  // HR - EASY/MEDIUM
  { id: "hr_1", category: "HR", difficulty: "EASY", text: "Tell me about a time you had a conflict with a teammate and how you resolved it." },
  { id: "hr_2", category: "HR", difficulty: "EASY", text: "Why are you interested in leaving your current role to join our company?" },
  { id: "hr_3", category: "HR", difficulty: "EASY", text: "Where do you see yourself in five years?" },
  { id: "hr_4", category: "HR", difficulty: "MEDIUM", text: "Describe a situation where you disagreed with a manager. How did you handle it?" },
  { id: "hr_5", category: "HR", difficulty: "MEDIUM", text: "Tell me about a time you received constructive feedback. How did you react and what changes did you make?" },
  { id: "hr_6", category: "HR", difficulty: "MEDIUM", text: "Describe your ideal work environment and company culture." },

  // BEHAVIORAL - EASY/MEDIUM/HARD
  { id: "beh_0a", category: "BEHAVIORAL", difficulty: "EASY", text: "What is your greatest strength and how has it helped you in your career?" },
  { id: "beh_0b", category: "BEHAVIORAL", difficulty: "EASY", text: "Tell me about a time when you went above and beyond for a project." },
  { id: "beh_1", category: "BEHAVIORAL", difficulty: "MEDIUM", text: "Describe a project where you had to quickly learn a new technology to deliver on a deadline. How did you approach the learning process?" },
  { id: "beh_2", category: "BEHAVIORAL", difficulty: "MEDIUM", text: "Tell me about a time you failed or made a significant mistake. What happened and what did you learn?" },
  { id: "beh_3", category: "BEHAVIORAL", difficulty: "MEDIUM", text: "Describe a time when you had to manage multiple competing priorities. How did you decide what to focus on?" },
  { id: "beh_4", category: "BEHAVIORAL", difficulty: "HARD", text: "Tell me about a time you had to persuade a team to adopt your idea when they were initially against it." },
  { id: "beh_5", category: "BEHAVIORAL", difficulty: "HARD", text: "Describe a situation where you had to work with a highly ambiguous problem with no clear requirements. How did you navigate it?" },
  { id: "beh_6", category: "BEHAVIORAL", difficulty: "HARD", text: "Tell me about a time you had to deliver bad news to a client or stakeholder. How did you prepare for the conversation?" }
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    
    let pool = [...fallbackQuestions]
    
    if (category && category.toUpperCase() !== 'ALL') {
      pool = pool.filter(q => q.category.toUpperCase() === category.toUpperCase())
    }
    if (difficulty && difficulty.toUpperCase() !== 'ALL') {
      pool = pool.filter(q => q.difficulty.toUpperCase() === difficulty.toUpperCase())
    }
    
    if (pool.length === 0) {
      // If filtering by both resulted in nothing, try filtering just by category so they don't get a random category
      if (category && category.toUpperCase() !== 'ALL') {
        pool = fallbackQuestions.filter(q => q.category.toUpperCase() === category.toUpperCase());
      }
      
      // If it's STILL empty (invalid category or no questions at all), fall back to everything
      if (pool.length === 0) {
        pool = fallbackQuestions;
      }
    }
    
    const randomIdx = Math.floor(Math.random() * pool.length)
    return NextResponse.json(pool[randomIdx])
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch question', message: error?.message },
      { status: 500 }
    )
  }
}
