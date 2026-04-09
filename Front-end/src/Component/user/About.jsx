import React from "react";
import img from "../../assets/Images/background3.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSeedling,
  faTractor,
  faEarthAmericas,
  faHandshake,
  faLeaf,
  faAward,
  faQuoteLeft
} from "@fortawesome/free-solid-svg-icons";

const About = () => {
  return (
    <div className="bg-[#f8fafc] font-sans selection:bg-green-200">
      
      {/* 🌟 HERO SECTION */}
      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax-like effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${img})` }}
        />
        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-green-950/60 to-black/90 backdrop-blur-[2px]"></div>

        <div className="relative z-10 px-6 text-center max-w-5xl mx-auto flex flex-col items-center">
          <span className="inline-block py-1 px-3 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
            Welcome to AgriFarm
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-6 leading-tight">
            Cultivating <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-300">Excellence</span> <br/> From The Ground Up
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed">
            We bridge the gap between traditional farming and modern agricultural science, providing premium seeds and fertilizers to ensure your harvest is nothing short of spectacular.
          </p>
        </div>

        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 text-[#f8fafc]">
            <svg className="relative block w-full h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.9,132.8,202.14,124.62,243.68,119.86,283.47,94.88,321.39,56.44Z" fill="currentColor"></path>
            </svg>
        </div>
      </div>

      {/* 🌱 OUR STORY SECTION */}
      <div className="max-w-7xl mx-auto py-24 px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-linear-to-r from-green-400 to-emerald-600 rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                <img 
                    src="https://plus.unsplash.com/premium_photo-1661962949590-1c248a9bbe6c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2VlZCUyMHBsYW50YWlvbiUyMHdpdGglMjB0cmFjdG9yfGVufDB8fDB8fHww"
                    alt="Farmer inspecting crops" 
                    className="w-full h-auto object-cover transform group-hover:scale-110 transition duration-1000"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-8">
                    <p className="text-white font-bold text-xl drop-shadow-md">Rooted in 20+ years of agricultural expertise.</p>
                </div>
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-20 -right-10 bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4 border border-green-50 z-20 animate-bounce-slow">
                <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center text-3xl">
                    <FontAwesomeIcon icon={faAward} />
                </div>
                <div>
                    <h4 className="font-black text-2xl text-gray-900">#1</h4>
                    <p className="text-gray-500 font-medium text-sm">Quality Seeds</p>
                </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:pl-10">
            <div className="flex items-center gap-3">
              <span className="w-10 h-1 bg-green-500 rounded-full"></span>
              <span className="text-green-600 font-bold uppercase tracking-widest text-sm">Our Story</span>
            </div>
            <h2 className="text-5xl font-black text-gray-900 leading-tight">
              A Legacy of <br/> <span className="text-green-600">Green Fields</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              What started as a small farming initiative has blossomed into AgriFarm—a leading provider of agricultural supplies. We realized that the secret to a bountiful yield wasn't just hard work; it was starting with the right foundations.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              Today, our mission is simple yet powerful: to equip every farmer, horticulturist, and home gardener with the highest quality, lab-tested seeds and bio-fertilizers. We believe in sustainable practices that nurture the soil and protect the environment for future generations.
            </p>
            <div className="mt-4 flex items-center gap-4">
                <div className="bg-green-50 text-green-700 p-4 rounded-2xl border border-green-100">
                    <FontAwesomeIcon icon={faQuoteLeft} className="text-2xl mb-2 opacity-50" />
                    <p className="font-bold italic">"He who plants a seed beneath the sod and waits to see believes in God."</p>
                </div>
            </div>
          </div>

        </div>
      </div>

      {/* 🚜 CORE VALUES */}
      <div className="bg-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">What Drives Us</h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">Our core values are the deeply ingrained principles that guide all of our company's actions and decisions.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Value 1 */}
                <div className="group bg-white p-10 rounded-[2.5rem] shadow-lg hover:shadow-2xl border border-gray-100 hover:border-green-200 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center text-4xl mb-6 transform group-hover:-translate-y-2 transition duration-500 shadow-sm">
                            <FontAwesomeIcon icon={faSeedling} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Sustainable Growth</h3>
                        <p className="text-gray-600 font-medium leading-relaxed">
                            We curate products that promote ecological balance, ensuring that our farming methods don't deplete the earth, but rather enrich it.
                        </p>
                    </div>
                </div>

                {/* Value 2 */}
                <div className="group bg-white p-10 rounded-[2.5rem] shadow-lg hover:shadow-2xl border border-gray-100 hover:border-emerald-200 transition-all duration-500 relative overflow-hidden mt-0 md:mt-8">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center text-4xl mb-6 transform group-hover:-translate-y-2 transition duration-500 shadow-sm">
                            <FontAwesomeIcon icon={faEarthAmericas} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovation in AgTech</h3>
                        <p className="text-gray-600 font-medium leading-relaxed">
                            Embracing modern technology, we bring you lab-tested, high-yielding seed varieties that are resilient against climate changes.
                        </p>
                    </div>
                </div>

                {/* Value 3 */}
                <div className="group bg-white p-10 rounded-[2.5rem] shadow-lg hover:shadow-2xl border border-gray-100 hover:border-yellow-200 transition-all duration-500 relative overflow-hidden mt-0 md:mt-16">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-3xl flex items-center justify-center text-4xl mb-6 transform group-hover:-translate-y-2 transition duration-500 shadow-sm">
                            <FontAwesomeIcon icon={faHandshake} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Farmer First</h3>
                        <p className="text-gray-600 font-medium leading-relaxed">
                            Our community of farmers is our biggest asset. We offer fair pricing, expert guidance, and unwavering support from sowing to harvest.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 🌾 IMPACT STATS */}
      <div className="relative py-24 bg-[#041d14] text-white">
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-96 h-96 bg-green-500/20 rounded-full blur-3xl mix-blend-screen"></div>
            <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-emerald-500/10 rounded-full blur-3xl mix-blend-screen"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-green-800 text-center">
             
             <div className="p-4">
                <h4 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-green-400 to-green-200 mb-2">15k+</h4>
                <p className="text-green-100/70 font-bold uppercase tracking-wider text-sm">Happy Farmers</p>
             </div>
             
             <div className="p-4">
                <h4 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-green-400 to-green-200 mb-2">500+</h4>
                <p className="text-green-100/70 font-bold uppercase tracking-wider text-sm">Seed Varieties</p>
             </div>
             
             <div className="p-4">
                <h4 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-green-400 to-green-200 mb-2">99%</h4>
                <p className="text-green-100/70 font-bold uppercase tracking-wider text-sm">Germination Rate</p>
             </div>
             
             <div className="p-4">
                <h4 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-green-400 to-green-200 mb-2">24/7</h4>
                <p className="text-green-100/70 font-bold uppercase tracking-wider text-sm">Expert Support</p>
             </div>

          </div>
        </div>
      </div>

      {/* 🚀 CALL TO ACTION */}
      <div className="max-w-5xl mx-auto py-24 px-6">
        <div className="relative bg-linear-to-br from-green-500 to-emerald-700 rounded-[3rem] p-12 md:p-16 text-center overflow-hidden shadow-2xl">
          {/* Glassmorphism decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Start Your Green Journey Today
            </h2>
            <p className="text-xl text-green-50 mb-10 max-w-2xl mx-auto font-medium">
                Browse our extensive catalog of premium, hand-selected seeds. Whether you are planting a commercial field or a backyard garden, we have exactly what you need.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-white text-green-700 font-bold py-4 px-10 rounded-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    Explore Products
                </button>
                <button className="bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white/10 transition-all duration-300">
                    Contact an Expert
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add a subtle custom animation in a style block */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce-slow {
            0%, 100% { transform: translateY(-5%); }
            50% { transform: translateY(5%); }
        }
        .animate-bounce-slow {
            animation: bounce-slow 4s infinite ease-in-out;
        }
      `}} />

    </div>
  );
};

export default About;