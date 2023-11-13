import React, { Component } from 'react';
import { NavLink } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';

export class Header extends Component {
    render() {
        return (
            <div>
                {/* ... (existing code) */}

                {/* Other content */}
                <div className="bg-[#792F82] h-[112px] w-100 flex items-center pl-6">
                    <HeaderTitle />
                </div>

                <div className="bg-[#3D3D3D] w-full">
                    <div className={'flex flex-row gap-4 pl-4'}>
                        <NavLink
                            tag={Link}
                            to="/kamers"
                            className="bg-[#9E9E9E54] p-1 pl-4 pr-4 font-light text-white"
                        >
                            Kamers
                        </NavLink>
                        <NavLink
                            tag={Link}
                            to="/evenementen"
                            className="bg-[#9E9E9E54] p-1 pl-4 pr-4 font-light text-white"
                        >
                            Evenementen
                        </NavLink>
                    </div>
                </div>
            </div>
        );
    }
}

// Component to dynamically render the title based on the route
const HeaderTitle = () => {
    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const title = pathSegments[pathSegments.length - 1];

    return (
        <span className="text-white font-medium text-[32px]">
            {title.charAt(0).toUpperCase() + title.slice(1)}
        </span>
    );
};
