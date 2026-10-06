import React, { useState } from 'react';
import api from '../api';
import { Upload as UploadIcon, FileVideo, X, CheckCircle } from 'lucide-react';

function Upload() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    try {
      await api.post('/videos/', formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setTitle('');
        setFile(null);
      }, 3000);
    } catch (err) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Upload Content</h1>
        <p className="text-slate-500">Share your best moments with the world</p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Video Title</label>
            <input
              type="text"
              className="input-field"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Give your video a catchy title..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Video File</label>
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
                ${file ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 hover:border-brand-primary bg-slate-50'}
              `}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <input
                id="fileInput"
                type="file"
                className="hidden"
                onChange={e => setFile(e.target.files[0])}
                required
              />

              {!file ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-white rounded-full shadow-sm text-brand-primary">
                    <UploadIcon size={32} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-500">MP4, MOV up to 500MB</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  <div className="p-3 bg-brand-primary text-white rounded-lg">
                    <FileVideo size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-slate-900 truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="p-1 text-slate-400 hover:text-red-500"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || !file}
            className="btn-primary w-full py-3 text-lg flex items-center justify-center gap-2"
          >
            {uploading ? 'Processing...' : 'Publish Video'}
          </button>
        </form>

        {success && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle size={20} />
            <span className="font-medium">Video uploaded successfully! It will appear in your feed soon.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;
