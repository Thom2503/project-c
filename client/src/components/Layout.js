import React from 'react';
import { Container } from 'reactstrap';
import { Header } from './Header';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();

    // Check if the current route is "/Login"
    const isLoginPage = location.pathname.toLowerCase() === '/login';

    return (
        <div>
            {!isLoginPage && <Header title="Kamers" />}
            <Container tag="main" className="w-[100%] m-auto mt-5">
                {children}
            </Container>
        </div>
    );
};

export default Layout;
