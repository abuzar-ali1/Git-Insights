'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'; // Necessary for canvas libraries!
import { Loader2, AlertCircle } from 'lucide-react';

// Dynamically import ForceGraph to avoid "Window is not defined" error
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => <div className="text-blue-500">Loading Physics Engine...</div>
});

interface Props {
  data: { nodes: any[], links: any[] };
  isLoading: boolean;
  error?: string;
}

export default function NetworkGraph({ data, isLoading, error }: Props) {
  const [dimensions, setDimensions] = useState({ w: 800, h: 600 });

  // Make graph responsive to window size
  useEffect(() => {
    setDimensions({ 
      w: window.innerWidth > 1000 ? window.innerWidth - 100 : window.innerWidth, 
      h: 600 
    });
  }, []);

  if (isLoading) return (
    <div className="h-[600px] flex flex-col items-center justify-center text-blue-500 bg-[#161b22] rounded-xl border border-gray-800">
      <Loader2 className="w-10 h-10 animate-spin mb-4" />
      <p>Summoning contributors...</p>
    </div>
  );

  if (error) return (
    <div className="h-[600px] flex flex-col items-center justify-center text-red-400 bg-[#161b22] rounded-xl border border-gray-800">
      <AlertCircle className="w-10 h-10 mb-4" />
      <p>{error}</p>
    </div>
  );

  return (
    <div className="rounded-xl overflow-hidden border border-gray-800 bg-[#0d1117] shadow-2xl relative">
      <div className="absolute top-4 left-4 z-10 bg-black/50 p-2 rounded text-xs text-gray-400 pointer-events-none">
        Wait for nodes to settle • Drag to move • Scroll to zoom
      </div>

      <ForceGraph2D
        width={dimensions.w}
        height={dimensions.h}
        graphData={data}
        backgroundColor="#0d1117"
        
        // PHYSICS SETTINGS
        d3VelocityDecay={0.08} // Low friction = bouncier
        d3AlphaDecay={0.02}   // Slower cooling = moves longer
        
        // LINK STYLING
        linkColor={() => '#30363d'}
        linkWidth={1}
        
        // NODE RENDERING (The Avatar Magic)
        nodeCanvasObject={(node: any, ctx, globalScale) => {
            const size = node.isCenter ? 10 : 4; // Center is bigger
            const fontSize = 12 / globalScale;
            
            // 1. Draw Text Label (only if center or hovered)
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = node.isCenter ? '#fff' : '#8b949e';
            
            // Draw name below node
            ctx.fillText(node.id, node.x, node.y + size + 4);

            // 2. Draw Circle/Image
            if (node.img) {
                const img = new Image();
                img.src = node.img;
                
                // Clip content to circle
                ctx.save();
                ctx.beginPath();
                ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
                ctx.clip();
                
                // Draw image
                try {
                  ctx.drawImage(img, node.x - size, node.y - size, size * 2, size * 2);
                } catch(e) {
                   // Fallback color if image fails
                   ctx.fillStyle = '#444'; 
                   ctx.fill();
                }
                ctx.restore();
            } else {
                // Fallback for nodes without images (like the Center)
                ctx.beginPath();
                ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
                ctx.fillStyle = node.color || '#fff';
                ctx.fill();
            }
        }}
      />
    </div>
  );
}