import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Stethoscope, User, Shield, Calendar, ChevronRight, Lock, Type, Eye, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { ClinicianPasswordModal } from './ClinicianPasswordModal';

interface SettingsScreenProps {
  onBack: () => void;
  onViewPrivacy: () => void;
  currentLeague: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | null;
  hasLeftLeague: boolean;
  onLeaveLeague: () => void;
  onRejoinLeague: () => void;
  onOpenPeriodTracker: () => void;
  userData?: any;
  onUpdateUserData?: (updates: any) => void;
  onViewClinicianDashboard?: () => void;
}

export function SettingsScreen({ 
  onBack, 
  onViewPrivacy, 
  userData, 
  onUpdateUserData,
  onViewClinicianDashboard 
}: SettingsScreenProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleOpenClinicianDashboard = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    onViewClinicianDashboard?.();
  };

  return (
    <div className="min-h-screen bg-[#FFF0F5] pb-20">
      <div className="bg-gradient-to-r from-[#F487B6] to-[#FFC0D3] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/10 mb-4">
            ← Back
          </Button>
          <h1 className="text-white mb-2">Settings</h1>
          <p className="text-white/80">Manage your preferences</p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Clinical Dashboard Access - Password Protected */}
        {onViewClinicianDashboard && (
          <Card className="border-2 border-blue-300 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Stethoscope className="w-5 h-5" />
                For Healthcare Providers
              </CardTitle>
              <CardDescription className="text-blue-700">
                View patient data with clinical insights and correlation graphs (Password Protected)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleOpenClinicianDashboard}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Lock className="w-4 h-4 mr-2" />
                Open Clinician Dashboard
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-xs text-blue-600 mt-3">
                <strong>🔒 Secure Access:</strong> This view is password-protected and designed for OBGYNs to review patient symptom data, identify patterns, and make diagnostic decisions. Patients cannot access clinical interpretations.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Password Modal */}
        {showPasswordModal && (
          <ClinicianPasswordModal
            onClose={() => setShowPasswordModal(false)}
            onSuccess={handlePasswordSuccess}
          />
        )}

        {/* User Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Adaptive Mode</Label>
                <p className="text-sm text-gray-600">Simplified interface for accessibility</p>
              </div>
              <Switch 
                checked={userData?.adaptiveMode || false}
                onCheckedChange={(checked) => onUpdateUserData?.({ adaptiveMode: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Pregnancy Mode</Label>
                <p className="text-sm text-gray-600">Adjust recommendations for pregnancy</p>
              </div>
              <Switch 
                checked={userData?.isPregnant || false}
                onCheckedChange={(checked) => onUpdateUserData?.({ isPregnant: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Accessibility
            </CardTitle>
            <CardDescription>
              Customize the app to work best for you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Text Size */}
            <div>
              <Label className="mb-3 block flex items-center gap-2">
                <Type className="w-4 h-4" />
                Text size
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={userData?.accessibilityPrefs?.textSize === 'normal' ? 'default' : 'outline'}
                  className={userData?.accessibilityPrefs?.textSize === 'normal' ? 'bg-[#4FB0AE]' : ''}
                  onClick={() => onUpdateUserData?.({
                    accessibilityPrefs: { 
                      ...userData?.accessibilityPrefs, 
                      textSize: 'normal' 
                    }
                  })}
                >
                  Normal
                </Button>
                <Button
                  variant={userData?.accessibilityPrefs?.textSize === 'large' ? 'default' : 'outline'}
                  className={userData?.accessibilityPrefs?.textSize === 'large' ? 'bg-[#4FB0AE]' : ''}
                  onClick={() => onUpdateUserData?.({
                    accessibilityPrefs: { 
                      ...userData?.accessibilityPrefs, 
                      textSize: 'large' 
                    }
                  })}
                >
                  Large
                </Button>
                <Button
                  variant={userData?.accessibilityPrefs?.textSize === 'xlarge' ? 'default' : 'outline'}
                  className={userData?.accessibilityPrefs?.textSize === 'xlarge' ? 'bg-[#4FB0AE]' : ''}
                  onClick={() => onUpdateUserData?.({
                    accessibilityPrefs: { 
                      ...userData?.accessibilityPrefs, 
                      textSize: 'xlarge' 
                    }
                  })}
                >
                  X-Large
                </Button>
              </div>
            </div>

            {/* Reduce Motion */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-[#4FB0AE] mt-0.5" />
                <div>
                  <Label htmlFor="reduceMotion">Reduce motion</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Minimize animations and transitions
                  </p>
                </div>
              </div>
              <Switch
                id="reduceMotion"
                checked={userData?.accessibilityPrefs?.reduceMotion || false}
                onCheckedChange={(checked) => onUpdateUserData?.({
                  accessibilityPrefs: { 
                    ...userData?.accessibilityPrefs, 
                    reduceMotion: checked 
                  }
                })}
              />
            </div>

            {/* Dyslexia Font */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-[#4FB0AE] mt-0.5" />
                <div>
                  <Label htmlFor="dyslexiaFont">Dyslexia-friendly font</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Use OpenDyslexic font for better readability
                  </p>
                </div>
              </div>
              <Switch
                id="dyslexiaFont"
                checked={userData?.accessibilityPrefs?.dyslexiaFont || false}
                onCheckedChange={(checked) => onUpdateUserData?.({
                  accessibilityPrefs: { 
                    ...userData?.accessibilityPrefs, 
                    dyslexiaFont: checked 
                  }
                })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy & Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={onViewPrivacy} variant="outline" className="w-full justify-between">
              View Privacy Settings
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Period Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Period Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full justify-between">
              Manage Period Data
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Clinical Note */}
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <p className="text-sm text-purple-900">
              <strong>🏥 Clinical Tool:</strong> This app is designed to help your OBGYN make better diagnostic decisions. Consistent tracking = better insights for your healthcare team.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}