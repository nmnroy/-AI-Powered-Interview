import { NextResponse } from "next/server";
import { generateWithFallback } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: "Missing code or language" }, { status: 400 });
    }

    const prompt = `You are a strict, precise code execution engine. 
The user has submitted the following ${language} code for execution.

If the code contains syntax errors or runtime errors, output the exact error message that a standard compiler/interpreter would produce.
If the code is valid, output EXACTLY what the stdout (standard output) would be. 

CRITICAL RULES:
1. ONLY output the stdout or the error message. 
2. DO NOT wrap the output in markdown code blocks (\`\`\`).
3. DO NOT provide any explanation, preamble, or postscript. 
4. DO NOT say "Here is the output". 
5. Just output the raw text as if you are the terminal.
6. If the code requires user input (e.g. input() in Python or cin in C++), assume reasonable default inputs (like 12 and 15) and output the prompts and the final result as if they were typed interactively.

CODE:
${code}`;

    const output = await generateWithFallback(prompt);

    return NextResponse.json({ output: output.trim() || "Program executed successfully.\n(No visible output)" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Execution failed", details: error.message },
      { status: 500 }
    );
  }
}
