import PeopleIcon from '@mui/icons-material/People';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import Shopping from '@mui/icons-material/ShoppingCartCheckout';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Calendar from '@mui/icons-material/CalendarMonth';
import BusinessIcon from '@mui/icons-material/AddBusiness';
import CleanHandsIcon from '@mui/icons-material/CleanHands';
import BathtubIcon from '@mui/icons-material/Bathtub';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Diversity2 from '@mui/icons-material/Diversity2';
import StoreIcon from '@mui/icons-material/Store';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';

export const NavbarItems =[
    {
        id: 0,
        icon: <SettingsSuggestIcon/>,
        label: 'Configuración',
        subitems: [
            { label: 'Roles', route: '/configuracion/roles', icon: <PeopleIcon /> },
          
          ],
    },
    {
        id: 1,
        icon: <PeopleIcon />,
        label: 'Usuarios',
        subitems: [

          { label: 'Administradores', route: '/usuarios/administradores', icon: <PeopleIcon /> },
          { label: 'Empleados', route: '/usuarios/empleados', icon: <PeopleIcon /> },
          { label: 'Empleados', route: '/Empleados', icon: <PeopleIcon /> },
          { label: 'Clientes', route: '/Clientes',icon: <PeopleIcon /> },
          

        ],
      },
    {
        id: 2,
        icon: <Shopping/>,
        label: 'Ventas',
        subitems: [
            { label: 'Ventas', route: '/ventas', icon: <StoreIcon /> },
            { label: 'Sallida insumos', route: '/Salida_Insumos', icon: <ExitToAppIcon /> },
          
          ],
    },
   
    {
        id: 3,
        icon: <BusinessIcon/>,
        label: 'Compras',
        subitems: [
            { label: 'Compras', route: '/compras', icon: <ShoppingBagIcon/> },
            { label: 'Proveedores', route: '/compras/proveedores', icon: <Diversity2 /> },
          ],
    },

    {
        id: 4,
        icon: <Calendar/>,
        label: 'Agendamiento',
        subitems: [
            { label: 'Agenda', route: '/agendamiento', icon: <AccessTimeFilledIcon /> },
            { label: 'Servicios', route: '/agendamiento/Servicios', icon: <BathtubIcon /> },
          ],
    },

    {
      id: 5,
      icon: <InventoryIcon/>,
      label: 'Insumos',
      subitems: [
          { label: 'Insumos', route: '/Insumos', icon: <CleanHandsIcon /> },
          { label: 'Categorias', route: '/Insumos/Categorias', icon: <CategoryIcon /> },

        ],
     },
]