import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn } from 'lucide-react';

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm = ({ onToggleMode }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError('Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort.');
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center justify-center mb-6">
        <LogIn className="w-8 h-8 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Anmelden</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            E-Mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ihre@email.de"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Passwort
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Wird angemeldet...' : 'Anmelden'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Noch kein Konto?{' '}
          <button
            onClick={onToggleMode}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Jetzt registrieren
          </button>
        </p>
      </div>
    </div>
  );
};
