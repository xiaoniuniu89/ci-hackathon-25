import React from 'react'
import { NavLink } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'
import '../../navbar.css'

const Header: React.FC = () => {
  return (
    <>
      <a href="#main" className="skip-link visually-hidden-focusable">Skip to main content</a>
      <Navbar expand="lg" className="navbar-dark">
        <Container>
          <Navbar.Brand as={NavLink} to="/">Merry Meals</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarContent" aria-label="Toggle navigation" />
          <Navbar.Collapse id="navbarContent">
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
              <Nav.Link as={NavLink} to="/recipes">Recipes</Nav.Link>
              <Nav.Link as={NavLink} to="/contact">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default Header
