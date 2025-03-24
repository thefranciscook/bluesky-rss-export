import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CarFileProcessor from './components/CarFileProcessor'

function App() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Bluesky to RSS</h1>

      <ol className="list-decimal list-inside mb-4">
        <li>Navigate to <a href="https://bsky.app/settings/account" target="_blank">https://bsky.app/settings/account</a></li>
        <li>Login and click: "Download my data"</li>
        <li>Upload downloaded CAR file below</li>
      </ol>

      <CarFileProcessor />
    </div>
  )
}

export default App