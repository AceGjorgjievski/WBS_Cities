import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import CityList from "../Cities/CityList/CityList";
import CityPopulation from "../navItems/CityPopulation/CityPopulation";
import CityArea from "../navItems/CityArea/CityArea";
import CityTemperature from "../navItems/CityTemperature/CityTemperature";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path='/' element={<CityList initialCity={null}/>}/>
                    <Route path='/cityList' element={<CityList initialCity={null}/>}/>
                    <Route path='/population' element={<CityPopulation/>}/>
                    <Route path='/area' element={<CityArea/>}/>
                    <Route path='/temperature' element={<CityTemperature/>}/>
                </Routes>
            </Router>
        </>
    );
}

export default App;
