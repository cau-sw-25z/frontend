import { createBrowserRouter } from "react-router-dom";

import LoginPage from "@/domains/auth/pages/LoginPage";
import SignupPage from "@/domains/auth/pages/SignupPage";
import HomePage from "@/domains/dashboard/pages/HomePage";
import StocksPage from "@/domains/stock/pages/StocksPage";
import StockDetailPage from "@/domains/stock/pages/StockDetailPage";
import PortfolioPage from "@/domains/portfolio/pages/PortfolioPage";
import PortfolioNewPage from "@/domains/portfolio/pages/PortfolioNewPage";
import SurveyPage from "@/domains/survey/pages/SurveyPage";
import SurveyResultPage from "@/domains/survey/pages/SurveyResultPage";
import MainLayout from "@/layouts/MainLayout";
import PrivateRoute from "./PrivateRoute";
import SignalPage from "@/domains/stock/pages/SignalPage";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/stocks",
            element: <StocksPage />,
          },
          {
            path: "/stocks/:ticker",
            element: <StockDetailPage />,
          },
          {
            path: "/portfolio",
            element: <PortfolioPage />,
          },
          {
            path: "/portfolio/new",
            element: <PortfolioNewPage />,
          },

          {
            path: "/signals",
            element: <SignalPage />,
          },

          {
            path: "/survey",
            element: <SurveyPage />,
          },
          {
            path: "/survey/result",
            element: <SurveyResultPage />,
          },
        ],
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
