import { createBrowserRouter } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import StockDetailPage from "@/pages/StockDetailPage";
import PortfolioPage from "@/pages/PortfolioPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import SurveyPage from "../pages/SurveyPage";
import SurveyResultPage from "../pages/SurveyResultPage";
import StocksPage from "../pages/StocksPage";
import PortfolioNewPage from "@/pages/PortfolioNewPage";
import MainLayout from "@/layouts/MainLayout";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/stocks/:ticker",
        element: <StockDetailPage />,
      },
      {
        path: "/survey",
        element: <SurveyPage />,
      },
      {
        path: "/survey/result",
        element: <SurveyResultPage />,
      },
      {
        path: "/portfolio/new",
        element: <PortfolioNewPage />,
      },
      {
        path: "/stocks",
        element: <StocksPage />,
      },
      {
        path: "/portfolio",
        element: <PortfolioPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
]);

export default router;
