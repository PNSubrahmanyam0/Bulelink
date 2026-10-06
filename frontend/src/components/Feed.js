import React, { useEffect, useState } from 'react';
import api from '../api';
import { Play, Heart, MessageCircle, Share2 } from 'lucide-react';

function Feed() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/feed/')
      .then(res => setVideos(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Explore</h1>
        <p className="text-slate-500">Discover the latest from your creators</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(v => (
          <div key={v.id} className="card group cursor-pointer">
            <div className="relative aspect-video bg-black overflow-hidden">
              <video
                src={v.source_url}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                muted
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => {
                  e.target.pause();
                  e.target.currentTime = 0;
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                  <Play fill="currentColor" size={24} />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {v.duration ? `${Math.floor(v.duration)}s` : 'Live'}
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-slate-900 line-clamp-1">{v.title}</h3>
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">{v.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex gap-4">
                  <button className="flex items-center gap-1 text-slate-500 hover:text-brand-accent transition-colors text-sm">
                    <Heart size={16} /> <span>{Math.floor(Math.random() * 1000)}</span>
                  </button>
                  <button className="flex items-center gap-1 text-slate-500 hover:text-brand-primary transition-colors text-sm">
                    <MessageCircle size={16} /> <span>{Math.floor(Math.random() * 100)}</span>
                  </button>
                </div>
                <button className="text-slate-500 hover:text-brand-primary transition-colors">
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;
