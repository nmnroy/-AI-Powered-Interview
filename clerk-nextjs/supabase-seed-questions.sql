-- Insert 30 interview questions (10 DSA, 10 HR/Behavioral, 10 System Design)
-- Run this in Supabase SQL Editor

-- DSA Questions (10)
INSERT INTO "Question" (id, text, category, difficulty, tags, "createdAt")
VALUES 
  (gen_random_uuid(), 'Explain the difference between BFS and DFS and when you would use each.', 'DSA', 'EASY', ARRAY['graph', 'traversal'], NOW()),
  
  (gen_random_uuid(), 'How would you find the two numbers in an array that sum to a target value? Explain your approach and its complexity.', 'DSA', 'EASY', ARRAY['array', 'two-sum', 'hashmap'], NOW()),
  
  (gen_random_uuid(), 'What is a binary search tree and how does insertion work?', 'DSA', 'EASY', ARRAY['trees', 'bst'], NOW()),
  
  (gen_random_uuid(), 'Describe how a heap works and how you would use it to find the k largest elements in a stream.', 'DSA', 'MEDIUM', ARRAY['heap', 'priority-queue'], NOW()),
  
  (gen_random_uuid(), 'Explain the sliding window technique and provide an example problem where it is appropriate.', 'DSA', 'MEDIUM', ARRAY['two-pointers', 'arrays'], NOW()),
  
  (gen_random_uuid(), 'How would you detect a cycle in a directed graph? Discuss algorithms and trade-offs.', 'DSA', 'MEDIUM', ARRAY['graph', 'cycle-detection'], NOW()),
  
  (gen_random_uuid(), 'Describe how dynamic programming differs from divide and conquer. Give an example DP problem and outline the state and transition.', 'DSA', 'HARD', ARRAY['dynamic-programming'], NOW()),
  
  (gen_random_uuid(), 'Explain suffix arrays or tries and a use case where they are preferable to naive approaches for string matching.', 'DSA', 'HARD', ARRAY['strings', 'tries', 'suffix-array'], NOW()),
  
  (gen_random_uuid(), 'How would you implement a lock-free concurrent queue? Discuss the challenges and high-level approach.', 'DSA', 'HARD', ARRAY['concurrency', 'data-structures'], NOW()),
  
  (gen_random_uuid(), 'Design an algorithm to merge k sorted linked lists. Explain time and space complexity and possible optimizations.', 'DSA', 'MEDIUM', ARRAY['linked-list', 'heap'], NOW());

-- HR Questions (5)
INSERT INTO "Question" (id, text, category, difficulty, tags, "createdAt")
VALUES 
  (gen_random_uuid(), 'Where do you see yourself in 3 years?', 'HR', 'EASY', ARRAY['career', 'goals'], NOW()),
  
  (gen_random_uuid(), 'How do you prioritize tasks when you have multiple high-priority deadlines? Give a concrete example.', 'HR', 'MEDIUM', ARRAY['time-management', 'prioritization'], NOW()),
  
  (gen_random_uuid(), 'How do you handle receiving feedback that you disagree with? Provide an example.', 'HR', 'MEDIUM', ARRAY['feedback', 'communication'], NOW()),
  
  (gen_random_uuid(), 'How do you build and maintain trust within a team? Give concrete practices you follow.', 'HR', 'EASY', ARRAY['teamwork', 'culture'], NOW()),
  
  (gen_random_uuid(), 'How do you approach mentoring junior engineers? Provide an example of a mentoring success story.', 'HR', 'MEDIUM', ARRAY['mentoring', 'leadership'], NOW());

-- Behavioral Questions (5)
INSERT INTO "Question" (id, text, category, difficulty, tags, "createdAt")
VALUES 
  (gen_random_uuid(), 'Tell me about a time you disagreed with your team lead. How did you handle it?', 'BEHAVIORAL', 'EASY', ARRAY['communication', 'conflict'], NOW()),
  
  (gen_random_uuid(), 'Describe a project you are most proud of and why.', 'BEHAVIORAL', 'EASY', ARRAY['accomplishment', 'leadership'], NOW()),
  
  (gen_random_uuid(), 'Tell me about a time you failed. What happened and what did you learn?', 'BEHAVIORAL', 'MEDIUM', ARRAY['resilience', 'learning'], NOW()),
  
  (gen_random_uuid(), 'Describe a time when you had to influence stakeholders without formal authority.', 'BEHAVIORAL', 'MEDIUM', ARRAY['influence', 'stakeholders'], NOW()),
  
  (gen_random_uuid(), 'Tell me about a time you had to make a difficult trade-off in a project. How did you decide?', 'BEHAVIORAL', 'HARD', ARRAY['decision-making', 'trade-offs'], NOW());

-- System Design Questions (10)
INSERT INTO "Question" (id, text, category, difficulty, tags, "createdAt")
VALUES 
  (gen_random_uuid(), 'How would you design a URL shortener? Discuss data model, API, scaling, and limitations.', 'SYSTEM_DESIGN', 'MEDIUM', ARRAY['storage', 'scalability'], NOW()),
  
  (gen_random_uuid(), 'Design a notification system for a mobile app. Consider push notifications, batching, and delivery guarantees.', 'SYSTEM_DESIGN', 'MEDIUM', ARRAY['notifications', 'mobile'], NOW()),
  
  (gen_random_uuid(), 'How would you design a rate limiter for an API gateway? Discuss algorithms and trade-offs.', 'SYSTEM_DESIGN', 'MEDIUM', ARRAY['rate-limiting', 'api'], NOW()),
  
  (gen_random_uuid(), 'Design a highly available chat system for millions of users. Discuss data model, presence, and message delivery.', 'SYSTEM_DESIGN', 'HARD', ARRAY['chat', 'availability'], NOW()),
  
  (gen_random_uuid(), 'How would you design a search service for a large document corpus? Discuss indexing and query patterns.', 'SYSTEM_DESIGN', 'HARD', ARRAY['search', 'indexing'], NOW()),
  
  (gen_random_uuid(), 'Design an event-driven analytics pipeline for user events. Cover ingestion, processing, and storage choices.', 'SYSTEM_DESIGN', 'HARD', ARRAY['analytics', 'event-driven'], NOW()),
  
  (gen_random_uuid(), 'How would you design a video streaming service? Consider encoding, CDN, and scalability.', 'SYSTEM_DESIGN', 'HARD', ARRAY['media', 'cdn'], NOW()),
  
  (gen_random_uuid(), 'Design a service to recommend content to users in real-time. Discuss feature storage, model serving, and latency constraints.', 'SYSTEM_DESIGN', 'HARD', ARRAY['recommendation', 'ml'], NOW()),
  
  (gen_random_uuid(), 'How would you design a distributed job scheduler for background tasks? Discuss fault tolerance and worker coordination.', 'SYSTEM_DESIGN', 'MEDIUM', ARRAY['scheduler', 'distributed'], NOW()),
  
  (gen_random_uuid(), 'Design a system to store and query time-series metrics at high throughput. Discuss compression and retention.', 'SYSTEM_DESIGN', 'MEDIUM', ARRAY['timeseries', 'storage'], NOW());

-- Verify insertion count
SELECT 
  category,
  difficulty,
  COUNT(*) as count
FROM "Question" 
GROUP BY category, difficulty
ORDER BY category, difficulty;
