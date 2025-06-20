import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaGithub, FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-dark text-light pt-5 pb-4 mt-5 border-top">
            <div className="container">
                <div className="row text-center text-md-start">

                    {/* Contact Info */}
                    <div className="col-md-3 mb-4">
                        <h5 className="text-uppercase mb-3">Contact</h5>
                        <p>
                            <FaEnvelope className="me-2" />
                            <a href="mailto:md008762@gmail.com" className="text-light text-decoration-none">
                                md008762@gmail.com
                            </a>
                        </p>
                        <p>
                            <FaPhoneAlt className="me-2" />
                            <a href="tel:+91 6203648107" className="text-light text-decoration-none">
                                +91 6203648107
                            </a>
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-md-3 mb-4">
                        <h5 className="text-uppercase mb-3">Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="/" className="text-light text-decoration-none">Home</a></li>
                            <li><a href="/about" className="text-light text-decoration-none">About</a></li>
                            <li><a href="/contact" className="text-light text-decoration-none">Contact</a></li>
                            <li><a href="/blog" className="text-light text-decoration-none">Blog</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="col-md-3 mb-4">
                        <h5 className="text-uppercase mb-3">Legal</h5>
                        <ul className="list-unstyled">
                            <li><a href="/privacy" className="text-light text-decoration-none">Privacy Policy</a></li>
                            <li><a href="/terms" className="text-light text-decoration-none">Terms of Service</a></li>
                            <li><a href="/faq" className="text-light text-decoration-none">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div className="col-md-3 mb-4">
                        <h5 className="text-uppercase mb-3">Follow Me</h5>
                        <div>
                            <a href="#" target="_blank" rel="noreferrer" className="text-light fs-5 me-3">
                                <FaFacebook />
                            </a>
                            <a href="https://github.com/aadil1073" target="_blank" rel="noreferrer" className="text-light fs-5 me-3">
                                <FaGithub />
                            </a>
                            <a href="https://www.linkedin.com/in/aadil17/" target="_blank" rel="noreferrer" className="text-light fs-5 me-3">
                                <FaLinkedin />
                            </a>
                            <a href="https://twitter.com/yourusername" target="_blank" rel="noreferrer" className="text-light fs-5">
                                <FaTwitter />
                            </a>
                        </div>
                    </div>

                </div>

                {/* Copyright */}
                <div className="text-center pt-4 border-top mt-4">
                    <small>
                        &copy; {new Date().getFullYear()} <strong>Md Aadil</strong>. All Rights Reserved.
                    </small>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
