import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactSection = () => {
    return (
        <section className="py-12 px-6 flex flex-col md:flex-row gap-8 justify-center">
            {/* Contact Info Card */}
            <Card className="bg-gray-900 text-white p-6 w-full md:w-1/3 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Contact Info</h2>
                <p className="text-gray-300 mb-6">
                    Many desktop publishing packages and web pages. Find all the details you need to
                    reach our support team.
                </p>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <MapPin className="text-yellow-500" />
                        <div>
                            <p className="font-semibold">Our Location</p>
                            <p className="text-gray-300">A108 Adam Street, New York, NY 535022</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Phone className="text-yellow-500" />
                        <div>
                            <p className="font-semibold">Phone Number</p>
                            <p className="text-gray-300">+1 5569 55488 55</p>
                            <p className="text-gray-300">+1 66879 254445 41</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Mail className="text-yellow-500" />
                        <div>
                            <p className="font-semibold">Email Address</p>
                            <p className="text-gray-300">info@example.com</p>
                            <p className="text-gray-300">contact@example.com</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Contact Form Card */}
            <Card className="p-6 w-full md:w-2/3 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
                <p className="text-gray-600 mb-6">
                    Have questions? Our team is available to assist you with any trading-related
                    inquiries. Reach out anytime, and we’ll respond promptly.
                </p>
                <form className="space-y-4 text-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input type="text" placeholder="Your Name" />
                        <Input type="email" placeholder="Your Email" />
                    </div>
                    <Input type="text" placeholder="Subject" />
                    <Textarea placeholder="Message" rows={4} />
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto">
                        Send Message
                    </Button>
                </form>
            </Card>
        </section>
    );
};

export default ContactSection;
