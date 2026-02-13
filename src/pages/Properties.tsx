import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Grid3X3, LayoutList, SlidersHorizontal, X, Loader2, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PropertyCard from "@/components/PropertyCard";

import propertyService, { Property } from "@/services/property.service";
import { useToast } from "@/hooks/use-toast";
import {
  propertyTypes,
  priceRanges,
  bedroomOptions,
  sortOptions,
} from "@/data/properties";

const Properties = () => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: "all",
    priceRange: "all",
    bedrooms: "all",
    sort: "featured",
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getAll({ status: 'active' });
      setProperties(response.properties);
    } catch (error: any) {
      toast({
        title: "Error loading properties",
        description: error.message || "Failed to load properties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = (() => {
    let result = [...properties];

    // Filter by property type
    if (filters.propertyType !== "all") {
      result = result.filter((p) => p.propertyType === filters.propertyType);
    }

    // Filter by price range
    if (filters.priceRange !== "all") {
      const range = priceRanges.find((r) => r.value === filters.priceRange);
      if (range) {
        result = result.filter((p) => p.price >= range.min && p.price < range.max);
      }
    }

    // Filter by bedrooms
    if (filters.bedrooms !== "all") {
      const minBeds = parseInt(filters.bedrooms);
      result = result.filter((p) => p.beds >= minBeds);
    }

    // Sort
    switch (filters.sort) {
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "beds":
        result.sort((a, b) => b.beds - a.beds);
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  })();

  const activeFilterCount = [
    filters.propertyType !== "all",
    filters.priceRange !== "all",
    filters.bedrooms !== "all",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({
      propertyType: "all",
      priceRange: "all",
      bedrooms: "all",
      sort: "featured",
    });
  };

  // Get the first image URL or placeholder
  const getPropertyImage = (property: Property): string => {
    if (property.images && property.images.length > 0) {
      return propertyService.getImageUrl(property.images[0]);
    }
    return "/placeholder.svg";
  };

  // Format price
  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">


      {/* Hero Banner */}
      <section className="pt-24 pb-12 bg-cream">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Properties
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Explore our complete portfolio of exceptional properties. Use the filters
              to find your perfect luxury home.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="sticky top-[72px] z-40 bg-background border-b border-border py-4">
        <div className="container-luxury">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left - Filter Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant={showFilters ? "luxury" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-charcoal text-xs rounded-full flex items-center justify-center font-semibold">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear all
                  <X className="w-4 h-4 ml-1" />
                </Button>
              )}

              <span className="text-sm text-muted-foreground ml-2">
                {filteredProperties.length} {filteredProperties.length === 1 ? "property" : "properties"}
              </span>
            </div>

            {/* Right - Sort & View */}
            <div className="flex items-center gap-3">
              <Select
                value={filters.sort}
                onValueChange={(value) => setFilters({ ...filters, sort: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="hidden md:flex border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <LayoutList className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Expandable Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-border"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Property Type
                  </label>
                  <Select
                    value={filters.propertyType}
                    onValueChange={(value) =>
                      setFilters({ ...filters, propertyType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Price Range
                  </label>
                  <Select
                    value={filters.priceRange}
                    onValueChange={(value) =>
                      setFilters({ ...filters, priceRange: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any Price" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Bedrooms
                  </label>
                  <Select
                    value={filters.bedrooms}
                    onValueChange={(value) =>
                      setFilters({ ...filters, bedrooms: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any Beds" />
                    </SelectTrigger>
                    <SelectContent>
                      {bedroomOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Properties Grid/List */}
      <section className="section-padding">
        <div className="container-luxury">
          {filteredProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-xl text-muted-foreground mb-4">
                No properties match your criteria
              </p>
              <Button variant="luxuryOutline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </motion.div>
          ) : viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  image={getPropertyImage(property)}
                  title={property.title}
                  location={`${property.city}, ${property.state}`}
                  price={formatPrice(property.price)}
                  beds={property.beds}
                  baths={property.baths}
                  sqft={property.sqft.toLocaleString()}
                  badge={property.status === 'sold' ? 'sold' : property.featured ? 'new' : null}
                  delay={index * 0.05}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProperties.map((property, index) => (
                <Link key={property.id} to={`/property/${property.id}`}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="group flex flex-col md:flex-row gap-6 bg-card rounded-xl overflow-hidden shadow-lg hover-lift border border-border/50"
                  >
                    <div className="md:w-80 lg:w-96 aspect-[4/3] md:aspect-auto overflow-hidden flex-shrink-0">
                      <img
                        src={getPropertyImage(property)}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        {(property.featured || property.status === 'sold') && (
                          <span
                            className={property.status === 'sold' ? "badge-sold" : "badge-new"}
                          >
                            {property.status === 'sold' ? "Sold" : "Featured"}
                          </span>
                        )}
                        <h3 className="text-xl font-semibold text-foreground mt-2 group-hover:text-gold transition-colors">
                          {property.title}
                        </h3>
                        <p className="text-muted-foreground mt-1">{property.city}, {property.state}</p>
                        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                          <span>{property.beds} Beds</span>
                          <span>•</span>
                          <span>{property.baths} Baths</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Square className="w-4 h-4" />
                            <span>{property.sqft.toLocaleString()} m²</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-6">
                          <p className="text-2xl font-bold text-gradient-gold">
                            {formatPrice(property.price)}
                          </p>
                          <Button variant="luxury" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="hidden"></div>

                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section >


    </div >
  );
};

export default Properties;
