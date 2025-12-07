import type { Metadata } from 'next';
import { getProductBySlug, getProductPrices, getBestPrice, trackAffiliateClick } from '@/lib/firebase/db';
import ProductComparisonClient from '@/components/ProductComparisonClient';
import { notFound } from 'next/navigation';

interface PageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const product = await getProductBySlug(params.slug);

    if (!product) {
        return {
            title: 'Product Not Found - UAE Discount Hub',
        };
    }

    return {
        title: `${product.title} - Best Price in UAE | UAE Discount Hub`,
        description: product.seo.meta_description || product.description,
        openGraph: {
            title: product.title,
            description: product.description,
            images: product.images,
        },
    };
}

export default async function ProductPage({ params }: PageProps) {
    const product = await getProductBySlug(params.slug);

    if (!product) {
        notFound();
    }

    const prices = await getProductPrices(product.id!);
    const bestPrice = await getBestPrice(product.id!);

    return (
        <ProductComparisonClient
            product={product}
            prices={prices}
            bestPrice={bestPrice}
        />
    );
}
