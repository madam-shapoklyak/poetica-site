const fs = require('fs');
const path = require('path');

const rootPoems = './СТИХИ';
const imageDir = './images';
const outputFile = './library.json';

function transliterate(text) {
  const map = {
    а:'a', б:'b', в:'v', г:'g', д:'d', е:'e', ё:'e', ж:'zh', з:'z', и:'i', й:'y',
    к:'k', л:'l', м:'m', н:'n', о:'o', п:'p', р:'r', с:'s', т:'t', у:'u', ф:'f',
    х:'h', ц:'ts', ч:'ch', ш:'sh', щ:'sch', ъ:'', ы:'y', ь:'', э:'e', ю:'yu', я:'ya'
  };
  return text.toLowerCase().split('').map(c => map[c] || c).join('');
}

function findCover(bookName) {
  if (!fs.existsSync(imageDir)) return "нет изображения";
  const files = fs.readdirSync(imageDir);
  const normalized = transliterate(bookName).replace(/\s+/g, '');
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const base = path.basename(file, ext).toLowerCase();
    if ((ext === '.jpg' || ext === '.png') && base.includes(normalized)) {
      return `${imageDir}/${file}`;
    }
  }
  return "нет изображения";
}

const library = {};

if (!fs.existsSync(rootPoems)) {
  console.error("❌ Папка СТИХИ не найдена");
  process.exit(1);
}

fs.readdirSync(rootPoems).forEach(book => {
  const bookPath = path.join(rootPoems, book);
  if (fs.statSync(bookPath).isDirectory()) {
    const sections = {};
    fs.readdirSync(bookPath).forEach(section => {
      const sectionPath = path.join(bookPath, section);
      if (fs.statSync(sectionPath).isDirectory()) {
        const docxFile = fs.readdirSync(sectionPath).find(f => f.endsWith('.docx'));
        if (docxFile) {
          sections[section] = sectionPath.replace(/\\/g, '/') + '/' + docxFile;
        }
      }
    });
    library[book] = {
      cover: findCover(book),
      sections
    };
  }
});

fs.writeFileSync(outputFile, JSON.stringify(library, null, 2), 'utf8');
console.log('✅ library.json создан');
