// scripts/seed-sample-data.ts
/**
 * This script adds sample products to your Firestore database for testing
 * 
 * Usage:
 * 1. Make sure you have created .env.local with your Firebase credentials
 * 2. Run: npx ts-node scripts/seed-sample-data.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleProducts = [
    {
        title: "Samsung Galaxy S24 Ultra 256GB",
        description: "Experience innovation with the Samsung Galaxy S24 Ultra. Featuring a stunning 6.8-inch Dynamic AMOLED display, advanced AI-powered camera system, and lightning-fast performance with Snapdragon 8 Gen 3 processor.",
        images: [
            "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"
        ],
        category_id: "electronics",
        brand: "Samsung",
        specs: {
            display: "6.8-inch Dynamic AMOLED, 120Hz",
            processor: "Snapdragon 8 Gen 3",
            ram: "12GB",
            storage: "256GB",
            camera: "200MP + 50MP + 12MP + 10MP",
            battery: "5000mAh",
        },
        pros: [
            "Exceptional camera quality with 200MP main sensor",
            "S Pen included for productivity",
            "Long battery life with fast charging",
            "Premium build quality with titanium frame"
        ],
        cons: [
            "Premium price point",
            "Large size may not suit everyone",
            "No microSD card slot"
        ],
        seo: {
            meta_title: "Samsung Galaxy S24 Ultra - Best Price in UAE",
            meta_description: "Find the best price for Samsung Galaxy S24 Ultra 256GB in UAE. Compare prices from Amazon.ae, Noon, and more.",
            slug: "samsung-galaxy-s24-ultra-256gb"
        },
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
    },
    {
        title: "Apple MacBook Air M3 13-inch",
        description: "The new MacBook Air with M3 chip delivers incredible performance in an impossibly thin and light design. Perfect for work, creativity, and everything in between.",
        images: [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800"
        ],
        category_id: "electronics",
        brand: "Apple",
        specs: {
            display: "13.6-inch Liquid Retina",
            processor: "Apple M3 chip",
            ram: "8GB",
            storage: "256GB SSD",
            battery: "Up to 18 hours",
            weight: "1.24 kg"
        },
        pros: [
            "Lightweight and portable design",
            "Exceptional battery life",
            "Silent fanless operation",
            "Brilliant Retina display"
        ],
        cons: [
            "Limited ports (2x Thunderbolt)",
            "Base model has only 8GB RAM",
            "Higher price compared to Windows laptops"
        ],
        seo: {
            meta_title: "Apple MacBook Air M3 - Best Price in UAE",
            meta_description: "Compare prices for Apple MacBook Air M3 13-inch across UAE retailers. Get the best deal today!",
            slug: "apple-macbook-air-m3-13inch"
        },
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
    },
    {
        title: "Sony WH-1000XM5 Wireless Headphones",
        description: "Industry-leading noise cancellation with crystal-clear call quality. The WH-1000XM5 offers premium sound and all-day comfort.",
        images: [
            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800"
        ],
        category_id: "electronics",
        brand: "Sony",
        specs: {
            type: "Over-ear Wireless",
            noise_cancellation: "Industry-leading ANC",
            battery: "Up to 30 hours",
            connectivity: "Bluetooth 5.2",
            weight: "250g"
        },
        pros: [
            "Best-in-class noise cancellation",
            "Exceptional sound quality",
            "Long battery life",
            "Comfortable for extended wear"
        ],
        cons: [
            "Expensive compared to competitors",
            "No official IP rating",
            "Case is bulky"
        ],
        seo: {
            meta_title: "Sony WH-1000XM5 - Best Price in UAE",
            meta_description: "Find the lowest price for Sony WH-1000XM5 wireless headphones in UAE. Compare offers from top retailers.",
            slug: "sony-wh-1000xm5-wireless-headphones"
        },
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
    }
];

const samplePrices = [
    // Samsung Galaxy S24 Ultra prices
    [
        {
            marketplace: "Amazon.ae",
            price: 4299.00,
            currency: "AED",
            in_stock: true,
            last_updated: Timestamp.now(),
            affiliate_url: "https://amazon.ae/...",
            discount_percent: 10,
            retry_count: 0,
            next_retry_at: null,
            last_error: null,
            status: "success",
            consecutive_failures: 0
        },
        {
            marketplace: "Noon",
            price: 4199.00,
            currency: "AED",
            in_stock: true,
            last_updated: Timestamp.now(),
            affiliate_url: "https://noon.com/...",
            discount_percent: 13,
            retry_count: 0,
            next_retry_at: null,
            last_error: null,
            status: "success",
            consecutive_failures: 0
        },
        {
            marketplace: "Sharaf DG",
            price: 4499.00,
            currency: "AED",
            in_stock: true,
            last_updated: Timestamp.now(),
            affiliate_url: "https://sharafdg.com/...",
            discount_percent: 6,
            retry_count: 0,
            next_retry_at: null,
            last_error: null,
            status: "success",
            consecutive_failures: 0
        }
    ],
    // MacBook Air M3 prices
    [
        {
            marketplace: "Amazon.ae",
            price: 4799.00,
            currency: "AED",
            in_stock: true,
            last_updated: Timestamp.now(),
            affiliate_url: "https://amazon.ae/...",
            discount_percent: 5,
            retry_count: 0,
            next_retry_at: null,
            last_error: null,
            status: "success",
            consecutive_failures: 0
        },
        {
            marketplace: "Noon",
            price: 4699.00,
            currency: "AED",
            in_stock: true,
            last_updated: Timestamp.now(),
            affiliate_url: "https://noon.com/...",
            discount_percent: 7,
            retry_count: 0,
            next_retry_at: null,
            last_error: null,
            status: "success",
            consecutive_failures: 0
        }
    ],
    // Sony WH-1000XM5 prices
    [
        {
            marketplace: "Amazon.ae",
            price: 1299.00,
            currency: "AED",
            in_stock: true,
            last_updated: Timestamp.now(),
            affiliate_url: "https://amazon.ae/...",
            discount_percent: 15,
            retry_count: 0,
            next_retry_at: null,
            last_error: null,
            status: "success",
            consecutive_failures: 0
        },
        {
            marketplace: "Noon",
            price: 1249.00,
            currency: "AED",
            in_stock: true,
            last_updated: Timestamp.now(),
            affiliate_url: "https://noon.com/...",
            discount_percent: 18,
            retry_count: 0,
            next_retry_at: null,
            last_error: null,
            status: "success",
            consecutive_failures: 0
        }
    ]
];

async function seedData() {
    console.log('🌱 Starting to seed sample data...\n');

    try {
        for (let i = 0; i < sampleProducts.length; i++) {
            const product = sampleProducts[i];
            console.log(`Adding product: ${product.title}`);

            // Add product
            const productRef = await addDoc(collection(db, 'products'), product);
            console.log(`✅ Product added with ID: ${productRef.id}`);

            // Add prices for this product
            const prices = samplePrices[i];
            for (const price of prices) {
                await addDoc(collection(db, 'products', productRef.id, 'prices'), price);
                console.log(`  💰 Added price from ${price.marketplace}: AED ${price.price}`);
            }
            console.log('');
        }

        console.log('✨ Sample data seeded successfully!');
        console.log('\nYou can now view products at:');
        sampleProducts.forEach(p => {
            console.log(`http://localhost:3000/product/${p.seo.slug}`);
        });

    } catch (error) {
        console.error('❌ Error seeding data:', error);
    }
}

seedData();
