import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ActorNetworkGraph } from '../components/ActorNetworkGraph';
import { ActorNetwork } from '../types';
import { Network } from 'lucide-react';

export const NetworkPage: React.FC = () => {
  const { actorId } = useParams<{ actorId?: string }>();
  const { t } = useTranslation();

  const [graphData, setGraphData] = useState<ActorNetwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGraph = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/actors/network${actorId ? `?actorId=${actorId}` : ''}`);
        if (!res.ok) throw new Error('Không thể kết nối đến máy chủ.');
        const data = await res.json();
        if (data.success) {
          setGraphData(data.data);
        } else {
          throw new Error(data.message || 'Không có dữ liệu mạng lưới.');
        }
      } catch (err) {
        console.error('Fetch network graph error', err);
        setError((err as Error).message || 'Có lỗi xảy ra khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, [actorId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pt-6">
        <div className="h-96 rounded-3xl skeleton-box" />
      </div>
    );
  }

  if (error || !graphData) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 my-12 border border-slate-800">
        <h2 className="text-lg font-bold text-slate-200">{error || 'Không tìm thấy dữ liệu mạng lưới.'}</h2>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Network className="w-3.5 h-3.5" />
          <span>Vượt trội hơn IMDb</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-100">{t('network.title')}</h1>
        <p className="text-xs sm:text-sm text-slate-400">{t('network.subtitle')}</p>
      </div>

      <ActorNetworkGraph graphData={graphData} currentActorId={actorId ? parseInt(actorId, 10) : undefined} />
    </div>
  );
};
