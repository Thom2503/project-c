import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Agenda } from "./components/Agenda";
import { Kamers } from "./components/Kamers";
import {Supplies} from "./components/Supplies";
import { Nieuws } from './components/Nieuws'
import {CreateAccount} from "./components/CreateAccount";
import {NieuwsDetails} from "./components/NieuwsDetails";

const AppRoutes = [
  {
    element: <Home />
  },
  {
    index: true,
    path: '/login',
    element: <Login />
  },
  {
    path: '/agenda',
    element: <Agenda />
  },
  {
    path: '/kamers',
    element: <Kamers />
  },
  {
    path: '/voorzieningen',
    element: <Supplies />
  },
  {
    path: '/Nieuws',
    element: <Nieuws />
  },
  {
	path: '/create',
	element: <CreateAccount />
  },
  {
    path: '/nieuws/details',
    element: <NieuwsDetails />
  }
];

export default AppRoutes;