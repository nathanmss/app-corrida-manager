import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetActiveEvent } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ChevronRight, Clock, Droplets, Flag, MapPin, Route, ShieldCheck, Users, Wind } from "lucide-react";

const routeOptions = [
  {
    distance: "3 km",
    title: "Leve",
    description: "Para caminhada, estreia no evento ou corrida tranquila.",
    tone: "text-primary",
    border: "border-primary/25",
  },
  {
    distance: "5 km",
    title: "Clássico",
    description: "O percurso equilibrado para quem já corre com frequência.",
    tone: "text-secondary-foreground",
    border: "border-secondary/50",
    featured: true,
  },
  {
    distance: "10 km",
    title: "Desafio",
    description: "Para quem quer sustentar ritmo e completar uma distância maior.",
    tone: "text-chart-5",
    border: "border-chart-5/30",
  },
];

const importantInfo = [
  {
    icon: Clock,
    title: "Chegada",
    description: "Chegue com antecedência para se orientar e aquecer com calma.",
  },
  {
    icon: Wind,
    title: "Conforto",
    description: "Use roupa leve, tênis adequado e proteção para atividade ao ar livre.",
  },
  {
    icon: Droplets,
    title: "Hidratação",
    description: "Hidrate-se antes, durante e depois do percurso escolhido.",
  },
  {
    icon: ShieldCheck,
    title: "Responsabilidade",
    description: "A inscrição é pessoal e deve ser feita com dados verdadeiros.",
  },
];

export default function Home() {
  const { data: event, isLoading } = useGetActiveEvent();

  return (
    <div className="min-h-[100dvh] flex flex-col overflow-x-hidden bg-background font-sans">
      <section className="relative isolate min-h-[92dvh] overflow-hidden bg-[#0f7f86] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(7,87,93,0.98)_0%,rgba(15,127,134,0.88)_44%,rgba(236,184,76,0.70)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[linear-gradient(176deg,transparent_0_20%,rgba(250,246,235,0.98)_21%_100%)] sm:h-[24%]" />
        <div className="absolute left-[-12%] top-[18%] h-[58%] w-[124%] rotate-[-8deg] rounded-[50%] border-t-[18px] border-white/20" />
        <div className="absolute left-[8%] top-[44%] h-[1px] w-[84%] rotate-[-8deg] bg-white/45" />
        <div className="absolute left-[15%] top-[42%] h-3 w-3 rounded-full bg-white shadow-[0_0_0_8px_rgba(255,255,255,0.16)]" />
        <div className="absolute right-[18%] top-[31%] h-3 w-3 rounded-full bg-secondary shadow-[0_0_0_8px_rgba(236,184,76,0.20)]" />

        <div className="container relative z-10 mx-auto flex min-h-[92dvh] max-w-6xl flex-col px-4 pt-6 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/14 ring-1 ring-white/25">
                <Droplets className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white/92">Treinão Encontro das Águas</p>
                <p className="text-xs text-white/70">2ª Edição</p>
              </div>
            </div>
            <Link href="/painel/login" className="hidden text-sm font-medium text-white/70 transition-colors hover:text-white sm:block">
              Organização
            </Link>
          </header>

          <div className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:py-14">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="max-w-3xl"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/12 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/88">
                <Flag className="h-4 w-4" />
                Inscrições abertas
              </div>

              <h1 className="text-[2.65rem] font-black leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl">
                Treinão Encontro das Águas — 2ª Edição
              </h1>

              <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white/88 sm:text-lg">
                Um treinão comunitário para celebrar o encontro, o movimento e a energia das águas. Escolha seu percurso, confirme sua presença e venha participar com a gente.
              </p>

              <div className="mt-6 grid gap-2 text-sm text-white/88 sm:grid-cols-3">
                {!isLoading && event ? (
                  <>
                    <div className="flex items-center gap-2 rounded-md border border-white/16 bg-black/12 px-3 py-3">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>5 de julho de 2026</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md border border-white/16 bg-black/12 px-3 py-3">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>{event.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md border border-white/16 bg-black/12 px-3 py-3">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="min-w-0 truncate">{event.location}</span>
                    </div>
                  </>
                ) : (
                  <div className="h-12 rounded-md border border-white/16 bg-white/12 sm:col-span-3" />
                )}
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/inscricao" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="min-h-[56px] w-full rounded-md bg-secondary px-6 text-base font-bold text-secondary-foreground hover:bg-secondary/90 sm:w-auto"
                  >
                    Fazer inscrição
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </Link>
                <a
                  href="#percursos"
                  className="inline-flex min-h-[56px] items-center justify-center rounded-md border border-white/70 bg-white/92 px-6 text-base font-bold text-primary transition-colors hover:bg-white"
                >
                  Ver percursos
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="relative hidden min-h-[430px] lg:block"
              aria-hidden="true"
            >
              <div className="absolute inset-x-8 bottom-10 h-56 rounded-[48%] bg-white/18" />
              <div className="absolute left-10 top-24 h-72 w-72 rounded-full border-[18px] border-white/18" />
              <div className="absolute right-8 top-10 h-52 w-52 rounded-full border-[14px] border-secondary/35" />
              <div className="absolute bottom-14 left-12 right-12 h-2 rotate-[-9deg] rounded-full bg-white/70" />
              <div className="absolute bottom-[8.9rem] left-[9rem] h-5 w-5 rounded-full bg-white shadow-[0_0_0_10px_rgba(255,255,255,0.18)]" />
              <div className="absolute bottom-[11.1rem] right-[10rem] h-5 w-5 rounded-full bg-secondary shadow-[0_0_0_10px_rgba(236,184,76,0.24)]" />
              <div className="absolute bottom-20 right-12 rounded-md border border-white/20 bg-white/14 px-4 py-3 text-sm font-semibold text-white">
                3 km · 5 km · 10 km
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-background py-12 sm:py-16">
        <div className="container mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Droplets className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black tracking-normal text-foreground sm:text-3xl">Um encontro para correr junto</h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              A 2ª edição reúne corredores, caminhantes e pessoas da comunidade em uma manhã de movimento. O foco é participar com segurança, escolher uma distância confortável e celebrar o espaço que volta a receber todos.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-3xl font-black text-primary">3</p>
              <p className="mt-1 text-sm font-semibold text-foreground">Percursos oficiais</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-3xl font-black text-secondary-foreground">0</p>
              <p className="mt-1 text-sm font-semibold text-foreground">Custo de inscrição</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-3xl font-black text-chart-5">1</p>
              <p className="mt-1 text-sm font-semibold text-foreground">Manhã de comunidade</p>
            </div>
          </div>
        </div>
      </section>

      <section id="percursos" className="bg-muted/35 py-12 sm:py-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Percursos</p>
              <h2 className="mt-2 text-2xl font-black text-foreground sm:text-3xl">Escolha a distância do seu momento</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">Todos os percursos fazem parte do mesmo encontro. Escolha com honestidade e aproveite a manhã no seu ritmo.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {routeOptions.map((route) => (
              <Card key={route.distance} className={`relative overflow-hidden border ${route.border} bg-card shadow-sm`}>
                {route.featured ? (
                  <div className="absolute right-4 top-4 rounded-md bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground">
                    Popular
                  </div>
                ) : null}
                <CardContent className="p-5 sm:p-6">
                  <Route className={`mb-5 h-6 w-6 ${route.tone}`} />
                  <div className="flex items-end gap-2">
                    <h3 className={`text-5xl font-black leading-none ${route.tone}`}>{route.distance}</h3>
                    <p className="pb-1 text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">{route.title}</p>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{route.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-12 sm:py-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Antes da largada</p>
            <h2 className="mt-2 text-2xl font-black text-foreground sm:text-3xl">Informações importantes</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {importantInfo.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-lg border bg-card p-4">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#0f7f86] py-12 text-white sm:py-16">
        <div className="container mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Users className="mx-auto mb-4 h-9 w-9 text-secondary" />
          <h2 className="text-2xl font-black sm:text-3xl">Confirme sua presença no treinão</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-white/82">A inscrição é rápida, gratuita e não exige conta. Tenha seus dados em mãos e aceite o termo de responsabilidade para concluir.</p>
          <Link href="/inscricao" className="mt-7 inline-block w-full sm:w-auto">
            <Button
              size="lg"
              className="min-h-[56px] w-full rounded-md bg-white px-6 text-base font-bold text-primary hover:bg-white/90 sm:w-auto"
            >
              Fazer inscrição agora
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="mt-auto bg-foreground py-9 text-background">
        <div className="container mx-auto px-4 text-center">
          <h3 className="mb-2 text-base font-bold text-background/90 sm:text-lg">Treinão Encontro das Águas — 2ª Edição</h3>
          <p className="mb-5 text-sm text-background/60">Uma celebração comunitária do movimento e da energia das águas.</p>
          <Link href="/painel/login" className="text-xs text-background/45 transition-colors hover:text-background/80">
            Acesso da Organização
          </Link>
        </div>
      </footer>
    </div>
  );
}
