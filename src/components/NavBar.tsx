import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { Container, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const NavBar: React.FC = () => {
  const { isLoggedIn } = useAuth();

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

  return (
    <Navbar bg="warning" expand="lg" variant="dark">
      <Container fluid>
        <Navbar.Brand href="/" className="text-white">STORE</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/cart">Cart</Nav.Link>
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