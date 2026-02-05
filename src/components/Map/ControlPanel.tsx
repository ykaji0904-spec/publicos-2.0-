'use client';

// PublicOS 2.0 - Control Panel
// Sidebar for simulation parameters and layer controls

import { useState } from 'react';
import { useMapStore } from '@/store/mapStore';

export function ControlPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const {
    viewState,
    flyTo,
    simulationParams,
    setSimulationParams,
    isSimulationRunning,
    setSimulationRunning,
    layers,
    toggleLayerVisibility,
    selectedTool,
    setSelectedTool,
  } = useMapStore();

  const presetLocations = [
    { name: '東京駅', lng: 139.7671, lat: 35.6812, zoom: 16 },
    { name: '渋谷', lng: 139.7016, lat: 35.6580, zoom: 16 },
    { name: '新宿', lng: 139.6917, lat: 35.6895, zoom: 16 },
    { name: '品川', lng: 139.7387, lat: 35.6284, zoom: 16 },
    { name: '港区', lng: 139.7454, lat: 35.6586, zoom: 15 },
  ];

  const tools = [
    { id: 'select' as const, icon: '↖', label: '選択' },
    { id: 'point' as const, icon: '●', label: 'ポイント' },
    { id: 'line' as const, icon: '/', label: 'ライン' },
    { id: 'polygon' as const, icon: '⬡', label: 'ポリゴン' },
    { id: 'measure' as const, icon: '📏', label: '計測' },
  ];

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="absolute left-4 top-4 z-20 bg-gray-900/90 text-white p-3 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <span className="text-xl">☰</span>
      </button>
    );
  }

  return (
    <div className="absolute left-4 top-4 bottom-4 w-80 bg-gray-900/95 text-white rounded-lg shadow-2xl z-20 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-cyan-400">PublicOS 2.0</h1>
          <p className="text-xs text-gray-400">空間オペレーティングシステム</p>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Tools */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 mb-2">ツール</h2>
          <div className="flex gap-1">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`flex-1 p-2 rounded text-center transition-colors ${
                  selectedTool === tool.id
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                title={tool.label}
              >
                <span className="block text-lg">{tool.icon}</span>
                <span className="text-xs">{tool.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Location Presets */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 mb-2">場所</h2>
          <div className="grid grid-cols-2 gap-2">
            {presetLocations.map((loc) => (
              <button
                key={loc.name}
                onClick={() => flyTo({ longitude: loc.lng, latitude: loc.lat, zoom: loc.zoom })}
                className="p-2 bg-gray-800 rounded text-sm hover:bg-gray-700 transition-colors text-left"
              >
                {loc.name}
              </button>
            ))}
          </div>
        </section>

        {/* Simulation Controls */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 mb-2">シミュレーション</h2>

          {/* Wind Speed */}
          <div className="mb-4">
            <label className="flex justify-between text-xs text-gray-400 mb-1">
              <span>風速</span>
              <span>{simulationParams.windSpeed} m/s</span>
            </label>
            <input
              type="range"
              min="0"
              max="40"
              step="1"
              value={simulationParams.windSpeed}
              onChange={(e) => setSimulationParams({ windSpeed: Number(e.target.value) })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Wind Direction */}
          <div className="mb-4">
            <label className="flex justify-between text-xs text-gray-400 mb-1">
              <span>風向</span>
              <span>{simulationParams.windDirection}°</span>
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="15"
              value={simulationParams.windDirection}
              onChange={(e) => setSimulationParams({ windDirection: Number(e.target.value) })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Drone Payload */}
          <div className="mb-4">
            <label className="flex justify-between text-xs text-gray-400 mb-1">
              <span>ドローン積載量</span>
              <span>{simulationParams.dronePayload} kg</span>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={simulationParams.dronePayload}
              onChange={(e) => setSimulationParams({ dronePayload: Number(e.target.value) })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Weather Condition */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-1 block">天候</label>
            <div className="grid grid-cols-4 gap-1">
              {(['clear', 'rain', 'typhoon', 'snow'] as const).map((condition) => (
                <button
                  key={condition}
                  onClick={() => setSimulationParams({ weatherCondition: condition })}
                  className={`p-2 rounded text-center text-xs transition-colors ${
                    simulationParams.weatherCondition === condition
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {condition === 'clear' && '☀️'}
                  {condition === 'rain' && '🌧️'}
                  {condition === 'typhoon' && '🌀'}
                  {condition === 'snow' && '❄️'}
                </button>
              ))}
            </div>
          </div>

          {/* Run Simulation Button */}
          <button
            onClick={() => setSimulationRunning(!isSimulationRunning)}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              isSimulationRunning
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-cyan-600 hover:bg-cyan-700 text-white'
            }`}
          >
            {isSimulationRunning ? '⏹ シミュレーション停止' : '▶ シミュレーション開始'}
          </button>
        </section>

        {/* Layer Controls */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 mb-2">レイヤー</h2>
          <div className="space-y-2">
            {layers.map((layer) => (
              <label
                key={layer.id}
                className="flex items-center gap-3 p-2 bg-gray-800 rounded hover:bg-gray-750 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={layer.visible}
                  onChange={() => toggleLayerVisibility(layer.id)}
                  className="w-4 h-4 accent-cyan-500"
                />
                <span className="text-sm capitalize">{layer.id}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Current View State Info */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 mb-2">現在位置</h2>
          <div className="bg-gray-800 rounded p-3 font-mono text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">経度:</span>
              <span>{viewState.longitude.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">緯度:</span>
              <span>{viewState.latitude.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">ズーム:</span>
              <span>{viewState.zoom.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">ピッチ:</span>
              <span>{viewState.pitch.toFixed(1)}°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">方位:</span>
              <span>{viewState.bearing.toFixed(1)}°</span>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700 text-center">
        <p className="text-xs text-gray-500">
          PublicOS 2.0 - 空間コンピューティングプラットフォーム
        </p>
      </div>
    </div>
  );
}

export default ControlPanel;
