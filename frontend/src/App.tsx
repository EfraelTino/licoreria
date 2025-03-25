import { Toaster } from "sonner";
import { RouterPrincipal } from "./routes/RouterPrincipal";

export const App = () => {
  return (
    <>
      <RouterPrincipal />
      <Toaster richColors className="z-[999999]"/>
    </>
  );
};

export default App;
  