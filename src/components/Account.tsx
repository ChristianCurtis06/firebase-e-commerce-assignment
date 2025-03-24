import { useState, useEffect } from "react";
import { Container, Form, FloatingLabel, Button } from "react-bootstrap";
import PageLayout from "./PageLayout";
import { useNavigate } from "react-router-dom";
import { getDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthProvider";
import { db } from "../firebase/firebaseConfig";
import { User } from "../context/AuthProvider";

const Account: React.FC = () => {
  const { user, isLoggedIn, loading } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const [data, setData] = useState<Omit<User, "authId">>({
    name: "",
    email: "",
    password: "",
    address: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  
  useEffect(() => {
    const fetchUserData = async () => {
      console.log(user?.authId);
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
    fetchUserData();
  }, [user]);

  if (loading) {
    return <PageLayout>Loading...</PageLayout>;
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

  return (
    <PageLayout>
      {isLoggedIn && user ? 
        <>
          <Container>
            <div className="my-3">
              <h2 className="display-5 mb-3">Hello, {user.name}!</h2>
            </div>
          </Container>

          <Container>
            <div className="my-3 bg-light rounded p-5">
              <h2 className="display-5 mb-3">Account Information</h2>
              <Form className="text-dark" onSubmit={handleUpdateUser}>
                <FloatingLabel
                  controlId="floatingName"
                  label="Name"
                  className="mb-3"
                >
                  <Form.Control type="text" name="name" value={data.name} onChange={handleChange} required />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingAddress"
                  label="Address"
                  className="mb-3"
                >
                  <Form.Control type="text" name="address" value={data.address} onChange={handleChange} required />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingEmail"
                  label="Email"
                  className="mb-3"
                >
                  <Form.Control type="email" name="email" value={data.email} className="text-secondary" readOnly />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingPassword"
                  label="Password"
                  className="mb-1"
                >
                  <Form.Control type={showPassword ? "text" : "password"} name="password" value={data.password} className="text-secondary" readOnly />
                </FloatingLabel>
                <p className="text-warning" style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide Password" : "Show Password"}</p>
                <br />
                <Button type="submit" variant="outline-warning" className="mt-2">Edit Account</Button>
              </Form>
            </div>
            <Button variant="danger" onClick={handleDeleteUser} className="mt-2">Delete Account</Button>
          </Container>
        </>
        :
        <Container>
          <div className="my-3">
            <h2 className="display-5 mb-3">Account</h2>
          </div>
          <div className="bg-light rounded p-5">
            <p>You are not logged in. Please log in to view your account information.</p>
            <Button variant="warning" onClick={() => navigate("/log-in")}>Log In</Button>
          </div>
        </Container>
      }
    </PageLayout>
  );
}

export default Account;