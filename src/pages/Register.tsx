import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useAuthContext } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import coverLogo from '@/assets/cover-logo.png';
import { LanguageSelector } from '@/components/LanguageSelector';

export default function Register() {
  const navigate = useNavigate();
  const { signUp, isAuthenticated, loading } = useAuthContext();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const signUpSchema = z.object({
    email: z.string().email(t('auth.invalidCredentials')),
    password: z.string().min(6, t('auth.password')),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Check password confirmation first
      if (password !== confirmPassword) {
        setErrors({ confirmPassword: t('auth.passwordMismatch') });
        setIsSubmitting(false);
        return;
      }

      const validation = signUpSchema.safeParse({ email, password });
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        setIsSubmitting(false);
        return;
      }

      // Sign up without prenom - child profiles handle names
      const { error } = await signUp(email, password, '');
      
      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: t('common.error'),
            description: t('auth.accountExists'),
            variant: "destructive"
          });
        } else {
          toast({
            title: t('common.error'),
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: t('auth.registerSuccess'),
          description: t('auth.registerSuccessDesc'),
        });
        navigate('/');
      }
    } catch (err) {
      toast({
        title: t('common.error'),
        description: t('common.error'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-auth-gradient flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-golden border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-auth-gradient relative overflow-x-hidden overflow-y-auto">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>

      {/* Animated particles/stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-golden/60 rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 py-4 sm:py-6 px-3 sm:px-4 min-h-screen flex flex-col">
        <div className="container max-w-md mx-auto flex-1 flex flex-col w-full">
          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-3 sm:mb-4 self-start text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            {t('nav.back')}
          </button>

          {/* Logo */}
          <div className="text-center mb-4 sm:mb-6 flex-shrink-0">
            <div className="inline-block p-2 sm:p-4 bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl">
              <img 
                src={coverLogo} 
                alt="Héros de la Classe" 
                className="w-full max-w-[200px] sm:max-w-xs mx-auto drop-shadow-2xl rounded-xl sm:rounded-2xl"
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="font-display text-2xl sm:text-3xl text-white mb-1 sm:mb-2 drop-shadow-lg">
              {t('auth.registerTitle')}
            </h1>
            <p className="text-white/80 text-sm sm:text-base px-2">
              {t('auth.registerSubtitle')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-2xl">
            {/* Email */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base font-semibold flex items-center gap-2 text-white">
                <Mail className="w-4 h-4 text-golden" />
                {t('auth.email')}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemple.com"
                className="h-10 sm:h-12 text-sm sm:text-base bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-golden focus:ring-golden/50"
              />
              {errors.email && (
                <p className="text-xs sm:text-sm text-red-300">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base font-semibold flex items-center gap-2 text-white">
                <Lock className="w-4 h-4 text-golden" />
                {t('auth.password')}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-10 sm:h-12 text-sm sm:text-base bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-golden focus:ring-golden/50"
              />
              {errors.password && (
                <p className="text-xs sm:text-sm text-red-300">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm sm:text-base font-semibold flex items-center gap-2 text-white">
                <Lock className="w-4 h-4 text-golden" />
                {t('auth.confirmPassword')}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="h-10 sm:h-12 text-sm sm:text-base bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-golden focus:ring-golden/50"
              />
              {errors.confirmPassword && (
                <p className="text-xs sm:text-sm text-red-300">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 sm:h-14 text-base sm:text-lg font-display font-bold bg-gradient-to-r from-golden to-orange-500 hover:from-golden/90 hover:to-orange-500/90 text-white border-0 shadow-lg shadow-golden/30"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                t('auth.registerButton')
              )}
            </Button>

            {/* Toggle to login */}
            <div className="text-center pt-1 sm:pt-2">
              <Link
                to="/auth"
                className="text-golden hover:text-golden/80 hover:underline font-medium transition-colors text-sm sm:text-base"
              >
                {t('auth.hasAccount')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
