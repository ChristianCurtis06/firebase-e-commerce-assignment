import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import PageLayout from "./PageLayout";
import { useNavigate } from "react-router-dom";
import { doc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export interface Product {
  id: string;
  title: string;
  price: string;
  description: string;
  category: string;
  image?: string;
  rating: {
    rate: number;
    count: number;
  };
  stock: number;
  quantity?: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productCount, setProductCount] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

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
        setProductCount(dataArray.length);
      } catch (error) {
        console.error("Error fetching products: ", error);
        setError("Error fetching products");
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleDeleteProduct = async (productId: string) => {
    await deleteDoc(doc(db, 'products', productId));
    setProducts(products.filter(product => product.id !== productId));
    setProductCount(productCount - 1);
  };

  return (
    <PageLayout>
      <Container>
        <div className="my-3">
          <h2 className="display-5 mb-3">Products</h2>
        </div>
      </Container>

      <Container>
        <div className="my-3 bg-light rounded p-5 text-white">

          {isLoading && <p className="m-2">Loading products...</p>}
          {error && <p>{error}</p>}

          {(productCount > 1 || productCount === 0) ? <p className="text-dark">{productCount} Products in Store</p> : <p className="text-dark">{productCount} Product in Store</p>}
          <Button variant="outline-secondary" className="w-100 mb-3" onClick={() => navigate("/add-product")}>Add Product</Button>
          {products.map((product, index) => (
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
                  <Card.Body className="d-flex flex-column">
                    <Card.Text className="mb-2 text-secondary" style={{ textTransform: "capitalize" }}>{product.category}</Card.Text>
                    <Card.Title className="mb-2">{product.title}</Card.Title>
                    <Card.Text className="mb-2">{product.rating.rate}⭐ ({product.rating.count} Reviews)</Card.Text>
                    <Card.Title className="mb-3"><Badge bg="warning">${parseFloat(product.price).toFixed(2)}</Badge></Card.Title>
                    <Card.Text>{product.description}</Card.Text>
                    <Card.Text>Stock: {product.stock}</Card.Text>
                    <Row>
                      <Col>
                        <Button variant="warning" onClick={() => navigate(`/edit-product/${product.id}`)} className="w-100">Edit Product</Button>
                      </Col>
                      <Col>
                        <Button variant="outline-danger" onClick={() => handleDeleteProduct(product.id)} className="w-100">Delete Product</Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      </Container>
    </PageLayout>
  );
}

export default Products;