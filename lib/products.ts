/**
 * Product catalog extracted from the legacy products.html inline PRODUCTS
 * array (30 products). Edit here to update the catalog; the products page,
 * cards, and detail modal all render from this data.
 */

import PRODUCT_IMAGE_MANIFEST from './product-images.json';

export type ProductCategory = 'pallets' | 'crates' | 'bins' | 'containers';

export type Product = {
  id: number;
  name: string;
  category: string;
  cat: ProductCategory;
  badge: string;
  status: string;
  statusClass: 'status-badge-green' | 'status-badge-blue' | 'status-badge-amber';
  shortDesc: string;
  image: string;
  /**
   * Featured 1:1 image shown on the collapsed product card. Falls back to
   * the generated /products/product-{id}/cover.jpg, then to `image`.
   */
  coverImage?: string;
  /**
   * Optional gallery of this product from different angles (front, back,
   * sides, close-up…). First entry is the main preview. When omitted, a
   * placeholder gallery is derived from same-category products (see
   * productGallery below); set a single-entry array to force the classic
   * one-image modal for a product.
   */
  images?: string[];
  description: string;
  material: string;
  dimensions: string;
  loadCapacity: string;
  colors: string[];
  applications: string[];
  features: string[];
  availability: string;
};

/** Swatch hex -> human-readable name (from the legacy modal renderer). */
export const COLOR_LABELS: Record<string, string> = {
  '#2d6a4f': 'Forest Green', '#6b7280': 'Industrial Grey', '#1e40af': 'Cobalt Blue', '#92400e': 'Amber Brown',
  '#1f2937': 'Carbon Black', '#dc2626': 'Safety Red', '#16a34a': 'Signal Green', '#f59e0b': 'Caution Yellow',
  '#fbbf24': 'Bright Yellow', '#f8fafc': 'Arctic White', '#dcfce7': 'Mint', '#dbeafe': 'Sky Blue',
  '#fef3c7': 'Cream', '#fef9c3': 'Pale Yellow', '#b45309': 'Terracotta', '#71717a': 'Steel', '#3f3f46': 'Graphite',
  '#1e3a5f': 'Navy',
};

export const PRODUCTS: Product[] = [
  {
    "id": 1,
    "name": "Reinforced Euro Pallet",
    "category": "Industrial Pallets",
    "cat": "pallets",
    "badge": "High Density",
    "status": "In Stock",
    "statusClass": "status-badge-green",
    "shortDesc": "Standardized 1200×800mm reinforced plastic pallet designed for heavy rack loads and automated systems.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCM_sssouJ-7lR-75qrCH_N_dXlpZGqep2zgxU4Ee-BlJNfQB8LrAKdb-Ejqw9gVNbW_SLrF3PU_h9kqYcP-x9-NLypDQNPfipDNBQFymdhdxGr4-g7noecTfeH6dpilDB8J3Hb2TlpSNk7-qz7HBb-P4bHLuAvij-0UA1dvyQxuV8rUopRZck9yzMHtXr0pvhFos_i_mUAgOUK0eTCRjqMCkFhqlq_VA4HdTsyrYNdFN6sh2SLhsCfLakfnHzoKQxMzm7y_rb2uDYS",
    "description": "The Reinforced Euro Pallet is our flagship product, engineered to the ISO 6780 standard footprint of 1200×800mm. Built from high-density polyethylene (HDPE), it withstands dynamic loads up to 1,500 kg in racking systems. Its nine-leg design ensures compatibility with automated conveyor lines and forklift entry from all four sides.",
    "material": "Virgin HDPE (High-Density Polyethylene)",
    "dimensions": "1200 × 800 × 145 mm",
    "loadCapacity": "1,500 kg dynamic / 5,000 kg static",
    "colors": [
      "#2d6a4f",
      "#6b7280",
      "#1e40af",
      "#92400e"
    ],
    "applications": [
      "Warehouse Racking",
      "Export Logistics",
      "Automated Conveyor Systems",
      "Cold Storage"
    ],
    "features": [
      "4-Way Forklift Entry",
      "Hygienic Non-Porous Surface",
      "UV Stabilized",
      "ISPM-15 Exempt",
      "Rackable Design",
      "Anti-Slip Surface"
    ],
    "availability": "Immediate dispatch. MOQ 50 units. Bulk pricing available."
  },
  {
    "id": 2,
    "name": "Space-Saver Crate XT",
    "category": "Heavy-Duty Crates",
    "cat": "crates",
    "badge": "Collapsible",
    "status": "Bulk Available",
    "statusClass": "status-badge-blue",
    "shortDesc": "Collapsible industrial-grade crate with high-impact resistance for return logistics efficiency.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuApH6SUNnP3VAWl9xRQPWKmjIIwgAmdQQjlZ1fCkdIefD8-_-E1sfxIMw3wKMy9O37ieDQsUgCKoGwFQrKYVYZMxxQCt7a0i8htm50sagvr8uFf_wHwQHivbWo_5hY_tSUUcQZhPgCr8sZWdGf9WnqCDbI0Tq-lXLcI41wCgbqchewDpeUp_0zjxWrjWRBgH7oZanWkzKXdBNTt1G63i_PMat0Ov2LBF7Xo5Zjoa4F7lJ1cd9bmmN9b-0r3mKTxZ3wXjZtECPgz6Mms",
    "description": "The Space-Saver Crate XT redefines return logistics with its patented 4-panel folding mechanism, reducing volume by up to 75% when empty. Constructed from impact-modified polypropylene, it sustains 600 kg loads in stacking configuration. The reinforced corner posts and snap-lock base ensure structural integrity through 500+ folding cycles.",
    "material": "Impact-Modified Polypropylene (PP)",
    "dimensions": "600 × 400 × 320 mm (unfolded)",
    "loadCapacity": "600 kg stacked / 150 kg dynamic",
    "colors": [
      "#6b7280",
      "#2d6a4f",
      "#1f2937"
    ],
    "applications": [
      "Return Logistics",
      "Automotive Parts",
      "Beverage Industry",
      "Retail Supply Chain"
    ],
    "features": [
      "75% Volume Reduction When Folded",
      "500+ Fold Cycle Rating",
      "Snap-Lock Base",
      "Drop-Down Front Panel",
      "Integrated Handle",
      "Ventilated Sides"
    ],
    "availability": "Stock available. Lead time 5–7 days for large orders. Custom branding available."
  },
  {
    "id": 3,
    "name": "Modular Picking Bins",
    "category": "Storage Bins",
    "cat": "bins",
    "badge": "Modular",
    "status": "New Arrival",
    "statusClass": "status-badge-amber",
    "shortDesc": "Ergonomically designed bins for small-parts handling and high-speed order fulfillment lines.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAn3q-Nk20XbLS5aA6OdmG4diVlqJnNo0Qt-h6nAFwUv40ugziQYHoTZ1joDdwCKc2SQ3uNP9nfNq4Z98cRWwEAKBmp6yC3fSXMYWaptx8W6GkrVLbUtQDlyr-1Kj4od6nhOTx2osPF6p0Crha1jMwEV0Ir-SKbtGsUTTtmQRKZXEb99H14kZvu7NW2LMplnJwQzIq1qNxCc5KvjxNc9IVjiVhDZu37IkSY4Z7mno8kDmvq2gg8xvswHDkPP9zBuPSO_uBAu7gHdWnF",
    "description": "Modular Picking Bins are precision-engineered for lean warehousing and pick-to-light systems. Their interlocking interface allows vertical and horizontal modular expansion without additional hardware. The open-front design gives pickers immediate visual access, reducing pick times by up to 30% in controlled environments.",
    "material": "Co-Polymer Polypropylene (PP-C)",
    "dimensions": "300 × 200 × 150 mm (multiple sizes available)",
    "loadCapacity": "25 kg per unit",
    "colors": [
      "#1e40af",
      "#dc2626",
      "#16a34a",
      "#f59e0b",
      "#6b7280"
    ],
    "applications": [
      "Order Fulfillment",
      "Electronics Assembly",
      "Pharmaceutical Dispensing",
      "Retail Back-of-House"
    ],
    "features": [
      "Pick-to-Light Compatible",
      "Label Holder Slot",
      "Modular Stackable",
      "Open-Front Design",
      "Color-Coded System",
      "Dishwasher Safe"
    ],
    "availability": "All standard sizes in stock. Custom sizes available with 10-day lead time."
  },
  {
    "id": 4,
    "name": "Wire Mesh Stillages",
    "category": "Containers",
    "cat": "containers",
    "badge": "Heavy Duty",
    "status": "Customizable",
    "statusClass": "status-badge-blue",
    "shortDesc": "Galvanized steel containers for the storage of dense components with easy visual identification.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBo5Vm8r6L3fYRz1QlwTkjmBq2jozxJWSt29k6Nld3qrSK0viAIoCbdhtI_sjdiSyVHhQMRG5IiVjtqQY00e0l4AZsIJHo0fCscH0QhQbsiX73JZyfynBwUg9wSaij4KJdDOlluFbWMhBlOn-FOsyqsLaLCbfX5PC170UuJft87vlsc7hVPdYbBnU0HVUjwSBaxkREo2HZkj7Uf_lUHjutTuRctQd4TCPnr8IQleIA12hnuDuTq07nAy9UWYX1J8-2zDI9C0HN5TrT7",
    "description": "Wire Mesh Stillages are heavy-duty galvanized steel containers engineered for the storage and transportation of bulk industrial components. The open mesh construction allows full visual inspection of contents without opening, reduces weight versus solid containers, and permits airflow for heat-sensitive components. The collapsible front gate enables easy loading and unloading with minimal manual handling.",
    "material": "Hot-Dip Galvanized Steel (Grade S235)",
    "dimensions": "1200 × 800 × 850 mm (customizable)",
    "loadCapacity": "1,200 kg gross load",
    "colors": [
      "#71717a",
      "#3f3f46"
    ],
    "applications": [
      "Automotive Manufacturing",
      "Metal Component Storage",
      "Engineering Parts",
      "Casting & Foundry"
    ],
    "features": [
      "Full Visual Access",
      "Collapsible Front Gate",
      "Stackable to 4 High",
      "Forklift Pockets",
      "Galvanized Anti-Rust",
      "Customizable Dimensions"
    ],
    "availability": "Standard sizes in 2-week lead time. Custom fabrication 4–6 weeks."
  },
  {
    "id": 5,
    "name": "Electronics Storage Bins",
    "category": "Storage Bins",
    "cat": "bins",
    "badge": "ESD Safe",
    "status": "Tech Grade",
    "statusClass": "status-badge-blue",
    "shortDesc": "Specialized anti-static containers for safe transport and storage of sensitive electronic modules.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDrEbE1vsY3vp4RURf4fgnndqWICMJg5EyqDury2UWmYWXJh1sVqBFcZwnns9UsBKVQ0xTqCIU1ocYO1AQt2YDqG4wZT7XMf231sgLdIcIY7gC9wmH02x2BZ5VD5Uj7CQqSTgwOqcX9EFfX-qtlM8II5wW9feTfbWvdLr8ajbcumYEk_zjR9Nv-JcNozbXSj8sNutZp0qmWBrfxywC4m9-94tyTCLqpDIL7_77kHzq6lo67vWhwmTm5XcDoHYpurM6bBg3YnlezWN1q",
    "description": "Electronics Storage Bins are manufactured from carbon-loaded conductive polypropylene providing a surface resistivity of 10³–10⁵ Ω. They meet IEC 61340-5-1 ESD protection standards and are essential in PCB assembly, semiconductor handling, and avionics component storage. The conductive material dissipates static charge continuously, protecting components throughout the handling chain.",
    "material": "Conductive Carbon-Loaded Polypropylene",
    "dimensions": "400 × 300 × 220 mm",
    "loadCapacity": "15 kg per unit",
    "colors": [
      "#1f2937",
      "#1e3a5f"
    ],
    "applications": [
      "PCB Assembly Lines",
      "Semiconductor Handling",
      "Avionics Components",
      "Medical Electronics"
    ],
    "features": [
      "IEC 61340-5-1 Compliant",
      "Surface Resistivity 10³–10⁵ Ω",
      "Continuous Dissipation",
      "Stackable",
      "ESD Logo Embossed",
      "Lead-Free Material"
    ],
    "availability": "Standard sizes in stock. Certification documentation available upon request."
  },
  {
    "id": 6,
    "name": "Pharma Cold-Chain Box",
    "category": "Containers",
    "cat": "containers",
    "badge": "Cold Chain",
    "status": "Pharma Ready",
    "statusClass": "status-badge-green",
    "shortDesc": "Insulated pallet shippers for temperature-sensitive pharmaceutical and life science logistics.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCuw7aIzV9LipN-dC6OyEf3ySngkH78w_e0XnLQtQ3Tt1_ucHw9JfNURVGdxNy0LefiR6_p0rtzBtEgft-jXtyAwiKCTlJPUA7eGnsztxQOqTI17C2e6vf0STNKvpVdvYrTjLTeXPUrNOaY-rOvmcZ2lePP6NdME9BK4x_Uz6P8vHmwg06CP6a8iUqlDzEijwxv-oZt-zhbfKVHJjqkovZcK6PMC_IyOQwoLko37rLnqlzCWwFiMsuECKfA1Zo8HsrfGuiE4_g0YJnc",
    "description": "The Pharma Cold-Chain Box is a GDP-compliant insulated shipper validated for temperature maintenance between +2°C and +8°C for 96+ hours. The multi-layer EPS foam construction paired with pharmaceutical-grade PCM refrigerant panels ensures product integrity during global air and road freight. Each unit is supplied with a calibration certificate.",
    "material": "EPS Foam Core + HDPE Outer Shell",
    "dimensions": "600 × 400 × 500 mm internal",
    "loadCapacity": "30 kg payload",
    "colors": [
      "#f8fafc",
      "#dbeafe"
    ],
    "applications": [
      "Pharmaceutical Biologics",
      "Vaccine Transport",
      "Clinical Trial Samples",
      "Blood Products"
    ],
    "features": [
      "96+ Hour Temperature Hold",
      "GDP Compliant",
      "PCM Refrigerant Panels",
      "Reusable 50+ Times",
      "Serialized Tracking",
      "Calibration Certificate"
    ],
    "availability": "Available ex-stock. Validation documentation and GDP certificates included."
  },
  {
    "id": 7,
    "name": "Export Heavy Pallet",
    "category": "Industrial Pallets",
    "cat": "pallets",
    "badge": "Export Grade",
    "status": "In Stock",
    "statusClass": "status-badge-green",
    "shortDesc": "Robust 1200×1000mm heavy-duty pallet engineered for international container shipping and export.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAF7K_7bxI6zZEwCDg0qwrfYNZTQ6cd4O6D1ZlTJErRG9xY4mE0_JUMGJVBZapnc1bGbgWKyN_gYKtmM7IjTLqPKHTuj81b4SV72jPsX1pUfu7Nw5pFvkzRLcGBwOHx67pmEtiOGBNCK4tyebHi3mk9cEQsvSkqoBi2o7Q35EQ5WdF8v92AYzQprZKNQ0ZA2xrcQS5caPRGT_JOgy6CVsfmYf1m6aoVB5_ODkjHhYhIrAz96Su8peHEkWLB_KXyT-NBw-Gg8CVQYug",
    "description": "The Export Heavy Pallet is purpose-built for intercontinental shipping. Its 1200×1000mm footprint maximizes 40-foot container utilization, fitting 11 pallets per layer versus 10 with Euro pallets. The nine-leg injection-molded base provides exceptional compression resistance under stacked container loads, while the sealed deck prevents contamination in food and pharma supply chains.",
    "material": "Virgin HDPE with Carbon Black UV Stabilization",
    "dimensions": "1200 × 1000 × 150 mm",
    "loadCapacity": "2,000 kg static / 1,800 kg racked",
    "colors": [
      "#2d6a4f",
      "#6b7280",
      "#1f2937"
    ],
    "applications": [
      "Container Shipping",
      "Export Logistics",
      "Retail Distribution",
      "Cold Chain"
    ],
    "features": [
      "ISO 6780 Compliant",
      "Sealed Hygienic Deck",
      "4-Way Forklift Entry",
      "ISPM-15 Exempt",
      "Stackable 10 High",
      "Container Optimized"
    ],
    "availability": "Ready stock. Export documentation provided. Fumigation-free certificates available."
  },
  {
    "id": 8,
    "name": "Nestable Pallet Pro",
    "category": "Industrial Pallets",
    "cat": "pallets",
    "badge": "Nestable",
    "status": "In Stock",
    "statusClass": "status-badge-green",
    "shortDesc": "Space-efficient nestable pallet designed for high-volume empty returns and distribution networks.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBq5RaPEnQ-nVljl3gMJjyk9Ci9IB2ANDnUZlM8YoMBkLBrWL1jAa3576FGEca3sFj68a1EXm6xqzhc2K62Oti6UOMG_rYwJ00rvrOgWSgHqo0WUYE7lAwAPfJEcChweyaHmU-juKmHArlQl51D7ioeazXCnItYwd6Rha06-AM0WdGdNPgBR6UDYS0VgBtUs6U9t5OQ8t62lXf0O9DkPVHr0MDGjAeswNL4M45mES3t0W9jFzyKkpKhXWxdoZ0EtNhFnnKtLqONpas",
    "description": "The Nestable Pallet Pro reduces empty return shipping costs by up to 70%. When nested, 10 pallets occupy the space of just 3 standard pallets. The open-bottom design is ideal for distribution networks where return freight cost is a critical variable. Made from recycled-content HDPE, this pallet supports circular economy goals without compromising structural integrity.",
    "material": "Recycled-Content HDPE (min. 40% PCR)",
    "dimensions": "1200 × 800 × 130 mm (nested height 35mm per pallet)",
    "loadCapacity": "1,200 kg static / 750 kg dynamic",
    "colors": [
      "#2d6a4f",
      "#6b7280",
      "#b45309"
    ],
    "applications": [
      "FMCG Distribution",
      "Retail Supply Chain",
      "Agricultural Exports",
      "Empty Return Logistics"
    ],
    "features": [
      "70% Space Saving When Nested",
      "PCR Material Content",
      "Open-Bottom Design",
      "2-Way Forklift Entry",
      "Lightweight Construction",
      "Economical Return Freight"
    ],
    "availability": "In stock. PCR content certificate available. MOQ 100 units."
  },
  {
    "id": 9,
    "name": "Heavy Duty Industrial Crate",
    "category": "Heavy-Duty Crates",
    "cat": "crates",
    "badge": "Industrial",
    "status": "In Stock",
    "statusClass": "status-badge-green",
    "shortDesc": "Extra-reinforced solid-sided crate for bulk industrial components requiring maximum structural rigidity.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAi7lX7MXKrbHrWBmmjBIrDOr-GkiDn11wjBI-4tJzzLTByVB4pLWgl03p7OzrUAv1z55KSeIbovkI1iGr1KPXaL8GtfZ3d5msswFDWb4Q7ypGNNjOorErYM85QzZdecEFaizTGKtW5V8Tj_RlLbpnLGqmrmy_IuXDAqUh379HVhVEgk-r3wsUg-lv_J_WMFfTWGa4wsaPX1e0Tn1wGhisKLuIdFP96aqybf2Zq01F-wI8Wbk6qbUubNsum4rTk2kX4KRwzRj5kjtQ",
    "description": "The Heavy Duty Industrial Crate is our most structurally reinforced solid-sided container. With 8mm wall thickness and dual-wall base construction, it handles the most demanding industrial environments including forging, casting, and heavy engineering. The solid-wall design prevents fine-particulate contamination from escaping and provides complete product containment.",
    "material": "High-Impact Copolymer Polypropylene (HIPP)",
    "dimensions": "800 × 600 × 500 mm",
    "loadCapacity": "900 kg stacked / 250 kg dynamic",
    "colors": [
      "#1f2937",
      "#2d6a4f",
      "#6b7280"
    ],
    "applications": [
      "Metal Component Storage",
      "Forging & Casting",
      "Engineering Parts",
      "Automotive Tier 1"
    ],
    "features": [
      "8mm Wall Thickness",
      "Dual-Wall Base",
      "Reinforced Corner Posts",
      "Integrated Lid Option",
      "Fork Entry Runners",
      "IP54 Sealed Variant Available"
    ],
    "availability": "Standard stocked. Custom sizes 3–4 week lead time. Volume discounts available."
  },
  {
    "id": 10,
    "name": "Ventilated Agriculture Crate",
    "category": "Heavy-Duty Crates",
    "cat": "crates",
    "badge": "Agri Grade",
    "status": "Seasonal Stock",
    "statusClass": "status-badge-amber",
    "shortDesc": "Ventilated harvest crate engineered for post-harvest storage of fresh produce with maximum airflow.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBGXe8LA-bga17T9a2Vpsftq01DixGiLApBkzi6tmzwh1obOx6MwKMYUXla6REnQ00qhqHmrjWZ7pND_dnNW2uNdBgrZgflIMhMeOmOS6O3Ja0LGsD8-kfHveDxjoIbbFbYeylVw4VhvGxeybduhOz0H2_ZDxOG9_PPJJ78iBYqY9uBR4DAdi5_aH5XIoPJecGr4OHNBne3SamwVIFBwwHbPvHuE9Wt-YPPYVgzbI_qnpXtA8vneiWXgHSZwn2Ba7ycKwaClD7Iv-s",
    "description": "The Ventilated Agriculture Crate is specifically designed for post-harvest handling of fruits and vegetables. Its 32% open ventilation ratio maintains consistent airflow, reducing respiration heat and ethylene buildup that causes premature ripening. The antimicrobial additive integrated into the polymer matrix inhibits bacterial growth, extending produce shelf life by up to 18%.",
    "material": "Food-Grade Polypropylene with Antimicrobial Additive",
    "dimensions": "600 × 400 × 300 mm",
    "loadCapacity": "30 kg produce / 400 kg stacked",
    "colors": [
      "#16a34a",
      "#f59e0b",
      "#dc2626",
      "#2563eb"
    ],
    "applications": [
      "Fresh Produce Harvesting",
      "Cold Store Circulation",
      "Wholesale Markets",
      "Export Packing"
    ],
    "features": [
      "32% Open Ventilation Ratio",
      "FDA Food-Grade Material",
      "Antimicrobial Treatment",
      "Smooth Interior Radius",
      "Stackable 8 High",
      "Pressure-Wash Safe"
    ],
    "availability": "Pre-harvest orders preferred. Seasonal stock available. Export clients contact sales."
  },
  {
    "id": 11,
    "name": "Food Grade Container",
    "category": "Containers",
    "cat": "containers",
    "badge": "FDA Approved",
    "status": "In Stock",
    "statusClass": "status-badge-green",
    "shortDesc": "FDA-compliant sealed containers for food processing, packing, and cold storage environments.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCM_sssouJ-7lR-75qrCH_N_dXlpZGqep2zgxU4Ee-BlJNfQB8LrAKdb-Ejqw9gVNbW_SLrF3PU_h9kqYcP-x9-NLypDQNPfipDNBQFymdhdxGr4-g7noecTfeH6dpilDB8J3Hb2TlpSNk7-qz7HBb-P4bHLuAvij-0UA1dvyQxuV8rUopRZck9yzMHtXr0pvhFos_i_mUAgOUK0eTCRjqMCkFhqlq_VA4HdTsyrYNdFN6sh2SLhsCfLakfnHzoKQxMzm7y_rb2uDYS",
    "description": "Food Grade Containers meet FDA 21 CFR and EU 10/2011 food contact material regulations. Manufactured in a certified cleanroom environment from virgin-grade, odor-neutral polypropylene, these containers are designed for direct food contact throughout the production and distribution chain. The integrated gasket seal meets IP67 when lid is fitted.",
    "material": "Virgin Food-Grade Polypropylene (FDA 21 CFR)",
    "dimensions": "550 × 370 × 310 mm",
    "loadCapacity": "25 kg content / 350 kg stacked",
    "colors": [
      "#f8fafc",
      "#dcfce7",
      "#fef9c3"
    ],
    "applications": [
      "Meat Processing",
      "Bakery & Confectionery",
      "Dairy Products",
      "Seafood Packing"
    ],
    "features": [
      "FDA 21 CFR Compliant",
      "EU 10/2011 Approved",
      "Odor-Neutral Material",
      "IP67 Sealed with Lid",
      "Smooth Internal Radius",
      "Autoclave Safe to 121°C"
    ],
    "availability": "Full stock. HACCP documentation available. Custom labeling on request."
  },
  {
    "id": 12,
    "name": "Warehouse Storage Bin XL",
    "category": "Storage Bins",
    "cat": "bins",
    "badge": "High Volume",
    "status": "In Stock",
    "statusClass": "status-badge-green",
    "shortDesc": "Extra-large warehouse storage bin for bulk parts organization in high-throughput distribution centers.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuApH6SUNnP3VAWl9xRQPWKmjIIwgAmdQQjlZ1fCkdIefD8-_-E1sfxIMw3wKMy9O37ieDQsUgCKoGwFQrKYVYZMxxQCt7a0i8htm50sagvr8uFf_wHwQHivbWo_5hY_tSUUcQZhPgCr8sZWdGf9WnqCDbI0Tq-lXLcI41wCgbqchewDpeUp_0zjxWrjWRBgH7oZanWkzKXdBNTt1G63i_PMat0Ov2LBF7Xo5Zjoa4F7lJ1cd9bmmN9b-0r3mKTxZ3wXjZtECPgz6Mms",
    "description": "The Warehouse Storage Bin XL is engineered for high-volume distribution centers and manufacturing environments requiring organized bulk parts storage. The tapered design allows efficient nesting for empty returns, while the reinforced open-front panel enables rapid hand-picking without bin removal. Compatible with standard shelving systems worldwide.",
    "material": "Copolymer Polypropylene (PP-C)",
    "dimensions": "800 × 500 × 450 mm",
    "loadCapacity": "50 kg",
    "colors": [
      "#1e40af",
      "#dc2626",
      "#16a34a",
      "#d97706",
      "#6b7280"
    ],
    "applications": [
      "Distribution Centers",
      "Manufacturing Parts Storage",
      "Retail Warehouse",
      "Spare Parts Management"
    ],
    "features": [
      "Open-Front Picking Access",
      "Nested Empty Returns",
      "Reinforced Rim",
      "Label Holder Integrated",
      "Pallet-Stackable",
      "Colour Coded Ranges"
    ],
    "availability": "All colours in stock. Bulk pricing from 200 units. Same-week dispatch available."
  },
  {
    "id": 13,
    "name": "Bulk Industrial Container",
    "category": "Containers",
    "cat": "containers",
    "badge": "Bulk Storage",
    "status": "In Stock",
    "statusClass": "status-badge-green",
    "shortDesc": "High-capacity bulk container for granular materials, powders, and loose industrial components.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCM_sssouJ-7lR-75qrCH_N_dXlpZGqep2zgxU4Ee-BlJNfQB8LrAKdb-Ejqw9gVNbW_SLrF3PU_h9kqYcP-x9-NLypDQNPfipDNBQFymdhdxGr4-g7noecTfeH6dpilDB8J3Hb2TlpSNk7-qz7HBb-P4bHLuAvij-0UA1dvyQxuV8rUopRZck9yzMHtXr0pvhFos_i_mUAgOUK0eTCRjqMCkFhqlq_VA4HdTsyrYNdFN6sh2SLhsCfLakfnHzoKQxMzm7y_rb2uDYS",
    "description": "The Bulk Industrial Container handles the storage and transport of granular materials, polymer pellets, and powdered substances across chemical and plastics industries. Its smooth internal surfaces promote complete discharge with no residue retention, and the integrated discharge valve option enables gravity-fed dispensing without manual tipping. Rated for ATEX Zone 2 environments when fitted with the conductive liner option.",
    "material": "HDPE with Optional Conductive Liner",
    "dimensions": "1200 × 1000 × 1050 mm",
    "loadCapacity": "1,500 kg gross / 1,000 litre capacity",
    "colors": [
      "#6b7280",
      "#1f2937",
      "#2d6a4f"
    ],
    "applications": [
      "Polymer Pellet Storage",
      "Chemical Powder Handling",
      "Grain & Feed",
      "Construction Materials"
    ],
    "features": [
      "Smooth Discharge Interior",
      "Gravity Valve Option",
      "ATEX Zone 2 Ready",
      "Stackable 3 High",
      "Forklift Pockets",
      "Tamper-Evident Lid"
    ],
    "availability": "Standard in stock. Conductive liner variant 2-week lead time."
  },
  {
    "id": 14,
    "name": "Foldable Transit Crate",
    "category": "Heavy-Duty Crates",
    "cat": "crates",
    "badge": "Foldable",
    "status": "In Stock",
    "statusClass": "status-badge-green",
    "shortDesc": "Ultra-compact foldable crate reducing return freight volumes by 80% with patented fold mechanism.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuApH6SUNnP3VAWl9xRQPWKmjIIwgAmdQQjlZ1fCkdIefD8-_-E1sfxIMw3wKMy9O37ieDQsUgCKoGwFQrKYVYZMxxQCt7a0i8htm50sagvr8uFf_wHwQHivbWo_5hY_tSUUcQZhPgCr8sZWdGf9WnqCDbI0Tq-lXLcI41wCgbqchewDpeUp_0zjxWrjWRBgH7oZanWkzKXdBNTt1G63i_PMat0Ov2LBF7Xo5Zjoa4F7lJ1cd9bmmN9b-0r3mKTxZ3wXjZtECPgz6Mms",
    "description": "The Foldable Transit Crate features a patented 4-panel wall collapse system that reduces height to just 95mm when folded — an 80% volume saving over an extended crate. Steel-reinforced corner posts ensure consistent dimensional accuracy over 1,000+ fold cycles. The bi-directional fork entry and flush base allow seamless integration with automated warehouse systems.",
    "material": "Glass-Reinforced Polypropylene + Steel Corner Posts",
    "dimensions": "1200 × 800 × 750 mm extended / 95 mm folded",
    "loadCapacity": "750 kg stacked / 200 kg dynamic",
    "colors": [
      "#2d6a4f",
      "#1f2937",
      "#6b7280"
    ],
    "applications": [
      "Automotive Supply Chain",
      "Retailer Returns",
      "Beverage Logistics",
      "3PL Operations"
    ],
    "features": [
      "80% Volume Reduction",
      "1,000+ Fold Cycles",
      "Steel-Reinforced Corners",
      "Bi-Directional Fork Entry",
      "Auto-Lock Base",
      "RFID Tag Ready"
    ],
    "availability": "In stock. Rental pool options available for high-volume contracts."
  },
  {
    "id": 15,
    "name": "ESD Protected Container",
    "category": "Containers",
    "cat": "containers",
    "badge": "Anti-Static",
    "status": "Tech Grade",
    "statusClass": "status-badge-blue",
    "shortDesc": "Large-format ESD container for bulk storage of sensitive components in electronics manufacturing.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDrEbE1vsY3vp4RURf4fgnndqWICMJg5EyqDury2UWmYWXJh1sVqBFcZwnns9UsBKVQ0xTqCIU1ocYO1AQt2YDqG4wZT7XMf231sgLdIcIY7gC9wmH02x2BZ5VD5Uj7CQqSTgwOqcX9EFfX-qtlM8II5wW9feTfbWvdLr8ajbcumYEk_zjR9Nv-JcNozbXSj8sNutZp0qmWBrfxywC4m9-94tyTCLqpDIL7_77kHzq6lo67vWhwmTm5XcDoHYpurM6bBg3YnlezWN1q",
    "description": "The ESD Protected Container is a large-format conductive storage solution for bulk electronic component handling. With a surface resistivity of 10³–10⁶ Ω across the entire interior and exterior, it provides continuous static dissipation without grounding straps. The integrated base runners allow pallet jack handling while maintaining continuous ESD contact with the floor. Ideal for SMT reel and IC storage.",
    "material": "Carbon-Fibre Reinforced Conductive PP",
    "dimensions": "600 × 400 × 400 mm",
    "loadCapacity": "40 kg",
    "colors": [
      "#1f2937",
      "#1e3a5f"
    ],
    "applications": [
      "SMT Component Storage",
      "IC Wafer Handling",
      "Aerospace Electronics",
      "Defense Electronics"
    ],
    "features": [
      "10³–10⁶ Ω Surface Resistivity",
      "No Grounding Strap Required",
      "Continuous ESD Contact Base",
      "Stacking Lugs",
      "Moisture Barrier Inner",
      "ISO 61340 Certified"
    ],
    "availability": "In stock with ESD compliance test certificates. Custom labeling available."
  },
  {
    "id": 16,
    "name": "Automotive Parts Container",
    "category": "Containers",
    "cat": "containers",
    "badge": "Automotive",
    "status": "In Stock",
    "statusClass": "status-badge-green",
    "shortDesc": "Precision returnable container for automotive parts with custom foam inserts and divider systems.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBo5Vm8r6L3fYRz1QlwTkjmBq2jozxJWSt29k6Nld3qrSK0viAIoCbdhtI_sjdiSyVHhQMRG5IiVjtqQY00e0l4AZsIJHo0fCscH0QhQbsiX73JZyfynBwUg9wSaij4KJdDOlluFbWMhBlOn-FOsyqsLaLCbfX5PC170UuJft87vlsc7hVPdYbBnU0HVUjwSBaxkREo2HZkj7Uf_lUHjutTuRctQd4TCPnr8IQleIA12hnuDuTq07nAy9UWYX1J8-2zDI9C0HN5TrT7",
    "description": "Automotive Parts Containers are engineered for JIT and lean manufacturing supply chains. The high-precision internal dimensions accept custom-fabricated foam inserts and divider systems for component-specific protection. The container meets VDA 4500 guidelines and is compatible with all major automotive OEM kanban systems. Steel skids provide stability on conveyor lines.",
    "material": "Fibre-Glass Reinforced Polypropylene + Steel Skids",
    "dimensions": "600 × 400 × 320 mm (VDA standard)",
    "loadCapacity": "50 kg",
    "colors": [
      "#6b7280",
      "#1f2937"
    ],
    "applications": [
      "OEM Automotive Assembly",
      "Tier 1 Supplier Kanban",
      "Stamping Parts Handling",
      "Engine Component Storage"
    ],
    "features": [
      "VDA 4500 Compatible",
      "Custom Foam Insert Ready",
      "Kanban Label Window",
      "Steel Skid Base",
      "Bar Code Window",
      "Automotive Wash Cycle Rated"
    ],
    "availability": "Standard VDA sizes in stock. Custom inserts 5-day turnaround. OEM documentation available."
  },
  {
    "id": 17,
    "name": "Pharmaceutical Storage Box",
    "category": "Containers",
    "cat": "containers",
    "badge": "GMP Certified",
    "status": "Pharma Ready",
    "statusClass": "status-badge-green",
    "shortDesc": "GMP-certified solid pharmaceutical storage container for in-process materials and API handling.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCuw7aIzV9LipN-dC6OyEf3ySngkH78w_e0XnLQtQ3Tt1_ucHw9JfNURVGdxNy0LefiR6_p0rtzBtEgft-jXtyAwiKCTlJPUA7eGnsztxQOqTI17C2e6vf0STNKvpVdvYrTjLTeXPUrNOaY-rOvmcZ2lePP6NdME9BK4x_Uz6P8vHmwg06CP6a8iUqlDzEijwxv-oZt-zhbfKVHJjqkovZcK6PMC_IyOQwoLko37rLnqlzCWwFiMsuECKfA1Zo8HsrfGuiE4_g0YJnc",
    "description": "The Pharmaceutical Storage Box is manufactured under ISO 15378 pharmaceutical packaging guidelines. Its virgin polypropylene construction leaves no extractables or leachables that could compromise API integrity. The tamper-evident lid seal provides full chain-of-custody assurance, and the integral lot-traceability embossing ensures full GMP batch record compliance.",
    "material": "Virgin Pharmaceutical-Grade Polypropylene",
    "dimensions": "500 × 380 × 280 mm",
    "loadCapacity": "20 kg API payload",
    "colors": [
      "#f8fafc",
      "#dcfce7",
      "#dbeafe"
    ],
    "applications": [
      "API Intermediate Storage",
      "Tablet & Capsule Handling",
      "Biotech Process Materials",
      "Clean Room Operations"
    ],
    "features": [
      "Zero Extractables/Leachables",
      "Tamper-Evident Lid Seal",
      "GMP Batch Traceability",
      "Clean Room Grade 8 Compatible",
      "Autoclave at 121°C",
      "FDA/EMA Compliant Material"
    ],
    "availability": "Available with full regulatory pack. Batch certificates included. MOQ 20 units."
  },
  {
    "id": 18,
    "name": "Chemical Resistant Bin",
    "category": "Storage Bins",
    "cat": "bins",
    "badge": "Chemical Safe",
    "status": "In Stock",
    "statusClass": "status-badge-green",
    "shortDesc": "PP-homopolymer bin with full chemical resistance for hazardous material storage and dispensing.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBGXe8LA-bga17T9a2Vpsftq01DixGiLApBkzi6tmzwh1obOx6MwKMYUXla6REnQ00qhqHmrjWZ7pND_dnNW2uNdBgrZgflIMhMeOmOS6O3Ja0LGsD8-kfHveDxjoIbbFbYeylVw4VhvGxeybduhOz0H2_ZDxOG9_PPJJ78iBYqY9uBR4DAdi5_aH5XIoPJecGr4OHNBne3SamwVIFBwwHbPvHuE9Wt-YPPYVgzbI_qnpXtA8vneiWXgHSZwn2Ba7ycKwaClD7Iv-s",
    "description": "Chemical Resistant Bins are fabricated from homopolymer polypropylene providing exceptional resistance to acids, alkalis, solvents, and petroleum-based products. The continuous hinge design eliminates metal fatigue failure points, and the sealed base prevents liquid ingress to floor surfaces. Compliant with UN3H2 packaging regulations for hazardous goods storage.",
    "material": "Homopolymer Polypropylene (PP-H)",
    "dimensions": "600 × 400 × 500 mm",
    "loadCapacity": "40 kg",
    "colors": [
      "#fef3c7",
      "#dc2626",
      "#1f2937"
    ],
    "applications": [
      "Chemical Laboratory",
      "Industrial Cleaning Products",
      "Agricultural Chemicals",
      "Waste Hazardous Storage"
    ],
    "features": [
      "Full Acid & Alkali Resistance",
      "UN3H2 Packaging Compliant",
      "Sealed Base Construction",
      "Continuous Hinge Lid",
      "Chemical Resistant Label Area",
      "Spill Containment Lip"
    ],
    "availability": "Stocked in standard sizes. MSDS compatibility certificates available upon request."
  },
  {
    "id": 19,
    "name": "Stackable Logistics Box",
    "category": "Containers",
    "cat": "containers",
    "badge": "Stackable",
    "status": "In Stock",
    "statusClass": "status-badge-green",
    "shortDesc": "Precision-toleranced logistics box engineered for automated conveyor and robotic picking systems.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCM_sssouJ-7lR-75qrCH_N_dXlpZGqep2zgxU4Ee-BlJNfQB8LrAKdb-Ejqw9gVNbW_SLrF3PU_h9kqYcP-x9-NLypDQNPfipDNBQFymdhdxGr4-g7noecTfeH6dpilDB8J3Hb2TlpSNk7-qz7HBb-P4bHLuAvij-0UA1dvyQxuV8rUopRZck9yzMHtXr0pvhFos_i_mUAgOUK0eTCRjqMCkFhqlq_VA4HdTsyrYNdFN6sh2SLhsCfLakfnHzoKQxMzm7y_rb2uDYS",
    "description": "The Stackable Logistics Box is designed for Industry 4.0 automated warehousing environments. Its precision ±0.5mm dimensional tolerance ensures reliable robotic gripper engagement and conveyor transfer. The integrated RFID antenna cavity in the base accommodates standard UHF labels for real-time inventory tracking. Anti-static surface treatment prevents dust attraction in cleanroom logistics.",
    "material": "Precision-Injection Polypropylene Copolymer",
    "dimensions": "600 × 400 × 300 mm (Eurobox standard)",
    "loadCapacity": "35 kg",
    "colors": [
      "#f8fafc",
      "#dcfce7",
      "#dbeafe",
      "#fef3c7"
    ],
    "applications": [
      "E-Commerce Fulfillment",
      "Robotic Picking Lines",
      "Automated Warehouses",
      "Parcel Sorting Systems"
    ],
    "features": [
      "±0.5mm Dimensional Tolerance",
      "RFID Antenna Cavity",
      "Anti-Static Surface",
      "Robotic Gripper Compatible",
      "Conveyor Rail Guides",
      "GS1 Bar Code Panel"
    ],
    "availability": "All standard Eurobox sizes in stock. Custom RFID integration 2-week lead time."
  },
  {
    "id": 20,
    "name": "Agriculture Harvest Crate",
    "category": "Heavy-Duty Crates",
    "cat": "crates",
    "badge": "Harvest Grade",
    "status": "Seasonal Stock",
    "statusClass": "status-badge-amber",
    "shortDesc": "Lightweight harvest crate for field collection of fruits, vegetables, and agricultural produce.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBq5RaPEnQ-nVljl3gMJjyk9Ci9IB2ANDnUZlM8YoMBkLBrWL1jAa3576FGEca3sFj68a1EXm6xqzhc2K62Oti6UOMG_rYwJ00rvrOgWSgHqo0WUYE7lAwAPfJEcChweyaHmU-juKmHArlQl51D7ioeazXCnItYwd6Rha06-AM0WdGdNPgBR6UDYS0VgBtUs6U9t5OQ8t62lXf0O9DkPVHr0MDGjAeswNL4M45mES3t0W9jFzyKkpKhXWxdoZ0EtNhFnnKtLqONpas",
    "description": "The Agriculture Harvest Crate balances field durability with minimal weight to reduce picker fatigue. At just 2.1 kg, it enables continuous harvesting shifts without musculoskeletal strain. The rounded internal corners prevent bruising of delicate produce, and the smooth exterior allows high-pressure cleaning without bacterial harbourage. UV-stabilized for 10+ seasons of outdoor field use.",
    "material": "Food-Grade PP with UV Stabilizer (10-year rating)",
    "dimensions": "600 × 400 × 250 mm",
    "loadCapacity": "25 kg produce",
    "colors": [
      "#16a34a",
      "#f59e0b",
      "#dc2626"
    ],
    "applications": [
      "Fruit Harvesting",
      "Vegetable Collection",
      "Greenhouse Operations",
      "Packhouse Grading"
    ],
    "features": [
      "Ultra-Lightweight 2.1 kg",
      "Rounded Internal Corners",
      "10+ Season UV Rating",
      "High-Pressure Washable",
      "Stackable 12 High Empty",
      "Ergonomic Hand Grip"
    ],
    "availability": "Pre-order for season. Contact agricultural sales team for pricing."
  },
  {
    "id": 21,
    "name": "Industrial Waste Bin",
    "category": "Storage Bins",
    "cat": "bins",
    "badge": "Industrial Waste",
    "status": "In Stock",
    "statusClass": "status-badge-green",
    "shortDesc": "Heavy-duty waste collection bin for manufacturing floor scrap, offcuts, and recyclable materials.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAi7lX7MXKrbHrWBmmjBIrDOr-GkiDn11wjBI-4tJzzLTByVB4pLWgl03p7OzrUAv1z55KSeIbovkI1iGr1KPXaL8GtfZ3d5msswFDWb4Q7ypGNNjOorErYM85QzZdecEFaizTGKtW5V8Tj_RlLbpnLGqmrmy_IuXDAqUh379HVhVEgk-r3wsUg-lv_J_WMFfTWGa4wsaPX1e0Tn1wGhisKLuIdFP96aqybf2Zq01F-wI8Wbk6qbUubNsum4rTk2kX4KRwzRj5kjtQ",
    "description": "Industrial Waste Bins provide durable, hygienic waste segregation on the manufacturing floor. The reinforced base withstands metal swarf, glass cullet, and heavy machining offcuts without cracking. The foot-pedal lid mechanism eliminates hand contact contamination, and the colour-coded range supports mandatory waste segregation compliance. Compatible with all standard waste compactor systems.",
    "material": "HDPE with UV Stabilization",
    "dimensions": "Ø 600 × 900 mm (120 litre standard)",
    "loadCapacity": "120 litre / 80 kg gross",
    "colors": [
      "#6b7280",
      "#dc2626",
      "#16a34a",
      "#1e40af",
      "#fbbf24"
    ],
    "applications": [
      "Manufacturing Scrap",
      "Metal Swarf Collection",
      "Recyclables Segregation",
      "Medical Waste (Yellow)"
    ],
    "features": [
      "Foot-Pedal Lid Mechanism",
      "Reinforced HDPE Base",
      "Colour-Coded Waste Streams",
      "Compactor Compatible",
      "Forklift Tine Pockets",
      "Lid-Lock Option"
    ],
    "availability": "All standard colours in stock 120L, 240L, 660L, and 1100L sizes available."
  },
  {
    "id": 22,
    "name": "Export Grade Flat Pallet",
    "category": "Industrial Pallets",
    "cat": "pallets",
    "badge": "Export Ready",
    "status": "In Stock",
    "statusClass": "status-badge-green",
    "shortDesc": "Ultra-flat profile plastic pallet optimized for air freight and premium product export packaging.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAF7K_7bxI6zZEwCDg0qwrfYNZTQ6cd4O6D1ZlTJErRG9xY4mE0_JUMGJVBZapnc1bGbgWKyN_gYKtmM7IjTLqPKHTuj81b4SV72jPsX1pUfu7Nw5pFvkzRLcGBwOHx67pmEtiOGBNCK4tyebHi3mk9cEQsvSkqoBi2o7Q35EQ5WdF8v92AYzQprZKNQ0ZA2xrcQS5caPRGT_JOgy6CVsfmYf1m6aoVB5_ODkjHhYhIrAz96Su8peHEkWLB_KXyT-NBw-Gg8CVQYug",
    "description": "The Export Grade Flat Pallet features a 90mm slim profile designed to maximize cargo space utilization in air freight containers and ocean LCL shipments. The full-perimeter deck ensures no product overhang or tip risk during loading. A polished deck surface protects premium consumer goods packaging from abrasion during intercontinental transit.",
    "material": "HDPE with Anti-Scratch Deck Coating",
    "dimensions": "1200 × 800 × 90 mm",
    "loadCapacity": "500 kg air freight rated / 3,000 kg static",
    "colors": [
      "#f8fafc",
      "#2d6a4f",
      "#6b7280"
    ],
    "applications": [
      "Air Freight",
      "Premium Consumer Goods",
      "Luxury Retail",
      "Pharmaceutical Export"
    ],
    "features": [
      "90mm Ultra-Slim Profile",
      "Polished Anti-Scratch Deck",
      "Full-Perimeter Deck Coverage",
      "Air Freight IATA Compliant",
      "ISPM-15 Phytosanitary Exempt",
      "Lightweight 8 kg"
    ],
    "availability": "In stock. Air freight compliance documentation available. Export certificates provided."
  },
  {
    "id": 23,
    "name": "Returnable Transit Package",
    "category": "Containers",
    "cat": "containers",
    "badge": "RTP System",
    "status": "In Stock",
    "statusClass": "status-badge-green",
    "shortDesc": "Complete returnable transit packaging system with pallet, container, and lid for closed-loop supply chains.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuApH6SUNnP3VAWl9xRQPWKmjIIwgAmdQQjlZ1fCkdIefD8-_-E1sfxIMw3wKMy9O37ieDQsUgCKoGwFQrKYVYZMxxQCt7a0i8htm50sagvr8uFf_wHwQHivbWo_5hY_tSUUcQZhPgCr8sZWdGf9WnqCDbI0Tq-lXLcI41wCgbqchewDpeUp_0zjxWrjWRBgH7oZanWkzKXdBNTt1G63i_PMat0Ov2LBF7Xo5Zjoa4F7lJ1cd9bmmN9b-0r3mKTxZ3wXjZtECPgz6Mms",
    "description": "The Returnable Transit Package (RTP) system delivers a complete closed-loop packaging solution encompassing a matched pallet, container, and weather-sealed lid. Designed for minimum 200 trip cycles, the system delivers a per-unit cost 60% lower than equivalent single-use packaging over a 5-year horizon. RFID asset tracking integrated as standard for real-time fleet management.",
    "material": "HDPE Pallet + PP Container + HDPE Lid",
    "dimensions": "1200 × 800 mm pallet with 400mm stackable container",
    "loadCapacity": "800 kg gross system weight",
    "colors": [
      "#2d6a4f",
      "#1f2937"
    ],
    "applications": [
      "Closed-Loop Retail",
      "Automotive Kanban",
      "Food Service Logistics",
      "Cross-Dock Hubs"
    ],
    "features": [
      "200+ Trip Cycle Design",
      "RFID Fleet Tracking",
      "Weather-Sealed Lid",
      "60% Lower Long-Term Cost",
      "Matched Pallet System",
      "GPS Tag Compatible"
    ],
    "availability": "System available as fleet lease or outright purchase. RFP support available."
  },
  {
    "id": 24,
    "name": "Multi-Trip Delivery Container",
    "category": "Containers",
    "cat": "containers",
    "badge": "Reusable",
    "status": "In Stock",
    "statusClass": "status-badge-green",
    "shortDesc": "Durable multi-trip container engineered for final-mile delivery in urban logistics and retail replenishment.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAn3q-Nk20XbLS5aA6OdmG4diVlqJnNo0Qt-h6nAFwUv40ugziQYHoTZ1joDdwCKc2SQ3uNP9nfNq4Z98cRWwEAKBmp6yC3fSXMYWaptx8W6GkrVLbUtQDlyr-1Kj4od6nhOTx2osPF6p0Crha1jMwEV0Ir-SKbtGsUTTtmQRKZXEb99H14kZvu7NW2LMplnJwQzIq1qNxCc5KvjxNc9IVjiVhDZu37IkSY4Z7mno8kDmvq2gg8xvswHDkPP9zBuPSO_uBAu7gHdWnF",
    "description": "The Multi-Trip Delivery Container is purpose-engineered for urban last-mile delivery. Its lightweight construction (1.8 kg) and ergonomic side grips support rapid manual handling at delivery points. The roll-cage compatibility allows a full tote-to-shelf merchandising workflow in retail environments. The secure snap lid prevents product loss and tamper during transit.",
    "material": "PP Copolymer with SEBS Impact Modifier",
    "dimensions": "600 × 400 × 280 mm",
    "loadCapacity": "20 kg delivery payload",
    "colors": [
      "#1e40af",
      "#dc2626",
      "#16a34a",
      "#f59e0b"
    ],
    "applications": [
      "Last-Mile Delivery",
      "Grocery Replenishment",
      "Pharmacy Distribution",
      "Click & Collect Fulfilment"
    ],
    "features": [
      "1.8 kg Ultra-Lightweight",
      "Roll-Cage Compatible",
      "Secure Snap Lid",
      "Ergonomic Side Grips",
      "Colour-Coded Routes",
      "Recyclable at End of Life"
    ],
    "availability": "All colours in stock. Minimum 200 units for fleet colour customization."
  },
  {
    "id": 25,
    "name": "Intermediate Bulk Container",
    "category": "Containers",
    "cat": "containers",
    "badge": "IBC Grade",
    "status": "In Stock",
    "statusClass": "status-badge-green",
    "shortDesc": "1000-litre composite IBC for liquid, semi-solid, and slurry transport in industrial supply chains.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCM_sssouJ-7lR-75qrCH_N_dXlpZGqep2zgxU4Ee-BlJNfQB8LrAKdb-Ejqw9gVNbW_SLrF3PU_h9kqYcP-x9-NLypDQNPfipDNBQFymdhdxGr4-g7noecTfeH6dpilDB8J3Hb2TlpSNk7-qz7HBb-P4bHLuAvij-0UA1dvyQxuV8rUopRZck9yzMHtXr0pvhFos_i_mUAgOUK0eTCRjqMCkFhqlq_VA4HdTsyrYNdFN6sh2SLhsCfLakfnHzoKQxMzm7y_rb2uDYS",
    "description": "The Intermediate Bulk Container (IBC) is a 1,000-litre composite unit consisting of an HDPE inner bottle housed in a galvanized steel cage on a plastic pallet base. UN31HA1/Y rated for hazardous liquids including flammables, corrosives, and toxic materials. The 2\" butterfly valve and DN150 wide-mouth filling port enable rapid filling and discharge with standard equipment.",
    "material": "HDPE Inner + Galvanized Steel Cage + HDPE Base",
    "dimensions": "1200 × 1000 × 1150 mm",
    "loadCapacity": "1,000 litres / 1,500 kg gross",
    "colors": [
      "#6b7280"
    ],
    "applications": [
      "Chemical Liquid Storage",
      "Food-Grade Syrup Transport",
      "Pharmaceutical Bulk Liquids",
      "Water Treatment Chemicals"
    ],
    "features": [
      "UN31HA1/Y Rated",
      "2\" Butterfly Discharge Valve",
      "DN150 Fill Port",
      "Galvanized Steel Cage",
      "Stacking Certified",
      "Rebottling & Recertification Service"
    ],
    "availability": "New and recertified IBCs available. UN documentation and leak test certificates provided."
  },
  {
    "id": 26,
    "name": "Drum Transport Container",
    "category": "Containers",
    "cat": "containers",
    "badge": "Liquid Safe",
    "status": "In Stock",
    "statusClass": "status-badge-green",
    "shortDesc": "Spill-containment drum transport container for safe movement of 205-litre steel and plastic drums.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBo5Vm8r6L3fYRz1QlwTkjmBq2jozxJWSt29k6Nld3qrSK0viAIoCbdhtI_sjdiSyVHhQMRG5IiVjtqQY00e0l4AZsIJHo0fCscH0QhQbsiX73JZyfynBwUg9wSaij4KJdDOlluFbWMhBlOn-FOsyqsLaLCbfX5PC170UuJft87vlsc7hVPdYbBnU0HVUjwSBaxkREo2HZkj7Uf_lUHjutTuRctQd4TCPnr8IQleIA12hnuDuTq07nAy9UWYX1J8-2zDI9C0HN5TrT7",
    "description": "The Drum Transport Container provides integrated secondary containment for 205-litre drums during warehouse handling and transport. Its 250-litre sump capacity fully contains a drum spill to prevent floor contamination and regulatory non-compliance. The removable steel grate supports drum weight and provides drainage to the sump. Compatible with all standard 205-litre steel and plastic drum formats.",
    "material": "HDPE Sump + Removable Steel Grate",
    "dimensions": "1400 × 800 × 350 mm (sump)",
    "loadCapacity": "400 kg (2 drums)",
    "colors": [
      "#fef3c7",
      "#6b7280"
    ],
    "applications": [
      "Chemical Drum Handling",
      "Solvent Storage Areas",
      "Fuel Additive Handling",
      "Waste Oil Management"
    ],
    "features": [
      "250 Litre Sump Capacity",
      "EN 14596 Compliant",
      "Removable Steel Grate",
      "Forklift Pockets",
      "Drum Securement Straps",
      "Chemical-Resistant Coating"
    ],
    "availability": "In stock. Secondary containment compliance documentation available."
  },
  {
    "id": 27,
    "name": "Collapsible Pallet Box",
    "category": "Heavy-Duty Crates",
    "cat": "crates",
    "badge": "Collapsible",
    "status": "In Stock",
    "statusClass": "status-badge-green",
    "shortDesc": "Large-format collapsible pallet box combining pallet and container in one space-saving unit.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuApH6SUNnP3VAWl9xRQPWKmjIIwgAmdQQjlZ1fCkdIefD8-_-E1sfxIMw3wKMy9O37ieDQsUgCKoGwFQrKYVYZMxxQCt7a0i8htm50sagvr8uFf_wHwQHivbWo_5hY_tSUUcQZhPgCr8sZWdGf9WnqCDbI0Tq-lXLcI41wCgbqchewDpeUp_0zjxWrjWRBgH7oZanWkzKXdBNTt1G63i_PMat0Ov2LBF7Xo5Zjoa4F7lJ1cd9bmmN9b-0r3mKTxZ3wXjZtECPgz6Mms",
    "description": "The Collapsible Pallet Box integrates a heavy-duty plastic pallet base with a collapsible container superstructure in a single unit. When folded, 5 units nest to the height of 1 open unit, enabling storage and backhaul of 10,000+ units per trailer load. The integrated pallet base eliminates pallet sourcing at load points and ensures dimensional consistency throughout the supply chain.",
    "material": "Virgin HDPE Pallet Base + Recycled-Content PP Walls",
    "dimensions": "1200 × 800 × 800 mm (assembled) / 220 mm folded",
    "loadCapacity": "750 kg stacked / 500 kg dynamic",
    "colors": [
      "#2d6a4f",
      "#1f2937",
      "#6b7280"
    ],
    "applications": [
      "FMCG Pallet Delivery",
      "Agricultural Bulk Transport",
      "Retail DC Replenishment",
      "Cross-Border Freight"
    ],
    "features": [
      "5:1 Fold Ratio",
      "Integrated Pallet Base",
      "Drop-Down Front Gate",
      "Corner Post Locking",
      "Pallet Jack Compatible",
      "Hygienic Interior"
    ],
    "availability": "In stock. Fleet lease contracts available. GPS tracking add-on available."
  },
  {
    "id": 28,
    "name": "Insulated Temperature Container",
    "category": "Containers",
    "cat": "containers",
    "badge": "Temp Control",
    "status": "Pharma Ready",
    "statusClass": "status-badge-green",
    "shortDesc": "Multi-use insulated container maintaining +2°C to +8°C for 72 hours without active refrigeration.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCuw7aIzV9LipN-dC6OyEf3ySngkH78w_e0XnLQtQ3Tt1_ucHw9JfNURVGdxNy0LefiR6_p0rtzBtEgft-jXtyAwiKCTlJPUA7eGnsztxQOqTI17C2e6vf0STNKvpVdvYrTjLTeXPUrNOaY-rOvmcZ2lePP6NdME9BK4x_Uz6P8vHmwg06CP6a8iUqlDzEijwxv-oZt-zhbfKVHJjqkovZcK6PMC_IyOQwoLko37rLnqlzCWwFiMsuECKfA1Zo8HsrfGuiE4_g0YJnc",
    "description": "The Insulated Temperature Container uses vacuum-insulated panel (VIP) technology to maintain +2°C to +8°C for a validated 72-hour transit window without any active refrigeration. Unlike EPS foam shippers, the VIP panels do not degrade thermally across multiple reuse cycles, maintaining performance to 100+ trips. Each unit is pre-validated to ISTA 7D protocol for regulatory submission.",
    "material": "HDPE Shell + Vacuum-Insulated Panels (VIP)",
    "dimensions": "600 × 400 × 450 mm internal",
    "loadCapacity": "25 kg payload",
    "colors": [
      "#f8fafc",
      "#dbeafe"
    ],
    "applications": [
      "Biologics Distribution",
      "Homecare Therapy Products",
      "Organ Transplant Logistics",
      "Specialty Chemicals"
    ],
    "features": [
      "72-Hour Validated Hold",
      "VIP Panel Technology",
      "100+ Reuse Cycles",
      "ISTA 7D Pre-Validated",
      "GPS Temperature Logger Ready",
      "100% Recyclable at EOL"
    ],
    "availability": "Available with validation data package. Lease and outright purchase models."
  },
  {
    "id": 29,
    "name": "Cleanroom Tote Box",
    "category": "Containers",
    "cat": "containers",
    "badge": "Cleanroom Grade",
    "status": "Tech Grade",
    "statusClass": "status-badge-blue",
    "shortDesc": "ISO Class 5 cleanroom-compatible tote for semiconductor wafers, optics, and precision components.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDrEbE1vsY3vp4RURf4fgnndqWICMJg5EyqDury2UWmYWXJh1sVqBFcZwnns9UsBKVQ0xTqCIU1ocYO1AQt2YDqG4wZT7XMf231sgLdIcIY7gC9wmH02x2BZ5VD5Uj7CQqSTgwOqcX9EFfX-qtlM8II5wW9feTfbWvdLr8ajbcumYEk_zjR9Nv-JcNozbXSj8sNutZp0qmWBrfxywC4m9-94tyTCLqpDIL7_77kHzq6lo67vWhwmTm5XcDoHYpurM6bBg3YnlezWN1q",
    "description": "The Cleanroom Tote Box is manufactured and assembled in an ISO Class 7 facility to prevent contamination at point of production. The ultra-smooth internal surfaces achieve Ra <0.8μm, eliminating particle generation from surface roughness. The conductive version (10³–10⁶ Ω) is available for ESD-sensitive cleanroom processes. Each unit undergoes outgassing analysis prior to dispatch.",
    "material": "Virgin POM (Polyoxymethylene) or Conductive PP",
    "dimensions": "400 × 300 × 150 mm",
    "loadCapacity": "10 kg precision components",
    "colors": [
      "#f8fafc",
      "#1f2937"
    ],
    "applications": [
      "Semiconductor Wafer Transfer",
      "Optical Component Storage",
      "Medical Device Assembly",
      "MEMS Component Handling"
    ],
    "features": [
      "ISO Class 5 Compatible",
      "Ra <0.8μm Surface Finish",
      "Outgassing Certified",
      "Particle Count <100/m³",
      "Cleanroom Manufactured",
      "ESD Version Available"
    ],
    "availability": "Lead time 3 weeks. Outgassing certificate and particle count report included."
  },
  {
    "id": 30,
    "name": "Security Sealed Container",
    "category": "Containers",
    "cat": "containers",
    "badge": "Tamper Proof",
    "status": "In Stock",
    "statusClass": "status-badge-green",
    "shortDesc": "Tamper-evident security container for high-value goods, sensitive documents, and cash transit.",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCM_sssouJ-7lR-75qrCH_N_dXlpZGqep2zgxU4Ee-BlJNfQB8LrAKdb-Ejqw9gVNbW_SLrF3PU_h9kqYcP-x9-NLypDQNPfipDNBQFymdhdxGr4-g7noecTfeH6dpilDB8J3Hb2TlpSNk7-qz7HBb-P4bHLuAvij-0UA1dvyQxuV8rUopRZck9yzMHtXr0pvhFos_i_mUAgOUK0eTCRjqMCkFhqlq_VA4HdTsyrYNdFN6sh2SLhsCfLakfnHzoKQxMzm7y_rb2uDYS",
    "description": "The Security Sealed Container provides physical tamper evidence for high-value logistics. The patented single-use security strap seal can only be released by breaking, providing visual confirmation of unauthorized access. A unique serialized seal number links the container to chain-of-custody documentation. The impact-resistant shell resists dropping from up to 1.5m without compromising seal integrity.",
    "material": "ABS (Acrylonitrile Butadiene Styrene) Impact Grade",
    "dimensions": "500 × 380 × 280 mm",
    "loadCapacity": "20 kg / 45 litre",
    "colors": [
      "#1f2937",
      "#6b7280",
      "#dc2626"
    ],
    "applications": [
      "Cash-in-Transit",
      "Jewellery & Valuables Logistics",
      "Confidential Document Transfer",
      "Forensic Evidence Transport"
    ],
    "features": [
      "Single-Use Security Strap Seal",
      "Serialized Seal Number",
      "1.5m Drop-Resistance Tested",
      "Tamper-Evident Hinge",
      "Inner RFID Sticker Pocket",
      "Chain-of-Custody Documentation"
    ],
    "availability": "In stock. Bulk serial number pre-allocation available. Integration with TMX tracking systems."
  }
];

/**
 * IMAGE SETS — generated by scripts/generate-product-images.mjs into
 * public/products/product-{id}/ (cover.jpg + front/back/side/top/detail).
 * Current files are PLACEHOLDERS derived from each product's own catalog
 * photo. TODO: when real 1200x1200 white-background studio shots arrive,
 * overwrite the files in each folder (same names) — no code change needed.
 * Per-product `coverImage` / `images` fields in PRODUCTS override the
 * manifest when set.
 */
type ImageManifest = Record<string, { cover?: string; images: string[] }>;
const IMAGE_SETS = PRODUCT_IMAGE_MANIFEST as ImageManifest;

/** Featured image for the collapsed product card. */
export function productCover(product: Product): string {
  return product.coverImage ?? IMAGE_SETS[product.id]?.cover ?? product.image;
}

/** Gallery for the expanded card: explicit `images`, else the generated set, else the single catalog photo. */
import { AR_PRODUCTS, AR_COLOR_LABELS } from './products-ar';
import { applyContentOverride } from './cms/deep-merge';

/** Product with locale-appropriate text fields (codes/specs preserved),
 *  then an optional CMS override layered on top (trim-or-fallback). */
export function localizeProduct(
  product: Product,
  locale: string,
  cmsOverride?: Partial<Product>
): Product {
  const arMerged: Product =
    locale !== 'ar' ? product : { ...product, ...AR_PRODUCTS[product.id] };
  return applyContentOverride(arMerged, cmsOverride);
}

/** Color swatch label in the active locale. */
export function colorLabel(hex: string, locale: string): string {
  const map = locale === 'ar' ? AR_COLOR_LABELS : COLOR_LABELS;
  return map[hex] ?? hex;
}

export function productGallery(product: Product): string[] {
  if (product.images && product.images.length > 0) return product.images;
  const generated = IMAGE_SETS[product.id]?.images;
  if (generated && generated.length > 0) return generated;
  return [product.image];
}
