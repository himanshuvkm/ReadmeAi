import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const generateReadme = async (repoData) => {
  try {
    if (!repoData) {
      throw new Error("repoData is required");
    }

    let { repoName, owner, description, languages, fileStructure } = repoData;

    // 🔹 Trim file structure (avoid huge prompts)
    if (Array.isArray(fileStructure)) {
      fileStructure = fileStructure
        .filter(
          (file) =>
            !file.includes("node_modules") &&
            !file.includes("dist") &&
            !file.includes("build")
        )
        .slice(0, 50)
        .join("\n");
    }

    const prompt = `
Generate a professional README.md for the following GitHub repository.

Repository:
Name: ${repoName}
Owner: ${owner}
Description: ${description || "No description provided"}
Languages: ${languages || "Not specified"}

File Structure:
${fileStructure || "Not provided"}

Requirements:
- Modern professional README
- Use emojis for sections
- Include badges (stars, forks, issues, license)
- Provide real examples
- Use proper Markdown formatting

Sections to include:
1. Project Title & Tagline
2. Badges
3. Description
4. Features
5. Tech Stack
6. Getting Started
7. Usage
8. Project Structure
9. Contributing
10. License
11. Support

Return valid Markdown only.
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 1200,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    // 🚀 Streaming response (much faster)
    const result = await model.generateContentStream(prompt);

    let output = "";

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) output += text;
    }

    if (!output.trim()) {
      throw new Error("Empty response from Gemini");
    }

    return output;
  } catch (err) {
    throw new Error(`Gemini generation failed: ${err.message}`);
  }
};