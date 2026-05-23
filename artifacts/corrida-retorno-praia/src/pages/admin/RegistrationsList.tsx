import React, { useState } from "react";
import { Link } from "wouter";
import { useListAdminRegistrations, getListAdminRegistrationsQueryKey } from "@workspace/api-client-react";
import { keepPreviousData } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FilterX, Loader2, Search, Edit, Phone } from "lucide-react";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  inscrito: { label: "Inscrito", variant: "default" },
  confirmado: { label: "Confirmado", variant: "default" },
  pendente_pagamento: { label: "Pendente", variant: "secondary" },
  cancelado: { label: "Cancelado", variant: "destructive" },
};

const sexMap: Record<string, string> = {
  masculino: "M",
  feminino: "F",
  outro: "Outro",
};

const sexMapFull: Record<string, string> = {
  masculino: "Masculino",
  feminino: "Feminino",
  outro: "Outro",
};

function formatTermsAcceptedAt(value?: string | null): string {
  if (!value) return "Sem data";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export default function AdminRegistrationsList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [routeFilter, setRouteFilter] = useState("all");
  const [sexFilter, setSexFilter] = useState("all");

  const pageSize = 20;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const params: any = { page, pageSize };
  if (debouncedSearch) params.search = debouncedSearch;
  if (statusFilter !== "all") params.status = statusFilter;
  if (routeFilter !== "all") params.route = routeFilter;
  if (sexFilter !== "all") params.sex = sexFilter;

  const { data, isLoading, isPlaceholderData } = useListAdminRegistrations(params, {
    query: {
      queryKey: getListAdminRegistrationsQueryKey(params),
      placeholderData: keepPreviousData,
    },
  });

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;
  const hasActiveFilters = search.trim() !== "" || statusFilter !== "all" || routeFilter !== "all" || sexFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setRouteFilter("all");
    setSexFilter("all");
    setPage(1);
  };

  return (
    <AdminLayout>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">Inscrições</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Gerencie todos os participantes do evento</p>
      </div>

      {/* Filters */}
      <Card className="mb-6 shadow-sm border-0">
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, CPF ou WhatsApp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Select value={routeFilter} onValueChange={(val) => { setRouteFilter(val); setPage(1); }}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Percurso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os percursos</SelectItem>
                <SelectItem value="3 km">3 km</SelectItem>
                <SelectItem value="5 km">5 km</SelectItem>
                <SelectItem value="10 km">10 km</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sexFilter} onValueChange={(val) => { setSexFilter(val); setPage(1); }}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Sexo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os sexos</SelectItem>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="feminino">Feminino</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="inscrito">Inscrito</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="pendente_pagamento">Pendente</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {hasActiveFilters ? (
            <div className="flex flex-col gap-2 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {data ? `${data.total} resultado${data.total === 1 ? "" : "s"} com os filtros atuais` : "Filtros aplicados"}
              </p>
              <Button type="button" variant="outline" size="sm" onClick={clearFilters} className="h-9 gap-2">
                <FilterX className="h-4 w-4" />
                Limpar filtros
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Card className="shadow-sm border-0 overflow-hidden">
          <div className="overflow-x-auto relative min-h-[400px]">
            {isLoading && !isPlaceholderData && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Percurso</TableHead>
                  <TableHead>Camisa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Termos</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                      Nenhuma inscrição encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.map((reg) => {
                    const statusInfo = statusMap[reg.status] || { label: reg.status, variant: "outline" as const };
                    return (
                      <TableRow key={reg.id} className="hover:bg-muted/10">
                        <TableCell className="font-mono text-xs text-muted-foreground">{reg.registrationCode}</TableCell>
                        <TableCell className="font-medium">
                          {reg.fullName}
                          <div className="text-xs font-normal text-muted-foreground mt-0.5">
                            {sexMapFull[reg.sex] || reg.sex} • {reg.age ? `${reg.age} anos` : "Idade N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{reg.cpf}</TableCell>
                        <TableCell className="text-sm">{reg.whatsapp}</TableCell>
                        <TableCell className="font-bold text-primary">{reg.routeName}</TableCell>
                        <TableCell>{reg.shirtSize || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge variant={reg.acceptedTerms ? "outline" : "destructive"} className="w-fit">
                              {reg.acceptedTerms ? "Aceito" : "Pendente"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTermsAcceptedAt(reg.acceptedTermsAt)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/painel/inscricoes/${reg.id}/editar`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {data && data.total > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/10">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{(page - 1) * pageSize + 1}</span>–
                <span className="font-medium text-foreground">{Math.min(page * pageSize, data.total)}</span> de{" "}
                <span className="font-medium text-foreground">{data.total}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || isLoading}>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || isLoading}>
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden relative">
        {isLoading && !isPlaceholderData && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {data?.data.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Nenhuma inscrição encontrada.
          </div>
        )}

        <div className="space-y-3">
          {data?.data.map((reg) => {
            const statusInfo = statusMap[reg.status] || { label: reg.status, variant: "outline" as const };
            return (
              <Card key={reg.id} className="border shadow-sm overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-foreground text-base truncate">{reg.fullName}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{reg.registrationCode}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">CPF {reg.cpf}</p>
                    </div>
                    <Badge variant={statusInfo.variant} className="shrink-0 text-xs">{statusInfo.label}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground text-xs uppercase tracking-wide font-medium">Percurso</span>
                      <p className="font-bold text-primary">{reg.routeName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs uppercase tracking-wide font-medium">Idade/Sexo</span>
                      <p className="font-medium">{reg.age ? `${reg.age} anos` : "—"} · {sexMap[reg.sex] || reg.sex}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground text-xs uppercase tracking-wide font-medium">Termos</span>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge variant={reg.acceptedTerms ? "outline" : "destructive"} className="text-xs">
                          {reg.acceptedTerms ? "Aceito" : "Pendente"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTermsAcceptedAt(reg.acceptedTermsAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>{reg.whatsapp}</span>
                    </div>
                    <Button variant="outline" size="sm" asChild className="h-8 gap-1.5">
                      <Link href={`/painel/inscricoes/${reg.id}/editar`}>
                        <Edit className="w-3.5 h-3.5" />
                        Editar
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {data && data.total > 0 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, data.total)} de {data.total}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || isLoading}>
                Anterior
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || isLoading}>
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
