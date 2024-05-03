import PeopleIcon from '@mui/icons-material/People';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import Shopping from '@mui/icons-material/ShoppingCartCheckout';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Calendar from '@mui/icons-material/CalendarMonth';
import Provider from '@mui/icons-material/AssignmentInd';
import CleanHandsIcon from '@mui/icons-material/CleanHands';
import BathtubIcon from '@mui/icons-material/Bathtub';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import StoreIcon from '@mui/icons-material/Store';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';

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
        icon: <ShoppingBagIcon/>,
        label: 'Compras',
        subitems: [
            { label: 'Compras', route: '/compras', icon: <PeopleIcon /> },
            { label: 'Proveedores', route: '/compras/Proveedores', icon: <PeopleIcon /> },
          ],
    },

    {
        id: 4,
        icon: <Calendar/>,
        label: 'Agendamiento',
        subitems: [
            { label: 'Agenda', route: '/agendamiento', icon: <CleanHandsIcon /> },
            { label: 'Servicios', route: '/agendamiento/Servicios', icon: <BathtubIcon /> },
          ],
    },

    {
      id: 5,
      icon: <Calendar/>,
      label: 'Insumos',
      subitems: [
          { label: 'Insumos', route: '/Insumos', icon: <CleanHandsIcon /> },
          { label: 'Categorias', route: '/Insumos/Categorias', icon: <CleanHandsIcon /> },

        ],
     },
]