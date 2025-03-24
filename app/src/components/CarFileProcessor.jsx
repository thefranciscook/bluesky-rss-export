// src/components/CarFileProcessor.jsx
import React, { useState } from 'react';
import { readCar, iterateAtpRepo } from '@atcute/car';

function CarFileProcessor() {
  const [rssFeeds, setRssFeeds] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      const reader = new FileReader();
      reader.onload = function (e) {
        const carData = new Uint8Array(e.target.result);
        console.log('File read successfully, starting parse...');
        parseCarFile(carData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const parseCarFile = (carData) => {
    console.log('Parsing CAR file...');
    const feeds = extractRssFeedsFromCar(carData);
    console.log('Feeds extracted:', feeds);
    setRssFeeds(feeds);
    setIsButtonDisabled(feeds.length === 0);
  };

  const extractRssFeedsFromCar = (carData) => {
    const feeds = [];
    const { iterate } = readCar(carData);

    for (const { collection, rkey, record } of iterateAtpRepo(carData)) {
      console.log('Processing record:', { collection, rkey, record });
      if (collection === 'app.bsky.graph.follow') {
        const did = record.subject;
        const rssUrl = `https://bsky.app/profile/${did}/rss`;
        console.log('Constructed RSS feed URL:', rssUrl);
        feeds.push(rssUrl);
      }
    }

    return feeds;
  };

  const downloadOpml = () => {
    console.log('Generating OPML file...');
    const opmlContent = generateOpmlContent(rssFeeds);
    const blob = new Blob([opmlContent], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feeds.opml';
    a.click();
    URL.revokeObjectURL(url);
    console.log('OPML file downloaded.');
  };

  const generateOpmlContent = (feeds) => {
    let opml = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="1.0">
<head>
    <title>RSS Feeds</title>
</head>
<body>
    <outline text="RSS Feeds">`;

    feeds.forEach(feed => {
      opml += `
        <outline type="rss" text="${feed}" xmlUrl="${feed}"/>`;
    });

    opml += `
    </outline>
</body>
</opml>`;
    return opml;
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <input 
        type="file" 
        onChange={handleFileSelect} 
        accept=".car" 
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
      />
      <button 
        onClick={downloadOpml} 
        disabled={isButtonDisabled} 
        className={`mt-4 px-4 py-2 text-white rounded-lg ${isButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
      >
        Download OPML
      </button>
      <ul className="mt-4 list-disc list-inside">
        {rssFeeds.map((feed, index) => (
          <li key={index} className="text-gray-700"><a href={feed} target='_blank'>{feed}</a></li>
        ))}
      </ul>
    </div>
  );
}

export default CarFileProcessor;