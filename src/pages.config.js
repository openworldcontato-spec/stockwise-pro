import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import POS from './pages/POS';
import Help from './pages/Help';
import Sales from './pages/Sales';
import Customers from './pages/Customers';
import Analytics from './pages/Analytics';
import Tutorial from './pages/Tutorial';
import About from './pages/About';
import Settings from './pages/Settings';
import Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Products": Products,
    "POS": POS,
    "Help": Help,
    "Sales": Sales,
    "Customers": Customers,
    "Analytics": Analytics,
    "Tutorial": Tutorial,
    "About": About,
    "Settings": Settings,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: Layout,
};