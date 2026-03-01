# 🚀 Intellio

> **Intellio** is a modern, full-stack web application built with React (Vite) on the frontend and Node.js/Express on the backend.  
> It’s designed to deliver a scalable, user-friendly experience — integrating authentication, API interactions, and real-time capabilities.

🔗 **Live Demo:** https://intellio-project.vercel.app/  
📦 **Source Code:** https://github.com/vednav9/Intellio

---

## 🧠 Features

Intellio includes the following core features:

- ✅ **User Authentication & Authorization**
- 📁 Full API backend with Express & Node.js
- 🔐 Secure session and token handling
- 🖼️ File upload and processing
- 📄 PDF or document text extraction
- 🤖 Integration with AI/third-party APIs
- 📊 Responsive UI with React, Zustand, TailwindCSS
- 🛠️ Modular client and server architecture

> ⚙️ *Add your specific features here — e.g., dashboards, analytics, role-based access, etc.*

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, TailwindCSS |
| State Management | Zustand |
| Routing | React Router |
| Backend | Node.js, Express |
| Database | MongoDB (via Mongoose) |
| Auth | JWT & OAuth (Google) |
| File Handling | Multer, AWS S3 |
| AI / Parsing | OpenAI, AWS Textract, PDF/Text utilities |
| Deployment | Vercel (frontend), [Your backend host] |

---

## 🚀 Getting Started

### 🛠 Requirements

- Node.js ≥ 18
- npm or yarn
- MongoDB connection (local or cloud)
- AWS Credentials (if using S3/Textract)
- Google OAuth credentials (optional)

---

## 📁 Project Structure
```
Intellio/
├── client/ # React Frontend
│ ├── public/
│ ├── src/
│ └── package.json
├── server/ # Node.js Backend
│ ├── index.js
│ └── package.json
├── .gitignore
└── README.md
```


---

## 🧪 Installation

### Clone the Repo

```bash
git clone https://github.com/vednav9/Intellio.git
cd Intellio
```

## Setup Backend
```bash
cd server
npm install
```

Create a ```.env``` file with your environment variables, e.g.:
```
DATABASE_URL=
GOOGLE_API_KEY=
PORT=3000

JWT_SECRET=
JWT_EXPIRE=7d

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

CLIENT_URL=

REMOVE_BG_API_KEY=

HUGGING_FACE_API_KEY=
```

Start the backend:
```bash
npm run dev
```
Setup Frontend
```bash
cd ../client
npm install
```

Update any environment variables required in .env (e.g., API base URL).

Start the frontend:
```bash
npm run dev
```
---
#✅ Usage

Once both servers are running:

1. Visit http://localhost:5173/ in the browser

2. Register / sign in

3. Explore Intellio features

4. Upload files, interact with APIs, test flows, etc.
---
# 📣 Contributing

Contributions are welcome!

1. Fork the repo

2. Create a feature branch

3. Commit & push

4. Open a Pull Request
---

Created and maintained by ```vednav9``` — thanks for checking out Intellio!
Feel free to reach out with questions or suggestions.
