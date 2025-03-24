import { useState, FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "./firebaseConfig";
import PageLayout from "../components/PageLayout";
import { Container, Form, FloatingLabel, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { User } from "../context/AuthProvider";

const Register: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<User>({
    authId: "",
    name: "",
    email: "",
    password: "",
    address: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const user = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const authUser = user.user;

      await setDoc(doc(db, "users", authUser.uid), {
        authId: authUser.uid,
        name: data.name,
        email: data.email,
        password: data.password,
        address: data.address,
      });

      alert("Registration successful!");
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <PageLayout>
      <Container className="d-flex flex-column justify-content-center w-50">
        <h2 className="display-5 my-3">Register</h2>
        <div className="bg-light rounded p-5 text-white">           
          <Form onSubmit={handleRegister} className="text-dark">
            <FloatingLabel
              controlId="floatingName"
              label="Name"
              className="mb-3"
            >
              <Form.Control name="name" type="text" placeholder="Name" value={data.name} onChange={handleChange} required />
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingAddress"
              label="Address"
              className="mb-3"
            >
              <Form.Control name="address" type="text" placeholder="Address" value={data.address} onChange={handleChange} required />
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingEmail"
              label="Email address"
              className="mb-3"
            >
              <Form.Control name="email" type="email" placeholder="Email" value={data.email} onChange={handleChange} required />
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingPassword"
              label="Password"
              className="mb-3"
            >
              <Form.Control name="password" type="password" placeholder="Password" value={data.password} onChange={handleChange} required />
            </FloatingLabel>
            <Button variant="warning" type="submit" className="w-100 my-2">Register</Button>
            {error && <p className="text-danger">{error}</p>}
            <p>Already have an account? <a href="/log-in" className="text-warning">Log in here</a></p>
          </Form>
        </div>
      </Container>
    </PageLayout>
  );
};

export default Register;