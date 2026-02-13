import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import InquiryForm from "@/components/InquiryForm";
import AppointmentBookingForm from "@/components/AppointmentBookingForm";
import propertyService, { Property } from "@/services/property.service";
import { useToast } from "@/hooks/use-toast";
import PropertyMap from "@/components/PropertyMap";
import GoogleMapsProvider from "@/components/GoogleMapsProvider";
import { useAuth } from "@/contexts/AuthContext";
import { Pencil } from 'lucide-react';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      loadProperty();
    }
  }, [id]);

  const loadProperty = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await propertyService.getById(id);
      setProperty(data);
    } catch (error: any) {
      toast({
        title: "Property not found",
        description: error.message || "Failed to load property",
        variant: "destructive",
      });
      setTimeout(() => navigate("/properties"), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-gold" />
      </div>
    );
  }

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

  // Get images from property or use placeholder
  const images = property.images && property.images.length > 0
    ? property.images.map(img => propertyService.getImageUrl(img))
    : ["/placeholder.svg"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Format price
  const priceFormatted = `R${property.price.toLocaleString()}`;
  const pricePerSqft = Math.round(property.price / property.sqft);

  return (
    <div className="min-h-screen bg-background">


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
            {user && property.agent && user.id === property.agent.id && (
              <Link to={`/agent/properties/edit/${property.id}`}>
                <Button variant="outline" className="gap-2 text-real-estate-600 border-real-estate-200 hover:bg-real-estate-50">
                  <Pencil className="w-4 h-4" />
                  Edit Property
                </Button>
              </Link>
            )}
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
            {property.featured && (
              <Badge className="absolute top-4 left-4 bg-gold text-charcoal">
                Featured
              </Badge>
            )}
            {property.status === 'sold' && (
              <Badge className="absolute top-4 left-4 bg-charcoal text-cream">
                Sold
              </Badge>
            )}

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
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
              </>
            )}
          </motion.div>

          {/* Thumbnail List */}
          {images.length > 1 && (
            <div className="hidden lg:block relative h-full">
              <div className="absolute inset-0 flex flex-col gap-4 overflow-y-auto pr-2 costume-scrollbar">
                {images.map((img, idx) => (
                  <motion.div
                    key={idx}
                    className={`relative shrink-0 aspect-[16/10] rounded-xl overflow-hidden cursor-pointer ${currentImageIndex === idx
                      ? "ring-2 ring-gold"
                      : ""
                      }`}
                    onClick={() => setCurrentImageIndex(idx)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Property Details */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-gold" />
                    <span>{property.city}, {property.state}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-gold">
                    {priceFormatted}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    R{pricePerSqft.toLocaleString()}/m²
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
                  <span className="font-medium">{property.sqft.toLocaleString()}</span>
                  <span className="text-muted-foreground">m²</span>
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
                  {property.description ? (
                    <p className="whitespace-pre-wrap">{property.description}</p>
                  ) : (
                    <>
                      <p>
                        Welcome to {property.title}, an exceptional {property.propertyType} nestled in
                        the prestigious {property.city} neighborhood. This stunning {property.sqft.toLocaleString()} m²
                        residence offers {property.beds} bedrooms and {property.baths} bathrooms,
                        perfectly blending luxury living with modern convenience.
                      </p>
                      <p>
                        Built in {property.yearBuilt}, this property showcases sophisticated
                        architectural design with premium finishes throughout. The open floor plan
                        creates an inviting atmosphere for both intimate gatherings and grand
                        entertaining.
                      </p>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="mt-6">
                {property.amenities && property.amenities.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                      >
                        <Check className="w-4 h-4 text-gold flex-shrink-0" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No amenities listed for this property.</p>
                )}
              </TabsContent>

              <TabsContent value="location" className="mt-6">
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-muted relative shadow-lg border border-border/50">
                  {property.latitude && property.longitude ? (
                    <GoogleMapsProvider>
                      <PropertyMap
                        properties={[property]}
                        zoom={15}
                        className="w-full h-full"
                        center={{ lat: property.latitude, lng: property.longitude }}
                      />
                    </GoogleMapsProvider>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/30">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 mx-auto mb-4 text-gold" />
                        <p className="font-medium">{property.location}</p>
                        <p className="text-sm">{property.city}, {property.state}</p>
                        <p className="text-sm mt-2 text-muted-foreground/70">Map location not available</p>
                      </div>
                    </div>
                  )}
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
                {property.agent ? (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-charcoal font-bold text-xl">
                        {property.agent.firstName[0]}{property.agent.lastName[0]}
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-foreground">
                          {property.agent.firstName} {property.agent.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Property Agent
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {property.agent.phone && (
                        <a
                          href={`tel:${property.agent.phone}`}
                          className="flex items-center gap-3 text-muted-foreground hover:text-gold transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          <span>{property.agent.phone}</span>
                        </a>
                      )}
                      <a
                        href={`mailto:${property.agent.email}`}
                        className="flex items-center gap-3 text-muted-foreground hover:text-gold transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span>{property.agent.email}</span>
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="mb-6">
                    <h3 className="font-display font-semibold text-foreground mb-2">
                      Contact Us
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Interested in this property? Send us a message.
                    </p>
                  </div>
                )}

                {/* Inquiry & Appointment Tabs */}
                <Tabs defaultValue="inquiry" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="inquiry" className="flex-1">Send Inquiry</TabsTrigger>
                    <TabsTrigger value="appointment" className="flex-1">Book Viewing</TabsTrigger>
                  </TabsList>

                  <TabsContent value="inquiry" className="mt-4">
                    <InquiryForm
                      propertyId={property.id}
                      propertyTitle={property.title}
                    />
                  </TabsContent>

                  <TabsContent value="appointment" className="mt-4">
                    <AppointmentBookingForm
                      propertyId={property.id}
                      propertyTitle={property.title}
                    />
                  </TabsContent>
                </Tabs>
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

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <motion.img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              alt={`View ${currentImageIndex + 1}`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            />

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-16 h-12 rounded-md overflow-hidden border-2 transition-colors ${currentImageIndex === idx
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
            )}
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
};

export default PropertyDetails;
