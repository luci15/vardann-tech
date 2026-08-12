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
  | "training"
  | "borescope"
  | "penetrant"
  | "hardness"
  | "spectroscopy"
  | "pipeline";

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

// ---------------------------------------------------------------------------
// Services experience — /services and its four detail routes.
// Every line below is sourced from the company brochure/catalogue (see
// Company Brouchure.pdf); nothing here is invented copy.
// ---------------------------------------------------------------------------

export type ServiceMethod = {
  code: string;
  name: string;
  scope: string;
  points: string[];
  advantages?: string[];
  icon: IconKey;
};

export type ServiceMethodGroup = {
  title: string;
  intro?: string;
  image: string;
  methods: ServiceMethod[];
};

export type ServiceMeta = {
  id: string;
  number: string;
  slug: string;
  title: string;
  /** Slash-separated method tag line shown under the eyebrow on the hub. */
  eyebrow: string;
  /** Directional editorial headline for the individual page hero. */
  headline: string;
  /** Method-group tag line for the individual page hero. */
  subtitle: string;
  intro: string;
  cardDescriptor: string;
  heroVisualLabel: string;
  /** Real photography extracted from the company brochure (public/services). */
  heroImage: string;
  galleryImage: string;
  ctaImage: string;
  icon: IconKey;
  accent: "vblue" | "gold";
};

export const serviceMeta: ServiceMeta[] = [
  {
    id: "advanced-ndt",
    number: "01",
    slug: "advanced-ndt",
    title: "Advanced NDT",
    eyebrow: "ECT · RFT · IRIS · NFT · PAUT · TOFD · LRUT",
    headline: "Seeing what conventional inspection cannot.",
    subtitle:
      "Tube & Tubular Inspection · Advanced Ultrasonic Inspection · Pipeline Inspection",
    intro:
      "We specialize in Eddy Current, Remote Field, Near Field, and IRIS Ultrasonic Testing for both ferrous and non-ferrous tubes used in heat exchangers, boilers, and condensers.",
    cardDescriptor: "Tube inspection, advanced ultrasonic & pipeline screening",
    heroVisualLabel: "PAUT weld scan in progress",
    heroImage: "/services/advanced-ndt-hero.jpg",
    galleryImage: "/services/advanced-ndt-gallery.jpg",
    ctaImage: "/services/advanced-ndt-cta.jpg",
    icon: "eddyCurrent",
    accent: "vblue",
  },
  {
    id: "conventional-ndt",
    number: "02",
    slug: "conventional-ndt",
    title: "Conventional NDT",
    eyebrow: "UT · UTG · RT · MT · PT · HT · PWHT",
    headline: "Proven inspection. Precise decisions.",
    subtitle: "Field-Proven Flaw Detection & Material Verification",
    intro:
      "Ultrasonic Testing uses high-frequency sound waves to determine part thickness and detect internal or surface flaws in base materials and welds — real-time, accurate results that reduce costly downtime.",
    cardDescriptor: "Field-proven flaw detection & material verification",
    heroVisualLabel: "UT thickness gauging on a pressure line",
    heroImage: "/services/conventional-ndt-hero.jpg",
    galleryImage: "/services/conventional-ndt-gallery.jpg",
    ctaImage: "/services/conventional-ndt-cta.jpg",
    icon: "ultrasonic",
    accent: "vblue",
  },
  {
    id: "destructive-testing-training",
    number: "03",
    slug: "destructive-testing-training",
    title: "Destructive Testing & Training",
    eyebrow: "PMI · OES · METALLOGRAPHY · ASNT I / II / III",
    headline: "Understand the material. Build the expertise.",
    subtitle: "Chemical Analysis · Metallurgical Testing · NDT Training",
    intro:
      "Portable XRF and optical emission analysis confirm material chemistry on site, while our ASNT-aligned training programs build certified, field-ready NDT technicians.",
    cardDescriptor: "Chemical/metallurgical testing plus certified NDT training",
    heroVisualLabel: "In-situ metallography on a weld cross-section",
    heroImage: "/services/destructive-testing-hero.jpg",
    galleryImage: "/services/hub-gallery-training.jpg",
    ctaImage: "/services/destructive-testing-cta.jpg",
    icon: "metallography",
    accent: "gold",
  },
  {
    id: "manufacturing",
    number: "04",
    slug: "manufacturing",
    title: "Manufacturing",
    eyebrow: "CNC · VMC · EDM · WIRE CUT · FABRICATION",
    headline: "Precision engineered to specification.",
    subtitle: "Precision Manufacturing & Fabrication",
    intro:
      "Comprehensive precision manufacturing and fabrication services for industrial, engineering, and NDT applications — from prototype to batch production.",
    cardDescriptor: "Precision fabrication for NDT & industrial applications",
    heroVisualLabel: "CNC turning of a calibration tube blank",
    heroImage: "/services/manufacturing-hero.jpg",
    galleryImage: "/services/manufacturing-gallery.jpg",
    ctaImage: "/services/manufacturing-cta.jpg",
    icon: "manufacturing",
    accent: "vblue",
  },
];

export const advancedNdtGroups: ServiceMethodGroup[] = [
  {
    title: "Tube & Tubular Inspection",
    intro:
      "We specialize in Eddy Current, Remote Field, Near Field, and IRIS Ultrasonic Testing for both ferrous and non-ferrous tubes used in heat exchangers, boilers, and condensers.",
    image: "/services/group-tube-inspection.jpg",
    methods: [
      {
        code: "ECT",
        name: "Eddy Current Testing",
        scope: "Non-ferrous tubing",
        points: ["Wall thinning", "Pitting", "Cracking"],
        advantages: ["Absolute channels", "Differential channels"],
        icon: "eddyCurrent",
      },
      {
        code: "RFT",
        name: "Remote Field Testing",
        scope: "Ferrous tubing",
        points: ["Measures wall thinning / corrosion up to 12mm"],
        advantages: ["Fast screening for carbon steel", "Ferritic alloys"],
        icon: "probe",
      },
      {
        code: "IRIS",
        name: "Internal Rotary Inspection System",
        scope: "All materials",
        points: ["Remaining wall thickness from corrosion", "Erosion"],
        advantages: ["B-scan imaging", "C-scan imaging"],
        icon: "ultrasonic",
      },
      {
        code: "NFT",
        name: "Near Field Testing",
        scope: "Fin-fan / air cooler tubes",
        points: ["Internal corrosion", "Pitting near tube inlet"],
        advantages: ["Used during plant shutdowns"],
        icon: "probe",
      },
    ],
  },
  {
    title: "Advanced Ultrasonic Inspection",
    image: "/services/group-advanced-ultrasonic.jpg",
    methods: [
      {
        code: "PAUT",
        name: "Phased Array Ultrasonic Testing",
        scope: "Weld & component flaw detection",
        points: ["Multiple beams detect, size and image internal flaws"],
        advantages: ["Real-time imaging", "No radiation hazard"],
        icon: "ultrasonic",
      },
      {
        code: "TOFD",
        name: "Time of Flight Diffraction",
        scope: "New construction & in-service welds",
        points: ["Sizes weld defects using diffracted sound waves"],
        advantages: ["Accurate sizing", "Full weld coverage", "Digital record"],
        icon: "ultrasonic",
      },
    ],
  },
  {
    title: "Pipeline Inspection",
    image: "/services/group-pipeline.jpg",
    methods: [
      {
        code: "LRUT",
        name: "Long Range Ultrasonic Testing",
        scope: "Pipelines, above and below ground",
        points: ["Guided waves screen long pipe sections without direct access"],
        icon: "pipeline",
      },
      {
        code: "PECT",
        name: "Pulsed Eddy Current Testing",
        scope: "Corrosion under insulation (CUI)",
        points: ["Wall thickness through insulation, coatings, marine growth"],
        icon: "eddyCurrent",
      },
      {
        code: "RVI",
        name: "Remote Visual Inspection",
        scope: "Borescope / Videoscope",
        points: ["Inaccessible areas in engines", "Exchangers", "Turbines", "Welds"],
        icon: "borescope",
      },
    ],
  },
];

export const conventionalNdtGroups: ServiceMethodGroup[] = [
  {
    title: "Conventional Methods",
    intro:
      "Field-proven techniques for thickness measurement, flaw detection and material verification — single-sided access, immediate, actionable results.",
    image: "/services/group-conventional-methods.jpg",
    methods: [
      {
        code: "UT / UTG",
        name: "Ultrasonic Testing / Thickness Gauging",
        scope: "Base materials & welds",
        points: ["High-frequency sound waves measure thickness", "Detect internal or surface flaws"],
        advantages: ["Single-sided access", "Immediate results"],
        icon: "ultrasonic",
      },
      {
        code: "RT",
        name: "Radiographic Testing",
        scope: "Welds, castings, pressure components",
        points: ["X-ray / gamma ray inspection"],
        advantages: ["Volumetric inspection", "Permanent visual record"],
        icon: "radiography",
      },
      {
        code: "MT",
        name: "Magnetic Particle Testing",
        scope: "Ferromagnetic materials",
        points: ["Magnetic fields + iron particles reveal surface / near-surface cracks"],
        advantages: ["Portable", "Fast on-site inspection"],
        icon: "magneticParticle",
      },
      {
        code: "PT",
        name: "Liquid Penetrant Testing",
        scope: "Non-porous materials",
        points: ["Detects surface discontinuities"],
        advantages: ["Quick", "Cost-effective"],
        icon: "penetrant",
      },
      {
        code: "HT",
        name: "Hardness Testing",
        scope: "Metal surfaces",
        points: ["Verifies material strength", "Heat-treatment effectiveness"],
        icon: "hardness",
      },
      {
        code: "CTM",
        name: "Coating Thickness Measurement",
        scope: "Dry film thickness",
        points: ["Quality control for corrosion protection"],
        icon: "testBlock",
      },
      {
        code: "PWHT",
        name: "Post Weld Heat Treatment",
        scope: "Pressure vessels, piping, process equipment",
        points: ["Relieves residual stress", "Restores mechanical properties after welding"],
        icon: "welding",
      },
    ],
  },
];

export const destructiveTestingGroups: ServiceMethodGroup[] = [
  {
    title: "Chemical & Metallurgical Testing",
    image: "/services/group-chemical-metallurgical.jpg",
    methods: [
      {
        code: "PMI",
        name: "Positive Material Identification",
        scope: "Welds, castings, components",
        points: ["Portable XRF analyzers identify alloy composition"],
        advantages: ["NACE compliance"],
        icon: "spectroscopy",
      },
      {
        code: "OES",
        name: "Optical Emission Spectroscopy",
        scope: "Spark testing",
        points: ["Identifies elements via emitted light spectrum"],
        advantages: ["Prevents material mix-ups"],
        icon: "spectroscopy",
      },
      {
        code: "ISM",
        name: "In-Situ Metallography",
        scope: "Welds, power plants, pipelines",
        points: ["On-site microstructure analysis without damaging the component"],
        icon: "metallography",
      },
    ],
  },
  {
    title: "Training & Certification",
    intro:
      "NDT Level I, II and III as per ASNT standards — theory paired with hands-on practicals across every method we operate in the field.",
    image: "/services/group-training.jpg",
    methods: [
      {
        code: "L1–L3",
        name: "ASNT-Aligned NDT Training",
        scope: "PAUT · TOFD · ECT · RFT · IRIS · UT · MT · PT",
        points: ["Theory + hands-on practicals for each method"],
        advantages: [
          "Practical learning",
          "Certification readiness",
          "Flexible schedules",
          "Industry-recognized credential",
        ],
        icon: "training",
      },
    ],
  },
];

export type ManufacturingProduct = {
  name: string;
  description: string;
  specs: string[];
  icon: IconKey;
  image: string;
};

export const manufacturingContent = {
  capabilities: [
    "Precision Welding",
    "CNC Turning",
    "CNC Milling",
    "VMC Machining",
    "EDM",
    "Wire Cut EDM",
    "Conventional Machining",
    "Fabrication & Assembly",
  ],
  materials: [
    "Carbon Steel",
    "Stainless Steel",
    "Alloy Steel",
    "Duplex Stainless Steel",
    "Aluminium",
    "Copper Alloys",
    "Titanium",
    "Engineering Plastics",
  ],
  services: [
    "Prototype development",
    "Reverse engineering",
    "Job work",
    "Batch production from customer drawings / specifications",
  ],
  products: [
    {
      name: "Welded Flawed Specimens",
      description:
        "Used for NDT training, personnel qualification, and procedure validation — every specimen manufactured to a specified flaw type, size and location.",
      specs: [
        "Carbon Steel · Stainless Steel · Alloy Steel · Duplex Steel",
        "Nickel Alloys · Aluminium · Titanium · Copper Alloys",
        "Fully customizable: material, dimensions, flaw type/size/location, standard",
      ],
      icon: "weldedSpecimen",
      image: "/services/product-welded-specimens.jpg",
    },
    {
      name: "Calibration Tubes & ECT / RFT / NFT Probes",
      description:
        "Precision-machined tubular inspection standards for tube and probe qualification work.",
      specs: ["30+ materials", "Manufactured per ASME standards", "3–6 day custom shipping"],
      icon: "calibrationTube",
      image: "/services/product-calibration-tubes-probes.jpg",
    },
    {
      name: "Calibration Blocks",
      description:
        "CNC / EDM machined calibration standards manufactured to IIW and ASME tolerances.",
      specs: [
        "IIW Type 1 · IIW Type 2 · V1 · V2 · ASME Section V",
        "Step wedges · Custom pipe blocks",
        "NABL / NPL traceable",
      ],
      icon: "testBlock",
      image: "/services/product-calibration-blocks.jpg",
    },
  ] as ManufacturingProduct[],
};

export const whyVardann = [
  "Complete NDT Solutions under one roof",
  "Custom Manufacturing & Engineering Support",
  "Fast Delivery for Standard Products",
  "Precision CNC & EDM Manufacturing",
  "Technical Expertise & Application Support",
  "Global Supply Capability",
  "Customer-Focused Engineering Solutions",
];

// Every method/discipline code across all four services, deduped — used by
// the marquee strip on the services hub.
export const allMethodCodes = Array.from(
  new Set(serviceMeta.flatMap((s) => s.eyebrow.split(" · "))),
);
