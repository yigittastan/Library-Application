const fs = require('fs');
const readline = require('readline');
const puppeteer = require('puppeteer');

async function readUrlsFromFile(filename) {
    const fileStream = fs.createReadStream(filename);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    const urls = [];
    for await (const line of rl) {
        if (line.trim()) urls.push(line.trim());
    }
    return urls;
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 300);
        });
    });
}

async function scrapeUrls() {
    const urls = await readUrlsFromFile('href_list.txt');
    const browser = await puppeteer.launch({ headless: false }); // Gerekirse true yapabilirsiniz
    const page = await browser.newPage();
    
    for (const url of urls) {
        console.log(`Ziyaret ediliyor: ${url}`);
        try {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
            
            // Catalog alanını bul
            const catalogExists = await page.evaluate(() => {
                return !!document.querySelector('[id*="catalog337"]');
            });
            
            if (!catalogExists) {
                console.log(`Catalog öğesi bulunamadı: ${url}`);
                continue;
            }
            
            // Scroll işlemi ve href toplama
            const collectedHrefs = new Set();
            let previousHeight = 0;
            let scrollTries = 0;
            
            while (scrollTries < 5) {
                // Scroll before collecting links
                await autoScroll(page);
                await page.waitForTimeout(1000);
                
                const newHrefs = await page.evaluate(() => {
                    const catalog = document.querySelector('[id*="catalog"]');
                    const anchors = catalog ? catalog.querySelectorAll('a') : [];
                    return Array.from(anchors).map(a => a.href).filter(h => h);
                });
                
                const prevSize = collectedHrefs.size;
                newHrefs.forEach(href => collectedHrefs.add(href));
                
                // Log the newly found links
                console.log(`Bu iterasyonda ${newHrefs.length} link bulundu. Toplam: ${collectedHrefs.size}`);
                if (newHrefs.length > 0) {
                    console.log("Bulunan linklerden bazıları:", newHrefs.slice(0, 3));
                }
                
                const currentHeight = await page.evaluate(() => document.body.scrollHeight);
                if (currentHeight === previousHeight) {
                    scrollTries++;
                    console.log(`Scroll denemesi ${scrollTries}/5. Yeni link bulunamadı.`);
                } else {
                    scrollTries = 0;
                    previousHeight = currentHeight;
                }
            }
            
            // Href'leri dosyaya yaz
            const hostname = new URL(url).hostname;
            const outFile = `href_output_${hostname}.txt`;
            fs.writeFileSync(outFile, [...collectedHrefs].join('\n'), 'utf-8');
            console.log(`${outFile} dosyasına ${collectedHrefs.size} link yazıldı.`);
        } catch (error) {
            console.error(`Hata oluştu (${url}):`, error.message);
        }
    }
    
    await browser.close();
}

scrapeUrls();