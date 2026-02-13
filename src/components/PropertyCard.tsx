import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Maximize, BedDouble, Bath, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  id: string;
  image: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: string;
  badge?: "new" | "sold" | null;
  delay?: number;
}

const PropertyCard = ({
  id,
  image,
  title,
  location,
  price,
  beds,
  baths,
  sqft,
  badge,
  delay = 0,
}: PropertyCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={`/property/${id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        viewport={{ once: true }}
        className="group relative bg-card rounded-xl overflow-hidden shadow-lg hover-lift cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay on hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${isHovered ? "opacity-100" : "opacity-60"
              }`}
          />

          {/* Badge */}
          {badge && (
            <div className="absolute top-4 left-4">
              <span className={badge === "new" ? "badge-new" : "badge-sold"}>
                {badge === "new" ? "New Construction" : "Just Sold"}
              </span>
            </div>
          )}

          {/* Quick Info on Hover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-4 left-4 right-4"
          >
            <div className="flex items-center gap-4 text-white mb-3">
              <div className="flex items-center gap-1.5">
                <BedDouble className="w-4 h-4" />
                <span className="text-sm">{beds} Beds</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4" />
                <span className="text-sm">{baths} Baths</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Maximize className="w-4 h-4" />
                <span className="text-sm">{sqft} m²</span>
              </div>
            </div>
            <Button variant="luxury" size="sm" className="w-full">
              View Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-gold transition-colors duration-300">
                {title}
              </h3>
              <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{location}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gradient-gold">{price}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default PropertyCard;
