import React, { useState, useRef } from 'react';
import { Scene3D } from './components/Scene3D';
import { ControlPanel } from './components/ControlPanel';
import { ChatInterface } from './components/ChatInterface';
import { SceneSettings } from './types';

const DEFAULT_SETTINGS: SceneSettings = {
  sunAzimuth: 135,   // Morning/Mid-day light
  sunElevation: 45,
  windIntensity: 0.3,
  showTourists: true,
};

export default function App() {
  const [settings, setSettings] = useState<SceneSettings>(DEFAULT_SETTINGS);
  const resetRef = useRef<() => void>(() => {});

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    resetRef.current();
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 text-white">
      {/* 3D Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <Scene3D settings={settings} onResetRef={resetRef} />
      </div>

      {/* UI Overlay Layer */}
      <ControlPanel 
        settings={settings} 
        onSettingsChange={setSettings} 
        onReset={handleReset} 
      />

      {/* Title Overlay (Top Right) */}
      <div className="absolute top-6 right-6 text-right pointer-events-none z-10">
        <h1 className="text-4xl font-serif text-amber-500 drop-shadow-lg tracking-widest">LIBERTY LENS</h1>
        <p className="text-sm font-light text-gray-300 tracking-widest mt-1">DIGITAL PRESERVATION PROJECT</p>
        <div className="mt-2 h-0.5 w-24 bg-amber-500 ml-auto"></div>
      </div>

      {/* Compass / Info Overlay (Bottom Left) */}
      <div className="absolute bottom-6 left-6 pointer-events-none z-10">
        <div className="flex flex-col items-start space-y-1">
            <div className="text-[10px] text-amber-500 font-bold uppercase tracking-widest border border-amber-500 px-2 py-1 rounded">
                Live Render
            </div>
            <div className="text-xs text-gray-400">
                {new Date().toLocaleTimeString()} | 40.6892° N, 74.0445° W
            </div>
        </div>
      </div>

      {/* Gemini Chat */}
      <ChatInterface />
    </div>
  );
}