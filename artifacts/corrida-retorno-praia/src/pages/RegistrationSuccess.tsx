import React from "react";
import { Link, useRoute } from "wouter";
import { useGetRegistrationByCode, getGetRegistrationByCodeQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, CheckCircle2, Hash, MapPin, Route, Share2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function RegistrationSuccess() {
  const [, params] = useRoute("/inscricao/sucesso/:code");
  const code = params?.code;

  const { data: registration, isLoading } = useGetRegistrationByCode(code!, {
    query: { enabled: !!code, queryKey: getGetRegistrationByCodeQueryKey(code ?? "") }
  });

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-muted/30 px-4">
        <div className="flex animate-pulse flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/20" />
          <div className="h-4 w-40 rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-muted/30 p-4 text-center">
        <h1 className="mb-2 text-2xl font-bold text-destructive">Inscrição não encontrada</h1>
        <p className="mb-6 text-muted-foreground">O código informado é inválido ou a inscrição não existe.</p>
        <Button asChild>
          <Link href="/">Voltar ao início</Link>
        </Button>
      </div>
    );
  }

  const shareText = encodeURIComponent(`Me inscrevi para o Treinão Encontro das Águas — 2ª Edição! Meu percurso será de ${registration.routeName}. Vem participar também!`);
  const whatsappUrl = `https://wa.me/?text=${shareText}`;
  const eventDate = format(new Date(`${registration.eventDate}T${registration.eventTime}`), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-background font-sans">
      <section className="relative isolate overflow-hidden bg-[#0f7f86] px-4 pb-16 pt-8 text-white sm:px-6 sm:pb-20">
        <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[linear-gradient(176deg,transparent_0_18%,rgba(250,246,235,1)_19%_100%)] sm:h-[24%]" />
        <div className="absolute left-[-10%] top-[34%] h-[1px] w-[120%] rotate-[-8deg] bg-white/35" />
        <div className="absolute left-[18%] top-[32%] h-3 w-3 rounded-full bg-white shadow-[0_0_0_8px_rgba(255,255,255,0.16)]" />
        <div className="absolute right-[18%] top-[24%] h-3 w-3 rounded-full bg-secondary shadow-[0_0_0_8px_rgba(236,184,76,0.22)]" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-md bg-white text-primary shadow-sm sm:h-20 sm:w-20">
            <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12" />
          </div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-secondary">Inscrição confirmada</p>
          <h1 className="text-3xl font-black leading-tight tracking-normal sm:text-5xl">Sua presença está registrada</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/86 sm:text-lg">
            Obrigado, {registration.fullName}. A organização poderá entrar em contato pelo WhatsApp informado caso precise ajustar alguma informação.
          </p>
        </div>
      </section>

      <main className="relative z-20 mx-auto -mt-8 max-w-3xl px-4 pb-12 sm:px-6">
        <Card className="overflow-hidden border shadow-lg">
          <div className="border-b bg-card px-5 py-4 sm:px-6">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-primary">
              <Hash className="h-4 w-4" />
              Comprovante de inscrição
            </h2>
          </div>

          <CardContent className="space-y-6 p-5 sm:p-6">
            <div>
              <p className="mb-1 text-sm text-muted-foreground">Participante</p>
              <p className="break-words text-2xl font-black leading-tight text-foreground">{registration.fullName}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Route className="h-5 w-5" />
                </div>
                <p className="text-sm text-muted-foreground">Percurso</p>
                <p className="mt-1 text-xl font-black text-foreground">{registration.routeName}</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-secondary/25 text-secondary-foreground">
                  <Hash className="h-5 w-5" />
                </div>
                <p className="text-sm text-muted-foreground">Código</p>
                <p className="mt-1 break-all font-mono text-xl font-black text-foreground">{registration.registrationCode}</p>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="font-bold text-foreground">{eventDate}</p>
                  <p className="break-words text-sm text-muted-foreground">{registration.eventName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="min-w-0 break-words font-bold text-foreground">{registration.location}</p>
              </div>
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
              Guarde este comprovante. No dia do evento, leve um documento com CPF e chegue com antecedência para receber as orientações da organização.
            </p>
          </CardContent>
        </Card>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button asChild size="lg" className="min-h-[56px] w-full rounded-md bg-[#25D366] text-base font-bold text-white hover:bg-[#20bd5a]">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Share2 className="h-5 w-5" />
              Compartilhar
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-h-[56px] w-full rounded-md bg-background text-base font-bold">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              Voltar ao início
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
