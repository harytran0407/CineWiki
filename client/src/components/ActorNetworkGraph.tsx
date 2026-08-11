import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActorNetwork, GraphNode } from '../types';

interface ActorNetworkGraphProps {
  data?: ActorNetwork;
  graphData?: ActorNetwork;
  centerActorId?: number;
  currentActorId?: number;
}

export const ActorNetworkGraph: React.FC<ActorNetworkGraphProps> = ({
  data,
  graphData,
  centerActorId,
  currentActorId
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const activeData = data || graphData || { nodes: [], links: [] };
  const activeCenterId = centerActorId || currentActorId || 2038;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setupAndRender = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth || 800;
      canvas.height = 450;
      const width = canvas.width;
      const height = canvas.height;

      const nodes = activeData.nodes.map((node, index) => {
        if (node.id.toString() === activeCenterId.toString()) {
          return { ...node, x: width / 2, y: height / 2 };
        }
        const angle = (index / Math.max(1, activeData.nodes.length - 1)) * 2 * Math.PI;
        const radius = 160;
        return {
          ...node,
          x: width / 2 + radius * Math.cos(angle),
          y: height / 2 + radius * Math.sin(angle)
        };
      });

      ctx.clearRect(0, 0, width, height);

      activeData.links.forEach((link) => {
        const sourceNode = nodes.find((n) => n.id.toString() === link.source.toString());
        const targetNode = nodes.find((n) => n.id.toString() === link.target.toString());

        if (sourceNode && targetNode) {
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
          ctx.lineWidth = Math.min(link.shared_count || 1, 4);
          ctx.stroke();

          const midX = (sourceNode.x + targetNode.x) / 2;
          const midY = (sourceNode.y + targetNode.y) / 2;
          ctx.fillStyle = '#94a3b8';
          ctx.font = '10px sans-serif';
          ctx.fillText(link.movie_title || '', midX - 20, midY - 5);
        }
      });

      nodes.forEach((node) => {
        const isCenter = node.id.toString() === activeCenterId.toString();

        ctx.beginPath();
        ctx.arc(node.x, node.y, isCenter ? 26 : 18, 0, 2 * Math.PI);
        ctx.fillStyle = isCenter ? '#f59e0b' : '#06b6d4';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#0f172a';
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = isCenter ? 'bold 12px sans-serif' : '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y + (isCenter ? 40 : 32));
      });

      return nodes;
    };

    let currentNodes = setupAndRender();

    const handleResize = () => {
      currentNodes = setupAndRender();
    };

    window.addEventListener('resize', handleResize);

    const handleCanvasClick = (e: MouseEvent) => {
      if (!currentNodes) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const clicked = currentNodes.find((node) => {
        const dist = Math.hypot(node.x - clickX, node.y - clickY);
        return dist <= 25;
      });

      if (clicked) {
        setSelectedNode(clicked);
        if (clicked.id.toString() !== activeCenterId.toString()) {
          navigate(`/actor/${clicked.id}`);
        }
      }
    };

    canvas.addEventListener('click', handleCanvasClick);
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [activeData, activeCenterId, navigate]);

  if (!activeData.nodes || activeData.nodes.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-10 text-center border border-slate-800 text-xs text-slate-400">
        Không có dữ liệu mạng lưới cho diễn viên này.
      </div>
    );
  }

  return (
    <div className="w-full relative glass-panel rounded-3xl p-4 border border-slate-800">
      <canvas ref={canvasRef} className="w-full h-[450px] cursor-pointer" />
    </div>
  );
};
