import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY is missing from environment variables");

const genAI = new GoogleGenerativeAI(apiKey);

// Model is created once at module level — avoids re-initializing on every call
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    maxOutputTokens: 2048,      // Cap output — biggest speed lever
    temperature: 0.7,
    thinkingConfig: {
      thinkingBudget: 0,        // Disable slow "thinking" mode in Gemini 2.5 Flash
    },
  },
});

// Lean prompt: same structure, ~60% fewer tokens
const buildPrompt = ({ repoName, owner, description, languages, fileStructure }) => `
You are a technical writer. Generate a professional README.md for this GitHub repo.

Repo: ${repoName} by ${owner}
Description: ${description || "Not provided"}
Languages: ${languages || "Not specified"}
File Structure: ${fileStructure || "Not provided"}

Include these sections with emojis, badges (shields.io), and proper Markdown:
1. Title & tagline
2. Badges (stars, forks, issues, license, top language)
3. Description (2–3 paragraphs)
4. Key Features (4–6 bullets)
5. Tech Stack (table)
6. Getting Started (prerequisites, install, env setup, first run)
7. Usage (code examples)
8. Project Structure (tree view)
9. Configuration (env vars)
10. Testing
11. Deployment
12. Contributing
13. License
14. Authors & Acknowledgments
15. Support & Contact

Rules: valid Markdown, syntax-highlighted code blocks, "Back to Top" links, star/fork CTA at the end.
Output only the README content, nothing else.
`.trim();

/**
 * Generates a README using streaming for faster time-to-first-byte.
 * @param {object} repoData
 * @param {function} [onChunk] - Optional callback(chunkText) for streaming output
 * @returns {Promise<string>} Full README text
 */
export const generateReadme = async (repoData, onChunk = null) => {
  const prompt = buildPrompt(repoData);

  // Use streaming — response starts flowing in ~2–5s instead of waiting 90s
  const result = await model.generateContentStream(prompt);

  let fullText = "";

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    fullText += chunkText;

    // If caller wants live chunks (e.g. SSE to frontend), call their handler
    if (onChunk && chunkText) onChunk(chunkText);
  }

  if (!fullText.trim()) {
    throw new Error("Empty response from Gemini. The prompt may need adjustment.");
  }

  return fullText;
};
