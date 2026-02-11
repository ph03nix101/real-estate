import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

const properties = [
  {
    id: "1",
    image: property1,
    title: "Modern Oceanfront Villa",
    location: "Miami Beach, FL",
    price: "$4,850,000",
    beds: 5,
    baths: 6,
    sqft: "6,200",
    badge: "new" as const,
  },
  {
    id: "2",
    image: property2,
    title: "Skyline Penthouse",
    location: "Manhattan, NY",
    price: "$8,200,000",
    beds: 4,
    baths: 4,
    sqft: "4,800",
    badge: null,
  },
  {
    id: "3",
    image: property3,
    title: "Mediterranean Estate",
    location: "Malibu, CA",
    price: "$12,500,000",
    beds: 7,
    baths: 8,
    sqft: "9,500",
    badge: "sold" as const,
  },
  {
    id: "4",
    image: property4,
    title: "Beachfront Paradise",
    location: "The Hamptons, NY",
    price: "$7,900,000",
    beds: 6,
    baths: 7,
    sqft: "7,200",
    badge: "new" as const,
  },
  {
    id: "5",
    image: property5,
    title: "Alpine Luxury Retreat",
    location: "Aspen, CO",
    price: "$5,400,000",
    beds: 5,
    baths: 5,
    sqft: "5,800",
    badge: null,
  },
  {
    id: "6",
    image: property6,
    title: "Industrial Chic Loft",
    location: "Brooklyn, NY",
    price: "$3,200,000",
    beds: 3,
    baths: 3,
    sqft: "3,500",
    badge: null,
  },
];

const FeaturedListings = () => {
  return (
    <section id="properties" className="section-padding bg-cream">
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
            Exclusive Portfolio
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Featured Properties
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our handpicked selection of exceptional homes, each representing
            the pinnacle of luxury living and architectural excellence.
          </p>
        </motion.div>

        {/* Properties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <PropertyCard
              key={property.title}
              {...property}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button variant="luxuryOutline" size="lg" asChild>
            <Link to="/properties">
              View All Properties
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedListings;
