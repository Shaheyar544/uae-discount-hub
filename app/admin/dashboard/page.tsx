'use client';

import { motion } from 'framer-motion';
import {
    ShoppingBagIcon,
    TagIcon,
    ChartBarIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
    const stats = [
        {
            name: 'Total Products',
            value: '0',
            icon: ShoppingBagIcon,
            color: 'blue',
            change: '+0%',
            changeType: 'neutral'
        },
        {
            name: 'Active Deals',
            value: '0',
            icon: TagIcon,
            color: 'green',
            change: '+0%',
            changeType: 'neutral'
        },
        {
            name: 'Price Updates Today',
            value: '0',
            icon: ChartBarIcon,
            color: 'purple',
            change: '0',
            changeType: 'neutral'
        },
        {
            name: 'Failed Updates',
            value: '0',
            icon: ExclamationTriangleIcon,
            color: 'red',
            change: '0',
            changeType: 'neutral'
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Admin Dashboard</h1>
                <p className="text-gray-600">Manage your products, prices, and deals from here.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg shadow p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 border-2 border-dashes border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left">
                        <ShoppingBagIcon className="w-8 h-8 text-primary mb-2" />
                        <h3 className="font-semibold text-gray-900">Add Product</h3>
                        <p className="text-sm text-gray-600">Create a new product listing</p>
                    </button>

                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left">
                        <TagIcon className="w-8 h-8 text-primary mb-2" />
                        <h3 className="font-semibold text-gray-900">Create Deal</h3>
                        <p className="text-sm text-gray-600">Add a new promotional deal</p>
                    </button>

                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left">
                        <ChartBarIcon className="w-8 h-8 text-primary mb-2" />
                        <h3 className="font-semibold text-gray-900">View Analytics</h3>
                        <p className="text-sm text-gray-600">Check performance metrics</p>
                    </button>
                </div>
            </div>

            {/* Getting Started */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">🚀 Getting Started</h2>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-gray-900">Admin account created</h3>
                            <p className="text-sm text-gray-600">You're logged in as an admin user</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <ClockIcon className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-gray-900">Add your first product</h3>
                            <p className="text-sm text-gray-600">Navigate to Products → New Product to get started</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <ClockIcon className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-gray-900">Configure price monitoring</h3>
                            <p className="text-sm text-gray-600">Set up automatic price tracking for your products</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
