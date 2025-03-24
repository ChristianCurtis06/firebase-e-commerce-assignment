import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { Container, Navbar, Nav, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const NavBar: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const cart = useSelector((state: RootState) => state.cart.cart);
  const [productCount, setProductCount] = useState<number>(0);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out!");
      navigate("/");
    } catch (err: any) {
      console.error("Logout error:", err.message);
    }
  };

  useEffect(() => {
    const countTotal = cart.reduce((acc, product) => acc + (product.quantity || 1), 0);
    setProductCount(countTotal);
  }, [cart]);

  return (
    <Navbar bg="warning" expand="lg" variant="dark">
      <Container fluid>
        <Navbar.Brand href="/" className="text-white">STORE</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/cart">Cart<Badge className="ms-1 bg-white text-dark">{productCount}</Badge></Nav.Link>
            <Nav.Link href="/products">Products</Nav.Link>
            { isLoggedIn && <Nav.Link href="/account">Account</Nav.Link> }
            { isLoggedIn ?
              <Nav.Link onClick={handleLogout}>Log Out</Nav.Link> :
              <Nav.Link href="/log-in">Log In</Nav.Link>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;