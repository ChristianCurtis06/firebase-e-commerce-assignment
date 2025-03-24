import { useState } from "react";
import { Col, Container, Button, Card, Row, Badge, Form } from "react-bootstrap";
import PageLayout from "./PageLayout";
import { useProducts, useProductsByCategory, Product } from "../queries/Products";
import useCategories from "../queries/Categories";
import { useDispatch } from 'react-redux';
import { addProduct } from "../redux/cartSlice";

const HomePage: React.FC = () => {
    const dispatch = useDispatch();

    const handleAddProduct = (productToAdd: Product) => {
        dispatch(addProduct(productToAdd));
        alert(`${productToAdd.title} added to cart!`);
    };

    const { data: categories } = useCategories();
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    const { data: products, isLoading, error } = useProducts();
    const { data: filteredProducts, isLoading: isFiltering } = useProductsByCategory(selectedCategory);

    const displayProducts = selectedCategory ? filteredProducts : products;

    const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
    };

    return (
        <PageLayout>
            <Container fluid>
                <div className="my-3 bg-warning rounded p-5 text-white">
                    <h1>Welcome to STORE!</h1>
                    <p>A one-stop-shop for everything you need...</p>
                </div>
            </Container>

            <Container>
                <div className="my-3">
                    <h2 className="display-5 mb-3">Products</h2>

                    <Form.Select className="w-25 mb-3" onChange={handleFilter}>
                        <option value="">Filter by category</option>
                        {categories?.map((category, index) => (
                            <option key={index} value={category} style={{ textTransform: "capitalize" }}>{category}</option>
                        ))}
                    </Form.Select>

                    {(isLoading || isFiltering) && <p>Loading products...</p>}
                    {error && <p>Error occurred while fetching products</p>}

                    <Row>
                        {displayProducts?.map(product => (
                            <Col sm={6} lg={4} key={product.id} className="mb-4">
                                <Card className="h-100">
                                    <Card.Img style={{ objectFit: "contain", maxHeight: "250px" }} className="mt-3 h-25" variant="top" src={product.image} />
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Text className="mb-2 text-secondary" style={{ textTransform: "capitalize" }}>{product.category}</Card.Text>
                                        <Card.Title className="mb-2">{product.title}</Card.Title>
                                        <Card.Text className="mb-2">{product.rating.rate}⭐ ({product.rating.count} Reviews)</Card.Text>
                                        <Card.Title className="mb-3"><Badge bg="warning">${parseFloat(product.price).toFixed(2)}</Badge></Card.Title>
                                        <Card.Text className="">{product.description}</Card.Text>
                                        <Button variant="warning" onClick={() => handleAddProduct(product)} className="mt-auto">Add to cart</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Container>
        </PageLayout>
    );
};

export default HomePage;