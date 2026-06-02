require('dotenv').config();
const mongoose = require('mongoose');

const products = [
  // cement
  { name: 'מדה מתפלסת 443', price: 60, category: 'cement', stock: 50, description: 'מדה מתפלסת איכותית לריצפות', images: [] },
  { name: 'בטון מוכן 189 מיסטר פיקס', price: 25, category: 'cement', stock: 100, description: 'בטון מוכן לשימוש מיידי', images: [] },
  { name: 'בטון פיקס 185 מיסטר פיקס', price: 21, category: 'cement', stock: 100, description: 'בטון פיקס איכותי', images: [] },
  { name: 'מלט לבן 25 ק"ג', price: 26, category: 'cement', stock: 80, description: 'אסמנט לבן פורטלנד סופר', images: [] },
  { name: 'מלט שחור 25 ק"ג', price: 18, category: 'cement', stock: 80, description: 'אסמנט פורטלנד שחור', images: [] },
  // steel
  { name: 'ברזל 12 מ"מ', price: 85, category: 'steel', stock: 200, description: 'ברזל לבנייה קוטר 12 מ"מ', images: [] },
  { name: 'ברזל 10 מ"מ', price: 65, category: 'steel', stock: 200, description: 'ברזל לבנייה קוטר 10 מ"מ', images: [] },
  { name: 'רשת ברזל 200x100', price: 120, category: 'steel', stock: 50, description: 'רשת ברזל לתשתיות', images: [] },
  // blocks
  { name: 'בלוק בטון 20x40', price: 3, category: 'blocks', stock: 1000, description: 'בלוק בטון סטנדרטי', images: [] },
  { name: 'בלוק בידוד 20x40', price: 5, category: 'blocks', stock: 500, description: 'בלוק בידוד תרמי', images: [] },
  { name: 'לבנה אדומה', price: 2, category: 'blocks', stock: 2000, description: 'לבנה אדומה קלאסית', images: [] },
  // sand
  { name: 'חול בנייה שק 25 ק"ג', price: 12, category: 'sand', stock: 300, description: 'חול בנייה איכותי', images: [] },
  { name: 'חול ים שק 25 ק"ג', price: 10, category: 'sand', stock: 300, description: 'חול ים נקי', images: [] },
  // tools
  { name: 'מגש טיח', price: 35, category: 'tools', stock: 40, description: 'מגש טיח מקצועי', images: [] },
  { name: 'פטיש 500 גרם', price: 45, category: 'tools', stock: 30, description: 'פטיש מקצועי לבנייה', images: [] },
  { name: 'מסור זווית 125 מ"מ', price: 180, category: 'tools', stock: 20, description: 'מסור זווית מקצועי', images: [] },
  // paint
  { name: 'צבע חיצוני לבן 20 ליטר', price: 120, category: 'paint', stock: 60, description: 'צבע חיצוני עמיד', images: [] },
  { name: 'צבע פנים לבן 10 ליטר', price: 75, category: 'paint', stock: 80, description: 'צבע פנים איכותי', images: [] },
  // plumbing
  { name: 'צינור PVC 4 אינץ', price: 28, category: 'plumbing', stock: 100, description: 'צינור PVC לביוב', images: [] },
  { name: 'ברז כדורי 1/2', price: 22, category: 'plumbing', stock: 150, description: 'ברז כדורי לצנרת', images: [] },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const Product = require('./src/features/products/product.model');
    
    // حذف المنتجات القديمة
    await Product.deleteMany({});
    console.log('🗑️ Deleted old products');
    
    // إضافة المنتجات الجديدة
    const created = await Product.insertMany(products.map(p => ({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      stock: p.stock,
      images: p.images,
      isActive: true,
    })));
    
    console.log(`✅ Added ${created.length} products`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seed();