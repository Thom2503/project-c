import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';

export default function App() {
    const location = useLocation();
    const ignoredLocations = ['/voorzieningen', '/agenda'];

    useEffect(() => {
        // kijk of de huidige pagina genegeerd moet worden
        if ((ignoredLocations.indexOf(location.pathname) >= 0) !== true) {
            import('./css/tailwind.css');
        }
    }, [location.pathname]);

    return (
        <Layout>
            <Routes>
                {AppRoutes.map((route, index) => {
                    const { element, ...rest } = route;
                    return <Route key={index} {...rest} element={element} />;
                })}
            </Routes>
        </Layout>
    );
}
