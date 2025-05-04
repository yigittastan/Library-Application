// Idefix Product Detail Scraper for Node.js
// This script reads URLs from output.txt, visits each page and extracts product information

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// Function to read URLs from file
function readUrlsFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n')
      .map(url => url.trim())
      .filter(url => url !== '');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

// Function to save JSON data to a file
function saveToFile(data, filename) {
  const filePath = path.join(process.cwd(), filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Data saved to ${filePath}`);
}

// Function to extract product information from a page
async function extractProductInfo(url) {
  console.log(`Extracting data from: ${url}`);
  
  try {
    // Add domain if not present
    if (!url.startsWith('https://www.idefix.com/')) {
      url = 'https://www.idefix.com/' + url.replace(/^\//, '');
    }
    
    // Fetch the product page HTML
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // Load HTML content into cheerio
    const $ = cheerio.load(response.data);
    
    // Get product image
    let imgSrc = '';
    $('img').each((i, elem) => {
      const src = $(elem).attr('src');
      if (src && src.includes('product')) {
        imgSrc = src;
        return false; // Break the loop
      }
    });
    
    // Get product name
    let productName = '';
    const h1 = $('h1.text-\\[1\\.375rem\\].leading-\\[1\\.875rem\\].font-semibold');
    if (h1.length) {
      productName = h1.text().trim();
    }
    
    // Get author name
    let author = '';
    const authorSpan = $('a span');
    if (authorSpan.length) {
      author = authorSpan.first().text().trim();
    }
    
    // Get product options/details
    const options = {};
    const optionsDiv = $('div.hidden.lg\\:grid.grid-cols-4.gap-9');
    
    if (optionsDiv.length) {
      let optionCounter = 1;
      optionsDiv.find('div').each((i, div) => {
        const spans = $(div).find('span');
        if (spans.length >= 2) {
          const optionName = `option${optionCounter}`;
          options[optionName] = {};
          
          // Process pairs of spans to create key-value pairs
          for (let i = 0; i < spans.length; i += 2) {
            if (i + 1 < spans.length) {
              const key = $(spans[i]).text().trim();
              const value = $(spans[i + 1]).text().trim();
              options[optionName][key] = value;
            }
          }
          
          optionCounter++;
        }
      });
    }
    
    // Return the product information
    return {
      url: url,
      img: imgSrc,
      name: productName,
      yazar: author,
      ...options
    };
    
  } catch (error) {
    console.error(`Error extracting data from ${url}:`, error);
    return {
      error: `Failed to extract data: ${error.message}`,
      url: url
    };
  }
}

// Main function
async function main() {
  try {
    // Path to the file containing URLs
    const filePath = path.join(process.cwd(), 'output.txt');
    console.log(`Reading URLs from ${filePath}`);
    
    // Read URLs from file
    const urls = readUrlsFromFile(filePath);
    console.log(`Found ${urls.length} URLs to process`);
    
    if (urls.length === 0) {
      console.log('No URLs found in the file. Make sure output.txt contains valid URLs.');
      return;
    }
    
    // Process each URL and collect product data
    const allProducts = [];
    
    for (let i = 0; i < urls.length; i++) {
      let url = urls[i];
      console.log(`Processing URL ${i+1}/${urls.length}: ${url}`);
      
      // Extract product info
      const productInfo = await extractProductInfo(url);
      allProducts.push(productInfo);
      
      // Progress update
      console.log(`Processed ${i+1}/${urls.length} URLs`);
      
      // Save intermediate results every 10 products or at the end
      if ((i + 1) % 10 === 0 || i === urls.length - 1) {
        saveToFile(allProducts, `idefix_products_${i+1}.json`);
        console.log(`Saved progress to idefix_products_${i+1}.json`);
      }
      
      // Wait a bit to avoid overloading the server
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Save the final results
    saveToFile(allProducts, 'idefix_products_all.json');
    console.log('All product information has been saved to idefix_products_all.json');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
console.log('Idefix Product Detail Scraper starting...');
main().catch(error => console.error('Fatal error:', error));