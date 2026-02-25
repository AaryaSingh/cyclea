import { motion } from 'motion/react';
import { Shield, Heart, Lock } from 'lucide-react';
import { Button } from './ui/button';

interface SplashScreenProps {
  onContinue: () => void;
}

export function SplashScreen({ onContinue }: SplashScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFC0D3] to-[#F487B6] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8 inline-block"
        >
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Heart className="w-12 h-12 text-[#F487B6]" fill="#F487B6" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white mb-4"
        >
          Your health. Your data. <br />
          <span className="italic">Private, always.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/90 mb-8"
        >
          Track your cycle, gut health, mood, and energy in one beautiful, secure place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-4 mb-8"
        >
          <div className="flex items-center gap-3 text-white/90">
            <Shield className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm text-left">End-to-end encrypted. Your data never leaves your control.</p>
          </div>
          <div className="flex items-center gap-3 text-white/90">
            <Lock className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm text-left">No selling to advertisers. No sharing with governments.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Button
            onClick={onContinue}
            size="lg"
            className="w-full bg-white text-[#F487B6] hover:bg-white/90"
          >
            Get Started
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
