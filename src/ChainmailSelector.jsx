import React, { useState, useMemo } from 'react';

// Ring data from Chainmail Joe chart
const WIRE_GAUGES = [
  { gauge: '20SWG', mm: 0.9 },
  { gauge: '18SWG', mm: 1.2 },
  { gauge: '16SWG', mm: 1.6 },
  { gauge: '14SWG', mm: 2.0 },
];

const INNER_DIAMETERS = [
  { imperial: '7/64"', mm: 2.8 },
  { imperial: '1/8"', mm: 3.2 },
  { imperial: '9/64"', mm: 3.6 },
  { imperial: '5/32"', mm: 4.0 },
  { imperial: '3/16"', mm: 4.8 },
  { imperial: '7/32"', mm: 5.6 },
  { imperial: '1/4"', mm: 6.4 },
  { imperial: '9/32"', mm: 7.1 },
  { imperial: '5/16"', mm: 7.9 },
  { imperial: '3/8"', mm: 9.6 },
  { imperial: '7/16"', mm: 11.2 },
  { imperial: '1/2"', mm: 12.7 },
  { imperial: '5/8"', mm: 16.0 },
];

// Weave data with AR requirements
const WEAVES = [
  { name: 'European 4 in 1', arMin: 4.0, arMax: 7.0, ideal: 4.0, twoSizes: false },
  { name: 'Box Weave', arMin: 4.0, arMax: 5.5, ideal: 5.0, twoSizes: false },
  { name: 'Helm Chain', arMin: 4.0, arMax: 4.0, ideal: 4.0, twoSizes: true, secondary: { arMin: 6.6, arMax: 7.0 } },
  { name: 'Spiral 4 in 1', arMin: 4.0, arMax: 6.0, ideal: 4.0, twoSizes: false },
  { name: 'Byzantine Chain', arMin: 3.5, arMax: 6.0, ideal: 3.5, twoSizes: false },
  { name: 'Half Persian 4 in 1', arMin: 4.4, arMax: 6.0, ideal: 5.0, twoSizes: false },
  { name: 'Barrel Weave', arMin: 3.3, arMax: 3.7, ideal: 3.5, twoSizes: false },
  { name: "King's Mail (Euro 8in2)", arMin: 5.0, arMax: 7.0, ideal: 5.5, twoSizes: false },
  { name: 'JPL (Jens Pind)', arMin: 2.9, arMax: 3.1, ideal: 3.0, twoSizes: false },
  { name: 'Sweet Pea', arMin: 3.8, arMax: 4.2, ideal: 4.0, twoSizes: false },
  { name: 'Vipera Berus', arMin: 3.5, arMax: 4.0, ideal: 3.5, twoSizes: false },
  { name: 'Kinged Vipera Berus', arMin: 5.3, arMax: 6.0, ideal: 5.3, twoSizes: false },
  { name: 'Full Persian 6 in 1', arMin: 5.0, arMax: 6.0, ideal: 5.3, twoSizes: false },
  { name: 'Round Mail', arMin: 3.5, arMax: 6.0, ideal: 4.0, twoSizes: false },
  { name: 'Dragonscale', arMin: 4.0, arMax: 4.0, ideal: 4.0, twoSizes: true, secondary: { arMin: 6.6, arMax: 7.0 } },
  { name: 'Elf Weave', arMin: 3.8, arMax: 4.2, ideal: 4.0, twoSizes: false },
  { name: 'Orc Weave', arMin: 3.3, arMax: 3.7, ideal: 3.5, twoSizes: false },
  { name: 'Dragon Back', arMin: 5.0, arMax: 6.0, ideal: 5.3, twoSizes: false },
  { name: 'Celtic Visions', arMin: 3.5, arMax: 3.5, ideal: 3.5, twoSizes: true, secondary: { arMin: 5.3, arMax: 5.3 } },
  { name: 'Candycane', arMin: 4.6, arMax: 5.3, ideal: 5.0, twoSizes: false },
].sort((a, b) => a.name.localeCompare(b.name));

// Generate all possible rings
const generateRings = () => {
  const rings = [];
  WIRE_GAUGES.forEach(wire => {
    INNER_DIAMETERS.forEach(id => {
      const ar = parseFloat((id.mm / wire.mm).toFixed(1));
      // Filter out impractical combinations (AR too low or too high)
      if (ar >= 2.5 && ar <= 9.0) {
        rings.push({
          gauge: wire.gauge,
          wireMm: wire.mm,
          idImperial: id.imperial,
          idMm: id.mm,
          ar: ar,
        });
      }
    });
  });
  return rings;
};

const ALL_RINGS = generateRings();

export default function ChainmailSelector() {
  const [selectedWeave, setSelectedWeave] = useState(null);
  const [showSecondary, setShowSecondary] = useState(false);

  const weave = WEAVES.find(w => w.name === selectedWeave);
  
  const matchingRings = useMemo(() => {
    if (!weave) return { primary: [], secondary: [] };
    
    const primary = ALL_RINGS.filter(r => 
      r.ar >= weave.arMin && r.ar <= weave.arMax
    ).sort((a, b) => Math.abs(a.ar - weave.ideal) - Math.abs(b.ar - weave.ideal));
    
    let secondary = [];
    if (weave.twoSizes && weave.secondary) {
      secondary = ALL_RINGS.filter(r => 
        r.ar >= weave.secondary.arMin && r.ar <= weave.secondary.arMax
      );
    }
    
    return { primary, secondary };
  }, [weave]);

  const isInRange = (ar) => {
    if (!weave) return false;
    const inPrimary = ar >= weave.arMin && ar <= weave.arMax;
    const inSecondary = weave.secondary && ar >= weave.secondary.arMin && ar <= weave.secondary.arMax;
    return inPrimary || inSecondary;
  };

  const isIdeal = (ar) => {
    if (!weave) return false;
    return Math.abs(ar - weave.ideal) < 0.15;
  };

  const isPrimary = (ar) => {
    if (!weave) return false;
    return ar >= weave.arMin && ar <= weave.arMax;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-2 text-purple-300">
        ⛓️ Chainmail Ring Selector
      </h1>
      <p className="text-center text-gray-400 text-sm mb-6">
        AR = Inside Diameter ÷ Wire Diameter
      </p>

      {/* Weave Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select a Weave:
        </label>
        <select
          value={selectedWeave || ''}
          onChange={(e) => {
            setSelectedWeave(e.target.value || null);
            setShowSecondary(false);
          }}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">-- Choose a weave --</option>
          {WEAVES.map(w => (
            <option key={w.name} value={w.name}>
              {w.name} (AR {w.arMin === w.arMax ? w.arMin : `${w.arMin}-${w.arMax}`})
              {w.twoSizes ? ' ⚡ 2 sizes' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Weave Info */}
      {weave && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-purple-500/30">
          <h2 className="text-xl font-semibold text-purple-300 mb-2">{weave.name}</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">AR Range:</span>
              <span className="ml-2 font-mono text-green-400">
                {weave.arMin === weave.arMax ? weave.arMin : `${weave.arMin} - ${weave.arMax}`}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Ideal AR:</span>
              <span className="ml-2 font-mono text-yellow-400">~{weave.ideal}</span>
            </div>
          </div>
          {weave.twoSizes && (
            <div className="mt-3 p-2 bg-purple-900/30 rounded border border-purple-500/30">
              <p className="text-purple-300 text-sm font-medium">⚡ This weave requires TWO ring sizes!</p>
              <p className="text-gray-400 text-xs mt-1">
                Primary: AR {weave.arMin}-{weave.arMax} | Secondary: AR {weave.secondary.arMin}-{weave.secondary.arMax}
              </p>
              <button
                onClick={() => setShowSecondary(!showSecondary)}
                className="mt-2 px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-sm"
              >
                {showSecondary ? 'Show Primary Rings' : 'Show Secondary Rings'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Ring Grid */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-300 mb-3">Ring Grid (AR values)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-2 border border-gray-700 text-left">Gauge</th>
                {INNER_DIAMETERS.slice(0, 11).map(id => (
                  <th key={id.imperial} className="p-2 border border-gray-700 text-center">
                    <div className="text-xs">{id.imperial}</div>
                    <div className="text-xs text-gray-500">{id.mm}mm</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WIRE_GAUGES.map(wire => (
                <tr key={wire.gauge}>
                  <td className="p-2 border border-gray-700 bg-gray-800 font-medium">
                    <div>{wire.gauge}</div>
                    <div className="text-xs text-gray-500">{wire.mm}mm</div>
                  </td>
                  {INNER_DIAMETERS.slice(0, 11).map(id => {
                    const ar = parseFloat((id.mm / wire.mm).toFixed(1));
                    const viable = ar >= 2.5 && ar <= 9.0;
                    const inRange = isInRange(ar);
                    const ideal = isIdeal(ar);
                    const primary = isPrimary(ar);
                    
                    let bgColor = 'bg-gray-900';
                    let textColor = 'text-gray-500';
                    
                    if (viable && weave) {
                      if (ideal) {
                        bgColor = 'bg-green-600';
                        textColor = 'text-white font-bold';
                      } else if (inRange) {
                        bgColor = primary ? 'bg-yellow-700' : 'bg-purple-700';
                        textColor = 'text-white';
                      }
                    } else if (viable) {
                      textColor = 'text-gray-300';
                    }
                    
                    return (
                      <td 
                        key={id.imperial} 
                        className={`p-2 border border-gray-700 text-center ${bgColor} ${textColor} transition-colors`}
                      >
                        {viable ? ar : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {weave && (
          <div className="flex gap-4 mt-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>Ideal</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-yellow-700 rounded"></div>
              <span>Primary Range</span>
            </div>
            {weave.twoSizes && (
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-purple-700 rounded"></div>
                <span>Secondary Range</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Matching Rings List */}
      {weave && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-300 mb-3">
            {showSecondary ? 'Secondary' : 'Primary'} Rings for {weave.name}
            <span className="text-sm text-gray-500 ml-2">
              ({(showSecondary ? matchingRings.secondary : matchingRings.primary).length} options)
            </span>
          </h3>
          
          {(showSecondary ? matchingRings.secondary : matchingRings.primary).length === 0 ? (
            <p className="text-gray-500 italic">No rings in standard sizes match this AR range.</p>
          ) : (
            <div className="grid gap-2">
              {(showSecondary ? matchingRings.secondary : matchingRings.primary).map((ring, i) => {
                const isIdealRing = Math.abs(ring.ar - weave.ideal) < 0.15;
                return (
                  <div
                    key={i}
                    className={`p-3 rounded border ${
                      isIdealRing
                        ? 'bg-green-900/30 border-green-500/50'
                        : 'bg-gray-700/50 border-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-mono font-bold text-lg">{ring.idImperial}</span>
                        <span className="text-gray-400 mx-2">ID</span>
                        <span className="font-mono">{ring.gauge}</span>
                        <span className="text-gray-400 ml-2">wire</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono text-lg ${isIdealRing ? 'text-green-400' : 'text-yellow-400'}`}>
                          AR {ring.ar}
                        </span>
                        {isIdealRing && (
                          <span className="ml-2 text-xs bg-green-600 px-2 py-0.5 rounded">IDEAL</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {ring.idMm}mm ID ÷ {ring.wireMm}mm wire
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <p className="text-center text-gray-600 text-xs mt-6">
        Data from Chainmail Joe ring sizer guide
      </p>
    </div>
  );
}
