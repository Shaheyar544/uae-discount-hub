/**
 * Seed default categories for UAE Discount Hub
 * 
 * Run with: npx ts-node scripts/seed-categories.ts
 */

// Import Firebase Admin SDK for server-side operations
import * as admin from 'firebase-admin';

// Initialize Firebase Admin (if not already initialized)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    });
}

const db = admin.firestore();

interface CategoryData {
    name: string;
    slug: string;
    icon: string;
    description: string;
    featured: boolean;
    order: number;
    product_count: number;
    created_at: admin.firestore.Timestamp;
    updated_at: admin.firestore.Timestamp;
}

const defaultCategories = [
    {
        name: 'Smartphones',
        slug: 'smartphones',
        icon: '📱',
        description: 'Latest mobile phones, accessories, and smartphone deals from top brands',
        featured: true,
        order: 1
    },
    {
        name: 'Laptops',
        slug: 'laptops',
        icon: '💻',
        description: 'Notebooks, ultrabooks, gaming laptops, and portable computers',
        featured: true,
        order: 2
    },
    {
        name: 'Audio & Headphones',
        slug: 'audio-headphones',
        icon: '🎧',
        description: 'Headphones, earbuds, speakers, and premium audio equipment',
        featured: true,
        order: 3
    },
    {
        name: 'Cameras & Photography',
        slug: 'cameras-photography',
        icon: '📷',
        description: 'Digital cameras, DSLRs, mirrorless cameras, and photography gear',
        featured: true,
        order: 4
    },
    {
        name: 'Smartwatches & Wearables',
        slug: 'smartwatches-wearables',
        icon: '⌚',
        description: 'Smart watches, fitness trackers, and wearable technology',
        featured: false,
        order: 5
    },
    {
        name: 'Gaming',
        slug: 'gaming',
        icon: '🎮',
        description: 'Gaming consoles, accessories, controllers, and gaming gear',
        featured: true,
        order: 6
    },
    {
        name: 'Tablets & E-Readers',
        slug: 'tablets-readers',
        icon: '📱',
        description: 'iPads, Android tablets, e-readers, and tablet accessories',
        featured: false,
        order: 7
    },
    {
        name: 'Monitors & Displays',
        slug: 'monitors-displays',
        icon: '🖥️',
        description: 'Computer monitors, displays, and screen accessories',
        featured: false,
        order: 8
    },
    {
        name: 'PC Components',
        slug: 'pc-components',
        icon: '⌨️',
        description: 'Keyboards, mice, graphics cards, RAM, and computer parts',
        featured: true,
        order: 9
    },
    {
        name: 'Home Appliances',
        slug: 'home-appliances',
        icon: '🏠',
        description: 'Smart home devices, appliances, and home automation',
        featured: false,
        order: 10
    }
];

async function seedCategories() {
    console.log('Starting category seeding...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const category of defaultCategories) {
        try {
            console.log(`Creating category: ${category.name}...`);

            // Check if category with this slug already exists
            const existing = await db.collection('categories')
                .where('slug', '==', category.slug)
                .limit(1)
                .get();

            if (!existing.empty) {
                console.log(`⚠ Category ${category.name} already exists, skipping...\n`);
                continue;
            }

            // Create category data
            const categoryData: CategoryData = {
                ...category,
                product_count: 0,
                created_at: admin.firestore.Timestamp.now(),
                updated_at: admin.firestore.Timestamp.now()
            };

            // Add to Firestore
            const docRef = await db.collection('categories').add(categoryData);
            console.log(`✓ Created ${category.name} (ID: ${docRef.id})\n`);
            successCount++;
        } catch (error: any) {
            console.error(`✗ Failed to create ${category.name}:`, error.message);
            errorCount++;
        }
    }

    console.log('\n=================================');
    console.log(`Seeding complete!`);
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log('=================================\n');

    process.exit(0);
}

// Run the seed function
seedCategories().catch((error) => {
    console.error('Fatal error during seeding:', error);
    process.exit(1);
});
