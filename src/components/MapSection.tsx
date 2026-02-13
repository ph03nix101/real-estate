import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Maximize2, Loader2, ArrowRight, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import propertyService, { Property } from "@/services/property.service";
import { useToast } from "@/hooks/use-toast";
import PropertyMap from "@/components/PropertyMap";
import GoogleMapsProvider from "@/components/GoogleMapsProvider";

const MapSection = () => {
  const { toast } = useToast();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getAll({ status: 'active' });
      setProperties(response.properties);
    } catch (error: any) {
      console.error('Error loading properties:', error);
      toast({
        title: 'Error loading properties',
        description: error.message || 'Failed to load properties for map',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPropertyImage = (property: Property) => {
    if (property.images && property.images.length > 0) {
      return propertyService.getImageUrl(property.images[0]);
    }
    return "/placeholder.svg";
  };

  const formatPrice = (price: number): string => {
    return `R${price.toLocaleString()}`;
  };

  // Get first 3 properties for sidebar preview
  const sidebarProperties = properties.slice(0, 3);

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
              className="lg:col-span-3 bg-muted rounded-2xl overflow-hidden relative min-h-[400px] lg:min-h-[500px] shadow-xl border border-border/50"
            >
              {loading ? (
                /* Loading State */
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-gold mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Loading map...</p>
                  </div>
                </div>
              ) : (
                /* Google Map Implementation */
                <div className="absolute inset-0 h-full w-full">
                  <GoogleMapsProvider>
                    <PropertyMap
                      properties={properties}
                      className="w-full h-full"
                      zoom={4}
                    />
                  </GoogleMapsProvider>

                  {/* Map Label Overlay */}
                  <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg z-10 pointer-events-none">
                    <p className="text-sm font-medium text-foreground">Interactive Map</p>
                    <p className="text-xs text-muted-foreground">{properties.filter(p => p.latitude).length} properties with location</p>
                  </div>
                </div>
              )}
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
                Featured Properties
              </h3>

              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-gold" />
                </div>
              ) : sidebarProperties.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-10">
                  No properties available
                </p>
              ) : (
                sidebarProperties.map((property, index) => (
                  <Link key={property.id} to={`/property/${property.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="group flex gap-4 p-3 rounded-xl bg-card hover:shadow-lg transition-all duration-300 cursor-pointer border border-border/50 hover:border-gold/30"
                    >
                      <div className="w-24 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={getPropertyImage(property)}
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
                          {property.city}, {property.state}
                        </p>
                        <p className="text-sm font-semibold text-gold mt-1">
                          {formatPrice(property.price)}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all self-center" />
                    </motion.div>
                  </Link>
                ))
              )}

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
        <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] p-0 gap-0 overflow-hidden border-border/50 flex flex-col">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-50 rounded-full bg-background/50 hover:bg-background"
            onClick={() => setIsMapOpen(false)}
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </Button>
          <DialogTitle className="sr-only">Full Property Map</DialogTitle>

          <div className="flex h-full">
            {/* Full Map Area */}
            <div className="flex-1 relative h-full w-full">
              <GoogleMapsProvider>
                <PropertyMap
                  properties={properties}
                  className="w-full h-full"
                  zoom={5}
                />
              </GoogleMapsProvider>

              {/* Map Overlay Info */}
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg z-10">
                <p className="text-sm font-bold text-foreground">Interactive Map</p>
                <p className="text-xs text-muted-foreground">{properties.length} Properties Available</p>
              </div>
            </div>

            {/* Sidebar listing (hidden on small screens) */}
            <div className="w-80 border-l border-border bg-background hidden md:flex md:flex-col h-full">
              <div className="p-4 border-b border-border bg-background z-10 flex-shrink-0">
                <h3 className="font-bold text-foreground">All Properties</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{properties.length} listings</p>
              </div>
              <div className="divide-y divide-border/50 flex-1 overflow-y-auto">
                {properties.map((prop) => (
                  <Link
                    key={prop.id}
                    to={`/property/${prop.id}`}
                    onClick={() => setIsMapOpen(false)}
                  >
                    <div className="flex gap-3 p-3 cursor-pointer transition-colors hover:bg-muted/50 group">
                      <img src={getPropertyImage(prop)} alt={prop.title} className="w-16 h-14 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate group-hover:text-gold transition-colors">{prop.title}</h4>
                        <p className="text-xs text-muted-foreground truncate">{prop.city}, {prop.state}</p>
                        <p className="text-xs font-semibold text-gold mt-0.5">{formatPrice(prop.price)}</p>
                      </div>
                    </div>
                  </Link>
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
