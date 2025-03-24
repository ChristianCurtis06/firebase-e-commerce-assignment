import { useState, useEffect } from "react";
import { Col, Container, Button, Card, Row, Badge, Form } from "react-bootstrap";
import PageLayout from "./PageLayout";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Product } from "./Products";
import { addProduct } from "../redux/cartSlice";
import { useDispatch } from "react-redux";

const HomePage: React.FC = () => {
  const dispatch = useDispatch();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const querySnapshot = await getDocs(collection(db, 'products'));
        const dataArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(dataArray);
        setCategories([...new Set(dataArray.map(product => product.category))]);
      } catch (error) {
        console.error("Error fetching products: ", error);
        setError("Error fetching products");
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleAddProduct = (productToAdd: Product) => {
    dispatch(addProduct(productToAdd));
    alert(`${productToAdd.title} added to cart!`);
  };

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (category) {
      const filteredProducts = products.filter(product => product.category === category);
      setFilteredProducts(filteredProducts);
    } else {
      setFilteredProducts(products);
    }
  };

  const displayProducts = selectedCategory ? filteredProducts : products;

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
          <h2 className="display-5 mb-3">Store</h2>

          <Form.Select className="w-25 mb-3" onChange={handleFilter}>
            <option value="">Filter by category</option>
            {categories?.map((category, index) => (
              <option key={index} value={category} style={{ textTransform: "capitalize" }}>{category}</option>
            ))}
          </Form.Select>

          {isLoading && <p className="m-2">Loading products...</p>}
          {error && <p>{error}</p>}

          <Row>
            {displayProducts?.map(product => (
              <Col sm={6} lg={4} key={product.id} className="mb-4">
                <Card className="h-100">
                  {product.image ?
                    <Card.Img style={{ objectFit: "contain", maxHeight: "250px" }} className="mt-3 h-25" variant="top" src={product.image} /> :
                    <div className="d-flex justify-content-center align-items-center p-2 h-25 bg-light rounded">
                      <Card.Text className="text-secondary display-6">No Image</Card.Text>
                    </div>
                  }
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