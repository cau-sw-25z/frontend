import { createBrowserRouter } from "react-router-dom";

import LoginPage from "@/domains/auth/pages/LoginPage";
import SignupPage from "@/domains/auth/pages/SignupPage";
import HomePage from "@/domains/dashboard/pages/HomePage";
import PortfolioNewPage from "@/domains/portfolio/pages/PortfolioNewPage";
import PortfolioPage from "@/domains/portfolio/pages/PortfolioPage";
import StockDetailPage from "@/domains/stock/pages/StockDetailPage";
import StocksPage from "@/domains/stock/pages/StocksPage";
import SurveyPage from "@/domains/survey/pages/SurveyPage";
import SurveyResultPage from "@/domains/survey/pages/SurveyResultPage";
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
