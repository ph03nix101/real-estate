import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import propertyService, { Property } from "@/services/property.service";
import { useToast } from "@/hooks/use-toast";

const FeaturedListings = () => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      setLoading(true);
      // Fetch featured properties or first 6 active properties
      const response = await propertyService.getAll({
        status: 'active',
        featured: true
      });

      // Limit to 6 properties for the homepage
      setProperties(response.properties.slice(0, 6));
    } catch (error: any) {
      console.error('Error loading featured properties:', error);
      toast({
        title: 'Error loading properties',
        description: error.message || 'Failed to load featured properties',
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

  const getBadge = (property: Property): "new" | "sold" | null => {
    if (property.status === 'sold') return 'sold';

    // Consider a property "new" if created within last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const createdDate = new Date(property.createdAt);

    if (createdDate > thirtyDaysAgo) return 'new';
    return null;
  };

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

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-gold" />
          </div>
        ) : properties.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">
              No featured properties available at the moment.
            </p>
            <Button variant="luxuryOutline" asChild>
              <Link to="/properties">
                View All Properties
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  image={getPropertyImage(property)}
                  title={property.title}
                  location={`${property.city}, ${property.state}`}
                  price={`R${property.price.toLocaleString()}`}
                  beds={property.beds}
                  baths={property.baths}
                  sqft={property.sqft.toLocaleString()}
                  badge={getBadge(property)}
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
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedListings;
