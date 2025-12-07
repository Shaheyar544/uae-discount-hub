'use client';

import { motion } from 'framer-motion';
import { ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function TransparencyFooter() {
    return (
        <motion.div
            className="w-full py-8 mt-24"
            style={{ background: 'hsl(var(--muted) / 0.3)', borderTop: '1px solid hsl(var(--border))' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
        >
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {/* Affiliate Disclosure */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <ShieldCheckIcon className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm text-foreground mb-1">Affiliate Disclosure</h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                We may earn a commission when you purchase through our links. This helps us keep the service free while maintaining complete transparency.
                            </p>
                        </div>
                    </div>

                    {/* Data Freshness */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                                <ClockIcon className="w-6 h-6 text-accent" />
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm text-foreground mb-1">Data Freshness Guarantee</h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                All prices are verified and updated every 6 hours by our AI-powered monitoring system to ensure accuracy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
