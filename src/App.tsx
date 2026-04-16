import { useEffect } from "react";
import AllRoutes from "./utils/allroutes/AllRoutes"

const App = () => {
  
  useEffect(() => {
    if (typeof window !== 'undefined' && window.top && window.top !== window.self) {
    window.top.location.href = window.location.href;
    }
    }, []);
    
  return (
    <AllRoutes/>
  )
}

export default App