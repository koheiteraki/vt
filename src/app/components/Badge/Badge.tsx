import React from 'react';
import Link from 'next/link';

interface BadgeProps {
    category: string;
    categoryLink: string;
  }
  export const Badge: React.FC<BadgeProps> = ({
    categoryLink
}) => {
    return (
            <Link href={categoryLink}>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300">{category}</span>
            </Link>
);
};
