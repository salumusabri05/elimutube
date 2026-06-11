'use client';

import { useState, useEffect } from 'react';
import { UploadCloud, Trash2, ExternalLink, HardDrive, RefreshCw, Search, FileText, Video, Image, Music, CheckCircle, AlertCircle } from 'lucide-react';
import { apiRequest, getApiBase } from '@/lib/api';

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // Upload states
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMethod, setUploadMethod] = useState<'presigned' | 'standard'>('presigned');
  const [uploaderId, setUploaderId] = useState('');

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiRequest('admin/assets');
      setAssets(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch assets. Make sure the NestJS backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    setUploadProgress(10);
    setError('');

    try {
      if (uploadMethod === 'standard') {
        // Method 1: Standard server-mediated multipart form upload
        const formData = new FormData();
        formData.append('file', uploadFile);
        if (uploaderId) {
          formData.append('uploader_id', uploaderId);
        }

        const API_BASE = getApiBase();
        const token = localStorage.getItem('adminToken');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE}/admin/upload-asset`, {
          method: 'POST',
          headers,
          body: formData,
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        setUploadProgress(100);
        alert('File uploaded and tracked successfully!');
      } else {
        // Method 2: Direct-to-R2 pre-signed URL upload
        setUploadProgress(20);
        // 1. Get presigned URL
        const presignRes = await apiRequest('admin/presign', {
          method: 'POST',
          body: JSON.stringify({
            filename: uploadFile.name,
            content_type: uploadFile.type,
            uploader_id: uploaderId || undefined,
          }),
        });

        setUploadProgress(40);

        // 2. Put file to R2 directly from browser
        const uploadRes = await fetch(presignRes.upload_url, {
          method: 'PUT',
          body: uploadFile,
          headers: {
            'Content-Type': uploadFile.type,
          },
        });

        if (!uploadRes.ok) {
          throw new Error('Failed to upload directly to Cloudflare R2 bucket.');
        }

        setUploadProgress(85);

        // 3. Confirm upload with size
        await apiRequest(`admin/assets/${presignRes.asset_id}/confirm`, {
          method: 'POST',
          body: JSON.stringify({
            size_bytes: uploadFile.size,
          }),
        });

        setUploadProgress(100);
        alert('Direct-to-R2 upload completed and tracked successfully!');
      }

      setUploadFile(null);
      fetchAssets();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'File upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this asset from the database and Cloudflare R2?')) return;
    try {
      await apiRequest(`admin/assets/${id}/delete`, { method: 'POST' });
      fetchAssets();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Video className="w-5 h-5 text-red-400" />;
      case 'IMAGE': return <Image className="w-5 h-5 text-emerald-400" />;
      case 'AUDIO': return <Music className="w-5 h-5 text-amber-400" />;
      default: return <FileText className="w-5 h-5 text-indigo-400" />;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return 'Pending...';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.original_name.toLowerCase().includes(searchText.toLowerCase()) || 
                          asset.stored_name.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = filterType === 'ALL' || asset.asset_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary tracking-tight flex items-center gap-2">
            <UploadCloud className="w-6 h-6 text-indigo-500" />
            Cloud Storage & R2 Asset Manager
          </h1>
          <p className="text-sm mt-1 theme-text-secondary">Directly upload large lecture files and PDFs, track bucket space, and review storage assets.</p>
        </div>
        <button onClick={fetchAssets} className="flex items-center gap-2 px-4 py-2.5 theme-item-bg theme-item-hover border theme-border theme-text-secondary hover:theme-text-primary text-sm font-semibold rounded-xl transition-all duration-200">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Form Box */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-3xl border theme-border space-y-6">
          <h2 className="text-sm font-bold theme-text-secondary uppercase tracking-wider flex items-center gap-2">
            <UploadCloud className="w-4.5 h-4.5 text-indigo-400" /> Upload Media Files
          </h2>

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold theme-text-secondary">Upload Flow Mode</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-200/50 dark:bg-slate-900/60 p-1 rounded-xl border theme-border">
                <button 
                  type="button" 
                  onClick={() => setUploadMethod('presigned')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    uploadMethod === 'presigned' ? 'bg-indigo-600 text-white shadow' : 'theme-text-secondary hover:theme-text-primary'
                  }`}
                >
                  R2 Direct (Large Video)
                </button>
                <button 
                  type="button" 
                  onClick={() => setUploadMethod('standard')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    uploadMethod === 'standard' ? 'bg-indigo-600 text-white shadow' : 'theme-text-secondary hover:theme-text-primary'
                  }`}
                >
                  Standard Form
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold theme-text-secondary">Uploader User ID (Optional)</label>
              <input 
                type="text" 
                placeholder="User UUID" 
                value={uploaderId}
                onChange={(e) => setUploaderId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-xs theme-text-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold theme-text-secondary">Choose File (500MB Limit)</label>
              <div className="border border-dashed theme-border rounded-xl p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer relative bg-slate-100/50 dark:bg-slate-900/20">
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="video/*,image/*,application/pdf,audio/*"
                />
                <UploadCloud className="w-8 h-8 mx-auto text-indigo-500/50 mb-2" />
                <span className="text-xs theme-text-secondary block font-medium truncate">
                  {uploadFile ? uploadFile.name : 'Select video, PDF, or image'}
                </span>
                {uploadFile && (
                  <span className="text-[10px] theme-text-secondary mt-1 block">
                    {(uploadFile.size / 1024 / 1024).toFixed(2)} MB • {uploadFile.type}
                  </span>
                )}
              </div>
            </div>

            {uploading && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] theme-text-secondary">
                  <span>Uploading to Cloudflare...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={!uploadFile || uploading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/15"
            >
              {uploading ? 'Processing...' : 'Start Upload'}
            </button>
          </form>

          <div className="p-4 theme-item-bg rounded-2xl border theme-border text-xs space-y-1.5 theme-text-secondary">
            <h4 className="font-bold theme-text-primary mb-1">Supported File Rules:</h4>
            <p>• MP4, WEBM, Quicktime (Videos)</p>
            <p>• PDF Documents (Handouts & Notes)</p>
            <p>• JPEG, PNG, WEBP (Images & Covers)</p>
            <p>• MP3, WAV (Lectures & Audiobooks)</p>
          </div>
        </div>

        {/* Assets List Table */}
        <div className="lg:col-span-2 glass-panel rounded-3xl overflow-hidden border theme-border flex flex-col">
          <div className="p-6 border-b theme-border bg-slate-100/50 dark:bg-[#0d1223]/30 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            
            {/* Filter Group */}
            <div className="flex gap-1 bg-slate-200/50 dark:bg-slate-900/60 p-0.5 rounded-xl border theme-border self-start">
              {['ALL', 'VIDEO', 'PDF', 'IMAGE'].map(type => (
                <button 
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    filterType === type ? 'bg-indigo-600 text-white shadow' : 'theme-text-secondary hover:theme-text-primary'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="relative">
              <input 
                type="text" 
                placeholder="Search uploaded files..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary placeholder-slate-500 w-60"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="text-center py-20 theme-text-secondary">
                No storage assets found matching criteria.
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b theme-border bg-slate-100/20 dark:bg-[#090b16]/30 theme-text-secondary font-bold uppercase tracking-wider">
                    <th className="px-4 py-3">File Type</th>
                    <th className="px-4 py-3">Original Name</th>
                    <th className="px-4 py-3">File Size</th>
                    <th className="px-4 py-3">Storage</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y theme-border text-sm">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="theme-item-hover transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {getFileIcon(asset.asset_type)}
                          <span className="font-semibold text-xs theme-text-secondary">{asset.asset_type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 max-w-[240px]">
                        <p className="font-bold text-xs theme-text-primary truncate">{asset.original_name}</p>
                        <p className="text-[10px] theme-text-secondary truncate mt-0.5">{asset.stored_name}</p>
                      </td>
                      <td className="px-4 py-3.5 theme-text-primary font-mono text-xs">
                        {formatSize(asset.size_bytes)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          asset.storage === 'R2' ? 'bg-indigo-500/15 text-indigo-400' : 'bg-amber-500/15 text-amber-400'
                        }`}>
                          {asset.storage}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex justify-end gap-1.5">
                          <a 
                            href={asset.public_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-1.5 rounded-lg theme-item-bg border theme-border text-indigo-400 hover:text-indigo-500 hover:theme-item-hover transition-all"
                            title="Open URL"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDelete(asset.id)}
                            className="p-1.5 rounded-lg theme-item-bg border theme-border text-red-400 hover:text-red-500 hover:theme-item-hover transition-all"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
