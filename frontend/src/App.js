import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import './App.css';
import { Navbar } from './component/Navbar';
import { Homepage } from './pages/Homepage';
import { Aboutpage } from './pages/Aboutpage';
import { Viewitems } from './pages/Viewitems';
import { Memberpage } from './pages/Memberpage';
import { Loginpage } from './pages/auth/loginpage';
import { Footer } from './component/Footer';
import { Registrationpage } from './pages/auth/registrationpage';
import { Profile } from './pages/userpages/Profile';
import { Mybookings } from './pages/userpages/Mybookings';
import { Dashboard } from './pages/adminpages/Dashboard';
import { ViewAllBooking } from './pages/adminpages/ViewAllBooking';
import { ViewAllNotReturnItems } from './pages/adminpages/ViewAllNotReturnItems';
import { ViewNotVerifyitem } from './pages/adminpages/ViewNotVerifyitem';
import { ViewAllreturneditem } from './pages/adminpages/ViewAllreturneditem';
import { Header } from './component/Header';
import { Supportpage } from './pages/Supportpage';
import { Contactpage } from './pages/Contactpage';
const { Content } = Layout;

function App() {
  return (
    <div className="App">
     <Router>
      <Layout >
        <Header/>
        <Navbar />
        <Content style={{ padding: '24px' }}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<Aboutpage />} />
            <Route path="/items" element={<Viewitems />} />
            <Route path="/member" element={<Memberpage />} />
            <Route path='/support' element={<Supportpage />} />
            <Route path='/contact' element={<Contactpage />}/>
            <Route path="/login" element={<Loginpage/>}/>
            <Route path="/register" element={ <Registrationpage/>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/history" element={<Mybookings />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/viewallbooking' element={<ViewAllBooking />}/>
            <Route path='/viewnotreturnitem' element={<ViewAllNotReturnItems />}/>
            <Route path='/unverifyitem' element={<ViewNotVerifyitem/>}/>
            <Route path='/returneditem' element ={ <ViewAllreturneditem />}/>
          </Routes>
        </Content>
        <Footer />
      </Layout>
    </Router>
    </div>
  );
}

export default App;
