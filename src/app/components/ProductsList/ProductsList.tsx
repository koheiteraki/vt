import React from 'react';
import { ProductsItem } from '@/app/components/ProductsItem/ProductsItem';


interface ProductsListProps {
    items: {
        title: string;
        contents: string;
        image: string;
        titleLink: string;
    }[];
  }
  
  export const ProductsList: React.FC<ProductsListProps> = ({ items }) => {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items?.length
          ? items.map((item, index) => (
              <ProductsItem
                key={index}
                title={item.title}
                contents={item.contents}
                image={item.image}
                titleLink={item.titleLink}
              />
            ))
            : null}
            </div>
      </>
    );
  };