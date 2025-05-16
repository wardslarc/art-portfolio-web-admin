import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

function App() {
  const isTempo = import.meta.env.VITE_TEMPO === "true";

  const routing = isTempo
    ? useRoutes(routes)
    : useRoutes([{ path: "/", element: <Home /> }]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      {routing}
    </Suspense>
  );
}

export default App;
