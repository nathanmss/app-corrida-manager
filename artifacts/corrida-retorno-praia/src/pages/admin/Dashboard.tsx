import React from "react";
import { Link } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { useGetAdminStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, Users, ArrowRight, Route, ShieldCheck, UserRoundCheck, UserRoundX } from "lucide-react";
import { format } from "date-fns";

const statusMap: Record<string, { label: string, variant: "default" | "secondary" | "destructive" | "outline" }> = {
  inscrito: { label: "Inscrito", variant: "default" },
  confirmado: { label: "Confirmado", variant: "default" },
  pendente_pagamento: { label: "Pendente", variant: "secondary" },
  cancelado: { label: "Cancelado", variant: "destructive" }
};

const sexLabelMap: Record<string, string> = {
  masculino: "Masculino",
  feminino: "Feminino",
  outro: "Outro",
};

function percent(value: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats();

  const handleExport = () => {
    window.open('/api/admin/export');
  };

  if (isLoading || !stats) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const statusCounts = Object.fromEntries(stats.byStatus.map((item) => [item.status, item.count]));
  const activeTotal = stats.total - (statusCounts.cancelado ?? 0);
  const confirmedTotal = statusCounts.confirmado ?? 0;
  const pendingTotal = statusCounts.pendente_pagamento ?? 0;
  const canceledTotal = statusCounts.cancelado ?? 0;
  const mostSelectedRoute = [...stats.byRoute].sort((a, b) => b.count - a.count)[0];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">Visão Geral</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Acompanhe volume, percursos e inscrições recentes</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2 w-full sm:w-auto">
          <Download className="w-4 h-4" />
          Exportar lista (CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-primary text-primary-foreground shadow-sm border-0">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium text-primary-foreground/80">Total de inscrições</p>
                <h3 className="mt-2 text-5xl font-black leading-none">{stats.total}</h3>
                <p className="mt-3 text-sm text-primary-foreground/75">{activeTotal} ativas no momento</p>
              </div>
              <Users className="w-8 h-8 text-primary-foreground/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-muted-foreground">Confirmadas</p>
                <h3 className="mt-2 text-4xl font-black text-foreground">{confirmedTotal}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{percent(confirmedTotal, stats.total)}% do total</p>
              </div>
              <UserRoundCheck className="w-8 h-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-muted-foreground">Pendentes</p>
                <h3 className="mt-2 text-4xl font-black text-foreground">{pendingTotal}</h3>
                <p className="mt-3 text-sm text-muted-foreground">Acompanhar antes do evento</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-secondary/70" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-muted-foreground">Canceladas</p>
                <h3 className="mt-2 text-4xl font-black text-foreground">{canceledTotal}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{percent(canceledTotal, stats.total)}% do total</p>
              </div>
              <UserRoundX className="w-8 h-8 text-destructive/55" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Route className="h-5 w-5 text-primary" />
              Distribuição por percurso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.byRoute.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma inscrição por percurso ainda.</p>
            ) : (
              stats.byRoute.map((route) => {
                const routePercent = percent(route.count, stats.total);
                return (
                  <div key={route.routeName} className="space-y-2">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-bold text-foreground">{route.routeName}</span>
                      <span className="text-muted-foreground">{route.count} inscrições · {routePercent}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${routePercent}%` }} />
                    </div>
                  </div>
                );
              })
            )}
            {mostSelectedRoute ? (
              <p className="rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                Percurso com maior procura: <span className="font-bold text-foreground">{mostSelectedRoute.routeName}</span>.
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Perfil das inscrições</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="mb-3 text-sm font-bold text-muted-foreground">Por sexo</p>
              <div className="space-y-2">
                {stats.bySex.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sem dados de sexo ainda.</p>
                ) : (
                  stats.bySex.map((item) => (
                    <div key={item.sex} className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm">
                      <span className="font-medium">{sexLabelMap[item.sex] ?? item.sex}</span>
                      <span className="font-bold">{item.count}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-bold text-muted-foreground">Por status</p>
              <div className="flex flex-wrap gap-2">
                {stats.byStatus.map((item) => {
                  const statusInfo = statusMap[item.status] || { label: item.status, variant: "outline" as const };
                  return (
                    <Badge key={item.status} variant={statusInfo.variant} className="px-2.5 py-1">
                      {statusInfo.label}: {item.count}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/10 pb-4">
          <CardTitle className="text-lg">Inscrições Recentes</CardTitle>
          <Button variant="ghost" size="sm" asChild className="gap-1">
             <Link href="/painel/inscricoes">
               Ver todas <ArrowRight className="w-4 h-4" />
             </Link>
          </Button>
        </CardHeader>
        <div className="hidden overflow-x-auto md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Percurso</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentRegistrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Nenhuma inscrição recente.</TableCell>
                </TableRow>
              ) : (
                stats.recentRegistrations.map((reg) => {
                  const statusInfo = statusMap[reg.status] || { label: reg.status, variant: "outline" };
                  return (
                    <TableRow key={reg.id}>
                      <TableCell className="font-medium">{reg.fullName}</TableCell>
                      <TableCell>{reg.routeName}</TableCell>
                      <TableCell>
                        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                         {format(new Date(reg.createdAt), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
        <div className="space-y-3 p-4 md:hidden">
          {stats.recentRegistrations.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Nenhuma inscrição recente.</p>
          ) : (
            stats.recentRegistrations.map((reg) => {
              const statusInfo = statusMap[reg.status] || { label: reg.status, variant: "outline" as const };
              return (
                <div key={reg.id} className="rounded-lg border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-foreground">{reg.fullName}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{reg.routeName}</p>
                    </div>
                    <Badge variant={statusInfo.variant} className="shrink-0">{statusInfo.label}</Badge>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {format(new Date(reg.createdAt), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </AdminLayout>
  );
}
