import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Instance from "./pages/Instance";
import NotFound from "./pages/NotFound";
import Workflow from "./pages/Workflow";
import Personal from "./pages/Personal";
import Signup from "./pages/Signup";
import SigninPage from "./pages/LoginPage";
import { DynamicForm } from "./pages/DynamicFormSendtoUser";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path= "/signup" element={<Signup/>}></Route>
          <Route path= "/signin" element={<SigninPage/>}></Route>
          <Route path="/" element={<Index />} />
          <Route path="/instance" element={<Instance />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/workflow" element={<Workflow/>}></Route>
          <Route path="/instance/personal" element={<Personal/>}></Route>
          <Route path ="/instance/form" element={<DynamicForm/>}></Route>
        
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
