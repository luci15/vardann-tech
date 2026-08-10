// All copy below is sourced from the Vardann Tech and Engg LLP company
// profile brochure. Keep this the single source of truth for site content.

export const company = {
  name: "Vardann Tech and Engg LLP",
  formerlyKnownAs: "Advanced NDT Services LLP",
  tagline: "Powering Precision Globally",
  established: 2019,
  website: "www.vardanntech.com",
  social: "@vardanntech",
  quote: "Quality means doing it right when no one is looking.",
  about:
    "Vardann Tech and Engg LLP is an independently owned, globally recognized manufacturer and engineering solutions provider specializing in Non-Destructive Testing (NDT), Inspection Services, Metallography, Precision Manufacturing, and Engineering Solutions.",
  history:
    "Established in 2019, we are committed to delivering engineering excellence through innovative manufacturing, precision inspection, and ethical engineering practices. Our products and services are trusted by clients across India, the Middle East, Africa, and the Asia-Pacific region.",
  vision:
    "To establish VARDANN TECH as a global symbol of precision, innovation, integrity, and trust in NDT and metallurgical engineering.",
  mission:
    "To innovate with purpose, engineer with precision, and deliver with uncompromising integrity while creating reliable solutions that exceed customer expectations.",
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Contact Us", href: "/contact" },
];

export type IconKey =
  | "eddyCurrent"
  | "ultrasonic"
  | "magneticParticle"
  | "radiography"
  | "metallography"
  | "welding"
  | "calibrationTube"
  | "probe"
  | "testBlock"
  | "weldedSpecimen"
  | "transducer"
  | "wedge"
  | "manufacturing"
  | "training";

export type ServiceGroup = {
  id: string;
  number: string;
  title: string;
  summary: string;
  icon: IconKey;
  items: string[];
};

export const advancedNdt: ServiceGroup = {
  id: "advanced-ndt",
  number: "01",
  title: "Advanced NDT",
  summary:
    "Advanced non-destructive testing methods designed for accurate inspection, defect detection and condition assessment.",
  icon: "eddyCurrent",
  items: [
    "Eddy Current Testing (ECT)",
    "Remote Field Testing (RFT)",
    "Internal Rotary Inspection System (IRIS)",
    "Phased Array Ultrasonic Testing (PAUT)",
    "Time of Flight Diffraction (TOFD)",
    "Remote Visual Inspection / Boroscope",
    "Long Range Ultrasonic Testing (LRUT)",
  ],
};

export const conventionalNdt: ServiceGroup = {
  id: "conventional-ndt",
  number: "02",
  title: "Conventional NDT",
  summary:
    "Proven, field-tested inspection methods for flaw detection, thickness gauging and material verification.",
  icon: "ultrasonic",
  items: [
    "Ultrasonic Flaw Detection",
    "Ultrasonic Thickness Gauging / High Temperature Thickness Gauge",
    "Magnetic Particle Testing",
    "Dye Penetrant Testing",
    "Hardness Testing",
    "Radiography Testing",
    "Coating Thickness Measurement",
  ],
};

export const specializedInspection: ServiceGroup = {
  id: "specialized-inspection",
  number: "03",
  title: "Specialized & Third-Party Inspection",
  summary:
    "QA/QC, vendor surveillance and material verification for critical projects and supply chains.",
  icon: "welding",
  items: [
    "QA/QC Supervision and Welding Inspection",
    "Vendor Surveillance and Commodity Inspection",
    "Positive Material Identification (PMI)",
    "Optical Emission Spectroscopy (OES)",
    "In-Situ Metallography and Microstructure Analysis",
    "Post Weld Heat Treatment",
  ],
};

export const serviceGroups: ServiceGroup[] = [
  advancedNdt,
  conventionalNdt,
  specializedInspection,
];

// Capability categories for the homepage "Explore Our Capabilities"
// stacked-card showcase (Products section 2).
export type Capability = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: IconKey;
};

export const capabilities: Capability[] = [
  {
    id: "advanced-ndt",
    number: "01",
    title: "Advanced NDT",
    subtitle: "ECT / RFT / IRIS / PAUT / TOFD / LRUT",
    description:
      "Advanced non-destructive testing methods designed for accurate inspection, defect detection and condition assessment.",
    icon: "eddyCurrent",
  },
  {
    id: "conventional-ndt",
    number: "02",
    title: "Conventional NDT",
    subtitle: "UT / MPI / DPT / RT / Hardness",
    description:
      "Field-proven inspection techniques for flaw detection, thickness gauging and coating verification.",
    icon: "ultrasonic",
  },
  {
    id: "inspection-services",
    number: "03",
    title: "Inspection Services",
    subtitle: "QA/QC / Vendor Surveillance / PMI / OES",
    description:
      "Third-party inspection, supervision and material verification for demanding industrial projects.",
    icon: "welding",
  },
  {
    id: "metallography",
    number: "04",
    title: "Metallography",
    subtitle: "In-Situ Metallography / Microstructure Analysis",
    description:
      "Precision microstructure analysis and material characterization performed in-situ or in-lab.",
    icon: "metallography",
  },
  {
    id: "precision-manufacturing",
    number: "05",
    title: "Precision Manufacturing",
    subtitle: "Calibration Blocks / Tubes / Welded Specimens",
    description:
      "CNC / EDM machined calibration standards manufactured to ASME specifications with NABL/NPL traceability.",
    icon: "manufacturing",
  },
  {
    id: "training-certification",
    number: "06",
    title: "Training & Certification",
    subtitle: "NDT Method Training / Post Weld Heat Treatment",
    description:
      "Hands-on training and certification support across NDT methods and welding inspection practices.",
    icon: "training",
  },
];

// Product catalogue for the "Bestsellers" carousel (Products section 1).
// Images are real product photography supplied by the client
// (public/products/*.png) — every entry below has a matching photo.
export type Product = {
  id: string;
  category: string;
  name: string;
  description: string;
  spec: string;
  icon: IconKey;
  image: string;
};

export const bestsellerProducts: Product[] = [
  {
    id: "welded-specimen-set",
    category: "Welded Specimens",
    name: "Welded Flawed Specimen Set",
    description:
      "Calibration tube and welded step-wedge plates with carry handles, for PAUT/TOFD/UT procedure qualification and training.",
    spec: "Custom mock-up exchangers and tube bundles on request",
    icon: "weldedSpecimen",
    image: "/products/welded-specimen-set.png",
  },
  {
    id: "ect-rft-probes",
    category: "Tube Inspection",
    name: "ECT / RFT Probes",
    description:
      "Precision-machined tubular inspection probes with gold-plated connectors, built for consistent, repeatable readings.",
    spec: "Manufactured per ASME standards — custom orders ship in 3–6 days",
    icon: "probe",
    image: "/products/ect-rft-probes.png",
  },
  {
    id: "calibration-step-block-a",
    category: "Calibration Standards",
    name: "Calibration Step Wedge Block",
    description:
      "5-step 1018 carbon steel wedge block for ultrasonic thickness and sensitivity calibration.",
    spec: "NABL / NPL traceability on every block",
    icon: "testBlock",
    image: "/products/calibration-step-block-a.png",
  },
  {
    id: "calibration-step-block-b",
    category: "Calibration Standards",
    name: "Calibration Step Wedge Block — 1018 Steel",
    description:
      "Precision-ground 5-step calibration block, CNC/EDM machined to IIW-style tolerances.",
    spec: "NABL / NPL traceability on every block",
    icon: "testBlock",
    image: "/products/calibration-step-block-b.png",
  },
  {
    id: "magnetic-yoke",
    category: "Conventional NDT",
    name: "Magnetic Particle Yoke",
    description:
      "Dual-pole electromagnetic yoke with articulating legs for magnetic particle testing on welds and castings.",
    spec: "Compatible with wet and dry magnetic particle media",
    icon: "magneticParticle",
    image: "/products/magnetic-yoke.png",
  },
  {
    id: "tr-probe",
    category: "Probe Accessories",
    name: "TR Probe",
    description:
      "Twin-crystal transmit-receive probe for near-surface flaw detection and thickness gauging.",
    spec: "Straight and flexible ECT-RFT-NFT probes with TUD cables",
    icon: "wedge",
    image: "/products/tr-probe.png",
  },
  {
    id: "normal-beam-probe",
    category: "Probe Accessories",
    name: "Normal Beam Probe",
    description:
      "Single-element straight-beam probe engineered for consistent coupling and stable amplitude response.",
    spec: "Compatible with all major NDT instruments",
    icon: "probe",
    image: "/products/normal-beam-probe.png",
  },
  {
    id: "transducer-cable",
    category: "Accessories",
    name: "Ultrasonic Transducer Cable",
    description:
      "Shielded, low-noise transducer cable with locking connectors for stable, drift-free readings in the field.",
    spec: "Compatible with all major NDT instruments",
    icon: "transducer",
    image: "/products/transducer-cable.png",
  },
  {
    id: "weld-scanner",
    category: "Inspection Equipment",
    name: "Weld Scanner",
    description:
      "Vardann-built wheel scanner for phased array and TOFD weld inspection, with tool-free height adjustment.",
    spec: "Manufactured per ASME standards — custom orders ship in 3–6 days",
    icon: "manufacturing",
    image: "/products/weld-scanner.png",
  },
  {
    id: "cleaning-bulb",
    category: "Accessories",
    name: "Coupling & Cleaning Bulb",
    description:
      "Squeeze-bulb applicator for couplant and surface cleaning ahead of probe contact.",
    spec: "Compatible with all major NDT instruments",
    icon: "wedge",
    image: "/products/cleaning-bulb.png",
  },
];

export const industriesServed = [
  "Oil & Gas",
  "Petrochemical & Refining",
  "Power Generation",
  "Marine & Shipping",
  "Pipeline & Storage",
  "Heavy Manufacturing",
];
