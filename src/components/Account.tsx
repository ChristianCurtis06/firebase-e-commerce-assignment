import { useState, useEffect } from "react";
import { Container, Form, FloatingLabel, Button, Card, Col, Row, Badge } from "react-bootstrap";
import PageLayout from "./PageLayout";
import { useNavigate } from "react-router-dom";
import { getDoc, updateDoc, deleteDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthProvider";
import { db } from "../firebase/firebaseConfig";
import { User } from "../context/AuthProvider";
import { Order } from "./Cart";

const Account: React.FC = () => {
  const { user, isLoggedIn, loading } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showProducts, setShowProducts] = useState<{ [key: string]: boolean }>({});

  const navigate = useNavigate();
  const [data, setData] = useState<Omit<User, "authId">>({
    name: "",
    email: "",
    password: "",
    address: "",
  });
  const [orders, setOrders] = useState<Order[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = doc(db, "users", user.authId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data() as User;
          setData({
            name: userData.name,
            email: userData.email,
            password: userData.password,
            address: userData.address,
          });
        } else {
          console.error("User does not exist!");
        }
      }
    };

    const fetchUserOrders = async () => {
      if (user) {
        const ordersQuery = query(collection(db, "orders"), where("uid", "==", user.authId));
        const querySnapshot = await getDocs(ordersQuery);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        setOrders(ordersData);
      }
    };

    fetchUserData();
    fetchUserOrders();
  }, [user]);

  if (loading) {
    return <PageLayout><p className="m-2">Loading account...</p></PageLayout>;
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      await updateDoc(doc(db, "users", user.authId), data);
      alert("User information updated successfully!");
    }
  };

  const handleDeleteUser = async () => {
    if (user) {
      await deleteDoc(doc(db, 'users', user.authId));
      alert("User account deleted successfully!");
      navigate("/log-in");
    }
  };

  const toggleShowProducts = (orderId: string) => {
    setShowProducts(prevState => ({
      ...prevState,
      [orderId]: !prevState[orderId]
    }));
  };

  return (
    <PageLayout>
      {isLoggedIn && user ? (
        <>
          <Container>
            <div className="my-3">
              <h2 className="display-5 mb-3">Hello, {user.name}!</h2>
            </div>
          </Container>

          <Container>
            <div className="mt-3 mb-2 bg-light rounded p-5">
              <h2 className="display-5 mb-3">Account Information</h2>
              <Form className="text-dark" onSubmit={handleUpdateUser}>
                <FloatingLabel controlId="floatingName" label="Name" className="mb-3">
                  <Form.Control type="text" name="name" value={data.name} onChange={handleChange} required />
                </FloatingLabel>
                <FloatingLabel controlId="floatingAddress" label="Address" className="mb-3">
                  <Form.Control type="text" name="address" value={data.address} onChange={handleChange} required />
                </FloatingLabel>
                <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3">
                  <Form.Control type="email" name="email" value={data.email} className="text-secondary" readOnly />
                </FloatingLabel>
                <FloatingLabel controlId="floatingPassword" label="Password" className="mb-1">
                  <Form.Control type={showPassword ? "text" : "password"} name="password" value={data.password} className="text-secondary" readOnly />
                </FloatingLabel>
                <p className="text-warning mb-2" style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide Password" : "Show Password"}
                </p>
                <br />
                <Button type="submit" variant="outline-warning" className="mt-1">Update Account Information</Button>
              </Form>
            </div>
            <Button variant="danger" onClick={handleDeleteUser} className="mt-1">Delete Account</Button>
          </Container>

          <Container>
            <div className="mt-4 bg-light rounded p-5">
              <h2 className="display-5 mb-3">Orders</h2>
              {orders.map((order) => (
                <div key={order.id} className="border-bottom py-3">
                  <p className="fs-4 mb-2"><strong>Order ID: {order.id}</strong></p>
                  <p className="mb-2">Order Date: {order.date}</p>
                  <p className="mb-3 fs-4"><Badge bg="warning">Total: ${order.total}</Badge></p>
                  {showProducts[order.id] && (
                    order.products.map((product) => (
                      <Card key={product.id} className="my-2">
                        <Row>
                          <Col md={2} className="d-flex justify-content-center align-items-center">
                            {product.image ? (
                              <Card.Img style={{ objectFit: "contain", maxHeight: "150px" }} className="p-2" src={product.image} />
                            ) : (
                              <div className="d-flex justify-content-center align-items-center p-2 h-100 w-100 bg-light rounded">
                                <Card.Text className="text-secondary display-6">No Image</Card.Text>
                              </div>
                            )}
                          </Col>
                          <Col md={10}>
                            <Card.Body className="d-flex flex-column h-100">
                              <div className="d-flex flex-row">
                                <Card.Title className="mb-2 fs-5">{product.title}</Card.Title>
                                <Card.Title className="mb-3 ms-3 fs-5"><Badge bg="warning">${parseFloat(product.price).toFixed(2)}</Badge></Card.Title>
                              </div>
                              <Row>
                                <Col md={3}>
                                  <FloatingLabel controlId="floatingInput" label="Quantity">
                                    <Form.Control type="number" value={product.quantity || 1} min="1" readOnly />
                                  </FloatingLabel>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Col>
                        </Row>
                      </Card>
                    ))
                  )}
                  <Button variant="outline-warning" onClick={() => toggleShowProducts(order.id)} className="mt-1 mb-4">{showProducts[order.id] ? "Hide Products" : "Show Products"}</Button>
                </div>
              ))}
            </div>
          </Container>
        </>
      ) : (
        <Container>
          <div className="my-3">
            <h2 className="display-5 mb-3">Account</h2>
          </div>
          <div className="bg-light rounded p-5">
            <p>You are not logged in. Please log in to view your account information.</p>
            <Button variant="warning" onClick={() => navigate("/log-in")}>Log In</Button>
          </div>
        </Container>
      )}
    </PageLayout>
  );
}

export default Account;