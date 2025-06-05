# GitHub AI Explorer

### Project Flow 

#### Initialize the project
1. Initialize the project using npm, project.JSON
2. Write the basic code of server.js and app.js 

#### Scrape the Github Search Pages
1. Use Puppeteer package for data extraction 
2. Pagination handling for 2-3 result pages 

#### Scrape individual pages 
1. Use the same package as above 
2. Extract the following data 
  1. Pinned repos 
  2. Contribution calender
  3. Follower count 
  4. Tech mentions 

#### AI Integration 
1. Send the data to the OpenAI 
2. Use the above extracted data to generate the summary 

#### Build REST API 
1. Set a GET endpoint 
2. Return structured JSON 

#### Refactor, Cache and Optimize 
1. Add node-cache to avoid repeated scraping 
2. Add error handling code in utils 
3. Apply API rate limiting 
4. Handle the Github rate limit

#### Test and Document 
1. Add Swagger/OpenAI docs and a README with endpoint details 

#### Deployment 
- Deploy using docker 
- Push code to github

### Project Requirements

#### Overview 
Create a backend service that scrapes GitHub user search results and processes the data using an AI API (e.g., OpenAI, Gemini) to extract and summarize relevant developer insights;

#### Objective
Build a backend service that performs the following tasks:
- Scrape GitHub user profiles from search result pages;
  Example URL: https://github.com/search?q=javascript+developer&type=users;
- Extract core details from each user in the listing:
  - GitHub username;
  - Display name;
  - Bio;
  - Location;
  - Profile URL;
- Fetch individual profile pages for each user and gather additional context (e.g.,pinned repositories, contribution count)
- Send extracted data to an AI model (like OpenAI or Gemini) and get a structured summary with insights such as:
  - Primary skills;
  - Tech stack;
  - Notable contributions;
- Expose a REST API that returns the enriched data in a structured JSON format;

#### Functional Requirements
- API endpoint (GET or POST) to trigger the scraping process;
- Scrape at least 2–3 pages of results (~20+ profiles);
- Send each bio and context to an LLM (OpenAI/Gemini) for summarization;
- Return structured summaries per user via a REST API;
- Store raw + AI-processed data (in-memory, JSON file, or database);

#### AI Integration 
- Use Public LLM to summarize the profile of the scrapped user
- Handle the rate limits, errors and retries 

#### Submission Guidlines
- Upload on Gtihub 
- Provide the sample Postman request to test the APi 
- Add readme with: 
  - Setup instructions 
  - Tech stack used 
  - Assumptions 
  - Instructions for running locally and hitting the endpoints 

#### Bonus Points 
- Dockerize the code and database for seamless local development and deployment;
- Add Swagger/OpenAPI documentation for your endpoints;
- Add support for scraping based on dynamic keywords via query params;
- Save all requests/responses (with timestamps) for debugging or logging

#### Evaluation Criteria
- Code structure: Modular, clean, and scalable;
- API design: RESTful and well-documented;
- Scraping logic: Reliable, handles pagination and edge cases;
- LLM usage: Smart prompting and error handling;
- Use of logging: Properly implemented for both success and error cases;
- Deployment readiness: Docker setup and .env usage;
- Documentation: Clear README, inline comments, and API docs;


