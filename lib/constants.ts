export interface CTAButton {
  label: string;
  href: string;
}

export interface Slide {
  kicker: string;
  title: string;
  desc: string;
  image: string;
  video?: string;
  cta: CTAButton;
}
