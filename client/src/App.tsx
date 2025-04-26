import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import CategoryPage from "@/pages/category";
import AboutUs from "@/pages/about";
import ContactPage from "@/pages/contact";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminServices from "@/pages/admin/services";
import AdminCategories from "@/pages/admin/categories";
import AdminPayments from "@/pages/admin/payments";
import AdminOrders from "@/pages/admin/orders";
import AdminContact from "@/pages/admin/contact";
import ScrollRestoration from "@/components/scroll-restoration";

function Router() {
  // We need this to handle page changes and back button
  const [location] = useLocation();
  
  useEffect(() => {
    // Force scroll to top on route change
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/about" component={AboutUs} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/services" component={AdminServices} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/payments" component={AdminPayments} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/contact" component={AdminContact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ScrollRestoration />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
