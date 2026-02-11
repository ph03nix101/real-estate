import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Phone, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const StickyContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-6 right-6 z-50"
        >
          {/* Expanded Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute bottom-16 right-0 mb-2 bg-card rounded-xl shadow-2xl border border-border p-4 min-w-[240px]"
              >
                <h4 className="font-semibold text-foreground mb-3">Contact an Expert</h4>
                <div className="space-y-2">
                  <a
                    href="tel:+1234567890"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Phone className="w-5 h-5 text-gold" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Call Us</p>
                      <p className="text-xs text-muted-foreground">(123) 456-7890</p>
                    </div>
                  </a>
                  <a
                    href="mailto:info@luxeterritory.com"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Mail className="w-5 h-5 text-gold" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Email Us</p>
                      <p className="text-xs text-muted-foreground">Quick response</p>
                    </div>
                  </a>
                  <a
                    href="#contact"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Calendar className="w-5 h-5 text-gold" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Schedule</p>
                      <p className="text-xs text-muted-foreground">Book a viewing</p>
                    </div>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle Button */}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant="luxury"
            size="icon"
            className="w-14 h-14 rounded-full shadow-xl"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <MessageCircle className="w-6 h-6" />
            )}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyContact;
