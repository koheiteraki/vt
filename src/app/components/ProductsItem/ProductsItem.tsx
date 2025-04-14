import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductsItemProps {
    title: string;
    contents: string;
    image: string;
    titleLink: string;
  }
  export const ProductsItem: React.FC<ProductsItemProps> = ({
    title,
    contents,
    image,
    titleLink,
}) => {
    return (
        <div className="max-w-sm bg-white border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700 transition-opacity duration-300 hover:opacity-80 ">
            <Link href={titleLink}>
            <div className="w-full relative h-auto overflow-hidden">
                <Image className="w-full" src={image} alt={title} width={400} height={200} />
            </div>
            <div className="p-5">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{contents}</p>
            </div>
            </Link>
        </div>
);
};
