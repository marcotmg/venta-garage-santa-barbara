import React, { useState, useEffect } from 'react';
import { Github, Send, CheckCircle2, Loader2, AlertCircle, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const GitHubPublish = () => {
  const [user, setUser] = useState<any>(null);
  const [repoName, setRepoName] = useState('venta-garage-santa-barbara');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
    
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) return;
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        checkAuth();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/github/user');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (e) {
      console.error('Auth check failed');
    }
  };

  const handleConnect = async () => {
    try {
      const res = await fetch('/api/auth/github/url');
      const { url } = await res.json();
      window.open(url, 'github_oauth', 'width=600,height=700');
    } catch (e) {
      setError('No se pudo obtener la URL de autenticación');
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishStatus('idle');
    setError('');
    
    try {
      const res = await fetch('/api/github/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoName }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setPublishStatus('success');
        setRepoUrl(data.url);
      } else {
        setPublishStatus('error');
        const detailMessage = data.details?.message || data.error || 'Error al publicar';
        setError(detailMessage);
      }
    } catch (e) {
      setPublishStatus('error');
      setError('Error de conexión');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDownloadZip = () => {
    window.location.href = '/api/project/download';
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-zinc-900 rounded-lg">
          <Github className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-zinc-900">Publicar en GitHub</h3>
          <p className="text-sm text-zinc-500">Sincroniza tu catálogo con un repositorio</p>
        </div>
      </div>

      {!user ? (
        <div className="space-y-3">
          <button
            onClick={handleConnect}
            className="w-full py-3 px-4 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
          >
            <Github className="w-5 h-5" />
            Conectar con GitHub
          </button>
          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-100"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-zinc-400">O también</span></div>
          </div>

          <button
            onClick={handleDownloadZip}
            className="w-full py-3 px-4 bg-white text-zinc-900 border border-zinc-200 rounded-xl font-medium hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Descargar como ZIP
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
            <img src={user.avatar_url} alt={user.login} className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-sm font-medium text-zinc-900">{user.name || user.login}</p>
              <p className="text-xs text-zinc-500">@{user.login}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5 ml-1">
              Nombre del Repositorio
            </label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
              placeholder="nombre-del-repo"
            />
          </div>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="w-full py-3 px-4 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isPublishing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            {isPublishing ? 'Publicando...' : 'Publicar Actualización'}
          </button>

          <button
            onClick={handleDownloadZip}
            className="w-full py-2 px-4 text-zinc-500 text-xs font-medium hover:text-zinc-900 transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Descargar respaldo ZIP
          </button>

          <AnimatePresence>
            {publishStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-900">¡Publicado con éxito!</p>
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-700 underline hover:text-emerald-800"
                  >
                    Ver repositorio en GitHub
                  </a>
                </div>
              </motion.div>
            )}

            {publishStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Error al publicar</p>
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
