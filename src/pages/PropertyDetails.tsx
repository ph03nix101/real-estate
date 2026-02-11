import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Bed,
  Bath,
  Square,
  MapPin,
  Calendar,
  Home,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Mail,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { properties } from "@/data/properties";

const amenities = [
  "Central Air Conditioning",
  "Heated Floors",
  "Smart Home System",
  "Wine Cellar",
  "Home Theater",
  "Infinity Pool",
  "Private Gym",
  "Chef's Kitchen",
  "Outdoor Kitchen",
  "Fire Pit",
  "3-Car Garage",
  "Security System",
];

const PropertyDetails = () => {
  const { id } = useParams();
  const property = properties.find((p) => p.id === id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">
            Property Not Found
          </h1>
          <Link to="/properties">
            <Button variant="luxury">Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Simulate multiple images using the same image
  const images = [property.image, property.image, property.image, property.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="pt-24 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/properties" className="hover:text-gold transition-colors">
            Properties
          </Link>
          <span>/</span>
          <span className="text-foreground">{property.title}</span>
        </div>
      </div>

      {/* Back Button & Actions */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <Link to="/properties">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Listings
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSaved(!isSaved)}
              className={isSaved ? "text-red-500 border-red-500" : ""}
            >
              <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Image */}
          <motion.div
            className="lg:col-span-3 relative aspect-[16/10] rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => setIsLightboxOpen(true)}
            whileHover={{ scale: 1.005 }}
          >
            <img
              src={images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white font-medium transition-opacity">
                Click to view gallery
              </span>
            </div>
            {property.badge && (
              <Badge
                className={`absolute top-4 left-4 ${
                  property.badge === "new"
                    ? "bg-gold text-charcoal"
                    : "bg-charcoal text-cream"
                }`}
              >
                {property.badge === "new" ? "New Listing" : "Just Sold"}
              </Badge>
            )}

            {/* Navigation Arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Thumbnail Grid */}
          <div className="hidden lg:grid grid-rows-3 gap-4">
            {images.slice(1, 4).map((img, idx) => (
              <motion.div
                key={idx}
                className={`relative rounded-xl overflow-hidden cursor-pointer ${
                  currentImageIndex === idx + 1
                    ? "ring-2 ring-gold"
                    : ""
                }`}
                onClick={() => setCurrentImageIndex(idx + 1)}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={img}
                  alt={`View ${idx + 2}`}
                  className="w-full h-full object-cover"
                />
                {idx === 2 && images.length > 4 && (
                  <div
                    className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer"
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    <span className="text-white font-medium">
                      +{images.length - 4} more
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-gold" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-gold">
                    {property.priceFormatted}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ${Math.round(property.price / parseInt(property.sqft.replace(",", ""))).toLocaleString()}/sqft
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 py-6 border-y border-border">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-gold" />
                  <span className="font-medium">{property.beds}</span>
                  <span className="text-muted-foreground">Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-gold" />
                  <span className="font-medium">{property.baths}</span>
                  <span className="text-muted-foreground">Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="w-5 h-5 text-gold" />
                  <span className="font-medium">{property.sqft}</span>
                  <span className="text-muted-foreground">Sq Ft</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold" />
                  <span className="font-medium">{property.yearBuilt}</span>
                  <span className="text-muted-foreground">Year Built</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-gold" />
                  <span className="font-medium capitalize">{property.propertyType}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start bg-muted/50 p-1">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p>
                    Welcome to {property.title}, an exceptional {property.propertyType} nestled in 
                    the prestigious {property.city} neighborhood. This stunning {property.sqft} square 
                    foot residence offers {property.beds} bedrooms and {property.baths} bathrooms, 
                    perfectly blending luxury living with modern convenience.
                  </p>
                  <p>
                    Built in {property.yearBuilt}, this property showcases sophisticated 
                    architectural design with premium finishes throughout. The open floor plan 
                    creates an inviting atmosphere for both intimate gatherings and grand 
                    entertaining. Floor-to-ceiling windows flood the space with natural light 
                    while offering breathtaking views.
                  </p>
                  <p>
                    The gourmet chef's kitchen features top-of-the-line appliances, custom 
                    cabinetry, and an expansive island. The primary suite is a true retreat 
                    with a spa-inspired bathroom and generous walk-in closets. Additional 
                    highlights include a home theater, wine cellar, and resort-style outdoor 
                    living spaces.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                    >
                      <Check className="w-4 h-4 text-gold flex-shrink-0" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="location" className="mt-6">
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-muted">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-4 text-gold" />
                      <p className="font-medium">{property.location}</p>
                      <p className="text-sm mt-2">Interactive map coming soon</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Contact Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Agent Card */}
              <motion.div
                className="bg-card rounded-xl p-6 border border-border shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-charcoal font-bold text-xl">
                    JD
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">
                      James Davidson
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Luxury Property Specialist
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <a
                    href="tel:+1234567890"
                    className="flex items-center gap-3 text-muted-foreground hover:text-gold transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>(123) 456-7890</span>
                  </a>
                  <a
                    href="mailto:james@luxeterritory.com"
                    className="flex items-center gap-3 text-muted-foreground hover:text-gold transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>james@luxeterritory.com</span>
                  </a>
                </div>

                <form className="space-y-4">
                  <Input placeholder="Your Name" className="bg-background" />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    className="bg-background"
                  />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    className="bg-background"
                  />
                  <Textarea
                    placeholder={`I'm interested in ${property.title}...`}
                    rows={4}
                    className="bg-background resize-none"
                  />
                  <Button variant="luxury" className="w-full">
                    Request Information
                  </Button>
                </form>
              </motion.div>

              {/* Schedule Tour */}
              <motion.div
                className="bg-charcoal rounded-xl p-6 text-cream"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="font-display font-semibold text-lg mb-2">
                  Schedule a Private Tour
                </h3>
                <p className="text-cream/70 text-sm mb-4">
                  Experience this exceptional property in person with a private showing.
                </p>
                <Button variant="luxuryOutline" className="w-full">
                  Book a Tour
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <motion.img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              alt={`View ${currentImageIndex + 1}`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            />

            <button
              onClick={nextImage}
              className="absolute right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-16 h-12 rounded-md overflow-hidden border-2 transition-colors ${
                    currentImageIndex === idx
                      ? "border-gold"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumb ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default PropertyDetails;
