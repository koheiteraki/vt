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

    if (!productionUrl || !developmentUrl) {
      setError('Missing productionUrl or developmentUrl');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/compare?productionUrl=${productionUrl}&developmentUrl=${developmentUrl}&device=${selectedDevice}&browser=${selectedBrowser}`
        );
        const data = await response.json();

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
      <div>
        <label htmlFor="device">Device:</label>
        <select id="device" value={selectedDevice} onChange={handleDeviceChange}>
          <option value="Desktop">Desktop</option>
          <option value="iPhone 11">iPhone 11</option>
          {/* 他のデバイスオプション */}
        </select>
      </div>
      <div>
        <label htmlFor="browser">Browser:</label>
        <select id="browser" value={selectedBrowser} onChange={handleBrowserChange}>
          <option value="chromium">Chromium</option>
          <option value="firefox">Firefox</option>
          <option value="webkit">WebKit</option>
        </select>
      </div>
      {diffImageSrc ? (
        <>
          <p>Differences found: {numDiffPixels} pixels</p>
          <img src={diffImageSrc} alt="Diff Image" />
        </>
      ) : (
        <p>No differences found or comparison pending.</p>
      )}
    </div>
  );
}