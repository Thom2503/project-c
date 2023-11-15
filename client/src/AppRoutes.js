import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Agenda } from "./components/Agenda";
import { Kamers } from "./components/Kamers";
import {SupplyModal} from "./components/SupplyModal";
import {Supplies} from "./components/Supplies";

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
    path: '/supply-toevoegen',
    element: <SupplyModal />
  },
  {
    path: '/voorzieningen',
    element: <Supplies />
  }
];

export default AppRoutes;