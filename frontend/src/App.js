import './App.css';
import Sheet from './Pages/Sheet';
import Home from './Pages/Home';
import { Route, Routes, BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/sheet' element={<Sheet/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
