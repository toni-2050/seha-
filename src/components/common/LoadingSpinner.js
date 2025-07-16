import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'جاري التحميل...' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
                <div className={`${sizeClasses[size]} border-4 border-blue-200 rounded-full animate-spin`}>
                    <div className="absolute top-0 left-0 h-full w-full border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            </div>
            <p className="text-gray-600 text-sm font-medium">{text}</p>
        </div>
    );
};

export default LoadingSpinner;