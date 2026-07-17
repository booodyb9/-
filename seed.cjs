const { initializeApp } = require('firebase/app');
const { getFirestore, collection, setDoc, doc } = require('firebase/firestore');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const defaultProjects = [
  {
    id: 'proj-1',
    title: 'قواطع زجاجية لمكاتب شركة',
    category: 'قواطع داخلية',
    image: '/images/gallery-1.jpg',
    description: 'تنفيذ وتركيب قواطع زجاجية سيكوريت 12 ملم لمكاتب إدارية، توفر بيئة عمل عصرية وعزلاً صوتياً ممتازاً.',
    className: 'md:col-span-2 md:row-span-2',
    order: 1
  },
  {
    id: 'proj-2',
    title: 'كابينة شاور زاوية مفصلية',
    category: 'كبائن شاور',
    image: '/images/gallery-2.jpg',
    description: 'تصميم وتركيب كابينة استحمام زاوية بزجاج سيكوريت عالي السماكة مع إكسسوارات ستانلس ستيل مقاومة للصدأ.',
    className: 'md:col-span-1 md:row-span-1',
    order: 2
  },
  {
    id: 'proj-3',
    title: 'واجهة زجاجية لمعرض تجاري',
    category: 'واجهات معارض',
    image: '/images/gallery-3.jpg',
    description: 'تركيب واجهة زجاجية استركشر لمعرض، تتيح أقصى رؤية للمنتجات مع توفير الحماية المطلوبة.',
    className: 'md:col-span-1 md:row-span-1',
    order: 3
  },
  {
    id: 'proj-4',
    title: 'درابزين زجاجي لسلم داخلي',
    category: 'درابزين زجاج',
    image: '/images/gallery-4.jpg',
    description: 'تركيب درابزين زجاجي أنيق للسلالم بلمسات عصرية تزيد من فخامة واتساع المكان.',
    className: 'md:col-span-1 md:row-span-2',
    order: 4
  },
  {
    id: 'proj-5',
    title: 'مرآة ليد (LED) ذكية مضيئة',
    category: 'مرايا ديكور',
    image: '/images/gallery-5.jpg',
    description: 'تفصيل مرآة حمام ذكية مع إضاءة ليد (LED) مدمجة بتصميم هندسي راقي.',
    className: 'md:col-span-1 md:row-span-1',
    order: 5
  },
  {
    id: 'proj-6',
    title: 'باب زجاجي سحاب للحديقة',
    category: 'أبواب ونوافذ',
    image: '/images/gallery-6.jpg',
    description: 'تركيب أبواب زجاجية سحابة تطل على الحديقة الخارجية، تمتاز بسهولة الحركة والعزل الحراري.',
    className: 'md:col-span-1 md:row-span-1',
    order: 6
  }
];

async function run() {
  console.log('Seeding data...');
  for (const proj of defaultProjects) {
    const { id, ...data } = proj;
    await setDoc(doc(db, 'projects', id), data);
    console.log(`Added ${id}`);
  }
  console.log('Done!');
  process.exit(0);
}

run().catch(console.error);
