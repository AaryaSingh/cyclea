import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface PrivacyScreenProps {
  onBack: () => void;
  userData?: any;
  onUpdateConsent?: (key: string, value: boolean) => void;
}

export function PrivacyScreen({ onBack }: PrivacyScreenProps) {
  return (
    <div className="min-h-screen bg-[#FFF0F5] pb-20">
      <div className="bg-gradient-to-r from-[#F487B6] to-[#FFC0D3] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/10 mb-4">
            ← Back
          </Button>
          <h1 className="text-white mb-2">Privacy Dashboard</h1>
          <p className="text-white/80">Your health data is private, always.</p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600">Privacy settings coming soon!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
