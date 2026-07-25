import React, { useState } from 'react';
import axios from 'axios';
import { Zap, Upload, Link as LinkIcon } from 'lucide-react';

const ConnexionCTrader: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleConnect = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/ctrader/auth-url`
      );

      window.location.href = response.data.authUrl;
    } catch (err: any) {
      setError('Impossible de lancer la connexion cTrader');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const fileContent = await file.text();
      const fileType = file.name.split('.').pop() || 'csv';
      const accountId = localStorage.getItem('accountId');

      if (!accountId) {
        setError('Aucun compte sélectionné');
        return;
      }

      await axios.post(
        `${process.env.REACT_APP_API_URL}/ctrader/upload-statement`,
        { accountId, fileContent, fileType },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setMessage(`✓ Trades importés avec succès depuis ${file.name}`);
      e.target.value = '';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Impossible de télécharger le fichier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Intégration cTrader</h1>
        <p className="text-slate-600">Connectez votre compte cTrader ou importez des relevés de trades</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
          {message}
        </div>
      )}

      {/* Options d'intégration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connexion OAuth */}
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-lg mb-4">
            <LinkIcon size={32} className="text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Connecter un compte cTrader</h2>
          <p className="text-slate-600 text-sm mb-6">
            Connectez facilement votre compte cTrader pour une synchronisation automatique des trades et des mises à jour en temps réel.
          </p>
          <button
            onClick={handleConnect}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Zap size={20} />
            {loading ? 'Connexion en cours...' : 'Se connecter à cTrader'}
          </button>
          <p className="text-xs text-slate-500 mt-4 text-center">
            Vous serez redirigé vers cTrader pour l'authentification
          </p>
        </div>

        {/* Téléchargement de fichier */}
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-4">
            <Upload size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Télécharger un relevé</h2>
          <p className="text-slate-600 text-sm mb-6">
            Importez votre historique de trading en téléchargeant des fichiers de relevé cTrader (CSV, Excel ou HTML).
          </p>
          <label className="block">
            <span className="sr-only">Choisir un fichier</span>
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={loading}
              accept=".csv,.xlsx,.html"
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
          </label>
          <p className="text-xs text-slate-500 mt-4">
            Formats supportés : CSV, Excel (.xlsx), HTML
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Comment exporter un relevé cTrader</h3>
        <ol className="text-blue-900 text-sm space-y-2 list-decimal list-inside">
          <li>Ouvrez le Terminal cTrader</li>
          <li>Allez à l'onglet Historique → Relevé de compte</li>
          <li>Sélectionnez la plage de dates (si nécessaire)</li>
          <li>Cliquez sur Exporter → Choisissez le format (CSV/Excel/HTML)</li>
          <li>Téléchargez le fichier ici</li>
        </ol>
      </div>
    </div>
  );
};

export default ConnexionCTrader;