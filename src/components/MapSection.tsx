import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, X, Maximize2, Bed, Bath, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { properties } from "@/data/properties";
import { Link } from "react-router-dom";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const mapProperties = [
  {
    id: 1,
    image: property1,
    title: "Modern Oceanfront Villa",
    location: "Miami Beach, FL",
    price: "$4,850,000",
  },
  {
    id: 2,
    image: property2,
    title: "Skyline Penthouse",
    location: "Manhattan, NY",
    price: "$8,200,000",
  },
  {
    id: 3,
    image: property3,
    title: "Mediterranean Estate",
    location: "Malibu, CA",
    price: "$12,500,000",
  },
];

const pinPositions = [
  { top: "20%", left: "15%", propertyIndex: 0 },
  { top: "35%", left: "75%", propertyIndex: 1 },
  { top: "60%", left: "30%", propertyIndex: 2 },
  { top: "25%", left: "55%", propertyIndex: 3 },
  { top: "50%", left: "65%", propertyIndex: 4 },
  { top: "70%", left: "45%", propertyIndex: 5 },
  { top: "40%", left: "20%", propertyIndex: 6 },
  { top: "15%", left: "40%", propertyIndex: 7 },
  { top: "55%", left: "80%", propertyIndex: 8 },
  { top: "75%", left: "15%", propertyIndex: 9 },
  { top: "30%", left: "90%", propertyIndex: 10 },
  { top: "65%", left: "55%", propertyIndex: 11 },
];

const MapSection = () => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState<number | null>(null);

  return (
    <>
      <section id="map" className="section-padding bg-background">
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
              Explore Locations
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Find Properties Near You
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover luxury properties in the most sought-after neighborhoods
              and communities around the world.
            </p>
          </motion.div>

          {/* Map Layout */}
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-3 bg-muted rounded-2xl overflow-hidden relative min-h-[400px] lg:min-h-[500px]"
            >
              {/* Stylized Map Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted">
                <div className="absolute inset-0 opacity-30">
                  <div className="w-full h-full" style={{
                    backgroundImage: `
                      linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                      linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                  }} />
                </div>
                
                {/* Map Pins */}
                {[
                  { top: '30%', left: '25%' },
                  { top: '45%', left: '60%' },
                  { top: '65%', left: '35%' },
                  { top: '25%', left: '70%' },
                  { top: '55%', left: '45%' },
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                    viewport={{ once: true }}
                    className="absolute"
                    style={{ top: pos.top, left: pos.left }}
                  >
                    <div className="relative group cursor-pointer">
                      <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <MapPin className="w-5 h-5 text-charcoal" />
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
                          View Property
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Map Label */}
                <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                  <p className="text-sm font-medium text-foreground">Interactive Map</p>
                  <p className="text-xs text-muted-foreground">Click pins to explore</p>
                </div>
              </div>
            </motion.div>

            {/* Property Thumbnails */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-4"
            >
              <h3 className="font-semibold text-lg text-foreground mb-4">
                Nearby Properties
              </h3>
              
              {mapProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="group flex gap-4 p-3 rounded-xl bg-card hover:shadow-lg transition-all duration-300 cursor-pointer border border-border/50 hover:border-gold/30"
                >
                  <div className="w-24 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground group-hover:text-gold transition-colors truncate">
                      {property.title}
                    </h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {property.location}
                    </p>
                    <p className="text-sm font-semibold text-gold mt-1">
                      {property.price}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all self-center" />
                </motion.div>
              ))}

              <Button
                variant="luxuryOutline"
                className="w-full mt-4"
                onClick={() => setIsMapOpen(true)}
              >
                <Maximize2 className="w-4 h-4 mr-2" />
                View Full Map
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Full Map Modal */}
      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] p-0 gap-0 overflow-hidden border-border/50">
          <DialogTitle className="sr-only">Full Property Map</DialogTitle>
          
          <div className="flex h-full">
            {/* Full Map Area */}
            <div className="flex-1 overflow-auto relative">
              {/* Scrollable map canvas - larger than viewport to allow scrolling */}
              <div className="relative bg-gradient-to-br from-secondary to-muted" style={{ width: "150%", height: "150%", minWidth: "900px", minHeight: "700px" }}>
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full" style={{
                    backgroundImage: `
                      linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                      linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                  }} />
                </div>

                {/* All property pins */}
                {pinPositions.map((pos, i) => {
                  const prop = properties[pos.propertyIndex];
                  if (!prop) return null;
                  const isSelected = selectedPin === i;
                  const topPercent = parseFloat(pos.top);
                  const leftPercent = parseFloat(pos.left);
                  // Position tooltip below if pin is near top, and shift horizontally if near edges
                  const showBelow = topPercent < 35;
                  const shiftRight = leftPercent > 75;
                  const shiftLeft = leftPercent < 20;

                  return (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="absolute z-10"
                      style={{ top: pos.top, left: pos.left }}
                    >
                      <div
                        className="relative cursor-pointer"
                        onClick={() => setSelectedPin(isSelected ? null : i)}
                      >
                        <motion.div
                          animate={{ scale: isSelected ? 1.3 : 1 }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 ${
                            isSelected ? "bg-gold ring-4 ring-gold/30" : "bg-gold/80 hover:bg-gold"
                          }`}
                        >
                          <MapPin className="w-5 h-5 text-charcoal" />
                        </motion.div>

                        {/* Tooltip */}
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, y: showBelow ? -5 : 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`absolute z-20 ${
                              showBelow
                                ? "top-full mt-3"
                                : "bottom-full mb-3"
                            } ${
                              shiftRight
                                ? "right-0"
                                : shiftLeft
                                ? "left-0"
                                : "left-1/2 -translate-x-1/2"
                            }`}
                          >
                            <div className="bg-background border border-border rounded-xl shadow-2xl p-3 w-56">
                              <img
                                src={prop.image}
                                alt={prop.title}
                                className="w-full h-28 object-cover rounded-lg mb-2"
                              />
                              <h4 className="font-semibold text-sm text-foreground truncate">{prop.title}</h4>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" /> {prop.location}
                              </p>
                              <p className="text-sm font-bold text-gold mt-1">{prop.priceFormatted}</p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{prop.beds}</span>
                                <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{prop.baths}</span>
                                <span className="flex items-center gap-1"><Ruler className="w-3 h-3" />{prop.sqft}</span>
                              </div>
                              <Link
                                to={`/property/${prop.id}`}
                                onClick={() => setIsMapOpen(false)}
                                className="block mt-2 text-center text-xs font-semibold text-charcoal bg-gold hover:bg-gold-light rounded-lg py-1.5 transition-colors"
                              >
                                View Details
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Map Legend */}
                <div className="sticky bottom-4 left-4 inline-block bg-background/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg ml-4 mb-4">
                  <p className="text-sm font-semibold text-foreground">{properties.length} Properties</p>
                  <p className="text-xs text-muted-foreground">Scroll to explore • Click pins for details</p>
                </div>
              </div>
            </div>

            {/* Sidebar listing */}
            <div className="w-80 border-l border-border bg-background overflow-y-auto hidden md:block">
              <div className="p-4 border-b border-border sticky top-0 bg-background z-10">
                <h3 className="font-bold text-foreground">All Properties</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{properties.length} listings</p>
              </div>
              <div className="divide-y divide-border/50">
                {properties.map((prop, i) => (
                  <div
                    key={prop.id}
                    className={`flex gap-3 p-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedPin !== null && properties[pinPositions[selectedPin]?.propertyIndex]?.id === prop.id
                        ? "bg-gold/10 border-l-2 border-l-gold"
                        : ""
                    }`}
                    onClick={() => {
                      const pinIndex = pinPositions.findIndex(p => p.propertyIndex === i);
                      if (pinIndex !== -1) setSelectedPin(pinIndex);
                    }}
                  >
                    <img src={prop.image} alt={prop.title} className="w-16 h-14 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">{prop.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">{prop.location}</p>
                      <p className="text-xs font-semibold text-gold mt-0.5">{prop.priceFormatted}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MapSection;
