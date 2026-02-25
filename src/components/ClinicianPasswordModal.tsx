import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Lock, X, AlertCircle } from 'lucide-react';

interface ClinicianPasswordModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

// Demo password - in production this would be handled securely on backend
const CLINICIAN_PASSWORD = 'doctor';

export function ClinicianPasswordModal({ onClose, onSuccess }: ClinicianPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === CLINICIAN_PASSWORD) {
      onSuccess();
    } else {
      setError('Incorrect password. Please try again.');
      setAttempts(prev => prev + 1);
      setPassword('');
      
      if (attempts >= 2) {
        setError('Too many failed attempts. Please contact support.');
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Clinician Access</h2>
                <p className="text-sm text-gray-600">Healthcare providers only</p>
              </div>
            </div>
            <Button onClick={onClose} variant="ghost" size="icon">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900">
                <p className="font-semibold mb-1">Protected Health Information</p>
                <p>
                  This area contains patient data with clinical interpretation tools.
                  Access is restricted to licensed healthcare providers only.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clinician Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter clinician password"
                autoFocus
                disabled={attempts >= 3}
                className="w-full"
              />
              {error && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              )}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Demo Note:</strong> For testing purposes, use password: <code className="bg-gray-200 px-1 rounded">doctor</code>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                In production, this would integrate with your practice's authentication system.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={!password || attempts >= 3}
              >
                Access Dashboard
              </Button>
            </div>
          </form>

          <div className="border-t pt-4 mt-4">
            <p className="text-xs text-gray-500 text-center">
              Patient users cannot access this area. All activity is logged for HIPAA compliance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}