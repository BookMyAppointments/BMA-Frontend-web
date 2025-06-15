'use client'
import { useState } from 'react';
import { Mail, Phone, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQ {
    question: string;
    answer: string;
}

export default function Page() {
    const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const faqs: FAQ[] = [
        {
            question: "How do I book a doctor's appointment?",
            answer: "You can book a doctor's appointment by visiting the doctor's profile page and clicking on the 'Book Appointment' button. Select your preferred date and time slot, and follow the booking process."
        },
        {
            question: "How do I upload my medical records?",
            answer: "Go to the Health Records section in your profile. Click on 'Upload Files' and select the medical documents you want to upload. You can upload PDF, images, or other medical reports."
        },
        {
            question: "How do I cancel or reschedule an appointment?",
            answer: "Visit the 'Bookings' section in your profile. Find the appointment you want to modify and click on 'Cancel' or 'Reschedule'. Follow the prompts to complete the process."
        },
        {
            question: "What payment methods are accepted?",
            answer: "We accept various payment methods including UPI, credit/debit cards, net banking, and cash payments at the facility."
        },
        {
            question: "How do I get my test results?",
            answer: "Your test results will be available in your Health Records section once they are ready. You'll also receive a notification via email and SMS when the results are uploaded."
        }
    ];

    const handleFAQClick = (index: number) => {
        setActiveFAQ(activeFAQ === index ? null : index);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // EMail bhejna h yaha abhi
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">How can we help you?</h1>
                    <p className="text-lg text-gray-600">We&apos;re here to help and answer any questions you might have</p>
                </div>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Phone className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="ml-4 text-lg font-semibold text-gray-900">Call Us</h3>
                        </div>
                        <p className="text-gray-600">Available 24/7 for emergency support</p>
                        <p className="text-blue-600 font-medium mt-2">+91 1234567890</p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Mail className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="ml-4 text-lg font-semibold text-gray-900">Email Us</h3>
                        </div>
                        <p className="text-gray-600">We&apos;ll respond as soon as possible</p>
                        <p className="text-blue-600 font-medium mt-2">support@healthcare.com</p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="ml-4 text-lg font-semibold text-gray-900">Live Chat</h3>
                        </div>
                        <p className="text-gray-600">Chat with our support team</p>
                        <button className="mt-2 text-blue-600 font-medium hover:text-blue-700">
                            Start Chat
                        </button>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg">
                                <button
                                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                                    onClick={() => handleFAQClick(index)}
                                >
                                    <span className="font-medium text-gray-900">{faq.question}</span>
                                    {activeFAQ === index ? (
                                        <ChevronUp className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </button>
                                {activeFAQ === index && (
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                        <p className="text-gray-600">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                Subject
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
