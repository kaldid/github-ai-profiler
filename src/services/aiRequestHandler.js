import dotenv from 'dotenv';
dotenv.config()
import { GoogleGenAI } from '@google/genai';
import AppError from './../utils/CustomError.js' 

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeGithubProfiles(userData){
  
  const analyzedUsers = [];
  //const analyzedUsers = await Promise.all(userData.map(async (user) => {
    
  for(const user of userData){
    // Added small delay between request to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000)); 

    // Prompt for Gemiini to summarize the users data and return the important information
    const prompt = `Please analyze the following GitHub profile data and provide a concise summary.
                    Ensure the output is in plain text only, with no Markdown formatting (e.g., no bolding with **, no italics with *, no headers with #, no lists with -, no code blocks with \`\`\` ).

                    For the user whose GitHub profile data is provided below, please extract and summarize the following details:

                    - Skills: List the primary programming languages, frameworks, libraries, and tools they appear proficient in. Prioritize skills evidenced by repository languages, project dependencies, or explicit mentions in their profile description.
                    - Tech Stack: Based on their repositories, contributions, and any profile information, identify the common technologies they use together (e.g., "Node.js, Express, MongoDB, React" for a web developer).
                    - Notable Contributions: Identify 2-3 significant repositories or contributions. Briefly describe why they are notable (e.g., high star count, active development, complex problem solved, open-source project). If specific contributions aren't obvious, focus on the overall quality or impact of their public work.
                    - Overall Profile Summary: Provide a general overview of their professional focus, experience level, and potential areas of expertise based on their GitHub activity.

                    Ensure the entire output is a valid JSON object and contains only the requested data. Do not include any additional text, markdown, or conversational filler outside the JSON. Do not wrap your output in \`\`\` or use any markdown formatting — return only valid JSON

                    GitHub Profile Data: ${JSON.stringify(user, null, 2)}`;
    
    

    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ parts: [{ text: prompt}] }],
        generativeConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        }
      });


      // Remove surrounding ```json ... ``` if present in the AI summarized text
      let aiResponseText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      let cleanedText = aiResponseText.trim();
      if (cleanedText.startsWith("```")) {
        aiResponseText = cleanedText.replace(/^```(?:json)?/, "").replace(/```$/, "").trim();
      }


      let aiAnalysisResult

      try {
        aiAnalysisResult = JSON.parse(aiResponseText)

      } catch(parseError){
        
        console.log(`JSON [parsing failed for user ${user.username}:`, parseError);
        analyzedUsers.push({ ...user, aiAnalysis: null, error: "AI response parsing failed" });
        //throw new AppError(400, `Error Parsing AI response for user ${user.username}: ${parseError.message}`, parseError);
        //console.error("Problematic AI Response Text:", aiResponseText);
        // Fallback or skip if parsing fails
        //return { ...user, aiAnalysis: null, error: "AI response parsing failed" };
      }
      //return { ...user, aiAnalysis: aiAnalysisResult};
    } catch(error){
      console.error(`Ai request for user ${user.username}:`, error);
      analyzedUsers.push({ ...user, aiAnalysis: null, error: "AI request failed" });
      //throw new AppError(500,"Error",error)
      //return {...user, aiAnalysis: null, error: error.message };
    }
  };

  return analyzedUsers;

}

// Data  and command for testing this particular page 
const data =[
  {
    "username": "jcarlosj",
    "displayName": "Developer",
    "bio": "Software Developer | JavaScript: React, Node; PHP: WordPress | SENA | UdeA - MisionTIC 2022 | Alura + ONE",
    "location": "Now in GitHub!",
    "company": "...",
    "website": null,
    "email": null,
    "twitter": null,
    "profileUrl": "https://github.com/jcarlosj",
    "avatar": "https://avatars.githubusercontent.com/u/12736518?s=64&v=4",
    "followers": 63,
    "following": 11,
    "publicRepos": 301,
    "contributionsThisYear": 411,
    "pinnedRepos": [
      {
        "name": "Front-End-JavaScript-Frameworks-Angular-C-HKUST",
        "description": "Full Stack Web and Multiplatform Mobile App Development (Specialization) > Course: Front-End JavaScript Frameworks: Angular (The Hong Kong University of Science and Technology: Jogesh K. Muppala)",
        "language": "TypeScript",
        "stars": 0,
        "forks": 0
      },
      {
        "name": "Full-Stack-Front-End-Bootstrap-4-C-HKUST",
        "description": "Full Stack Web and Multiplatform Mobile App Development (Specialization) > Course: Front-End Web UI Frameworks and Tools: Bootstrap 4 (The Hong Kong University of Science and Technology: Jogesh K. …",
        "language": "HTML",
        "stars": 0,
        "forks": 0
      },
      {
        "name": "React-Gatsby-Hotel-U-JPdTV",
        "description": "Curso de React: Sitio de Hotel usando DatoCMS GraphQL & Gatsby (Udemy: Juan Pablo de la Torre Valdez)",
        "language": "JavaScript",
        "stars": 0,
        "forks": 0
      },
      {
        "name": "React-Gatsby-RealEstate-FrontEnd-U-JPdTV",
        "description": "Curso de React (FrontEnd): Sitio de Bienes Raíces usando Strapi & Gatsby (Udemy: Juan Pablo de la Torre Valdez)",
        "language": "JavaScript",
        "stars": 0,
        "forks": 0
      },
      {
        "name": "React-NextJS-Clone-Product-Hunt-U-JPdTV",
        "description": "Curso React: Clon de \"Product Hunt\" React/Next.js/Firebase (Udemy: Juan Pablo de la Torre Valdez)",
        "language": "JavaScript",
        "stars": 0,
        "forks": 0
      },
      {
        "name": "React-Redux-CRUD-Products-U-JPdTV",
        "description": "Curso React: CRUD productos usando React/Redux (Udemy: Juan Pablo de la Torre Valdez)",
        "language": "JavaScript",
        "stars": 0,
        "forks": 0
      }
    ],
    "organizations": [
      {
        "name": "",
        "url": "https://github.com/jcarlosj?tab=overview&org=BIT-Desarrollo-Web-MEAN-Stack-2024-3",
        "avatar": "https://avatars.githubusercontent.com/u/189414603?s=40&v=4"
      },
      {
        "name": "",
        "url": "https://github.com/jcarlosj?tab=overview&org=BIT-Desarrollo-Web-MEAN-Stack-2025-1",
        "avatar": "https://avatars.githubusercontent.com/u/205223195?s=40&v=4"
      },
      {
        "name": "",
        "url": "https://github.com/jcarlosj?tab=overview&org=BIT-BootCamp-MEAN-1-2024",
        "avatar": "https://avatars.githubusercontent.com/u/162496278?s=40&v=4"
      }
    ],
    "createdAt": null,
    "isPro": false,
    "scrapedAt": "2025-06-03T07:46:06.220Z"
  }
]
// const analyzedInfo = await analyzeGithubProfiles(data)
//console.log(analyzedInfo)

export default analyzeGithubProfiles;
