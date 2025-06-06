import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, FloatingLabel, Button, Badge } from "react-bootstrap";
import PageLayout from "./PageLayout";
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, removeProduct, updateProduct } from "../redux/cartSlice";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { Product } from "../components/Products";
import { useAuth } from "../context/AuthProvider";
import { db } from "../firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

export interface Order {
    id: string;
    uid: string;
    products: Product[];
    date: string;
    total: number;
}

const Cart: React.FC = () => {
    const { user, isLoggedIn } = useAuth();

    const dispatch = useDispatch();
    const cart = useSelector((state: RootState) => state.cart.cart);
    const [productCount, setProductCount] = useState<number>(0);
    const navigate = useNavigate();

    const calculateTotal = () => {
        let total: number = 0;
        for (let product of cart) {
            total += parseFloat(product.price) * product.quantity!;
        }
        return total.toFixed(2);
    };

    const handleRemoveProduct = (productId: string) => {
        dispatch(removeProduct(productId));
    };

    const handleQuantityChange = (product: Product, quantity: number) => {
        if (isNaN(quantity) || quantity < 1) {
            quantity = 1;
        }
        dispatch(updateProduct({ ...product, quantity: quantity }));
    };

    const handleCheckout = async () => {
        try {
            await addDoc(collection(db, "orders"), {
                uid: user?.authId,
                products: cart,
                date: new Date().toISOString(),
                total: parseFloat(calculateTotal()),
            });
            dispatch(clearCart());
            alert(`You have been checked out! Your cart has been emptied.`);
            navigate("/");
        } catch (error) {
            console.error("Error adding order: ", error);
            alert("Error adding order");
        }
    };

    useEffect(() => {
        const countTotal = cart.reduce((acc, product) => acc + (product.quantity || 1), 0);
        setProductCount(countTotal);
    }, [cart]);

    return (
        <PageLayout>
            <Container>
                <div className="my-3">
                    <h2 className="display-5 mb-3">Cart</h2>
                </div>
            </Container>

            <Container>
                <div className="my-3 bg-light rounded p-5 text-white">
                    {productCount === 0 ? (
                        <p className="text-secondary display-6">Your cart is empty</p>
                    ) : (
                        ((productCount > 1) ? <p className="text-dark">{productCount} Products in Cart</p> : <p className="text-dark">{productCount} Product in Cart</p>)
                    )}
                    
                    {cart.map((product, index) => (
                        <Card key={index} className="mb-4">
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
                                            <Card.Title className="mb-2 fs-4">{product.title}</Card.Title>
                                            <Card.Title className="mb-3 ms-3 fs-2"><Badge bg="warning">${parseFloat(product.price).toFixed(2)}</Badge></Card.Title>
                                        </div>
                                        <Row>
                                            <Col md={3}>
                                                <FloatingLabel
                                                    controlId="floatingInput"
                                                    label="Quantity"
                                                >
                                                    <Form.Control
                                                        type="number"
                                                        value={product.quantity || 1}
                                                        onChange={(e) => handleQuantityChange(product, parseInt(e.target.value))}
                                                        min="1"
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                            <Col md={9} className="mt-sm-2 mt-md-0">
                                                <Button variant="outline-warning" onClick={() => handleRemoveProduct(product.id)} className="h-100 w-100 mt-auto">Remove from cart</Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                    {cart.length > 0 && <p className="display-6 text-dark">Total: <strong>${calculateTotal()}</strong></p>}
                    {cart.length > 0 &&
                        ( isLoggedIn ?
                            <Button variant="warning" onClick={handleCheckout} className="h-100 w-100 mt-2">Checkout</Button> :
                            <Button variant="outline-warning" onClick={() => navigate("/log-in")} className="h-100 w-100 mt-2">Log in to checkout</Button>
                        )
                    }
                </div>
            </Container>
        </PageLayout>
    );
}

export default Cart;