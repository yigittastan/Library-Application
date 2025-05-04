const fs = require('fs');
const path = require('path');

/**
 * Klasör yapısını tarar ve hiyerarşik bir şekilde listeler
 * @param {string} directoryPath - Taranacak ana klasör yolu
 * @param {string} outputFile - Çıktı dosyasının yolu
 * @param {boolean} updateReadme - README.md dosyasını güncelle
 */
function scanDirectory(directoryPath, outputFile, updateReadme = true) {
  try {
    // .gitignore dosyasını kontrol et ve içeriğini analiz et
    const ignoredPaths = getIgnoredPaths(directoryPath);
    
    // Ana klasör adını al
    const rootDirName = path.basename(directoryPath);
    
    // Çıktı içeriğini oluştur
    let output = `${rootDirName}/\n`;
    
    // Klasör içeriğini rekursif olarak tara
    scanDirectoryRecursive(directoryPath, output, 0, ignoredPaths, (finalOutput) => {
      // Sonucu dosyaya yaz
      fs.writeFileSync(outputFile, finalOutput, 'utf8');
      console.log(`Klasör yapısı başarıyla ${outputFile} dosyasına kaydedildi.`);
      
      // README.md dosyasını güncelle
      if (updateReadme) {
        updateReadmeFile(directoryPath, finalOutput);
      }
    });
  } catch (error) {
    console.error('Hata:', error.message);
  }
}

/**
 * .gitignore dosyasını okur ve yok sayılacak klasörleri belirler
 * @param {string} directoryPath - Ana klasör yolu
 * @returns {Set} - Yok sayılacak klasör yollarının kümesi
 */
function getIgnoredPaths(directoryPath) {
  const ignoredPaths = new Set();
  const gitignorePath = path.join(directoryPath, '.gitignore');
  
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    const lines = gitignoreContent.split('\n');
    
    lines.forEach(line => {
      // Yorum satırlarını ve boş satırları atla
      if (line && !line.startsWith('#')) {
        // Önce başında ve sonunda boşlukları temizle
        const trimmedLine = line.trim();
        // Sondaki eğik çizgileri temizle
        const pattern = trimmedLine.endsWith('/') 
          ? trimmedLine.slice(0, -1) 
          : trimmedLine;
          
        if (pattern) {
          ignoredPaths.add(pattern);
        }
      }
    });
  }
  
  return ignoredPaths;
}

/**
 * Klasör yapısını rekursif olarak tarar
 * @param {string} currentPath - Şu anki klasör yolu
 * @param {string} output - Biriktirilen çıktı
 * @param {number} depth - Hiyerarşi derinliği
 * @param {Set} ignoredPaths - Yok sayılacak klasör yolları
 * @param {Function} callback - İşlem tamamlandığında çağrılacak fonksiyon
 */
function scanDirectoryRecursive(currentPath, output, depth, ignoredPaths, callback) {
  const items = fs.readdirSync(currentPath);
  let updatedOutput = output;
  let processedItems = 0;
  
  // Önce dosyaları sırala: Önce klasörler, sonra dosyalar
  const sortedItems = items.sort((a, b) => {
    const aIsDir = fs.statSync(path.join(currentPath, a)).isDirectory();
    const bIsDir = fs.statSync(path.join(currentPath, b)).isDirectory();
    
    if (aIsDir && !bIsDir) return -1;
    if (!aIsDir && bIsDir) return 1;
    return a.localeCompare(b);
  });
  
  for (const item of sortedItems) {
    // Gizli dosyaları atla (.git, .DS_Store gibi)
    if (item.startsWith('.') && item !== '.gitignore' && item !== '.env') {
      processedItems++;
      continue;
    }
    
    const itemPath = path.join(currentPath, item);
    const relativePath = path.relative(currentPath, itemPath);
    const isDirectory = fs.statSync(itemPath).isDirectory();
    
    // Bu öğenin .gitignore'da olup olmadığını kontrol et
    const shouldIgnoreContent = Array.from(ignoredPaths).some(pattern => {
      return item === pattern || relativePath === pattern;
    });
    
    // Klasör adını ve uygun girintileri ekle
    const indent = '│   '.repeat(depth);
    
    if (isDirectory) {
      // Klasör ise
      if (processedItems < sortedItems.length - 1) {
        updatedOutput += `${indent}├── ${item}/`;
      } else {
        updatedOutput += `${indent}└── ${item}/`;
      }
      
      // .gitignore'da olan klasörlerin içeriğini tarama
      if (shouldIgnoreContent) {
        updatedOutput += `                  # İçerik .gitignore'da belirtildiği için taranmadı\n`;
        processedItems++;
      } else {
        // Alt öğeleri recursive olarak tara
        updatedOutput += '\n';
        const childItems = fs.readdirSync(itemPath);
        
        if (childItems.length === 0) {
          // Boş klasör durumu
          const nextIndent = '│   '.repeat(depth + 1);
          updatedOutput += `${nextIndent}(boş klasör)\n`;
        } else {
          scanDirectoryRecursive(itemPath, updatedOutput, depth + 1, ignoredPaths, (newOutput) => {
            updatedOutput = newOutput;
          });
        }
        processedItems++;
      }
    } else {
      // Dosya ise
      if (processedItems < sortedItems.length - 1) {
        updatedOutput += `${indent}├── ${item}`;
      } else {
        updatedOutput += `${indent}└── ${item}`;
      }
      
      // Özel dosyalar için açıklama ekle
      if (item === '.env') {
        updatedOutput += `                         # Ortam (env) değişkenleri`;
      } else if (item === 'package.json') {
        updatedOutput += `                         # Bağımlılıklar ve scriptler`;
      } else if (item === 'package-lock.json') {
        updatedOutput += `                         # Paket kilit dosyası`;
      } else if (item === 'index.js') {
        updatedOutput += `                         # Uygulamanın başlangıç noktası`;
      } else if (item === 'readme.md') {
        updatedOutput += `                         # Proje açıklamaları ve kullanım talimatları`;
      } else if (item.endsWith('.js') && itemPath.includes('config')) {
        updatedOutput += `                         # Konfigürasyon dosyası`;
      } else if (item.endsWith('.js') && itemPath.includes('controllers')) {
        updatedOutput += `                         # Controller dosyası`;
      } else if (item.endsWith('.js') && itemPath.includes('middleware')) {
        updatedOutput += `                         # Middleware dosyası`;
      } else if (item.endsWith('.js') && itemPath.includes('models')) {
        updatedOutput += `                         # Model dosyası`;
      } else if (item.endsWith('.js') && itemPath.includes('routes')) {
        updatedOutput += `                         # Route dosyası`;
      }
      
      updatedOutput += '\n';
      processedItems++;
    }
  }
  
  callback(updatedOutput);
}

/**
 * README.md dosyasını günceller veya oluşturur
 * @param {string} directoryPath - Proje klasörü yolu
 * @param {string} directoryStructure - Eklenecek klasör yapısı
 */
function updateReadmeFile(directoryPath, directoryStructure) {
  const readmePath = path.join(directoryPath, 'readme.md');
  const readmePathAlt = path.join(directoryPath, 'README.md'); // Büyük harflerle alternatif
  
  let readmeContent = '';
  let readmeExists = false;
  let actualReadmePath = readmePath;
  
  // README.md dosyasının varlığını kontrol et (büyük/küçük harf duyarlı olabilir)
  if (fs.existsSync(readmePath)) {
    readmeContent = fs.readFileSync(readmePath, 'utf8');
    readmeExists = true;
  } else if (fs.existsSync(readmePathAlt)) {
    readmeContent = fs.readFileSync(readmePathAlt, 'utf8');
    readmeExists = true;
    actualReadmePath = readmePathAlt;
  }
  
  // Eklenecek içeriği hazırla
  const currentDate = new Date().toLocaleDateString('tr-TR');
  const projectName = path.basename(directoryPath);
  
  const directorySection = `
## Proje Yapısı (${currentDate} tarihinde otomatik oluşturuldu)

\`\`\`
${directoryStructure}
\`\`\`
`;

  if (readmeExists) {
    // README.md var, içeriğin sonuna ekle
    if (readmeContent.includes('## Proje Yapısı')) {
      // Eğer "Proje Yapısı" bölümü zaten varsa, bu bölümü güncelle
      const regex = /(## Proje Yapısı[^\n]*\n\n```[\s\S]*?```)/;
      if (regex.test(readmeContent)) {
        readmeContent = readmeContent.replace(regex, directorySection);
      } else {
        // Başlık var ama format farklı, bu durumda sona ekle
        readmeContent += '\n' + directorySection;
      }
    } else {
      // "Proje Yapısı" bölümü yoksa, dosyanın sonuna ekle
      readmeContent += '\n' + directorySection;
    }
  } else {
    // README.md yok, yeni oluştur
    readmeContent = `# ${projectName}

Bu projenin otomatik oluşturulmuş README dosyasıdır.

${directorySection}
`;
  }
  
  // README.md dosyasını yaz
  fs.writeFileSync(actualReadmePath, readmeContent, 'utf8');
  console.log(`README.md dosyası ${readmeExists ? 'güncellendi' : 'oluşturuldu'}.`);
}

// Komut satırından argümanları al
const args = process.argv.slice(2);

if (args.length < 1) {
  console.log('Kullanım: node directory-scanner.js <klasör-yolu> [çıktı-dosyası] [readme-güncelle]');
  console.log('Örnek: node directory-scanner.js ./API ./klasor-yapisi.txt true');
  process.exit(1);
}

const directoryPath = args[0];
const outputFile = args[1] || 'klasor-yapisi.txt';
const updateReadme = args[2] === undefined ? true : args[2].toLowerCase() === 'true';

// Girilen klasör yolunun geçerli olup olmadığını kontrol et
if (!fs.existsSync(directoryPath)) {
  console.error(`Hata: "${directoryPath}" klasörü bulunamadı.`);
  process.exit(1);
}

// Klasör taramasını başlat
scanDirectory(directoryPath, outputFile, updateReadme);