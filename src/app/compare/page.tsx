"use client";

import PageTitle from '@/app/components/PageTitle/PageTitle';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Compare() {
  const router = useRouter();
  const [diffImageSrc, setDiffImageSrc] = useState(null);
  const [productionImageSrc, setproductionImageSrc] = useState(null);
  const [developmentImageSrc, setdevelopmentImageSrc] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [numDiffPixels, setNumDiffPixels] = useState(0);
  const [productionUrl, setProductionUrl] = useState('');
  const [developmentUrl, setDevelopmentUrl] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('Desktop');
  const [selectedBrowser, setSelectedBrowser] = useState('chromium');
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの開閉状態
  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null); // モーダルに表示する画像

  const openModal = (imageSrc: string) => {
    setModalImageSrc(imageSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalImageSrc(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const { searchParams } = new URL(window.location.href);
    const productionUrlFromParams = searchParams.get('productionUrl');
    const developmentUrlFromParams = searchParams.get('developmentUrl');
    const developmentUsername = searchParams.get('developmentUsername') || '';
    const developmentPassword = searchParams.get('developmentPassword') || '';

  if (!productionUrlFromParams || !developmentUrlFromParams) {
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

    setProductionUrl(productionUrlFromParams);
    setDevelopmentUrl(developmentUrlFromParams);

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/compare?productionUrl=${productionUrlFromParams}&developmentUrl=${developmentUrlFromParams}&device=${selectedDevice}&browser=${selectedBrowser}&developmentUsername=${developmentUsername}&developmentPassword=${developmentPassword}`
        );
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('API Response:', data); // レスポンスデータをコンソールに出力
    
          setDiffImageSrc(data.diffImageSrc);
          setproductionImageSrc(data.productionImageSrc);
          setdevelopmentImageSrc(data.developmentImageSrc);
          setNumDiffPixels(data.numDiffPixels);
        } else {
          throw new Error('Invalid JSON response');
        }
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
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
      <div className="mt-8">
        <h2 className="text-lg font-bold">Select Device</h2>
        <div className="flex space-x-4 mt-4">
          {['Desktop', 'iPhone', 'Android'].map((device) => (
            <button
              key={device}
              onClick={() => setSelectedDevice(device)}
              className={`px-4 py-2 rounded-md ${
                selectedDevice === device
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {device}
            </button>
          ))}
        </div>
      </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold">Select Browser</h2>
          <div className="flex space-x-4 mt-4">
            {['chromium', 'firefox', 'webkit'].map((browser) => (
              <button
                key={browser}
                onClick={() => setSelectedBrowser(browser)}
                className={`px-4 py-2 rounded-md ${
                  selectedBrowser === browser
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {browser}
              </button>
            ))}
          </div>
        </div>
        {diffImageSrc ? (
          <>
            <h2 className="text-lg font-bold mt-6">画像の差分結果</h2>
            <p className="text-md mt-2">差分ピクセル数: {numDiffPixels}</p>
            <div className="flex mt-4 gap-3">
              <div className="w-1/3">
                <h3 className="text-md font-semibold">Production</h3>
                {productionImageSrc ? (
                  <Image
                    src={productionImageSrc}
                    alt="Production Screenshot"
                    width={600}
                    height={300}
                    className="mt-4 border rounded-md cursor-pointer"
                    onClick={() => openModal(productionImageSrc)} // クリックでモーダルを開く
                  />
                ) : (
                  <p>Production image not available</p>
                )}
                                <h4>
                URL:<Link href={productionUrl} target='blank' className='underline decoration-slate-50'>{productionUrl}</Link>
                </h4>
              </div>
              <div className="w-1/3">
                <h3 className="text-md font-semibold">Development</h3>
                {developmentImageSrc ? (
                  <Image
                    src={developmentImageSrc}
                    alt="development Screenshot"
                    width={600}
                    height={300}
                    className="mt-4 border rounded-md cursor-pointer"
                    onClick={() => openModal(developmentImageSrc)} // クリックでモーダルを開く
                  />
                ) : (
                  <p>Production image not available</p>
                )}
                  <h4>
                    URL:<Link href={developmentUrl} target='blank' className='underline decoration-slate-50'>{developmentUrl}</Link>
                </h4>
              </div>
              <div className="w-1/3">
                <h3 className="text-md font-semibold">差分画像</h3>
                <Image
                  src={diffImageSrc}
                  alt="Diff Image"
                  width={600}
                  height={300}
                  className="mt-4 border rounded-md cursor-pointer"
                  onClick={() => openModal(diffImageSrc)} // クリックでモーダルを開く
                />
              </div>
            </div>
          </>
        ) : (
          <p>No differences found or comparison pending.</p>
        )}
      </div>
            {/* モーダル */}
            {isModalOpen && (
              <div
                className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm"
                onClick={closeModal} // 背景クリックでモーダルを閉じる
              >
                <div
                  className="relative m-4 p-10 w-3/5 max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-sm"
                  onClick={(e) => e.stopPropagation()} // モーダル内クリックで閉じないようにする
                >
                  <Image
                    src={modalImageSrc!}
                    alt="Expanded Image"
                    width={800}
                    height={600}
                    className="rounded-md w-full"
                  />
                  <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 text-white bg-red-600 rounded-full px-3 py-1"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
    </div>
  );
}