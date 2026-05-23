import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useGetActiveEvent, useCreateRegistration, type RegistrationInputSex } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

const TERMS_VERSION = "2026-05-18-v1";

const TERMS_TEXT = `Ao confirmar minha inscrição no Treinão Encontro das Águas — 2ª Edição, declaro, para todos os fins, que li, compreendi e aceito integralmente as condições abaixo:

1. PARTICIPAÇÃO VOLUNTÁRIA

Declaro que minha participação no evento é feita por minha livre e espontânea vontade, sem qualquer tipo de obrigação, pressão ou imposição por parte da organização, apoiadores, patrocinadores, voluntários ou terceiros envolvidos.

2. CONDIÇÃO DE SAÚDE

Declaro estar em condições físicas e de saúde adequadas para participar de atividade esportiva de corrida, caminhada ou treino coletivo, conforme o percurso escolhido no ato da inscrição.

Declaro também que não possuo, até onde tenho conhecimento, qualquer impedimento médico, físico, cardíaco, respiratório, ortopédico ou de outra natureza que torne inadequada ou arriscada minha participação no evento.

3. RECOMENDAÇÃO DE AVALIAÇÃO MÉDICA

Estou ciente de que é recomendável realizar avaliação médica antes de participar de atividades físicas, especialmente em caso de histórico de problemas cardíacos, respiratórios, hipertensão, diabetes, lesões, uso de medicamentos contínuos, sedentarismo, idade avançada, gravidez ou qualquer outra condição de saúde relevante.

Caso eu tenha qualquer dúvida sobre minha aptidão física, comprometo-me a buscar orientação médica antes de participar.

4. CIÊNCIA DOS RISCOS

Estou ciente de que a participação em corrida, caminhada ou treino ao ar livre envolve riscos naturais e previsíveis, incluindo, mas não se limitando a: quedas, tropeços, torções, câimbras, mal-estar, desidratação, exaustão física, alterações de pressão, lesões musculares ou articulares, acidentes no percurso, contato com outros participantes, exposição ao sol, chuva, calor, vento ou outras condições climáticas e demais imprevistos relacionados à prática esportiva.

Declaro compreender esses riscos e aceitá-los integralmente.

5. RESPONSABILIDADE PESSOAL

Assumo total responsabilidade por minha participação, ritmo, esforço físico, hidratação, alimentação, uso de roupas e calçados adequados, bem como por respeitar meus próprios limites físicos.

Comprometo-me a interromper minha participação caso sinta dor, tontura, falta de ar, mal-estar, desconforto intenso ou qualquer sinal de risco à minha saúde.

6. ISENÇÃO DE RESPONSABILIDADE DA ORGANIZAÇÃO

Declaro estar ciente de que a organização, seus representantes, voluntários, apoiadores, patrocinadores e demais envolvidos no evento não serão responsabilizados por acidentes, lesões, danos físicos, danos materiais, problemas de saúde, agravamento de condições pré-existentes ou qualquer outro prejuízo decorrente da minha participação, salvo nos casos previstos em lei.

7. ATENDIMENTO EMERGENCIAL

Autorizo a organização, em caso de necessidade, a acionar atendimento de emergência, primeiros socorros, ambulância, familiares ou serviços públicos/privados de saúde.

Estou ciente de que eventuais despesas médicas, hospitalares, medicamentosas, exames, transporte ou atendimentos particulares decorrentes da minha participação serão de minha responsabilidade.

8. DADOS INFORMADOS

Declaro que todas as informações fornecidas no formulário de inscrição são verdadeiras e assumo responsabilidade por eventuais erros, omissões ou dados incompletos.

Autorizo a organização a utilizar meu número de WhatsApp para comunicações relacionadas ao evento, incluindo confirmação de inscrição, avisos, alterações, orientações e informações importantes.

9. IMAGEM E DIVULGAÇÃO

Autorizo, de forma gratuita, o uso de minha imagem, nome e voz em fotos, vídeos, publicações, redes sociais, materiais de divulgação e registros relacionados ao evento, sem que isso gere direito a qualquer remuneração ou indenização.

10. MENORES DE IDADE

Caso o participante seja menor de 18 anos, a inscrição deverá ser feita com ciência e autorização de seu responsável legal, que declara estar ciente dos riscos e assumir a responsabilidade pela participação do menor no evento.

11. ALTERAÇÕES, ADIAMENTO OU CANCELAMENTO

Estou ciente de que a organização poderá alterar percurso, horários, local, regras, programação, adiar ou cancelar o evento por motivo de segurança, clima, força maior, determinação de autoridade pública ou qualquer situação que possa comprometer a integridade dos participantes e da equipe.

12. ACEITE FINAL

Ao marcar a opção de aceite e confirmar minha inscrição, declaro que li, compreendi e concordo com este Termo de Responsabilidade, Saúde e Ciência de Riscos.`;

function normalizeCpf(value: string): string {
  return value.replace(/\D/g, "");
}

function isValidCpf(value: string): boolean {
  const cpf = normalizeCpf(value);
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;

  const calculateDigit = (base: string, factor: number): number => {
    const total = base
      .split("")
      .reduce((sum, digit) => sum + Number(digit) * factor--, 0);
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const digit1 = calculateDigit(cpf.slice(0, 9), 10);
  const digit2 = calculateDigit(cpf.slice(0, 10), 11);
  return digit1 === Number(cpf[9]) && digit2 === Number(cpf[10]);
}

const schema = z.object({
  fullName: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  cpf: z.string().min(11, "Informe o CPF").refine(isValidCpf, "CPF inválido"),
  whatsapp: z.string().min(10, "Informe o WhatsApp com DDD"),
  birthDate: z.string().min(10, "Data inválida"),
  sex: z.enum(["masculino", "feminino", "outro"] as const, { required_error: "Selecione o sexo" }),
  routeId: z.coerce.number({ required_error: "Selecione um percurso" }).min(1, "Selecione um percurso"),
  acceptedTerms: z.boolean().refine((value) => value, "Você precisa aceitar os termos para prosseguir"),
  emergencyContactName: z.string().optional(),
  emergencyContactWhatsapp: z.string().optional(),
}).superRefine((values, ctx) => {
  const hasName = Boolean(values.emergencyContactName?.trim());
  const hasWhatsapp = Boolean(values.emergencyContactWhatsapp?.trim());

  if (hasName && !hasWhatsapp) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["emergencyContactWhatsapp"],
      message: "Informe o WhatsApp do contato de emergência ou deixe os dois campos em branco",
    });
  }

  if (hasWhatsapp && !hasName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["emergencyContactName"],
      message: "Informe o nome do contato de emergência ou deixe os dois campos em branco",
    });
  }
});

type FormValues = z.infer<typeof schema>;

function hasActiveEventShape(event: unknown): event is NonNullable<ReturnType<typeof useGetActiveEvent>["data"]> {
  if (!event || typeof event !== "object") return false;
  const candidate = event as { name?: unknown; eventDate?: unknown; eventTime?: unknown; routes?: unknown };
  return (
    typeof candidate.name === "string" &&
    typeof candidate.eventDate === "string" &&
    typeof candidate.eventTime === "string" &&
    Array.isArray(candidate.routes)
  );
}

function TermsModal({
  open,
  onOpenChange,
  onAccept,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAccept: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[calc(100vw-2rem)] p-0 gap-0">
        <DialogHeader className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b">
          <DialogTitle className="text-lg sm:text-xl font-black text-foreground leading-tight">
            Termo de Responsabilidade, Saúde e Ciência de Riscos
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Leia o termo com atenção antes de confirmar o aceite.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[55vh] sm:max-h-[60vh]">
          <div className="px-5 sm:px-6 py-4">
            {TERMS_TEXT.split("\n\n").map((paragraph, i) => {
              const isSection = /^\d+\./.test(paragraph.trim());
              if (isSection) {
                const [heading, ...rest] = paragraph.split("\n");
                return (
                  <div key={i} className="mb-4">
                    <p className="font-bold text-sm text-foreground mb-1">{heading}</p>
                    {rest.map((line, j) => (
                      <p key={j} className="text-sm text-muted-foreground leading-relaxed">{line}</p>
                    ))}
                  </div>
                );
              }
              return (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-4">{paragraph}</p>
              );
            })}
          </div>
        </ScrollArea>
        <div className="px-5 sm:px-6 py-4 border-t flex flex-col sm:flex-row gap-3 bg-background">
          <Button
            variant="outline"
            className="w-full sm:w-auto order-2 sm:order-1"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
          <Button
            className="w-full sm:flex-1 order-1 sm:order-2 bg-primary text-primary-foreground font-bold"
            onClick={() => {
              onAccept();
              onOpenChange(false);
            }}
          >
            <CheckCircle2 className="mr-2 w-4 h-4" />
            Li e aceito os termos
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Registration() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: event, isLoading: isLoadingEvent } = useGetActiveEvent();
  const createMutation = useCreateRegistration();
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      cpf: "",
      whatsapp: "",
      birthDate: "",
      emergencyContactName: "",
      emergencyContactWhatsapp: "",
      acceptedTerms: false,
    }
  });

  const onSubmit = (values: FormValues) => {
    if (!event) return;

    createMutation.mutate({
      data: {
        eventId: event.id,
        routeId: values.routeId,
        fullName: values.fullName,
        cpf: normalizeCpf(values.cpf),
        whatsapp: values.whatsapp,
        birthDate: values.birthDate,
        sex: values.sex as RegistrationInputSex,
        acceptedTerms: values.acceptedTerms,
        termsVersion: TERMS_VERSION,
        emergencyContactName: values.emergencyContactName?.trim() || null,
        emergencyContactWhatsapp: values.emergencyContactWhatsapp?.trim() || null,
      }
    }, {
      onSuccess: (data) => {
        setLocation(`/inscricao/sucesso/${data.registrationCode}`);
      },
      onError: (err: any) => {
        if (err?.status === 409 || err?.error?.includes("inscrição")) {
          toast({
            title: "CPF já inscrito",
            description: "Já existe uma inscrição ativa com este CPF para este evento. Se precisar de ajuda, contate a organização.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro na inscrição",
            description: "Ocorreu um erro inesperado. Tente novamente em instantes.",
            variant: "destructive"
          });
        }
      }
    });
  };

  if (isLoadingEvent) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasActiveEventShape(event)) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background flex-col gap-4 p-4 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Inscrições encerradas ou indisponíveis</h2>
        <Button asChild><Link href="/">Voltar ao início</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-muted/30 py-6 sm:py-12 px-4 font-sans">
      <TermsModal
        open={termsModalOpen}
        onOpenChange={setTermsModalOpen}
        onAccept={() => form.setValue("acceptedTerms", true, { shouldValidate: true })}
      />

      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" asChild className="mb-5 -ml-3 text-muted-foreground min-h-[44px]">
          <Link href="/">
            <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
          </Link>
        </Button>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-2 leading-tight">Fazer Inscrição</h1>
          <p className="text-muted-foreground text-base sm:text-lg">{event.name} • {format(new Date(`${event.eventDate}T${event.eventTime}`), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
        </div>

        <Card className="shadow-lg border-0 bg-background overflow-hidden">
          <div className="bg-primary h-2 w-full" />
          <CardContent className="p-4 sm:p-6 md:p-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Percurso */}
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-primary border-b pb-2">1. Escolha o percurso</h3>
                  <FormField
                    control={form.control}
                    name="routeId"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                            className="grid grid-cols-3 gap-3 sm:gap-4"
                          >
                            {event.routes.map((route) => (
                              <FormItem key={route.id}>
                                <FormControl>
                                  <RadioGroupItem value={route.id.toString()} className="peer sr-only" />
                                </FormControl>
                                <FormLabel className="flex flex-col items-center justify-center p-3 sm:p-6 border-2 rounded-xl cursor-pointer hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all text-center h-full min-h-[80px] sm:min-h-[100px]">
                                  <span className="text-xl sm:text-2xl font-black text-foreground mb-1">{route.name}</span>
                                  <span className="text-xs sm:text-sm text-muted-foreground font-normal leading-tight hidden sm:block">{route.description}</span>
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Dados Pessoais */}
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-primary border-b pb-2">2. Seus dados</h3>
                  <div className="grid grid-cols-1 gap-5">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base font-medium">Nome completo *</FormLabel>
                          <FormControl>
                            <Input placeholder="Como você quer ser chamado" className="h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base font-medium">CPF *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="000.000.000-00"
                              className="h-12"
                              inputMode="numeric"
                              autoComplete="off"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">Usado apenas para identificar sua inscrição no evento.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="whatsapp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base font-medium">WhatsApp *</FormLabel>
                            <FormControl>
                              <Input placeholder="(00) 00000-0000" className="h-12" type="tel" {...field} />
                            </FormControl>
                            <FormDescription className="text-xs">Usado para comunicações do evento.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base font-medium">Data de nascimento *</FormLabel>
                            <FormControl>
                              <Input type="date" className="h-12" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="sex"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base font-medium">Sexo *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="masculino">Masculino</SelectItem>
                              <SelectItem value="feminino">Feminino</SelectItem>
                              <SelectItem value="outro">Outro / Prefiro não informar</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Contato de emergência */}
                <div className="space-y-4 rounded-xl border bg-muted/20 p-4 sm:p-5">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-primary">3. Contato de emergência</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Opcional, mas útil caso a organização precise avisar alguém durante o evento.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="emergencyContactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base font-medium">Nome do contato</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da pessoa" className="h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergencyContactWhatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base font-medium">WhatsApp do contato</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" className="h-12" type="tel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Termos */}
                <div className="pt-2 border-t">
                  <FormField
                    control={form.control}
                    name="acceptedTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 bg-primary/5 rounded-xl border border-primary/20">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setTermsModalOpen(true);
                                return;
                              }
                              field.onChange(false);
                            }}
                            className="mt-0.5 w-5 h-5 shrink-0"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-relaxed min-w-0">
                          <FormLabel className="text-sm sm:text-base font-medium cursor-pointer">
                            Li e aceito o{" "}
                            <button
                              type="button"
                              onClick={() => setTermsModalOpen(true)}
                              className="text-primary underline underline-offset-2 hover:text-primary/80 font-semibold transition-colors"
                            >
                              Termo de Responsabilidade, Saúde e Ciência de Riscos
                            </button>
                            .
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-base sm:text-lg min-h-[56px] font-bold shadow-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:scale-[1.01] transition-all"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                    )}
                    Confirmar inscrição
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
