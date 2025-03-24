import { useState, useEffect, FormEvent } from "react";
import { db } from "../firebase/firebaseConfig";
import PageLayout from "../components/PageLayout";
import { Container, Form, FloatingLabel, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Product } from "./Products";

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
    stock: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const productDoc = doc(db, "products", id);
          const productSnapshot = await getDoc(productDoc);
          if (productSnapshot.exists()) {
            const productData = productSnapshot.data() as Product;
            setData({
              title: productData.title,
              price: productData.price,
              description: productData.description,
              category: productData.category,
              image: productData.image || "",
              rating: {
                rate: productData.rating.rate,
                count: productData.rating.count,
              },
              stock: productData.stock,
            });
          } else {
            setError("Product not found");
          }
        } catch (error) {
          console.error("Error fetching product: ", error);
          setError("Error fetching product");
        }
      }
    };
    fetchProduct();
  }, [id]);

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

  const handleUpdateProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (id) {
      try {
        const productDoc = doc(db, "products", id);
        await updateDoc(productDoc, data);
        alert('Product updated!');
        navigate("/products");
      } catch (error) {
        console.error("Error updating product: ", error);
        setError("Error updating product");
      }
    }
  };

  return (
    <PageLayout>
      <Container>
        <div className="my-3">
          <h2 className="display-5 mb-3">Edit Product</h2>
        </div>
      </Container>

      <Container>
        <div className="my-3 bg-light rounded p-5 text-white">        
          <Form onSubmit={handleUpdateProduct} className="text-dark">
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
              label="Image URL (Optional)"
              className="mb-3"
            >
              <Form.Control name="image" type="text" placeholder="Image URL" value={data.image} onChange={handleChange} />
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
            <FloatingLabel
              controlId="floatingStock"
              label="Stock"
              className="mb-3"
            >
              <Form.Control name="stock" type="number" placeholder="Stock" value={data.stock} onChange={handleChange} min={1} required />
            </FloatingLabel>
            <Button variant="warning" type="submit" className="w-100 my-2">Update Product</Button>
            {error && <p className="text-danger">{error}</p>}
          </Form>
        </div>
      </Container>
    </PageLayout>
  );
};

export default EditProduct;