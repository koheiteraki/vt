"use client";

import PageTitle from '@/app/components/PageTitle/PageTitle';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Compare() {
  const router = useRouter();
  const [diffImageSrc, setDiffImageSrc] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [numDiffPixels, setNumDiffPixels] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState('Desktop');
  const [selectedBrowser, setSelectedBrowser] = useState('chromium');
  const [developmentUsername, setDevelopmentUsername] = useState('');
  const [developmentPassword, setDevelopmentPassword] = useState('');

  const handleDeviceChange = (event) => {
    setSelectedDevice(event.target.value);
  };

  const handleBrowserChange = (event) => {
    setSelectedBrowser(event.target.value);
  };

  useEffect(() => {
    const { searchParams } = new URL(window.location.href);
    const productionUrl = searchParams.get('productionUrl');
    const developmentUrl = searchParams.get('developmentUrl');
    const developmentUsername = searchParams.get('developmentUsername') || '';
    const developmentPassword = searchParams.get('developmentPassword') || '';

    setDevelopmentUsername(developmentUsername);
    setDevelopmentPassword(developmentPassword);


    if (!productionUrl || !developmentUrl) {
      document.body.innerHTML = `
        <div style="color: red; text-align: center; margin-top: 20px;">
          <h1>Error</h1>
          <p>「productionUrl または developmentUrl が不足しています」</p>
          <p>URLを正しく入力してください。</p>
          <p className="py-4"><a href="/" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">戻る</a></p>
        </div>
      `;
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/compare?productionUrl=${productionUrl}&developmentUrl=${developmentUrl}&device=${selectedDevice}&browser=${selectedBrowser}&developmentUsername=${developmentUsername}&developmentPassword=${developmentPassword}`
        );
        const data = await response.json();
        console.log('API Response:', data); // レスポンスデータをコンソールに出力

        if (response.ok) {
          setDiffImageSrc(data.diffImageSrc);
          setNumDiffPixels(data.numDiffPixels);
        } else {
          setError(data.error || 'An error occurred');
        }
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, selectedDevice, selectedBrowser]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
        <PageTitle title="Visual Regression Test" description="差分テスト結果" />
        <div className="container mx-auto">
          <div className="mt-10 grid grid-cols-3 gap-4 justify-center">
            <div>
            <label htmlFor="device" className="block text-sm font-medium text-gray-700">Device:</label>
            <select
              id="device"
              value={selectedDevice}
              onChange={handleDeviceChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="Desktop">Desktop</option>
              <option value="iPhone 11">iPhone 11</option>
              {/* 他のデバイスオプション */}
            </select>
          </div>

          <div>
            <label htmlFor="browser" className="block text-sm font-medium text-gray-700">Browser:</label>
            <select
              id="browser"
              value={selectedBrowser}
              onChange={handleBrowserChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="chromium">Chromium</option>
              <option value="firefox">Firefox</option>
              <option value="webkit">WebKit</option>
            </select>
          </div>
      </div>

      {diffImageSrc ? (
        <>
          {/* <p>Differences found: {numDiffPixels} pixels</p> */}
          <p className='mt-6'>画像の差分</p>
          {/* 画像を表示するためのimgタグ */}
          <div className="mt-4 mx-auto max-w-4xl">
          <img src={diffImageSrc} alt="Diff Image" />
          </div>
        </>
      ) : (
        <p>No differences found or comparison pending.</p>
      )}
            </div>
    </div>
  );
}