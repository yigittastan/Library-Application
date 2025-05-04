// Idefix Web Scraper - Sonsuz Versiyon
// Bu script idefix.com sitesine gider, belirli sınıfa sahip bölümleri bulur,
// bu bölümlerdeki linklerden href değerlerini çıkarır ve output.txt'ye kaydeder
// Sonsuza kadar çalışır ve düzenli olarak scroll atar

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Ana scraper fonksiyonu
async function runScraper() {
  console.log('Idefix web scraper başlatılıyor...');
  
  const browser = await puppeteer.launch({
    headless: false, // Görsel olarak görüntülemek için false
    defaultViewport: null,
    args: ['--start-maximized', '--disable-notifications']
  });
  
  const page = await browser.newPage();
  
  try {
    // Hedef siteye git
    console.log('https://www.idefix.com/kitap-c-3307?isSalable=false adresine gidiliyor...');
    await page.goto('https://www.idefix.com/kitap-c-3307?isSalable=false', {
      waitUntil: 'networkidle2',
      timeout: 90000 // Sayfanın yüklenmesi için daha uzun süre bekle
    });
    
    console.log('Sayfa başarıyla yüklendi');
    
    // Çıktı dosyasını oluştur (varsa üzerine yazma)
    const outputFile = path.join(__dirname, 'output.txt');
    
    // İlerlemeyi takip etmek için değişkenler
    let collectedUrls = new Set();
    
    // Eğer output.txt dosyası önceden varsa, içindeki URL'leri yükle
    if (fs.existsSync(outputFile)) {
      const existingContent = fs.readFileSync(outputFile, 'utf8');
      const existingUrls = existingContent.split('\n').filter(url => url.trim() !== '');
      existingUrls.forEach(url => collectedUrls.add(url));
      console.log(`Mevcut output.txt dosyasından ${existingUrls.length} URL yüklendi.`);
    } else {
      // Dosya yoksa oluştur
      fs.writeFileSync(outputFile, '');
    }
    
    console.log('Sonsuz scraping döngüsü başlatılıyor...');
    
    // Sonsuz scraping döngüsü
    while (true) {
      // Hedef bölümlerdeki tüm href'leri çıkar
      const newUrls = await page.evaluate(() => {
        const urls = new Set();
        
        // Belirtilen sınıfa sahip tüm bölümleri bul
        const sections = document.querySelectorAll('.grid.grid-cols-2.w-full.md\\:grid-cols-3.xl\\:grid-cols-4.md\\:gap-8');
        
        sections.forEach(section => {
          // Bölüm içindeki div'leri bul
          const divs = section.querySelectorAll('div');
          
          divs.forEach(div => {
            // Her div içindeki linkleri bul
            const links = div.querySelectorAll('a');
            
            links.forEach(link => {
              const href = link.getAttribute('href');
              if (href) {
                if (href.startsWith('/')) {
                  // Göreceli URL'leri mutlak URL'lere dönüştür
                  urls.add('https://www.idefix.com' + href);
                } else {
                  urls.add(href);
                }
              }
            });
          });
        });
        
        return Array.from(urls);
      });
      
      // Yeni URL'leri işle
      let newUrlsCount = 0;
      for (const url of newUrls) {
        if (!collectedUrls.has(url)) {
          collectedUrls.add(url);
          // URL'yi çıktı dosyasına ekle
          fs.appendFileSync(outputFile, url + '\n');
          newUrlsCount++;
        }
      }
      
      // Yeni URL'ler hakkında rapor ver
      const timestamp = new Date().toLocaleTimeString();
      if (newUrlsCount > 0) {
        console.log(`[${timestamp}] ${newUrlsCount} yeni URL bulundu. Toplam benzersiz URL: ${collectedUrls.size}`);
      } else {
        console.log(`[${timestamp}] Yeni URL bulunamadı. Toplam benzersiz URL: ${collectedUrls.size}`);
      }
      
      // Sayfayı aşağı kaydır
      console.log(`[${timestamp}] Sayfa kaydırılıyor...`);
      
      // Sayfayı aşağı kaydır (daha yavaş ve düzgün kaydırma)
      await page.evaluate(() => {
        window.scrollBy({
          top: Math.floor(window.innerHeight * 0.8), // Ekran yüksekliğinin %80'i kadar kaydır
          behavior: 'smooth'
        });
      });
      
      // Yeni içeriğin yüklenmesi için bekle
      console.log('Yeni içeriğin yüklenmesi için 10 saniye bekleniyor...');
      await page.waitForTimeout(10000); // 10 saniye bekle
      
      // Sayfanın sonuna gelip gelmediğimizi kontrol et
      const isAtBottom = await page.evaluate(() => {
        return window.innerHeight + window.pageYOffset >= document.body.scrollHeight - 100;
      });
      
      // Eğer sayfanın sonuna geldiysek, başa dön
      if (isAtBottom) {
        console.log('Sayfanın sonuna ulaşıldı! Sayfayı yeniliyorum...');
        
        // Sayfayı yenile
        await page.reload({ waitUntil: 'networkidle2', timeout: 60000 });
        console.log('Sayfa yenilendi, tekrar baştan taranıyor...');
        
        // Sayfanın yüklenmesi için biraz bekle
        await page.waitForTimeout(5000);
      }
    }
  } catch (error) {
    console.error('Veri çekme sırasında bir hata oluştu:', error);
    console.log('Hata sonrası 30 saniye bekleniyor ve script yeniden başlatılacak...');
    
    // Hata olursa bekle ve scripti yeniden başlat
    setTimeout(() => {
      console.log('Script yeniden başlatılıyor...');
      runScraper();
    }, 30000);
  }
}

// Scraper'ı çalıştır
runScraper().catch(err => {
  console.error('Kritik hata:', err);
  console.log('Script yeniden başlatılacak...');
  // Kritik hata durumunda yeniden başlat
  setTimeout(runScraper, 30000);
});