import React from 'react';

interface DeviceBrowserSelectProps {
  selectedDeviceBrowser: { device: string; browser: string };
  setSelectedDeviceBrowser: React.Dispatch<
    React.SetStateAction<{ device: string; browser: string }>
  >;
}

const DeviceBrowserSelect: React.FC<DeviceBrowserSelectProps> = ({
  selectedDeviceBrowser,
  setSelectedDeviceBrowser,
}) => {
  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeviceBrowser((prev) => ({
      ...prev,
      device: event.target.value,
    }));
  };

  const handleBrowserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeviceBrowser((prev) => ({
      ...prev,
      browser: event.target.value,
    }));
  };

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Device:
      </label>
      <select
        value={selectedDeviceBrowser.device}
        onChange={handleDeviceChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="Desktop">Desktop</option>
        <option value="Mobile">Mobile</option>
      </select>

      <label className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Browser:
      </label>
      <select
        value={selectedDeviceBrowser.browser}
        onChange={handleBrowserChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="chromium">Chromium</option>
        <option value="firefox">Firefox</option>
        <option value="webkit">Webkit</option>
      </select>
    </div>
  );
};

export default DeviceBrowserSelect;