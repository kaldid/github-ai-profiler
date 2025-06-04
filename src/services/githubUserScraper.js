import puppeteer from 'puppeteer';
import fs from 'fs';
import AppError from '../utils/CustomError.js'

// Function to scrape multiple Github search pages
async function scrapeMultiplePages(maxPages = 3, searchTerm ='javascript developer'){

  // Launch a headless browser instance
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let allUsers = []; // This array will collect all the users who were scrapped. 

  try {
    const page = await browser.newPage();

    // Set a realistic useragent to avoid detectiona/bot-blocking
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    // Loop through all the pages specified
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      console.log(`\nScraping page ${pageNum}...`);
       
      // Url that would be used to search for the users on github 
      const encodedSearch = encodeURIComponent(searchTerm);
      const url = `https://github.com/search?q=${encodedSearch}&type=users&p=${pageNum}`;
      //const url = `https://github.com/search?q=javascript+developer&type=users&p=${pageNum}`;

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      try {
        // Wait for the results to load on the page 
        await page.waitForSelector('[data-testid="results-list"]', { timeout: 10000 });
        
        const usersOnPage = await page.evaluate(() => {
          const userElements = document.querySelectorAll('[data-testid="results-list"] .search-title');
          const users = [];

          userElements.forEach((element) => {
            try {

              // Extract username and profile 
              const userLink = element.querySelector('a');
              const username = userLink ? userLink.textContent.trim() : null;
              const profileUrl = userLink ? userLink.href : null;
            
              // Push the extracted user info 
              if (username && profileUrl) {
                users.push({
                  username: username,
                  profileUrl: profileUrl,
                });
              }
            } catch (error) {
              throw new AppError(400, 'Error extracting user data', error);
            }
          });

          return users;
        });

        // Add users from this page to the global list 
        allUsers.push(...usersOnPage);
        console.log(`Found ${usersOnPage.length} users on page ${pageNum}`);

      } catch (innerError) {
        throw new AppError(500, `Failed to scape GitHub on page ${pageNum}:`, innerError)
      }
    }

    console.log(`\nTotal users scraped: ${allUsers.length}`);
    
    if (allUsers.length === 0) {
      throw new AppError(404, `No GitHub users found for search term "${searchTerm}"`);
    }

    return allUsers;

  } catch (outerError) {
    throw new AppError(500, 'Unexpected error during Github user Scraping', outerError)
  
  } finally {
    // Ensure browser is always closed to avoid memory leaks
    await browser.close();
  }
}

export default scrapeMultiplePages;
