
# 🚀 ReadmeAi 🎯

**Generate a useful first draft of your project documentation from a GitHub repository.**

<p align="center">
  <img src="https://img.shields.io/github/languages/top/himanshuvkm/ReadmeAi?style=for-the-badge" alt="Top Languages" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/himanshuvkm/ReadmeAi?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/himanshuvkm/ReadmeAi?style=for-the-badge" alt="Stars" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/forks/himanshuvkm/ReadmeAi?style=for-the-badge" alt="Forks" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/issues/himanshuvkm/ReadmeAi?style=for-the-badge" alt="Issues" />
</p>


---

## 📖 Overview

ReadmeAi simplifies README creation by providing an intuitive interface combined with powerful automation. Authenticate using your GitHub account, select your repository, and generate a comprehensive README in minutes using Gemini's advanced markdown processing. Ideal for developers and teams who want consistent, professional documentation without the hassle.

---

## ✨ Key Features

- 📄 **Automated README Generation** — Generate structured, polished READMEs in a few clicks.
- 🔐 **GitHub OAuth Integration** — Secure login and access via GitHub authentication.
- 💎 **Gemini README Generation** — Drafts documentation from repository metadata and its file tree.
- 🎨 **Customizable Templates** — Easily tailor the README layout to match your project style.
- 🗂️ **Organized Output** — Includes features, installation, usage, and contribution sections by default.
- 🤝 **Team Collaboration** — Share and collaboratively build documentation with your team.

---

## 🧱 Tech Stack

| Layer               | Technology                  |
|---------------------|-----------------------------|
| **Frontend**        | React, Vite, JavaScript, HTML, CSS |
| **Backend**         | Node.js, Express.js          |
| **Authentication** | GitHub OAuth                 |
| **Markdown Engine** | Gemini                        |
| **Utilities**       | ESLint, Git                   |

---

## ⚡ Quick Start Guide

### ✅ Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### 🚧 Installation

```bash
# Clone repository
git clone https://github.com/himanshuvkm/ReadmeAi.git

# Frontend setup
cd ReadmeAi/frontend
npm install

# Backend setup
cd ../server
npm install
```

### ⚙️ Configuration

Configure the backend and frontend environment variables for your Firebase and GitHub OAuth setup. The backend also needs `GEMINI_API_KEY`. Optionally set `GEMINI_MODEL` to override the default `gemini-3.8-flash` model.

### ▶️ Run Locally

```bash
# Start backend
cd server
npm start

# Start frontend dev server
cd ../frontend
npm run dev
```

---

## 🚀 Usage

1. Log in using GitHub OAuth.
2. Select your repository.
3. Fill in project-specific details (features, usage, etc.).
4. Preview and download the generated README.

### Example API Usage

```javascript
fetch('/api/repos/:repoId')
  .then(res => res.json())
  .then(data => {
    console.log('Repo data:', data);
  })
  .catch(err => console.error('Error:', err));
```

---

## 🗂️ Project Structure

```plaintext
ReadmeAi/
├── frontend/          # Frontend code (React, Vite)
│   ├── public/
│   └── src/
├── server/            # Backend API
│   ├── Config/
│   ├── Controller/
│   ├── Routes/
│   └── ...
```

---

## 🧱 Environment Variables

| Variable              | Purpose                          |
|-----------------------|----------------------------------|
| GITHUB_CLIENT_ID      | OAuth App Client ID             |
| GITHUB_CLIENT_SECRET  | OAuth App Secret               |
| GEMINI_API_KEY        | Gemini API key for README generation |
| GEMINI_MODEL          | Optional Gemini model override (defaults to `gemini-3.8-flash`) |
| PORT                  | Server and Frontend Port        |

---

## ✅ Testing

Unit and integration testing is under development. Contributions are welcome.

---

## 🚢 Deployment

[Deployment link is added .  


---](https://readmegen-pz8j.vercel.app/)

## 🤝 Contributing

Contributions are welcome!  
Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.  
A clear template for issues and PRs will be provided there.

---

## 📝 Changelog

📋 A changelog will be maintained in [CHANGELOG.md](CHANGELOG.md).

---

## ❓ FAQ & Troubleshooting

This section will be added soon.  
For urgent issues, open a GitHub Issue.

---

## 📄 License

Licensed under the [MIT License](LICENSE).

---

## 👤 Author & Acknowledgments

**Himanshu VKM** – Creator & Maintainer  
Special thanks to contributors and the open-source community.

---

## 📞 Contact

For questions or support, open an issue or reach out:  
✉️ [himanshuvkm](https://github.com/himanshuvkm)

---

⭐ If you found this tool helpful, please star the project!  
🍴 Fork it to contribute.  
🛠️ Open an issue for questions or feature requests.

[Back to Top](#-readmeai-🎯)
