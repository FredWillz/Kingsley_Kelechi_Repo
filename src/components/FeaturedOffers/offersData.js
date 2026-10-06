import growthImage from "../../../public/photo-1633158829875-e5316a358c6f.avif";
export const offers = [
  {
    image: {
      // src: 'https://images.unsplash.com/photo-1482961667792-d164d3e7ab3d?q=80&w=1200&auto=format&fit=crop',
      src: growthImage,
      alt: "Woman hiking along a mountain ridge at sunset",
    },
    title: "Grow your savings faster",
    description:
      "Earn a $150 bonus when you deposit $10,000 or more into a new HSBC Tiered Savings account. Enjoy rates well above the national average, with no monthly fees or minimum balance.",
    fineprint: "Terms apply.",
    cta: "Learn more",
    to: "/personal/savings",
    imageSide: "right",
  },
  {
    image: {
      src: "https://images.unsplash.com/photo-1766066014237-00645c74e9c6?q=80&w=1200&auto=format&fit=crop",
      alt: "Smiling customer support representative wearing a headset at her desk",
    },
    title: "Visit our Help Center",
    description:
      "From FAQs to how-to guides to managing your cards, the Help Center is your go-to resource for all your banking needs. You can also reach us anytime at 1-800-555-0199.",
    fineprint: null,
    cta: "Help Center",
    to: "/support",
    imageSide: "left",
  },
];
