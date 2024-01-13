import React from 'react';
import { Container } from 'reactstrap';
import { Header } from './Header';
import { Footer } from './Footer';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();

    // check of de path login is of het maken van een account zodat er bepaald kan worden
	// welke header getoond moet worden
	const isLoginOrCreatePage = ['/login', '/create', '/forgotpassword', '/twofactor'].includes(location.pathname.toLowerCase());

    return (
        <>
            {!isLoginOrCreatePage && <Header title="Kamers" />}
            <Container tag="main" className="w-[100%] m-auto mt-5 max-h-auto overflow-y-scroll pb-[90px] footerPadding">
                {children}
            </Container>
            {!isLoginOrCreatePage && <Footer />}
        </>
    );
};

export default Layout;
