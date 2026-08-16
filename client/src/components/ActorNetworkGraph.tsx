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
      if (!canvas || !canvas.parentElement) return null;

      const parentWidth = canvas.parentElement.clientWidth || 360;
      const width = parentWidth;
      const height = window.innerWidth < 640 ? 320 : 450;

      canvas.width = width;
      canvas.height = height;

      // Scale factor based on canvas width
      const scale = Math.min(1, Math.max(0.45, width / 700));

      // Dynamic radius with ample margin for labels around the edges
      const radius = Math.min(width, height) * 0.35;

      const centerNodeRadius = Math.round(26 * scale);
      const nodeRadius = Math.round(18 * scale);

      const fontSizeCenter = `bold ${Math.max(9, Math.round(12 * scale))}px sans-serif`;
      const fontSizeNode = `${Math.max(8, Math.round(11 * scale))}px sans-serif`;
      const fontSizeLink = `${Math.max(7.5, Math.round(10 * scale))}px sans-serif`;

      const fontOffsetCenter = Math.round(36 * scale);
      const fontOffsetNode = Math.round(28 * scale);

      const nonCenterNodes = activeData.nodes.filter((n) => n.id.toString() !== activeCenterId.toString());
      const totalNonCenter = Math.max(1, nonCenterNodes.length);

      let nonCenterIndex = 0;
      const nodes = activeData.nodes.map((node) => {
        if (node.id.toString() === activeCenterId.toString()) {
          return { ...node, x: width / 2, y: height / 2, radiusSize: centerNodeRadius };
        }
        const angle = (nonCenterIndex / totalNonCenter) * 2 * Math.PI - Math.PI / 2;
        nonCenterIndex++;
        return {
          ...node,
          x: width / 2 + radius * Math.cos(angle),
          y: height / 2 + radius * Math.sin(angle),
          radiusSize: nodeRadius
        };
      });

      ctx.clearRect(0, 0, width, height);

      // Draw links
      activeData.links.forEach((link) => {
        const sourceNode = nodes.find((n) => n.id.toString() === link.source.toString());
        const targetNode = nodes.find((n) => n.id.toString() === link.target.toString());

        if (sourceNode && targetNode) {
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
          ctx.lineWidth = Math.max(1, Math.round(Math.min(link.shared_count || 1, 4) * scale));
          ctx.stroke();

          const midX = (sourceNode.x + targetNode.x) / 2;
          const midY = (sourceNode.y + targetNode.y) / 2;
          ctx.fillStyle = '#94a3b8';
          ctx.font = fontSizeLink;
          ctx.textAlign = 'center';
          ctx.fillText(link.movie_title || '', midX, midY - 4);
        }
      });

      // Draw nodes
      nodes.forEach((node) => {
        const isCenter = node.id.toString() === activeCenterId.toString();
        const r = isCenter ? centerNodeRadius : nodeRadius;

        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
        ctx.fillStyle = isCenter ? '#f59e0b' : '#06b6d4';
        ctx.fill();
        ctx.lineWidth = Math.max(1.5, Math.round(3 * scale));
        ctx.strokeStyle = '#0f172a';
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = isCenter ? fontSizeCenter : fontSizeNode;
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y + (isCenter ? fontOffsetCenter : fontOffsetNode));
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
        const r = (node as any).radiusSize || 20;
        const dist = Math.hypot(node.x - clickX, node.y - clickY);
        return dist <= r + 10;
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
    <div className="w-full relative glass-panel rounded-3xl p-3 sm:p-4 border border-slate-800 overflow-hidden">
      <canvas ref={canvasRef} className="w-full cursor-pointer touch-none block" />
    </div>
  );
};
