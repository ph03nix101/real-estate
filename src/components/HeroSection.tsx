import { motion } from "framer-motion";
import { Search, MapPin, DollarSign, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-mansion.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury modern mansion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-luxury text-center text-white pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-gold text-sm md:text-base font-semibold tracking-[0.3em] uppercase mb-4">
            Exceptional Properties, Extraordinary Living
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
        >
          Discover Your
          <br />
          <span className="text-gradient-gold">Dream Home</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-12"
        >
          We curate the finest luxury properties worldwide. Experience unparalleled
          service and find the home that matches your lifestyle.
        </motion.p>

        {/* Glass Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="glass-card max-w-4xl mx-auto rounded-2xl p-2 md:p-3"
        >
          <div className="flex flex-col md:flex-row gap-2 md:gap-0">
            {/* Location */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 md:border-r border-border/30">
              <MapPin className="w-5 h-5 text-gold" />
              <div className="flex-1">
                <label className="text-xs text-muted-foreground block text-left">Location</label>
                <input
                  type="text"
                  placeholder="City, neighborhood, or address"
                  className="w-full bg-transparent text-foreground text-sm focus:outline-none placeholder:text-muted-foreground/70"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 md:border-r border-border/30">
              <DollarSign className="w-5 h-5 text-gold" />
              <div className="flex-1">
                <label className="text-xs text-muted-foreground block text-left">Price Range</label>
                <select className="w-full bg-transparent text-foreground text-sm focus:outline-none appearance-none cursor-pointer">
                  <option value="">Any Price</option>
                  <option value="500000-1000000">R500K - R1M</option>
                  <option value="1000000-2500000">R1M - R2.5M</option>
                  <option value="2500000-5000000">R2.5M - R5M</option>
                  <option value="5000000+">R5M+</option>
                </select>
              </div>
            </div>

            {/* Property Type */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3">
              <Home className="w-5 h-5 text-gold" />
              <div className="flex-1">
                <label className="text-xs text-muted-foreground block text-left">Property Type</label>
                <select className="w-full bg-transparent text-foreground text-sm focus:outline-none appearance-none cursor-pointer">
                  <option value="">All Types</option>
                  <option value="house">House</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="villa">Villa</option>
                  <option value="estate">Estate</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <Button variant="luxury" size="xl" className="md:ml-2 rounded-xl">
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16"
        >
          {[
            { value: "500+", label: "Luxury Properties" },
            { value: "R2B+", label: "Properties Sold" },
            { value: "15+", label: "Years Experience" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
              <p className="text-white/60 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 1.5, delay: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-gold rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
