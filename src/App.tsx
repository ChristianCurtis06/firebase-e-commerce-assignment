import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Cart from './components/Cart';
import Login from './firebase/Login';
import Register from './firebase/Register';
import Account from './components/Account';
import Products from './components/Products';
import AddProduct from './components/AddProduct';
import { AuthProvider } from './context/AuthProvider';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<Products />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/log-in" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;