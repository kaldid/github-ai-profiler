
# 🔍 GitHub Profile Scraper & AI Analyzer

This project scrapes multiple GitHub user profiles based on a search term, extracts detailed profile information, and analyzes them using an AI model (Google Gemini or similar). It includes proper error handling, rate limiting, and modular structure.

---

## 📂 Features

- Scrapes GitHub user profiles from search result pages using Puppeteer.
- Extracts detailed information including pinned repositories, contributions, and social links.
- Analyzes data using an AI handler (Gemini).
- Fully modular, error-resilient codebase.
- Usable via Postman or any API client.

---

## 🛠️ Tech Stack

- Node.js
- Puppeteer
- Express 
- AI Integration (Google Gemini via `@google/genai`)
- Custom error handling via `AppError` class

---

## 📦 Project Structure

```
github-scraper/
│
├── services/
│   ├── githubUserScraper.js                # Scrapes basic user list from search
│   ├── GithubUserProfileScraper.js         # Scrapes detailed data from each user profile
│   ├── aiRequestHandler.js                 # Sends user profile data to an AI model
│
├── utils/
│   └── CustomError.js                      # Centralized error class
│
├── controllers/
│   └── githubUserInsightsController.js     # Merges scrapers and AI to deliver result
│
├── routes/
│   └── userRoutes.js                       # Express route handler 
│
├── server.js                               # Entry point if Express server is used
├── .env
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/github-scraper-ai.git
cd github-scraper-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_google_genai_api_key
```

---

## ⚙️ Running the Scraper

If you're using a standalone script (no server):

```bash
node controllers/collectUserInsights.js
```

If you're using an Express API:

```bash
node server.js
```

---

## 📮 Using with Postman

### Step 1: Start the Server

If you’re exposing the scraping through an API:

```bash
npm run dev
# or
node server.js
```

### Step 2: Send a POST Request

**URL:**  
```
GET http://localhost:3000/github-users
```

**Headers:**

| Key         | Value                   |
|-------------|-------------------------|
| searchTerm  | user_you_want_to_search |


### Step 3: Get AI Analysis Output

You’ll receive:

```json
{
  "status": "success",
  "data": [
    {
      "username": "john-doe",
      "profileUrl": "https://github.com/john-doe",
      "displayName": "John Doe",
      ...
      "aiSummary": "This developer is experienced in React, Node.js..."
    },
    ...
  ]
}
```

---

## 🧪 Example Search Terms

- `python developer`
- `data scientist`
- `machine learning engineer`


