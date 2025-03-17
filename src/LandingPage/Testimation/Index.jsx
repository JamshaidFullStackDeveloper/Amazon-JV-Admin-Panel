import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Mario Smith",
        role: "Designer",
        review:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
        rating: 5,
        avatar: "https://via.placeholder.com/50", // Replace with actual image URL
    },
    {
        name: "Mario Smith",
        role: "Designer",
        review:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
        rating: 5,
        avatar: "https://via.placeholder.com/50",
    },
    {
        name: "Mario Smith",
        role: "Designer",
        review:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
        rating: 5,
        avatar: "https://via.placeholder.com/50",
    },
    {
        name: "Mario Smith",
        role: "Designer",
        review:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
        rating: 5,
        avatar: "https://via.placeholder.com/50",
    },
];

export default function Testimonials() {
    return (
        <section className="py-10 px-4 text-center">
            <h2 className="text-2xl font-bold">Testimonials</h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">
                It is a long established fact that a reader will be distracted by the readable content of a page.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {testimonials.map((testimonial, index) => (
                    <Card key={index} className="bg-black text-white rounded-lg p-5 shadow-lg">
                        <CardContent className="flex gap-4 items-start">
                            <Avatar className="w-12 h-12" src={testimonial.avatar} alt={testimonial.name} />
                            <div className="text-left">
                                <h3 className="text-green-400 font-semibold">{testimonial.name}</h3>
                                <p className="text-yellow-500 text-sm">{testimonial.role}</p>
                                <div className="flex mt-1">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-300 mt-2">{testimonial.review}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
