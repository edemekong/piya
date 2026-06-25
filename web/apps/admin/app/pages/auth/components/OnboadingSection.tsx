import {
  ChevronRight,
  Megaphone,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

type OnboardingSlide = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  imageUrl: string;
};

const onboardingSlides: OnboardingSlide[] = [
  {
    icon: ShoppingBag,
    title: "Run daily business operations from one place.",
    subtitle:
      "Track customers, orders, offerings, and store performance without jumping between tools.",
    imageUrl: "/assets/business-operations.jpg",
  },
  {
    icon: Users,
    title: "Keep every customer profile close to the sale.",
    subtitle:
      "Review contact history, order activity, preferences, and follow-ups before the next interaction.",
    imageUrl: "/assets/happy-customer.jpg",
  },
  {
    icon: Megaphone,
    title: "Send campaigns that connect back to real orders.",
    subtitle:
      "Coordinate email, SMS, and WhatsApp updates around discounts, gifts, and customer moments.",
    imageUrl: "/assets/campaign.jpg",
  },
];

export function OnboadingSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = onboardingSlides[activeSlide];
  const SlideIcon = slide.icon;

  function showNextSlide() {
    setActiveSlide((current) => (current + 1) % onboardingSlides.length);
  }

  return (
    <div className="h-full min-w-0 py-screen pl-screen">
      <div className="relative h-full overflow-hidden rounded-lg">
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          src={slide.imageUrl}
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute left-screen top-screen flex items-center gap-2 rounded-full bg-black/35 px-3 py-2 backdrop-blur-sm">
          {onboardingSlides.map((item, index) => (
            <button
              aria-label={`Show onboarding slide ${index + 1}`}
              className={
                index === activeSlide
                  ? "h-2 w-8 rounded-full bg-secondary"
                  : "size-2 rounded-full bg-secondary/45 transition hover:bg-secondary/70"
              }
              key={item.title}
              onClick={() => setActiveSlide(index)}
              type="button"
            />
          ))}
        </div>

        <div className="absolute bottom-screen right-screen w-[min(684px,calc(100%-112px))] rounded-lg bg-black/45 p-card text-left backdrop-blur-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-secondary">
              <SlideIcon className="size-7 shrink-0" />
              <h2 className="text-title1 font-semibold">{slide.title}</h2>
            </div>
            <p className="text-callout leading-relaxed text-white/80">
              {slide.subtitle}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 flex h-24 w-28 items-end justify-start rounded-tr-[52px] bg-background p-4">
          <button
            aria-label="Next"
            className="flex size-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-sm transition hover:bg-secondary-light focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background"
            onClick={showNextSlide}
            type="button"
          >
            <ChevronRight className="size-7" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
