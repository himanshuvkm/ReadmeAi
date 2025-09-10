import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const generateReadme = async (repoData) => {
  try {
    const { repoName, owner, description, languages, fileStructure } = repoData;
    const prompt = `
You are an expert open-source documentation writer.  
Generate a **comprehensive, professional, and visually appealing README.md** file for a GitHub repository.  

📌 Repository Metadata:
- Name: ${repoName}
- Owner: ${owner}
- Description: ${description || "No description provided"}
- Primary Languages: ${languages || "Not specified"}
- File Structure: ${fileStructure || "No files found"}

⚡ Requirements:
- ✨ Add relevant emojis throughout for visual appeal
- 🎯 Use a modern, professional tone (engaging + helpful)
- 📋 Include GitHub badges for:
  - Top languages  
  - License  
  - Stars, Forks, Issues  
  - Build status (if relevant)
- 🔧 Infer realistic features & details from languages and file structure
- 💡 Provide practical and actionable examples (not placeholders)

📖 README Structure:
1. **🎯 Project Title & Tagline**  
   - Use repo name as title  
   - Add a compelling tagline  

2. **📋 Badges**  
   - Shields.io badges (functional, clickable)  

3. **📖 Description**  
   - Engaging 2–3 paragraphs  
   - What it does, who it helps  

4. **✨ Key Features**  
   - 4–8 bullets with emojis  

5. **🛠️ Tech Stack**  
   - Organized by Frontend, Backend, Database, Tools  

6. **🚀 Getting Started**  
   - Prerequisites (with versions)  
   - Installation steps  
   - Environment setup  
   - First run instructions  

7. **💻 Usage**  
   - Code examples (syntax highlighting)  
   - API endpoints / CLI usage  
   - Screenshot placeholders  

8. **📁 Project Structure**  
   - Tree view of directories/files  
   - Brief explanation of key parts  

9. **🔧 Configuration**  
   - Env vars & config options  

10. **🧪 Testing**  
    - Commands to run tests  
    - Coverage / frameworks  

11. **🚀 Deployment**  
    - Hosting steps (local + cloud)  
    - CI/CD info (if files exist)  

12. **🤝 Contributing**  
    - Guidelines  
    - PR process  
    - Code of Conduct  

13. **📝 Changelog**  
    - Link to updates  

14. **🆘 Troubleshooting & FAQ**  
    - Common errors & fixes  

15. **📄 License**  
    - License badge + text  

16. **👥 Authors & Acknowledgments**  
    - Owner, contributors, credits  

17. **📞 Support & Contact**  
    - Contact info  
    - Links to docs/discussions  

📌 Guidelines:
- ✅ Consistent emojis per section  
- ✅ Proper Markdown formatting  
- ✅ Add tables for complex info  
- ✅ Add "Back to Top" links for long sections  
 
- ✅ Call-to-action: ⭐ Star / 🍴 Fork / 📬 Issues  

---
Generate the README now using the above details.  
Output should be **valid Markdown**, ready to copy-paste into a GitHub repo.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    if (!text || text.trim().length === 0) {
      throw new Error("Empty response from Gemini. The prompt may need adjustment.");
    }

    return text;
  } catch (error) {
    console.error("Detailed Gemini API Error:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      details: error.details,
    });
    if (error.code === 429) {
      throw new Error("Gemini API rate limit exceeded. Please try again later.");
    }
    throw new Error(`Failed to generate README: ${error.message || "Unknown Gemini API error"}`);
  }
};