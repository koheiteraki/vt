"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Home() {
  const [productionUrl, setProductionUrl] = useState('');
  const [developmentUrl, setDevelopmentUrl] = useState('');
  const [developmentUsername, setDevelopmentUsername] = useState('');
  const [developmentPassword, setDevelopmentPassword] = useState('');

  const router = useRouter();

  const handleProductionUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProductionUrl(event.target.value);
  };

  const handleDevelopmentUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDevelopmentUrl(event.target.value);
  };


  const handleDevelopmentUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDevelopmentUsername(event.target.value);
  };

  const handleDevelopmentPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDevelopmentPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // デフォルトのフォーム送信を防止
    // URLをクエリパラメータとして /compare ページに遷移
    const url = new URL('/compare', window.location.origin);
    url.searchParams.append('productionUrl', productionUrl);
    url.searchParams.append('developmentUrl', developmentUrl);
    url.searchParams.append('developmentUsername', developmentUsername);
    url.searchParams.append('developmentPassword', developmentPassword);
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
              <form onSubmit={handleSubmit} className="mt-8 space-y-6"> {/* form要素にspace-y-6を追加 */}
                {/* URL入力欄 */}
                <div>
                  <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white' htmlFor="productionUrl">公開環境 URL:</label>
                  <input
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    type="url"
                    id="productionUrl"
                    value={productionUrl}
                    placeholder="hoge.com"
                    onChange={handleProductionUrlChange}
                  />
                </div>
                <div>
                  <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white' htmlFor="developmentUrl">開発環境 URL:</label>
                  <input
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    type="url"
                    id="developmentUrl"
                    value={developmentUrl}
                    placeholder="stage21-hoge.com"
                    onChange={handleDevelopmentUrlChange}
                  />
                </div>

                {/* 認証情報入力欄 */}
                <div>
                  <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white' htmlFor="developmentUsername">開発環境ベーシック認証：Username:</label>
                  <input
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    type="text"
                    id="developmentUsername"
                    autoComplete="username"
                    value={developmentUsername}
                    onChange={handleDevelopmentUsernameChange}
                  />
                </div>
                <div>
                  <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white' htmlFor="developmentPassword">開発環境ベーシック認証：Password:</label>
                  <input
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    type="password"
                    id="developmentPassword"
                    autoComplete="current-password"
                    value={developmentPassword}
                    onChange={handleDevelopmentPasswordChange}
                  />
                </div>

                {/* ボタン */}
                <div className="sm:text-center"> {/* ボタンを中央に配置 */}
                  <button type="submit" className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>Compare</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}