import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Agenda } from "./components/Agenda";
import { Kamers } from "./components/Kamers";
import {SupplyModal} from "./components/SupplyModal";
import {Supplies} from "./components/Supplies";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/fetch-data',
    element: <FetchData />
  },
  {
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
