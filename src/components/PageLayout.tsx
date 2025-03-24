import { Col, Container } from "react-bootstrap";
import NavBar from "./NavBar";

type PageLayoutProps = {
  children?: React.ReactNode;
};

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <Container fluid className="p-0">
      <Col>
      <NavBar />
      </Col>
      {children}
    </Container>
  );
};

export default PageLayout;