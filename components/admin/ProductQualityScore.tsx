'use client';

import { type QualityScore } from '@/lib/quality-scoring';
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface ProductQualityScoreProps {
    score: QualityScore;
}

export default function ProductQualityScore({ score }: ProductQualityScoreProps) {
    const [expanded, setExpanded] = useState(false);

    const getScoreColor = (total: number) => {
        if (total >= 85) return 'text-green-600';
        if (total >= 70) return 'text-yellow-600';
        if (total >= 50) return 'text-orange-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (total: number) => {
        if (total >= 85) return 'bg-green-50 border-green-200';
        if (total >= 70) return 'bg-yellow-50 border-yellow-200';
        if (total >= 50) return 'bg-orange-50 border-orange-200';
        return 'bg-red-50 border-red-200';
    };

    const getGradeEmoji = (grade: string) => {
        if (grade === 'excellent') return '🎉';
        if (grade === 'good') return '👍';
        if (grade === 'fair') return '⚠️';
        return '❌';
    };

    return (
        <div className={`border rounded-lg p-4 ${getScoreBgColor(score.total)}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Score Circle */}
                    <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 transform -rotate-90">
                            <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="none"
                                className="text-gray-200"
                            />
                            <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 28}`}
                                strokeDashoffset={`${2 * Math.PI * 28 * (1 - score.total / 100)}`}
                                className={getScoreColor(score.total)}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-xl font-bold ${getScoreColor(score.total)}`}>
                                {score.total}
                            </span>
                        </div>
                    </div>

                    {/* Score Info */}
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Quality Score
                            </h3>
                            <span className="text-2xl">{getGradeEmoji(score.grade)}</span>
                        </div>
                        <p className="text-sm text-gray-600 capitalize">
                            {score.grade} quality listing
                        </p>
                    </div>
                </div>

                {/* Expand Button */}
                <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                    {expanded ? (
                        <ChevronUpIcon className="w-5 h-5 text-gray-600" />
                    ) : (
                        <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                    )}
                </button>
            </div>

            {/* Expanded Details */}
            {expanded && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    {/* Breakdown */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Score Breakdown</h4>
                        <div className="space-y-2">
                            <ScoreItem label="Title" score={score.breakdown.title} max={10} />
                            <ScoreItem label="Brand" score={score.breakdown.brand} max={10} />
                            <ScoreItem label="Description" score={score.breakdown.description} max={20} />
                            <ScoreItem label="Images" score={score.breakdown.images} max={30} />
                            <ScoreItem label="Specifications" score={score.breakdown.specs} max={20} />
                            <ScoreItem label="Pros & Cons" score={score.breakdown.proscons} max={10} />
                        </div>
                    </div>

                    {/* Suggestions */}
                    {score.suggestions.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                💡 Suggestions to Improve
                            </h4>
                            <ul className="space-y-1">
                                {score.suggestions.map((suggestion, index) => (
                                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                        <span className="text-gray-400 mt-0.5">•</span>
                                        <span>{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Perfect Score Message */}
                    {score.total === 100 && (
                        <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-center">
                            <p className="text-sm font-medium text-green-800">
                                🎊 Perfect score! This is an excellent product listing!
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function ScoreItem({ label, score, max }: { label: string; score: number; max: number }) {
    const percentage = (score / max) * 100;

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 w-24">{label}</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-300 ${percentage === 100 ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="text-xs text-gray-600 w-12 text-right">
                {score}/{max}
            </span>
        </div>
    );
}
