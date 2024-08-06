import React from 'react';
import {Navbar, Nav, Container, NavLink} from 'react-bootstrap';

const CustomNavbar = () => {
    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <div className="d-flex">
                        <Navbar.Brand href="/" className="mx-5">
                            City Factography data
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                            <Nav className="mx-auto">
                                <NavLink
                                    href={'/population'}
                                    className="nav-link mx-lg-1"
                                    active={ window.location.pathname === '/population' }

                                >
                                    Top 5 cities by population
                                </NavLink>
                                <NavLink
                                    href={'/area'}
                                    className="nav-link mx-lg-1"
                                    active={ window.location.pathname === '/area' }
                                >
                                    Top 5 cities by area
                                </NavLink>
                                <NavLink
                                    href={'/temperature'}
                                    className="nav-link mx-lg-1"
                                    active={ window.location.pathname === '/temperature' }
                                >
                                    Top 5 cities by high temperature
                                </NavLink>
                            </Nav>
                        </Navbar.Collapse>
                    </div>
                </Container>
            </Navbar>
        </>
    );
};

export default CustomNavbar;
