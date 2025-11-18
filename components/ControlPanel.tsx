import React from 'react';
import { SceneSettings } from '../types';

interface ControlPanelProps {
  settings: SceneSettings;
  onSettingsChange: (newSettings: SceneSettings) => void;
  onReset: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ settings, onSettingsChange, onReset }) => {
  const handleChange = (key: keyof SceneSettings, value: number | boolean) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 p-6 rounded-xl text-white w-80 z-10 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif text-amber-400 tracking-widest">CONTROLS</h2>
        <button 
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-white underline uppercase tracking-wider"
        >
          Reset View
        </button>
      </div>

      <div className="space-y-6">
        {/* Sun Azimuth */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-gray-300 uppercase tracking-wider">
            <span>Sun Azimuth</span>
            <span>{Math.round(settings.sunAzimuth)}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={settings.sunAzimuth}
            onChange={(e) => handleChange('sunAzimuth', parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-amber-400 hover:accent-amber-300 transition-all"
          />
        </div>

        {/* Sun Elevation */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-gray-300 uppercase tracking-wider">
            <span>Sun Elevation</span>
            <span>{Math.round(settings.sunElevation)}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="90"
            value={settings.sunElevation}
            onChange={(e) => handleChange('sunElevation', parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-amber-400 hover:accent-amber-300 transition-all"
          />
        </div>

        {/* Wind Intensity */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-gray-300 uppercase tracking-wider">
            <span>Wind Intensity</span>
            <span>{(settings.windIntensity * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.windIntensity}
            onChange={(e) => handleChange('windIntensity', parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-all"
          />
        </div>

        {/* Tourists Toggle */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Crowd</span>
          <button
            onClick={() => handleChange('showTourists', !settings.showTourists)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              settings.showTourists ? 'bg-green-500' : 'bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.showTourists ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/10 text-[10px] text-gray-500 leading-relaxed">
        <p>Use LEFT MOUSE to Orbit</p>
        <p>Use RIGHT MOUSE to Pan</p>
        <p>Use SCROLL to Zoom</p>
      </div>
    </div>
  );
};