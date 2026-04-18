import { Heart, Mail, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-sage-light/50 py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-hope flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold text-xl text-foreground">
                Soul Space
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              A safe, anonymous space for those who need someone to talk to. 
              You're not alone on this journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#mood-selector" className="text-muted-foreground hover:text-primary transition-colors">
                  Talk to a Volunteer
                </a>
              </li>
              <li>
                <a href="#yoga" className="text-muted-foreground hover:text-primary transition-colors">
                  Yoga Sessions
                </a>
              </li>
              <li>
                <a href="#relaxation" className="text-muted-foreground hover:text-primary transition-colors">
                  Relaxation Music
                </a>
              </li>
            </ul>
          </div>

          {/* Crisis Support */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Crisis Support
            </h4>
            <p className="text-muted-foreground text-sm mb-4">
              If you're in immediate danger, please reach out to professional help:
            </p>
            <div className="space-y-2">
              <a 
                href="tel:988" 
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Phone className="w-4 h-4" />
                988 Suicide & Crisis Lifeline
              </a>
              <a 
                href="mailto:support@soulspace.com" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                support@soulspace.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Soul Space. Made with{" "}
            <Heart className="w-4 h-4 inline text-coral" /> for those who need it most.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            This is a support platform, not a replacement for professional mental health care.
          </p>
        </div>
      </div>
    </footer>
  );
};
