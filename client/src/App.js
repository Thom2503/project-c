import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import Layout from "./components/Layout";
import "./css/custom.css";
import { BaseModal } from "./components/BaseModal";

export default function App() {
  const location = useLocation();
  const ignoredLocations = ["/voorzieningen", "/agenda"];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modalParam = params.get("modal");
	const sidebarParam = params.get("sidebar");

    // check if the modal needs to be loaded
    if (modalParam !== null) {
      setIsModalOpen(true);
    }
  }, []);

  useEffect(() => {
    if ((ignoredLocations.indexOf(location.pathname) >= 0) !== true) {
      import("./css/tailwind.css");
    }
  }, [location.pathname]);

  const closeModal = () => {
    const currentURL = window.location.href;
    const URLWithoutParams = currentURL.split("?")[0];
    window.location.replace(URLWithoutParams);
  };

  const customFunctionForNews = (newsId, isAdmin) => {
    if (isAdmin) {
      // Redirect to the modify page for admins
      navigate(`/nieuws/modify/${newsId}`);
    } else {
      // Redirect to the read page for regular users
      navigate(`/nieuws/read/${newsId}`);
    }
  };
  return (
    <Layout>
      <BaseModal isOpen={isModalOpen} onClose={closeModal}></BaseModal>
      <Routes>
        {AppRoutes.map((route, index) => {
          const { element, ...rest } = route;
          return <Route key={index} {...rest} element={element} />;
        })}
      </Routes>
    </Layout>
  );
}
