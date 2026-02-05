import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: 'Email obrigatorio',
        description: 'Digite seu email para recuperar a senha.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });

      if (error) {
        toast({
          title: 'Erro ao enviar email',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setSent(true);
        toast({
          title: 'Email enviado!',
          description: 'Verifique sua caixa de entrada.',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Erro',
        description: err.message || 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-medium border-border/50">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold">Email enviado!</h2>
              <p className="text-muted-foreground">
                Enviamos um link de recuperacao para <strong>{email}</strong>.
                Verifique sua caixa de entrada e spam.
              </p>
              <Link to="/login">
                <Button variant="outline" className="mt-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-medium border-border/50">
          <CardHeader className="space-y-4 text-center">
            <motion.div
              className="mx-auto w-16 h-16 gradient-hero rounded-2xl flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Flame className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-display">Esqueci minha senha</CardTitle>
              <CardDescription>
                Digite seu email para receber o link de recuperacao
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar link de recuperacao'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/login" className="hover:text-primary transition-colors flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
