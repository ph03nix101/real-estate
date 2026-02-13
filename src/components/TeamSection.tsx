import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Linkedin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const agents = [
  {
    id: 1,
    name: "Victoria Sterling",
    role: "Founder & Lead Agent",
    bio: "With over 20 years in luxury real estate, Victoria has closed over R500M in transactions. Her expertise in high-end properties is unmatched.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop",
    sales: "R180M+",
    properties: "45+",
  },
  {
    id: 2,
    name: "Marcus Chen",
    role: "Senior Property Specialist",
    bio: "Marcus brings architectural expertise to every transaction, helping clients understand the true value and potential of each property.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    sales: "R120M+",
    properties: "38+",
  },
  {
    id: 3,
    name: "Isabella Rodriguez",
    role: "International Sales Director",
    bio: "Fluent in five languages, Isabella connects global buyers with exceptional properties across three continents.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop",
    sales: "R95M+",
    properties: "32+",
  },
  {
    id: 4,
    name: "James Whitmore",
    role: "Estate Specialist",
    bio: "James specializes in historic estates and waterfront properties, with a deep network of exclusive listings.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop",
    sales: "R88M+",
    properties: "28+",
  },
];

const TeamSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slidesPerView = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 3 :
    typeof window !== 'undefined' && window.innerWidth >= 768 ? 2 : 1;

  const maxIndex = Math.max(0, agents.length - slidesPerView);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section id="team" className="section-padding bg-cream">
      <div className="container-luxury">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Our Experts
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Meet the Team
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our award-winning team of agents brings decades of combined experience
            and an unparalleled commitment to excellence.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="absolute -top-16 right-0 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="rounded-full border-border hover:border-gold hover:text-gold disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="rounded-full border-border hover:border-gold hover:text-gold disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Carousel */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: `-${currentIndex * (100 / slidesPerView + 2)}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {agents.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="min-w-full md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] group"
                >
                  <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover-lift">
                    {/* Image */}
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img
                        src={agent.image}
                        alt={agent.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Social Links */}
                      <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                        <Button variant="glass" size="icon" className="rounded-full">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                        <Button variant="glass" size="icon" className="rounded-full">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="glass" size="icon" className="rounded-full">
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-gold transition-colors">
                        {agent.name}
                      </h3>
                      <p className="text-gold text-sm font-medium mt-1">
                        {agent.role}
                      </p>
                      <p className="text-muted-foreground text-sm mt-3 line-clamp-2">
                        {agent.bio}
                      </p>

                      {/* Stats */}
                      <div className="flex gap-6 mt-4 pt-4 border-t border-border">
                        <div>
                          <p className="text-lg font-bold text-foreground">{agent.sales}</p>
                          <p className="text-xs text-muted-foreground">Sales Volume</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-foreground">{agent.properties}</p>
                          <p className="text-xs text-muted-foreground">Properties</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
