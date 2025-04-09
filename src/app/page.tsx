"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [productionUrl, setProductionUrl] = useState('');
  const [developmentUrl, setDevelopmentUrl] = useState('');
  const router = useRouter();

  const handleProductionUrlChange = (event) => {
    setProductionUrl(event.target.value);
  };

  const handleDevelopmentUrlChange = (event) => {
    setDevelopmentUrl(event.target.value);
  };

  const handleCompare = async () => {
    // URLをクエリパラメータとして /compare ページに遷移
    const url = new URL('/compare', window.location.origin);
    url.searchParams.append('productionUrl', productionUrl);
    url.searchParams.append('developmentUrl', developmentUrl);
    router.push(url.toString());
  };

  return (

    <div>
      
      <div className="relative px-6 lg:px-8 dark:bg-gray-800">
          <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
              <div>
                  <div>
                      <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl dark:text-gray-100">
                      Visual Regression Test
                      </h1>
                      <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center dark:text-gray-200">
                        テストのためのURLを入力してください。
                      </p>
                      <div className="mt-8 flex gap-x-4 sm:justify-center">
                      <div className="grid gap-6 mb-6 md:grid-cols-2">
          <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white' htmlFor="productionUrl">Production URL:</label>
          <input
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            type="url"
            id="productionUrl"
            value={productionUrl}
            onChange={handleProductionUrlChange}
          />
        </div>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white' htmlFor="developmentUrl">Development URL:</label>
          <input
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            type="url"
            id="developmentUrl"
            value={developmentUrl}
            onChange={handleDevelopmentUrlChange}
          />
        </div>
        <button onClick={handleCompare} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>Compare</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}