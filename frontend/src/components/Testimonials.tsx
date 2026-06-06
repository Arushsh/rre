import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Singer / Artist",
    content: "The quality of recording and mixing at RRE Studio is world-class. Highly recommended for every serious artist.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=33"
  },
  {
    name: "Priya Singh",
    role: "Independent Artist",
    content: "Amazing experience! The team is professional and they really understand the sound I was looking for.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=44"
  },
  {
    name: "Amit Kumar",
    role: "Music Producer",
    content: "The best studio in the region. Their equipment and acoustic treatment are top-notch.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=55"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-primary font-bold tracking-widest uppercase mb-4">Reviews</h2>
          <h3 className="text-4xl md:text-6xl font-black text-dark mb-6">Artist Stories</h3>
          <p className="text-gray-500 text-xl font-medium max-w-2xl mx-auto">
            See what the creative community says about their experience at our studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-12 bg-white rounded-[2.5rem] shadow-premium relative flex flex-col items-center text-center"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-20 h-20 rounded-full border-8 border-secondary overflow-hidden shadow-lg">
                  <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="mt-6 mb-8 flex gap-1">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent fill-current" />
                ))}
              </div>

              <Quote className="w-12 h-12 text-primary/10 mb-6" />
              
              <p className="text-gray-600 text-lg font-medium italic mb-10 leading-relaxed">
                "{item.content}"
              </p>
              
              <div>
                <h4 className="text-dark font-black text-xl mb-1">{item.name}</h4>
                <span className="text-primary font-bold text-sm uppercase tracking-wider">{item.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
