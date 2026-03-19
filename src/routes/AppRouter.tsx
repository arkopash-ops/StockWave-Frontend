import BaseBackground from "../component/BaseBackground";
import { BrowserRouter, Routes } from "react-router-dom";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <BaseBackground>
        <Routes></Routes>
      </BaseBackground>
    </BrowserRouter>
  );
};

export default AppRouter;
