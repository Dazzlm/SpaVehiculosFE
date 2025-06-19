import GroupIcon from "@mui/icons-material/Group";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalCarWashIcon from '@mui/icons-material/LocalCarWash';
import PlaceIcon from '@mui/icons-material/Place';
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PhotoIcon from '@mui/icons-material/Photo';


const optionsSidebar = [
  {
    id: 0,
    title: "Inicio",
    icon: <HomeIcon />,
    Path: "/",
  },
  {
    id: 1,
    title: "Usuarios",
    icon: <GroupIcon />,
    Path: "/usuarios",
  },
  {
    id: 2,
    title: "Facturacion",
    icon: <ReceiptLongIcon />,
    Path: "/facturacion",
  },
  {
    id: 3,
    title: "Productos",
    icon: <ShoppingBagIcon />,
    Path: "/gestion",
  },
  {
    id: 4,
    title: "Servicios",
    icon: <LocalCarWashIcon />,
    Path: "/servicios",
  },
  {
    id: 5,
    title: "Sedes",
    icon: <LocationCityIcon />,
    Path: "/sedes",
  },
  {
    id: 6,
    title: "Reservar",
    icon: <EventAvailableIcon />,
    Path: "/reservas",
  },
    {
    id: 7,
    title: "Ciudades",
    icon: <PlaceIcon />,
    Path: "/ciudades",
  },
     {
    id: 8,
    title: "Imagen Cliente",
    icon: <PhotoIcon />,
    Path: "/imagen",
  },
];

export default optionsSidebar;
