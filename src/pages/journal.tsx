import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Modal from '@/components/Modal';

interface JournalEntry {
  id: number;
  content: string;
  created_at: string;
  trade_id: number | null;
}

export default function JournalPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // Check auth
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (!data.user) {
          router.push('/');
        } else {
          setUser(data.user);
        }
      })
      .catch(() => router.push('/'));

    // Fetch journal entries
    fetch('/api/journal-entries')
      .then(r => r.json())
      .then(data => {
        setEntries(data.entries || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching journal entries:', err);
        setLoading(false);
      });
  }, [router]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('Veuillez entrer du contenu');
      return;
    }

    setPosting(true);
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const newEntry = await response.json();
        setEntries([newEntry.entry, ...entries]);
        setContent('');
      }
    } catch (error) {
      console.error('Error posting entry:', error);
      alert('Erreur lors de la publication');
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (entryId: number) => {
    try {
      const response = await fetch(`/api/journal/${entryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEntries(entries.filter(e => e.id !== entryId));
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-dark">
      {/* Navigation */}
      <nav className="bg-dark-secondary border-b border-dark-tertiary sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-500">
              🏰 Empire Noble North
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
                Dashboard
              </Link>
              <Link href="/positions" className="text-gray-300 hover:text-white transition">
                Positions
              </Link>
              <Link href="/history" className="text-gray-300 hover:text-white transition">
                Historique
              </Link>
              <Link href="/goals" className="text-gray-300 hover:text-white transition">
                Objectifs
              </Link>
              <Link href="/journal" className="text-blue-400 hover:text-blue-300 font-semibold">
                Journal
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">{user.email}</span>
            <a href="/api/auth/logout" className="text-red-500 hover:text-red-400 transition text-sm">
              Déconnexion
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">📔 Journal de Trading</h1>
          <p className="text-gray-400">Analyse psychologique, lessons learned, observations personnelles</p>
        </div>

        {/* New Entry Form */}
        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Nouvelle Entrée</h2>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Partagez vos pensées, observations, lessons learned..."
            className="w-full h-32 bg-dark-tertiary px-3 py-2 rounded border border-dark-tertiary text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
          />
          <button
            onClick={handleSubmit}
            disabled={posting || !content.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {posting ? 'Publication en cours...' : '📤 Publier'}
          </button>
        </div>

        {/* Entries List */}
        <div className="space-y-4">
          {loading ? (
            <div className="card text-center py-8">
              <p className="text-gray-400">Chargement du journal...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-400 text-lg">Aucune entrée pour le moment</p>
              <p className="text-gray-500 text-sm mt-2">Commencez à documenter votre parcours de trading 📝</p>
            </div>
          ) : (
            entries.map(entry => (
              <div key={entry.id} className="card hover:bg-dark-tertiary transition">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-xs text-gray-400">
                    {new Date(entry.created_at).toLocaleString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedEntry(entry);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-500 hover:text-red-400 transition font-semibold text-sm"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
                <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{entry.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {selectedEntry && (
        <Modal
          isOpen={showDeleteModal}
          title="Supprimer cette entrée ?"
          onClose={() => setShowDeleteModal(false)}
          onSubmit={async () => {
            if (selectedEntry) {
              await handleDelete(selectedEntry.id);
            }
          }}
          submitLabel="Supprimer"
        >
          <p className="text-gray-300 text-sm">
            Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cette entrée ?
          </p>
        </Modal>
      )}
    </div>
  );
}
