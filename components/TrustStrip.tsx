'use client';

import { motion } from 'framer-motion';

const retailers = [
    { name: 'Amazon.ae', logo: '🛒' },
    { name: 'Noon', logo: '🌙' },
    { name: 'Namshi', logo: '👗' },
    { name: 'Sharaf DG', logo: '📱' },
    { name: 'Carrefour', logo: '🛍️' },
];

export default function TrustStrip() {
    return (
        <motion.div
            className="w-full py-8 border-y border-border/50"
            style={{ background: 'hsl(var(--background))' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
        >
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                    <p className="text-sm font-semibold text-muted-foreground text-center md:text-left">
                        We Compare Prices Across The UAE's Leading Retailers
                    </p>

                    <div className="flex items-center gap-6 md:gap-8 flex-wrap justify-center">
                        {retailers.map((retailer, index) => (
                            <motion.div
                                key={retailer.name}
                                className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 0.7, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ opacity: 1 }}
                            >
                                <span className="text-2xl">{retailer.logo}</span>
                                <span className="text-sm font-medium text-foreground">{retailer.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
