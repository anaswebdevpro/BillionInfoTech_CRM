import { COLORS } from './constants/colors';
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className={`min-h-screen bg-${COLORS.SECONDARY_BG}`}>
      <Outlet context={{ 
        // isAuthenticated, 
      <Outlet />
    </div>
  );
}

export default App;
