import puppeteer from 'puppeteer';
import {promises as fs} from 'fs';
import path from 'path';
import AppError from '../utils/CustomError.js'

class GitHubProfileScraper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    try{
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.page = await this.browser.newPage();

      // Set user agent to avoid detection
      await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
      // Set screenresolution for the headless browser
      await this.page.setViewport({ width: 1366, height: 768 });
    }
    catch (error){
    throw new AppError(500,'Failed to initialize browser', [], null, err.stack)
    }
  }

  async scrapeProfile(profileUrl) {
    try {
      console.log(`Scraping: ${profileUrl}`);
      
      await this.page.goto(profileUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Wait for the profile to load
      await this.page.waitForSelector('.vcard-fullname', { timeout: 10000 });

      const scrapedProfile = await this.page.evaluate(() => {

        const data = {};

        // Basic profile information
        const usernameEl = document.querySelector('.vcard-username');
        data.username = usernameEl ? usernameEl.textContent.trim() : null;

        const displayNameEl = document.querySelector('.vcard-fullname');
        data.displayName = displayNameEl ? displayNameEl.textContent.trim() : null;

        const bioEl = document.querySelector('.user-profile-bio');
        data.bio = bioEl ? bioEl.textContent.trim() : null;

        const locationEl = document.querySelector('.p-label');
        data.location = locationEl ? locationEl.textContent.trim() : null;

        const companyEl = document.querySelector('.p-org');
        data.company = companyEl ? companyEl.textContent.trim() : null;

        const websiteEl = document.querySelector('[data-test-selector="profile-website"] a');
        data.website = websiteEl ? websiteEl.href : null;

        const emailEl = document.querySelector('[data-test-selector="profile-email"] a');
        data.email = emailEl ? emailEl.href.replace('mailto:', '') : null;

        data.profileUrl = window.location.href;

        const avatarEl = document.querySelector('.avatar-user');
        data.avatar = avatarEl ? avatarEl.src : null;

        const followersEl = document.querySelector('a[href*="followers"] .text-bold');
        data.followers = followersEl ? parseInt(followersEl.textContent.trim()) : 0;

        const followingEl = document.querySelector('a[href*="following"] .text-bold');
        data.following = followingEl ? parseInt(followingEl.textContent.trim()) : 0;

        // Repository count
        const repoCountEl = document.querySelector('[data-tab-item="repositories"] .Counter');
        data.publicRepos = repoCountEl ? parseInt(repoCountEl.textContent.trim()) : 0;

        // Contribution count (from the contribution graph)
        const contributionEl = document.querySelector('.js-yearly-contributions h2');
        if (contributionEl) {
          const contributionText = contributionEl.textContent;
          const match = contributionText.match(/(\d+)\s+contributions/);
          data.contributionsThisYear = match ? parseInt(match[1]) : 0;
        } else {
          data.contributionsThisYear = 0;
        }

        // Pinned repositories
       data.pinnedRepos = [];
        const pinnedRepoElements = document.querySelectorAll('.js-pinned-item-list-item');
        pinnedRepoElements.forEach(repo => {
          const nameEl = repo.querySelector('.repo');
          const descEl = repo.querySelector('.pinned-item-desc');
          const languageEl = repo.querySelector('[itemprop="programmingLanguage"]');
          const starsEl = repo.querySelector('a[href*="stargazers"] .text-small');
          const forksEl = repo.querySelector('a[href*="forks"] .text-small');
         
          if (nameEl) {
            data.pinnedRepos.push({
              name: nameEl.textContent.trim(),
              url: nameEl.href,
              description: descEl ? descEl.textContent.trim() : null,
              language: languageEl ? languageEl.textContent.trim() : null,
              stars: starsEl ? parseInt(starsEl.textContent.trim()) || 0 : 0,
              forks: forksEl ? parseInt(forksEl.textContent.trim()) || 0 : 0
            });
          }
        });

        // Organizations
        data.organizations = [];
        const orgElements = document.querySelectorAll('.border-top a[data-hovercard-type="organization"]');
        orgElements.forEach(org => {
          const imgEl = org.querySelector('img');
          if (imgEl) {
            data.organizations.push({
              name: imgEl.alt,
              url: org.href,
              avatar: imgEl.src
            });
          }
        });

        // Account creation date
        const createdDateEl = document.querySelector('relative-time');
        data.createdAt = createdDateEl ? createdDateEl.getAttribute('datetime') : null;

        return data;
      });

      // Add timestamp
      scrapedProfile.scrapedAt = new Date().toISOString();
      
      console.log(`✓ Successfully scraped: ${scrapedProfile.username || 'Unknown user'}`);
      return scrapedProfile;

    } catch (error) {
      console.error(`Error scraping ${profileUrl}:`, error.message);
      return {
        profileUrl,
        error: error.message,
        scrapedAt: new Date().toISOString()
      };
    }
  }

  async scrapeMultipleProfiles(profileUrls) {
    const results = [];
    
    for (let i = 0; i < profileUrls.length; i++) {
      const url = profileUrls[i];
      console.log(`\nProcessing ${i + 1}/${profileUrls.length}: ${url}`);
      
      const scrapedProfile = await this.scrapeProfile(url);
      results.push(scrapedProfile);
      
      // Add delay between requests to avoid rate limiting
       if (i < profileUrls.length - 1) {
        console.log('Waiting 2 seconds before next request...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return results;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Export for use as module
export default GitHubProfileScraper;

