import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import Layout  from "./components/Layout";
import "./css/custom.css";
import { BaseModal } from "./components/BaseModal";

export default function App() {
  const location = useLocation();
  const ignoredLocations = ["/voorzieningen", "/agenda"];
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modalParam = params.get("modal");

    // check if the modal needs to be loaded
    if (modalParam === "1") {
      setIsModalOpen(true);
    }
  }, []);

  useEffect(() => {
    if ((ignoredLocations.indexOf(location.pathname) >= 0) !== true) {
        import('./css/tailwind.css');
    }
}, [location.pathname]);

  const closeModal = () => {
    setIsModalOpen(false);
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
