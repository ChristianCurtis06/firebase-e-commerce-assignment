import { useState, FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { useAuth } from "../context/AuthProvider";
import PageLayout from "../components/PageLayout";
import { Container, Form, FloatingLabel, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (isLoggedIn) {
    navigate("/");
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <PageLayout>
      <Container className="d-flex flex-column justify-content-center w-50">
        <h2 className="display-5 my-3">Log In</h2>
        <div className="bg-light rounded p-5 text-white">           
          <Form onSubmit={handleLogin} className="text-dark">
            <FloatingLabel
              controlId="floatingEmail"
              label="Email address"
              className="mb-3"
            >
              <Form.Control name="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingPassword"
              label="Password"
              className="mb-3"
            >
              <Form.Control name="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </FloatingLabel>
            <Button variant="warning" type="submit" className="w-100 my-2">Log In</Button>
            {error && <p className="text-danger">{error}</p>}
            <p>Don't have an account? <a href="/register" className="text-warning">Register here</a></p>
          </Form>
        </div>
      </Container>
    </PageLayout>
  );
};

export default Login;