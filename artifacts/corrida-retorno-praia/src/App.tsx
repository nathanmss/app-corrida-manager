import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "./pages/Home";
import Registration from "./pages/Registration";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminRegistrationsList from "./pages/admin/RegistrationsList";
import AdminEditRegistration from "./pages/admin/EditRegistration";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/inscricao" component={Registration} />
      <Route path="/inscricao/sucesso/:code" component={RegistrationSuccess} />
      <Route path="/painel" component={AdminDashboard} />
      <Route path="/painel/login" component={AdminLogin} />
      <Route path="/painel/inscricoes" component={AdminRegistrationsList} />
      <Route path="/painel/inscricoes/:id/editar" component={AdminEditRegistration} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
