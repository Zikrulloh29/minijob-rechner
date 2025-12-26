import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus } from 'lucide-react';

interface RegisterFormProps {
  onToggleMode: () => void;
}

export const RegisterForm = ({ onToggleMode }: RegisterFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein.');
      return;
    }

    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password);

    if (error) {
      setError('Registrierung fehlgeschlagen. Möglicherweise existiert die E-Mail bereits.');
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center justify-center mb-6">
        <UserPlus className="w-8 h-8 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Registrieren</h2>
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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Passwort bestätigen
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? 'Wird registriert...' : 'Registrieren'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Bereits ein Konto?{' '}
          <button
            onClick={onToggleMode}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Jetzt anmelden
          </button>
        </p>
      </div>
    </div>
  );
};
