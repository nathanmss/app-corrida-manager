import React from "react";
import { Link, useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetAdminRegistration, 
  getGetAdminRegistrationQueryKey,
  useUpdateAdminRegistration
} from "@workspace/api-client-react";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { format } from "date-fns";

function formatTermsAcceptedAt(value?: string | null): string {
  if (!value) return "Sem data registrada";
  return format(new Date(value), "dd/MM/yyyy 'às' HH:mm");
}

const schema = z.object({
  fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  cpf: z.string().min(11, "Informe o CPF"),
  whatsapp: z.string().min(8, "WhatsApp inválido"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  status: z.string(),
  internalNotes: z.string().optional(),
  routeId: z.coerce.number(),
  shirtSize: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactWhatsapp: z.string().optional(),
});

export default function AdminEditRegistration() {
  const [, params] = useRoute("/painel/inscricoes/:id/editar");
  const id = Number(params?.id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: registration, isLoading } = useGetAdminRegistration(id, {
    query: { enabled: !!id, queryKey: getGetAdminRegistrationQueryKey(id) }
  });

  const updateMutation = useUpdateAdminRegistration();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      cpf: "",
      whatsapp: "",
      email: "",
      status: "",
      internalNotes: "",
      routeId: 0,
      shirtSize: "",
      emergencyContactName: "",
      emergencyContactWhatsapp: "",
    }
  });

  React.useEffect(() => {
    if (registration) {
      form.reset({
        fullName: registration.fullName,
        cpf: registration.cpf,
        whatsapp: registration.whatsapp,
        email: registration.email || "",
        status: registration.status,
        internalNotes: registration.internalNotes || "",
        routeId: registration.routeId || 0,
        shirtSize: registration.shirtSize || "",
        emergencyContactName: registration.emergencyContactName || "",
        emergencyContactWhatsapp: registration.emergencyContactWhatsapp || "",
      });
    }
  }, [registration, form]);

  const onSubmit = (values: z.infer<typeof schema>) => {
    updateMutation.mutate({
      id,
      data: {
        fullName: values.fullName,
        cpf: values.cpf,
        whatsapp: values.whatsapp,
        email: values.email || null,
        status: values.status,
        internalNotes: values.internalNotes || null,
        routeId: values.routeId,
        shirtSize: values.shirtSize || null,
        emergencyContactName: values.emergencyContactName || null,
        emergencyContactWhatsapp: values.emergencyContactWhatsapp || null,
      }
    }, {
      onSuccess: () => {
        toast({ title: "Inscrição atualizada com sucesso!" });
        queryClient.invalidateQueries({ queryKey: getGetAdminRegistrationQueryKey(id) });
      },
      onError: () => {
        toast({ title: "Erro ao atualizar inscrição", variant: "destructive" });
      }
    });
  };

  if (isLoading || !registration) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4 -ml-4 text-muted-foreground">
          <Link href="/painel/inscricoes">
            <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
          </Link>
        </Button>
        <h1 className="text-3xl font-black text-foreground">Editar Inscrição</h1>
        <p className="text-muted-foreground mt-1 font-mono">{registration.registrationCode}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-0">
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input {...field} inputMode="numeric" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="shirtSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tamanho da Camisa</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tamanho" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="PP">PP</SelectItem>
                              <SelectItem value="P">P</SelectItem>
                              <SelectItem value="M">M</SelectItem>
                              <SelectItem value="G">G</SelectItem>
                              <SelectItem value="GG">GG</SelectItem>
                              <SelectItem value="XG">XG</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status da Inscrição</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="inscrito">Inscrito</SelectItem>
                              <SelectItem value="confirmado">Confirmado</SelectItem>
                              <SelectItem value="pendente_pagamento">Pendente de pagamento</SelectItem>
                              <SelectItem value="cancelado">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="emergencyContactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contato de emergência</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nome da pessoa" />
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
                          <FormLabel>WhatsApp do contato</FormLabel>
                          <FormControl>
                            <Input {...field} type="tel" placeholder="(00) 00000-0000" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="internalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Anotações Internas (Organização)</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={4} placeholder="Anotações visíveis apenas no painel..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" size="lg" disabled={updateMutation.isPending} className="w-full md:w-auto">
                    {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Salvar Alterações
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-0 bg-muted/20">
            <CardHeader>
              <CardTitle className="text-lg">Detalhes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
               <div>
                 <span className="text-muted-foreground block mb-1">Data da Inscrição</span>
                 <span className="font-medium">{format(new Date(registration.createdAt), "dd/MM/yyyy 'às' HH:mm")}</span>
               </div>
               <div>
                 <span className="text-muted-foreground block mb-1">Termo de responsabilidade</span>
                 <span className="font-medium block">{registration.acceptedTerms ? "Aceito pelo participante" : "Aceite pendente"}</span>
                 <span className="text-muted-foreground block mt-1">{formatTermsAcceptedAt(registration.acceptedTermsAt)}</span>
                 <span className="text-muted-foreground block">Versão {registration.termsVersion || "não registrada"}</span>
               </div>
               <div>
                 <span className="text-muted-foreground block mb-1">CPF</span>
                 <span className="font-medium font-mono">{registration.cpf}</span>
               </div>
               <div>
                 <span className="text-muted-foreground block mb-1">Idade / Sexo</span>
                 <span className="font-medium">{registration.age} anos / {registration.sex}</span>
               </div>
               {registration.team && (
                 <div>
                   <span className="text-muted-foreground block mb-1">Equipe / Assessoria</span>
                   <span className="font-medium">{registration.team}</span>
                 </div>
               )}
               {registration.medicalNotes && (
                 <div>
                   <span className="text-muted-foreground block mb-1">Obs. Médica</span>
                   <span className="font-medium text-destructive">{registration.medicalNotes}</span>
                 </div>
               )}
               {(registration.emergencyContactName || registration.emergencyContactWhatsapp) && (
                 <div>
                   <span className="text-muted-foreground block mb-1">Contato de emergência</span>
                   <span className="font-medium block">{registration.emergencyContactName || "Nome não informado"}</span>
                   <span className="font-medium block">{registration.emergencyContactWhatsapp || "WhatsApp não informado"}</span>
                 </div>
               )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
