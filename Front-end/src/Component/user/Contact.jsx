import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSeedling,
  faLocationDot,
  faPhone,
  faEnvelope,
  faClock,
  faPaperPlane,
  faHeadset,
  faLeaf
} from "@fortawesome/free-solid-svg-icons";

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const validationRules = {
    name: {
      required: "Name is required",
      pattern: {
        value: /^[A-Za-z\s]+$/,
        message: "Only characters allowed",
      },
    },
    email: {
      required: "Email is required",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Enter a valid email",
      },
    },
    subject: {
      required: "Subject is required",
      minLength: {
        value: 10,
        message: "Minimum 10 characters",
      },
    },
    message: {
      required: "Message is required",
      minLength: {
        value: 20, // Adjusted from 100 to be more user-friendly
        message: "Message must be at least 20 characters",
      },
    },
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/contact", data);
      if (response.data.success) {
        toast.success("Message sent successfully! We will get back to you soon.", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
        reset(); // Clear all form fields
      }
    } catch (error) {
      console.error("Contact Form Error:", error);
      toast.error(error.response?.data?.message || "Failed to send message. Please try again later.", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="bg-[#f8fafc] font-sans selection:bg-green-200">
      
      {/* 🌟 HERO SECTION */}
      <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef4e22?q=80&w=2070')` }}
        />
        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-green-950/70 to-black/90 backdrop-blur-[2px]"></div>

        <div className="relative z-10 px-6 text-center max-w-4xl mx-auto flex flex-col items-center mt-10">
          <span className="inline-block py-1 px-4 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-sm font-bold tracking-widest uppercase mb-4 backdrop-blur-md">
             We're Here For You
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-4 leading-tight flex items-center justify-center gap-4">
            Get in <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-300">Touch</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Whether you have a question about our premium seeds, need farming advice, or want to partner with us, our team is ready to answer all your questions.
          </p>
        </div>
      </div>

      {/* 🌿 MAIN CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-20 relative -mt-20 z-20">
        <div className="grid lg:grid-cols-12 gap-10">
            
            {/* LEFT COLUMN: About Content & Info */}
            <div className="lg:col-span-5 flex flex-col gap-8">
                
                {/* About Snippet Card */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">
                            <FontAwesomeIcon icon={faLeaf} />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-4">About AgriFarm Support</h3>
                        <p className="text-gray-600 leading-relaxed font-medium mb-4">
                            AgriFarm stands globally as a beacon of agricultural innovation. We don't just sell seeds—we foster communities. Our dedicated support team is backed by agronomists with decades of hands-on experience in the field.
                        </p>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            When you contact us, you’re speaking directly with experts who understand the soil, the seasons, and the struggles of modern farming. Let's cultivate success together.
                        </p>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-1 transition duration-300">
                        <FontAwesomeIcon icon={faPhone} className="text-green-500 text-3xl mb-3 group-hover:scale-110 transition"/>
                        <h4 className="font-bold text-gray-900 text-lg">Call Us</h4>
                        <p className="text-gray-500 text-sm mt-1">+91 98765 43210</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-1 transition duration-300">
                        <FontAwesomeIcon icon={faEnvelope} className="text-green-500 text-3xl mb-3 group-hover:scale-110 transition"/>
                        <h4 className="font-bold text-gray-900 text-lg">Email Us</h4>
                        <p className="text-gray-500 text-sm mt-1">support@agrifarm.com</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-1 transition duration-300">
                        <FontAwesomeIcon icon={faLocationDot} className="text-green-500 text-3xl mb-3 group-hover:scale-110 transition"/>
                        <h4 className="font-bold text-gray-900 text-lg">Visit Us</h4>
                        <p className="text-gray-500 text-sm mt-1">Ahmedabad, Gujarat</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-1 transition duration-300">
                        <FontAwesomeIcon icon={faClock} className="text-green-500 text-3xl mb-3 group-hover:scale-110 transition"/>
                        <h4 className="font-bold text-gray-900 text-lg">Working Hours</h4>
                        <p className="text-gray-500 text-sm mt-1">Mon-Sat: 9 AM - 7 PM</p>
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
                
                <div className="relative z-10">
                    <h3 className="font-black text-gray-900 text-3xl mb-2">Send a Message</h3>
                    <p className="text-gray-500 font-medium mb-8">Fill out the form below and we will get back to you as soon as possible.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      
                      {/* Name & Email Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="flex flex-col">
                            <label className="text-gray-700 font-bold text-sm mb-2 ml-1">Full Name</label>
                            <input
                              {...register("name", validationRules.name)}
                              placeholder="John Doe"
                              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                            />
                            {errors.name && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.name.message}</p>}
                          </div>

                          <div className="flex flex-col">
                            <label className="text-gray-700 font-bold text-sm mb-2 ml-1">Email Address</label>
                            <input
                              {...register("email", validationRules.email)}
                              placeholder="john@example.com"
                              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                            />
                            {errors.email && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.email.message}</p>}
                          </div>
                      </div>

                      {/* Subject */}
                      <div className="flex flex-col">
                        <label className="text-gray-700 font-bold text-sm mb-2 ml-1">Subject</label>
                        <input
                          {...register("subject", validationRules.subject)}
                          placeholder="How can we help you?"
                          className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                        />
                        {errors.subject && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.subject.message}</p>}
                      </div>

                      {/* Message */}
                      <div className="flex flex-col">
                        <label className="text-gray-700 font-bold text-sm mb-2 ml-1">Your Message</label>
                        <textarea
                          rows="5"
                          {...register("message", validationRules.message)}
                          placeholder="Please provide as much detail as possible..."
                          className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all resize-none"
                        />
                        {errors.message && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.message.message}</p>}
                      </div>

                      {/* Submit Button */}
                      <button className="w-full bg-linear-to-r from-green-500 to-emerald-600 text-white font-black py-4 rounded-2xl hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 text-lg mt-2">
                        <FontAwesomeIcon icon={faPaperPlane} />
                        Send Message
                      </button>

                    </form>
                </div>
              </div>
            </div>

        </div>
      </div>

      {/* 🗺️ GOOGLE MAP SECTION */}
      <div className="w-full h-[500px] relative mt-10">
        <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-[#f8fafc] to-transparent z-10 pointer-events-none"></div>
        <iframe
          title="map"
          src="https://maps.google.com/maps?q=Ahmedabad&t=&z=13&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          className="grayscale-[0.3] contrast-125 hover:grayscale-0 transition duration-700"
        ></iframe>
      </div>

    </div>
  );
};

export default Contact;