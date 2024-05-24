import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Button, Container } from 'react-bootstrap';

const DropdownMenu = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleDrop = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNav = () => {
    onToggle();
  };

  return (
    <Navbar bg="light" expand="lg" className="border-bottom">
      <Container fluid>
        <Button variant="primary" id="sidebarToggle" onClick={handleNav}>
          Toggle Menu
        </Button>
        <Navbar.Toggle aria-controls="navbarSupportedContent" onClick={handleDrop} />
        <Navbar.Collapse in={!isCollapsed} id="navbarSupportedContent">
          <Nav className="ms-auto mt-2 mt-lg-0">
            <Nav.Link href="#!">Home</Nav.Link>
            <Nav.Link href="#!">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="navbarDropdown">
              <NavDropdown.Item href="#!">Action</NavDropdown.Item>
              <NavDropdown.Item href="#!">Another action</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#!">Something else here</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default DropdownMenu;
