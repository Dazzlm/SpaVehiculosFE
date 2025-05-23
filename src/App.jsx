
import Mainlayout from './views/mainlayout/Mainlayout';
import { BrowserRouter,Routes,Route } from "react-router";
import './App.css';
//<Route index element={<CardGroupButton />} />
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mainlayout />}>
          <Route path="*" element={<h1>No encontrado</h1>} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
