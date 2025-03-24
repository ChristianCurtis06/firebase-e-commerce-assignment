import { useState, FormEvent } from "react";
import { db } from "../firebase/firebaseConfig";
import PageLayout from "../components/PageLayout";
import { Container, Form, FloatingLabel, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { Product } from "./Products";

const AddProduct: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Omit<Product, 'id'>>({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
    rating: {
      rate: 0,
      count: 0,
    },
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "rate" || name === "count") {
      setData({
        ...data,
        rating: {
          ...data.rating,
          [name]: Number(value),
        },
      });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), data);
      alert('Product added!');
      setData({
        title: "",
        price: "",
        description: "",
        category: "",
        image: "",
        rating: {
          rate: 0,
          count: 0,
        },
      });
      navigate("/products");
    } catch (error) {
      setError('Error adding product');
    }
  };

  return (
    <PageLayout>
      <Container>
        <div className="my-3">
          <h2 className="display-5 mb-3">Add Product</h2>
        </div>
      </Container>

      <Container>
        <div className="my-3 bg-light rounded p-5 text-white">        
          <Form onSubmit={handleAddProduct} className="text-dark">
            <FloatingLabel
              controlId="floatingTitle"
              label="Title"
              className="mb-3"
            >
              <Form.Control name="title" type="text" placeholder="Title" value={data.title} onChange={handleChange} required />
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                name="description"
                placeholder="Write product description here"
                value={data.description}
                onChange={handleChange}
                style={{ height: '100px' }}
                required
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingPrice"
              label="Price"
              className="mb-3"
            >
              <Form.Control name="price" type="number" placeholder="Price" value={data.price} onChange={handleChange} required />
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingCategory"
              label="Category"
              className="mb-3"
            >
              <Form.Control name="category" type="text" placeholder="Category" value={data.category} onChange={handleChange} required />
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingImage"
              label="Image URL"
              className="mb-3"
            >
              <Form.Control name="image" type="text" placeholder="Image URL" value={data.image} onChange={handleChange} required />
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingRate"
              label="Rating Rate (1-5)"
              className="mb-3"
            >
              <Form.Control name="rate" type="number" placeholder="Rating Rate" value={data.rating.rate} onChange={handleChange} min={1} max={5} required />
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingCount"
              label="Rating Count"
              className="mb-3"
            >
              <Form.Control name="count" type="number" placeholder="Rating Count" value={data.rating.count} onChange={handleChange} min={1} required />
            </FloatingLabel>
            <Button variant="warning" type="submit" className="w-100 my-2">Add Product</Button>
            {error && <p className="text-danger">{error}</p>}
          </Form>
        </div>
      </Container>
    </PageLayout>
  );
};

export default AddProduct;