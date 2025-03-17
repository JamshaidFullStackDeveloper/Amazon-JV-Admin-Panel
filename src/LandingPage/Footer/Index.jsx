import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import CompanyLogo from "../../assets/AmazonLandingPage/Logo.svg"; // Replace with your logo path

const Footer = () => {
    return (
        <footer className="bg-white text-gray-700 py-10 border-t">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Left Section - Company Info */}
                    <div>
                        <img src={CompanyLogo} alt="Company Logo" className="h-16 mb-4" />
                        <p className="text-sm">Gulberg 2, Siddique Trade Center , Office# 206
                        </p>
                        <p className="text-sm">Lahore, Punjab, Pakistan</p>
                        <p className="mt-2 text-sm font-semibold">Phone: +1 5589 55488 55</p>
                        <p className="text-sm">Email: info@example.com</p>
                        {/* Social Icons */}
                        <div className="flex gap-4 mt-4">
                            <Link to="#" className="text-gray-500 hover:text-blue-600">
                                <Facebook size={20} />
                            </Link>
                            <Link to="#" className="text-gray-500 hover:text-blue-600">
                                <Instagram size={20} />
                            </Link>
                            <Link to="#" className="text-gray-500 hover:text-blue-600">
                                <Twitter size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Center Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Useful Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
                            <li><Link to="/about" className="hover:text-blue-600">About us</Link></li>
                            <li><Link to="/services" className="hover:text-blue-600">Services</Link></li>
                            <li><Link to="/terms" className="hover:text-blue-600">Terms of service</Link></li>
                            <li><Link to="/privacy" className="hover:text-blue-600">Privacy policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-3">Our Services</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="#" className="hover:text-blue-600">Molestiae accusamus iure</Link></li>
                            <li><Link to="#" className="hover:text-blue-600">Excepturi dignissimos</Link></li>
                            <li><Link to="#" className="hover:text-blue-600">Suscipit distinctio</Link></li>
                            <li><Link to="#" className="hover:text-blue-600">Dilecta</Link></li>
                            <li><Link to="#" className="hover:text-blue-600">Sit quas consectetur</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-3">Nobis illum</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="#" className="hover:text-blue-600">Ipsam</Link></li>
                            <li><Link to="#" className="hover:text-blue-600">Laudantium dolorum</Link></li>
                            <li><Link to="#" className="hover:text-blue-600">Dinera</Link></li>
                            <li><Link to="#" className="hover:text-blue-600">Trodelas</Link></li>
                            <li><Link to="#" className="hover:text-blue-600">Flexo</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="mt-10 border-t pt-6 text-center text-sm">
                    <p>
                        &copy; Copyright <strong>Amazon JV</strong>. All Rights Reserved
                    </p>
                    <p className="mt-2 text-gray-500">
                        Designed by <Link to="#" className="text-blue-600">Tecjaunt</Link> Distributed by <Link to="#" className="text-blue-600">ThemeWagon</Link>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
