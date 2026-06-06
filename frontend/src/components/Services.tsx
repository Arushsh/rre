import React from 'react';
import { Mic2, Music, Scissors, Camera, Video, Youtube, Layout, Wand2, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
  {
    title: "Audio Recording",
    description: "High-quality vocal and instrument recording with professional gear.",
    icon: Mic2,
    color: "text-blue-600",
    bg: "bg-blue-100/50"
  },
  {
    title: "Mixing & Mastering",
    description: "Industry-standard processing to make your tracks radio-ready.",
    icon: Wand2,
    color: "text-purple-600",
    bg: "bg-purple-100/50"
  },
  {
    title: "Music Production",
    description: "Custom beat making and full track arrangement services.",
    icon: Music,
    color: "text-red-600",
    bg: "bg-red-100/50"
  },
  {
    title: "Cinematic Videography",
    description: "Stunning music videos and cinematic story-telling.",
    icon: Video,
    color: "text-amber-600",
    bg: "bg-amber-100/50"
  },
  {
    title: "Wedding Shoot",
    description: "Capturing your special moments with artistic perfection.",
    icon: Camera,
    color: "text-pink-600",
    bg: "bg-pink-100/50"
  },
  {
    title: "Video Editing",
    description: "Professional post-production with advanced color grading.",
    icon: Scissors,
    color: "text-emerald-600",
    bg: "bg-emerald-100/50"
  },
  {
    title: "Album Cover Design",
    description: "Eye-catching artwork that represents your musical identity.",
    icon: Layout,
    color: "text-indigo-600",
    bg: "bg-indigo-100/50"
  },
  {
    title: "YouTube Management",
    description: "Optimize your channel growth and content distribution.",
    icon: Youtube,
    color: "text-rose-600",
    bg: "bg-rose-100/50"
  }
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-primary font-bold tracking-widest uppercase mb-4">Our Expertise</h2>
            <h3 className="text-4xl md:text-6xl font-black text-dark">Professional <br /> Studio Services</h3>
          </div>
          <p className="text-gray-500 text-lg font-medium max-w-sm">
            Everything you need to transform your creative ideas into high-quality digital content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group p-8 bg-white rounded-[2rem] border border-gray-100 hover:shadow-premium transition-all duration-500 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-8">
                <div className={`w-14 h-14 ${service.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                  <service.icon className={`w-7 h-7 ${service.color}`} />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-6 h-6 text-gray-300" />
                </div>
              </div>
              <h4 className="text-xl font-black text-dark mb-4">{service.title}</h4>
              <p className="text-gray-500 font-medium leading-relaxed mb-6 flex-grow">
                {service.description}
              </p>
              <div className="h-1 w-0 group-hover:w-full bg-primary transition-all duration-500 rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
