/**
 * Industries-page content extracted from the legacy indastries.html inline
 * MODALS data: 5 manufacturing stages, 3 technology highlights, 6 industries,
 * 4 certifications — each opens a detail modal.
 */

export type IndustryModal = {
  image: string;
  category: string;
  badge: string;
  status: string;
  statusClass: 'status-badge-green' | 'status-badge-blue' | 'status-badge-amber';
  title: string;
  description: string;
  specs: [string, string][];
  features: string[];
  applications: string[];
  industries: string[];
  availability: string;
};

import { AR_INDUSTRY_MODALS } from './industries-ar';
import { applyContentOverride } from './cms/deep-merge';

/** Modal data with locale-appropriate text (codes/standards preserved),
 *  then an optional CMS override layered on top (trim-or-fallback). */
export function localizeIndustryModal(
  id: string,
  data: IndustryModal,
  locale: string,
  cmsOverride?: Partial<IndustryModal>
): IndustryModal {
  const arMerged: IndustryModal =
    locale !== 'ar' ? data : { ...data, ...AR_INDUSTRY_MODALS[id] };
  return applyContentOverride(arMerged, cmsOverride);
}

export const INDUSTRY_MODALS: Record<string, IndustryModal> = {
  "step1": {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAfIz7xoCoCeskrANEUPt-yxmMglbOfvTX0ZWWdu0-qiPLkl851yRKeGtCHeCegMXiizZoGTJ4-dG8VVXUiRrIuBHoi3yZ_QKUHDbtGpPandXKrYMrk-jlW3HGt7LCZGYBdluK3ctxfQ5CrxWyYnzvVvrZr5IrgYqhty4Fm7a5rfceSqMYfvgi1JVw01lRZZLRm1thT3mVTOT1Ipxeq7UE_pfIMVCMOGGPPIa68T3fNVo8nNy4_S0j_-RLx_xwX9dX7gTtFMrqMldA",
    "category": "Manufacturing Process",
    "badge": "Stage 01",
    "status": "Core Process",
    "statusClass": "status-badge-blue",
    "title": "Design & Engineering",
    "description": "Our engineering team uses cutting-edge CAD software and finite element analysis (FEA) to design products that exceed performance benchmarks before a single gram of material is used. Each design is validated through multiple simulation cycles including drop tests, compression analysis, and thermal stress modeling, ensuring real-world durability from day one.",
    "specs": [
      [
        "Software",
        "SolidWorks, CATIA V5, ANSYS FEA"
      ],
      [
        "Lead Time",
        "2–6 Weeks per Design Cycle"
      ],
      [
        "Prototyping",
        "Rapid SLA/SLS 3D Printing (48hr)"
      ],
      [
        "Tolerance",
        "±0.02mm Design Tolerance"
      ],
      [
        "Revision Cycles",
        "Up to 5 Client Revisions Included"
      ]
    ],
    "features": [
      "FEA Stress Simulation",
      "Rapid 3D Prototyping",
      "DFM Review",
      "IP Protected Designs",
      "Client Approval Portal",
      "Custom OEM Tooling"
    ],
    "applications": [
      "Custom Storage Solutions",
      "OEM Tooling Design",
      "Compliance Engineering",
      "Lightweight Optimization"
    ],
    "industries": [
      "Automotive",
      "Pharmaceutical",
      "Logistics",
      "Aerospace"
    ],
    "availability": "Design consultation available. Submit RFQ for custom product development."
  },
  "step2": {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBOGPBETeYt00MVcZMfifXJTpvXMAu_X_UYjVASBgTz3dRp_pCcEr0DdoxIWf0Ggi8j_qYXSG8BTHRcLodHq0UhzKQi-hoo7W757xx7waLAhze3DwOzWQ4LDwXNC9dqQ66E7Wg3t_hKY_KoOI1kYEK8xiaQIwrnc5a5AFVH4U8CdQjNrZ2lMoAZGyyFvhRcb5C0H_LZqKwboaClbw3aF08odIiYZe-6IvvZ9jEzdW_6_WjObWSriG2HjPBLXpyfh4t-ZEs9x9hPnIM",
    "category": "Manufacturing Process",
    "badge": "Stage 02",
    "status": "Quality Assured",
    "statusClass": "status-badge-green",
    "title": "Raw Material Selection",
    "description": "We source globally certified high-density polyethylene (HDPE), polypropylene (PP), and advanced co-polymer blends from approved international suppliers. Every batch undergoes melt flow index testing, tensile strength verification, and UV stability assessment in our on-site laboratory before release to production.",
    "specs": [
      [
        "Primary Materials",
        "Virgin HDPE, PP Copolymer, PP Homopolymer"
      ],
      [
        "Certification",
        "FDA, REACH, RoHS Compliant"
      ],
      [
        "Testing",
        "Melt Flow Index, Tensile Strength, UV"
      ],
      [
        "Recycled Content",
        "Up to 40% PCR on Selected Products"
      ],
      [
        "Batch Traceability",
        "Full Lot Traceability to Source"
      ]
    ],
    "features": [
      "Global Approved Suppliers",
      "FDA/REACH Compliance",
      "Recycled-Content Options",
      "On-Site Lab Testing",
      "Full Batch Traceability",
      "Food-Grade Certified"
    ],
    "applications": [
      "Food Contact Packaging",
      "Pharma-Grade Containers",
      "ESD Safe Bins",
      "UV-Stabilized Outdoor Products"
    ],
    "industries": [
      "Food & Beverage",
      "Pharmaceutical",
      "Chemical",
      "Agriculture"
    ],
    "availability": "Material compliance certificates provided with every shipment."
  },
  "step3": {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCDym3ti4gcog9pjkvj64A21jQkw9WL3siruxo255_O2uABblTewYIRTGLUhOM4A534JVPkq5cYwoRk1n0hKFLJwOpGv2b4Za7NSIGovULhxJJTtc6DKWCZLmHi9lQf5ESJnG_-I1M5co5GSP1RBAsoIEyyhWHZqQUe1HYGCpuJZpl8rqcd94kk5Ay5Hy92GAeJ4z6xmnBfeNXKdu1H7W3Hfq6iSxKO-qJ14X8fFxRvQBizRjpKK1RaHsCujNPkwl2w6PXjDHLaQsI",
    "category": "Manufacturing Process",
    "badge": "Stage 03",
    "status": "Production Core",
    "statusClass": "status-badge-blue",
    "title": "Injection Molding",
    "description": "Our 3,000-ton press fleet operates in climate-controlled bays at ±1°C ambient temperature to ensure material consistency and zero-warp production. Fully automated robotic arm demold systems maintain cycle times as low as 28 seconds per unit. Our proprietary mold-cooling system cuts cycle times by 18% versus industry average while maintaining zero-defect output targets.",
    "specs": [
      [
        "Press Fleet",
        "24 Injection Molding Presses"
      ],
      [
        "Clamping Force",
        "Up to 3,000 Ton Capability"
      ],
      [
        "Cycle Time",
        "28–90 Seconds per Unit"
      ],
      [
        "Shot Weight",
        "Up to 25 kg per Shot"
      ],
      [
        "Environment",
        "Climate Controlled ±1°C"
      ]
    ],
    "features": [
      "24 Production Presses",
      "3000-Ton Capability",
      "Robotic Arm Handling",
      "28-Second Min Cycle Time",
      "Zero-Warp Production",
      "Automated Inline QC"
    ],
    "applications": [
      "High-Volume Industrial Pallets",
      "Structural Crate Production",
      "Precision Component Molding",
      "Custom Colour Production"
    ],
    "industries": [
      "Automotive",
      "Logistics",
      "Retail",
      "Food & Beverage"
    ],
    "availability": "High-volume production slots available. Contact factory planning team."
  },
  "step4": {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCtTvzO722tn8uWbRNzkyArVszXvat49LHL9jU9vgD4ebyuUyr5ntRDTbHrFmJmKmDA6Sd_vXa2pUaXbGt9R_CaOscCzGjzKJXtSNc-1zPHtEZ4ulNPZc_uPBsjQfEpWiAd25dTzlYPnofrvejwNC4DKIahS9m7mES5ruwXc7TVbj6wbohni5cbzrGU_Kuf3xUFg5bhcOWSUDcRMqPL8aRf_PIkF41EatV6UT1fFb4_-unC5eOX5-pftw2hpPAptGhHygOBkS3HEOo",
    "category": "Manufacturing Process",
    "badge": "Stage 04",
    "status": "Zero Defect",
    "statusClass": "status-badge-green",
    "title": "Quality Control",
    "description": "Every unit leaving Giant Storage production must pass a 12-point quality inspection including dimensional verification with laser scanning, load testing to 120% of rated capacity, and surface quality assessment. Our ISO 9001:2015 certified lab operates 24/7 alongside production, providing real-time defect detection and statistical process control monitoring.",
    "specs": [
      [
        "Inspection Points",
        "12-Point Quality Gate per Unit"
      ],
      [
        "Load Testing",
        "To 120% of Rated Capacity"
      ],
      [
        "Measurement",
        "Laser 3D Dimensional Scanning"
      ],
      [
        "Defect Rate",
        "<0.02% Escape Rate Target"
      ],
      [
        "Certification",
        "ISO 9001:2015 Certified Lab"
      ]
    ],
    "features": [
      "12-Point Inspection Gate",
      "120% Load Capacity Test",
      "Laser Dimensional Scanning",
      "SPC Statistical Monitoring",
      "24/7 Lab Operations",
      "Full Batch Traceability"
    ],
    "applications": [
      "Critical Infrastructure Products",
      "Medical & Pharma Supply Chain",
      "Aerospace Component Storage",
      "Export Compliance Products"
    ],
    "industries": [
      "Pharmaceutical",
      "Aerospace",
      "Medical Devices",
      "Automotive"
    ],
    "availability": "Inspection reports and batch certificates available for all product lines."
  },
  "step5": {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAuIePElBxhVt48XqlFqlqBsk3g1mwziD_BkF1-bMHP5-QjUJygm6yUEEA0hDUPOIF6LbJ4r7_YDHwtD8OGzWVQdlfEwUxlbrSGDS-a0YBN9Fprtq10M2ZIP1oWAbnF84niJD_-WmP9Lae6-0Q4WZevp9gD3p3Re37XTEAPyL9sbV78XGUSl94jjEBJXFL1KKtNLVtkoP9uINBAFUWAiKILlXeTOaDh4hKP01r6q1Fo5a2QHWK8aK_F5h6oYcnmmh40ScP4-OmUzxKS",
    "category": "Manufacturing Process",
    "badge": "Stage 05",
    "status": "Global Ready",
    "statusClass": "status-badge-green",
    "title": "Export Preparation",
    "description": "Giant Storage operates a dedicated export logistics hub within the Cairo Free Zone, providing direct access to Suez Canal shipping routes and Alexandria Port. Every shipment is documented with ISPM-15 phytosanitary certificates, CE declarations, and country-specific compliance documentation. EDI integration with major freight forwarders enables real-time container tracking.",
    "specs": [
      [
        "Location",
        "Cairo Free Zone (Tax-Optimized)"
      ],
      [
        "Certifications",
        "ISPM-15, CE, EUR.1 Certificates"
      ],
      [
        "Shipping Routes",
        "Mediterranean, Red Sea, Air Freight"
      ],
      [
        "EDI Integration",
        "Major Freight Forwarders"
      ],
      [
        "Lead Time",
        "2–4 Weeks FOB Alexandria"
      ]
    ],
    "features": [
      "Cairo Free Zone Location",
      "ISPM-15 Certified Packaging",
      "EDI Freight Integration",
      "Real-Time Container Tracking",
      "CE & Compliance Documentation",
      "Multi-Currency Invoicing"
    ],
    "applications": [
      "EU & GCC Export Logistics",
      "Global Distribution Networks",
      "Pharma Cold-Chain Export",
      "Retail Replenishment Programs"
    ],
    "industries": [
      "Global Logistics",
      "Retail",
      "Pharmaceutical",
      "Automotive"
    ],
    "availability": "Global shipping available. Contact export team for Incoterms and freight quotes."
  },
  "tech1": {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCa9xG4AOLYtNF6EeqxOIyGlrwnGXVZUlh95ADhGQ5AGSP8iESn5u-6v9g6KADSN3RpjfF6GSiDeK_wNYUVdHIn8wKBxZo_D4u9W7UgkZA4jTj8gm6koZL_FxEZ09iCcpCZPIXctcf8iSUoqEetfgp8MdJ_j2BULAwR3iDzEF6mOP0MVLDYrXY-U0epKLARtpzAZ9k7HEDlc-6_7ehjbIBA8VuQ5uUQMbtKDSe1MNKu1hOQNMOmYz0K1x0EiDW25D-yKgCj4LWADIk",
    "category": "Technology",
    "badge": "Industry 4.0",
    "status": "AI Powered",
    "statusClass": "status-badge-blue",
    "title": "AI-Driven Robotics",
    "description": "Our manufacturing floor is equipped with 14 collaborative robotic systems integrating AI vision sensors capable of identifying surface defects at 0.01mm resolution. The robots perform continuous demold, transfer, and quality inspection tasks without human intervention, enabling 24/7 production with consistent output quality regardless of shift or operator variance.",
    "specs": [
      [
        "Robotic Units",
        "14 Collaborative Arms"
      ],
      [
        "Vision Resolution",
        "0.01mm Defect Detection"
      ],
      [
        "Uptime",
        "99.2% Mean Time Between Failures"
      ],
      [
        "AI System",
        "Deep Learning Vision + PLC"
      ],
      [
        "Tasks",
        "Demold, Transfer, QC, Palletizing"
      ]
    ],
    "features": [
      "0.01mm Vision Precision",
      "24/7 Unmanned Operation",
      "AI Defect Recognition",
      "Adaptive Grip Systems",
      "Predictive Maintenance",
      "Industry 4.0 Ready"
    ],
    "applications": [
      "Automated Quality Inspection",
      "High-Speed Demold Operations",
      "Precision Palletizing",
      "Unmanned Night-Shift Production"
    ],
    "industries": [
      "All Production Lines"
    ],
    "availability": "Technology integrated across all primary production lines."
  },
  "tech2": {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAfIz7xoCoCeskrANEUPt-yxmMglbOfvTX0ZWWdu0-qiPLkl851yRKeGtCHeCegMXiizZoGTJ4-dG8VVXUiRrIuBHoi3yZ_QKUHDbtGpPandXKrYMrk-jlW3HGt7LCZGYBdluK3ctxfQ5CrxWyYnzvVvrZr5IrgYqhty4Fm7a5rfceSqMYfvgi1JVw01lRZZLRm1thT3mVTOT1Ipxeq7UE_pfIMVCMOGGPPIa68T3fNVo8nNy4_S0j_-RLx_xwX9dX7gTtFMrqMldA",
    "category": "Technology",
    "badge": "Precision Grade",
    "status": "In-House",
    "statusClass": "status-badge-green",
    "title": "5-Axis CNC Machining",
    "description": "Our in-house tool and die shop features 6 five-axis CNC machining centers capable of producing tooling and replacement mold components to ±0.005mm tolerance. This eliminates external tooling supplier dependency, reducing mold repair lead times from 3 weeks to under 72 hours and enabling rapid prototyping from design approval to first-article production.",
    "specs": [
      [
        "CNC Centers",
        "6 Five-Axis Machining Centers"
      ],
      [
        "Tolerance",
        "±0.005mm"
      ],
      [
        "Mold Repair Time",
        "Under 72 Hours"
      ],
      [
        "Materials",
        "P20 Tool Steel, H13, Aluminum"
      ],
      [
        "Software",
        "Mastercam, Hypermill CAM"
      ]
    ],
    "features": [
      "±0.005mm Precision",
      "72-Hour Mold Repair",
      "In-House Tooling",
      "6 CNC Centers",
      "CAM-Integrated Programming",
      "Hardened Steel Tooling"
    ],
    "applications": [
      "Custom Mold Fabrication",
      "Rapid Tooling Repair",
      "Prototype Component Machining",
      "Insert Molding Tools"
    ],
    "industries": [
      "Tool & Die",
      "Automotive",
      "Aerospace",
      "General Manufacturing"
    ],
    "availability": "In-house toolroom supporting all production lines. Custom tooling quotations available."
  },
  "tech3": {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCDym3ti4gcog9pjkvj64A21jQkw9WL3siruxo255_O2uABblTewYIRTGLUhOM4A534JVPkq5cYwoRk1n0hKFLJwOpGv2b4Za7NSIGovULhxJJTtc6DKWCZLmHi9lQf5ESJnG_-I1M5co5GSP1RBAsoIEyyhWHZqQUe1HYGCpuJZpl8rqcd94kk5Ay5Hy92GAeJ4z6xmnBfeNXKdu1H7W3Hfq6iSxKO-qJ14X8fFxRvQBizRjpKK1RaHsCujNPkwl2w6PXjDHLaQsI",
    "category": "Technology",
    "badge": "Zero Warp",
    "status": "Climate Controlled",
    "statusClass": "status-badge-green",
    "title": "High-Precision Molding",
    "description": "Climate-controlled injection molding environments maintain ±1°C ambient temperature, preventing material warping due to thermal fluctuation. Our proprietary mold-cooling circuits using chilled water at 8°C reduce cycle times by 18% versus industry standard, while maintaining dimensional stability required for precision-stacking storage products. Hot-runner systems reduce material waste by 35%.",
    "specs": [
      [
        "Ambient Control",
        "±1°C Climate Controlled Bays"
      ],
      [
        "Cooling System",
        "8°C Chilled Water Circuits"
      ],
      [
        "Cycle Time Reduction",
        "18% vs. Industry Standard"
      ],
      [
        "Material Waste",
        "35% Reduction (Hot-Runner)"
      ],
      [
        "Dimensional Stability",
        "±0.3mm on 1200mm Profiles"
      ]
    ],
    "features": [
      "±1°C Climate Control",
      "18% Faster Cycle Times",
      "Chilled Mold Cooling",
      "35% Waste Reduction",
      "Hot-Runner Technology",
      "Zero-Warp Guarantee"
    ],
    "applications": [
      "Large-Format Pallet Molding",
      "Precision Crate Production",
      "Thin-Wall Container Production",
      "Multi-Cavity Tool Operations"
    ],
    "industries": [
      "Logistics",
      "Food & Beverage",
      "Pharmaceutical",
      "Retail"
    ],
    "availability": "All production lines feature precision-controlled molding environments."
  },
  "ind1": {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCM_sssouJ-7lR-75qrCH_N_dXlpZGqep2zgxU4Ee-BlJNfQB8LrAKdb-Ejqw9gVNbW_SLrF3PU_h9kqYcP-x9-NLypDQNPfipDNBQFymdhdxGr4-g7noecTfeH6dpilDB8J3Hb2TlpSNk7-qz7HBb-P4bHLuAvij-0UA1dvyQxuV8rUopRZck9yzMHtXr0pvhFos_i_mUAgOUK0eTCRjqMCkFhqlq_VA4HdTsyrYNdFN6sh2SLhsCfLakfnHzoKQxMzm7y_rb2uDYS",
    "category": "Industries We Serve",
    "badge": "Automotive",
    "status": "OEM Approved",
    "statusClass": "status-badge-green",
    "title": "Automotive Manufacturing",
    "description": "Giant Storage supplies precision returnable containers and VDA-compliant packaging systems to tier-1 and tier-2 automotive suppliers. Our containers integrate custom foam inserts, kanban windows, and steel skid bases to meet OEM logistics requirements, supporting JIT assembly line delivery with zero-damage transport.",
    "specs": [
      [
        "Standard",
        "VDA 4500 Compatible"
      ],
      [
        "Load Rating",
        "Up to 50 kg per Container"
      ],
      [
        "Cycle Life",
        "500+ Round Trips Rated"
      ],
      [
        "Compliance",
        "AIAG Automotive Packaging Guidelines"
      ],
      [
        "Customization",
        "Foam Inserts + Custom Dimensions"
      ]
    ],
    "features": [
      "VDA 4500 Compliant",
      "Custom Foam Inserts",
      "Kanban Label Windows",
      "Steel Skid Base",
      "JIT Compatible",
      "OEM Documentation"
    ],
    "applications": [
      "Engine Component Storage",
      "Stamping Parts Transport",
      "OEM Assembly Line Kanban",
      "Tier 1 Returnable Packaging"
    ],
    "industries": [
      "Automotive OEM",
      "Tier 1 Suppliers",
      "Tier 2 Suppliers",
      "Automotive Logistics"
    ],
    "availability": "Standard VDA sizes in stock. Custom inserts available with 5-day lead time."
  },
  "ind2": {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCuw7aIzV9LipN-dC6OyEf3ySngkH78w_e0XnLQtQ3Tt1_ucHw9JfNURVGdxNy0LefiR6_p0rtzBtEgft-jXtyAwiKCTlJPUA7eGnsztxQOqTI17C2e6vf0STNKvpVdvYrTjLTeXPUrNOaY-rOvmcZ2lePP6NdME9BK4x_Uz6P8vHmwg06CP6a8iUqlDzEijwxv-oZt-zhbfKVHJjqkovZcK6PMC_IyOQwoLko37rLnqlzCWwFiMsuECKfA1Zo8HsrfGuiE4_g0YJnc",
    "category": "Industries We Serve",
    "badge": "Pharmaceutical",
    "status": "GMP Certified",
    "statusClass": "status-badge-green",
    "title": "Pharmaceutical & Life Sciences",
    "description": "Our pharmaceutical-grade containers and cold-chain systems meet GDP, GMP, and FDA 21 CFR standards. From cleanroom tote boxes manufactured in ISO Class 7 facilities to validated cold-chain shippers maintaining 2–8°C for 96+ hours, Giant Storage supports the full pharmaceutical supply chain from API manufacturing to final distribution.",
    "specs": [
      [
        "Regulatory",
        "FDA 21 CFR, EU GMP, GDP"
      ],
      [
        "Temp Range",
        "+2°C to +8°C (96+ Hours Validated)"
      ],
      [
        "Cleanroom",
        "ISO Class 7 Manufacturing"
      ],
      [
        "Traceability",
        "Batch Certificate + SDS Provided"
      ],
      [
        "Testing",
        "Outgassing + Particle Count Reports"
      ]
    ],
    "features": [
      "FDA 21 CFR Materials",
      "GDP Validated Shippers",
      "GMP Batch Certificates",
      "Zero Extractables",
      "Cleanroom Manufacturing",
      "Temperature Mapping"
    ],
    "applications": [
      "API Intermediate Storage",
      "Vaccine Cold-Chain Logistics",
      "Biotech Sample Transport",
      "Clinical Trial Materials"
    ],
    "industries": [
      "Big Pharma",
      "Biotech",
      "Hospital Logistics",
      "CRO & CDMOs"
    ],
    "availability": "Available with full regulatory documentation pack. MOQ 20 units."
  },
  "ind3": {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBOGPBETeYt00MVcZMfifXJTpvXMAu_X_UYjVASBgTz3dRp_pCcEr0DdoxIWf0Ggi8j_qYXSG8BTHRcLodHq0UhzKQi-hoo7W757xx7waLAhze3DwOzWQ4LDwXNC9dqQ66E7Wg3t_hKY_KoOI1kYEK8xiaQIwrnc5a5AFVH4U8CdQjNrZ2lMoAZGyyFvhRcb5C0H_LZqKwboaClbw3aF08odIiYZe-6IvvZ9jEzdW_6_WjObWSriG2HjPBLXpyfh4t-ZEs9x9hPnIM",
    "category": "Industries We Serve",
    "badge": "Food & Beverage",
    "status": "HACCP Ready",
    "statusClass": "status-badge-green",
    "title": "Food & Beverage",
    "description": "Food safety is non-negotiable. Our food-grade containers are manufactured from virgin polypropylene meeting FDA and EU 10/2011 food contact material regulations. Smooth internal radii prevent bacterial harbourage, while HACCP-compliant designs allow complete high-pressure washdown. Antimicrobial-additive ventilated crates extend fresh produce shelf life by up to 18%.",
    "specs": [
      [
        "Material",
        "FDA 21 CFR / EU 10/2011 Approved"
      ],
      [
        "Wash Rating",
        "Up to 90°C High-Pressure Washable"
      ],
      [
        "Antimicrobial",
        "Integrated Additive Available"
      ],
      [
        "Ventilation",
        "Up to 32% Open Area"
      ],
      [
        "Traceability",
        "HACCP Lot Traceability"
      ]
    ],
    "features": [
      "FDA & EU 10/2011 Approved",
      "HACCP-Compliant Design",
      "Antimicrobial Treatment Option",
      "High-Pressure Washable",
      "Smooth Internal Radii",
      "Odor-Neutral Materials"
    ],
    "applications": [
      "Fresh Produce Harvest",
      "Meat & Seafood Processing",
      "Dairy & Bakery Production",
      "Food Distribution Centers"
    ],
    "industries": [
      "Supermarket Chains",
      "Fresh Produce Exporters",
      "FMCG Manufacturers",
      "Food Processors"
    ],
    "availability": "Food-grade containers in stock. HACCP documentation available upon request."
  },
  "ind4": {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAuIePElBxhVt48XqlFqlqBsk3g1mwziD_BkF1-bMHP5-QjUJygm6yUEEA0hDUPOIF6LbJ4r7_YDHwtD8OGzWVQdlfEwUxlbrSGDS-a0YBN9Fprtq10M2ZIP1oWAbnF84niJD_-WmP9Lae6-0Q4WZevp9gD3p3Re37XTEAPyL9sbV78XGUSl94jjEBJXFL1KKtNLVtkoP9uINBAFUWAiKILlXeTOaDh4hKP01r6q1Fo5a2QHWK8aK_F5h6oYcnmmh40ScP4-OmUzxKS",
    "category": "Industries We Serve",
    "badge": "Logistics",
    "status": "Industry 4.0",
    "statusClass": "status-badge-blue",
    "title": "Logistics & E-Commerce",
    "description": "With global e-commerce volumes growing 15% YoY, logistics operators need ultra-durable totes and pallets that survive automated sortation systems, high-throughput conveyor lines, and robotic picking operations. Giant Storage containers meet ±0.5mm dimensional tolerance for robotic gripper compatibility and are fitted with RFID antenna cavities for real-time inventory visibility.",
    "specs": [
      [
        "Dimensional Tolerance",
        "±0.5mm for Robotic Systems"
      ],
      [
        "RFID",
        "Integrated Antenna Cavity Standard"
      ],
      [
        "Conveyor Rating",
        "500kg Dynamic Conveyor Tested"
      ],
      [
        "Trip Cycles",
        "200+ Trip Cycles Designed"
      ],
      [
        "Tracking",
        "GPS Tag Compatible Variants"
      ]
    ],
    "features": [
      "Robotic Gripper Compatible",
      "RFID Ready Containers",
      "Conveyor Rail Guides",
      "High Dimensional Accuracy",
      "Lightweight Construction",
      "Colour-Coded Systems"
    ],
    "applications": [
      "Fulfillment Center Totes",
      "Last-Mile Delivery Containers",
      "Automated Sortation Systems",
      "Click & Collect Packaging"
    ],
    "industries": [
      "E-Commerce Fulfilment",
      "3PL Operators",
      "Postal & Parcel",
      "Grocery Delivery"
    ],
    "availability": "All standard Eurobox sizes in stock. RFID integration available with 2-week lead time."
  },
  "ind5": {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAn3q-Nk20XbLS5aA6OdmG4diVlqJnNo0Qt-h6nAFwUv40ugziQYHoTZ1joDdwCKc2SQ3uNP9nfNq4Z98cRWwEAKBmp6yC3fSXMYWaptx8W6GkrVLbUtQDlyr-1Kj4od6nhOTx2osPF6p0Crha1jMwEV0Ir-SKbtGsUTTtmQRKZXEb99H14kZvu7NW2LMplnJwQzIq1qNxCc5KvjxNc9IVjiVhDZu37IkSY4Z7mno8kDmvq2gg8xvswHDkPP9zBuPSO_uBAu7gHdWnF",
    "category": "Industries We Serve",
    "badge": "Agriculture",
    "status": "Export Grade",
    "statusClass": "status-badge-green",
    "title": "Agriculture & Fresh Produce",
    "description": "Giant Storage ventilated harvest crates, agriculture pallets, and field bins are deployed across Egypt's primary agriculture export sector and international fresh produce supply chains. Ultra-lightweight field crates reduce picker fatigue during continuous harvest shifts, while UV-stabilized construction provides 10+ seasons of outdoor field use without material degradation.",
    "specs": [
      [
        "UV Rating",
        "10+ Season UV Stabilization"
      ],
      [
        "Min Weight",
        "From 1.8 kg Field Crate"
      ],
      [
        "Ventilation",
        "32% Open Ventilation Area"
      ],
      [
        "Wash Rating",
        "High-Pressure Wash Rated"
      ],
      [
        "Stacking",
        "12 High Empty Nest Rating"
      ]
    ],
    "features": [
      "10-Season UV Rating",
      "Ultra-Lightweight Design",
      "Antimicrobial Treatment",
      "Smooth Produce Contact",
      "High-Pressure Washable",
      "Stackable & Nestable"
    ],
    "applications": [
      "Field Harvest Collection",
      "Cold Store Circulation",
      "Wholesale Market Handling",
      "Export Packhouse Operations"
    ],
    "industries": [
      "Fresh Produce Exporters",
      "Agri-Business",
      "Packhouses",
      "Cold Storage Operators"
    ],
    "availability": "Pre-order for seasonal demand. Agricultural sales team available for pricing."
  },
  "ind6": {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCtTvzO722tn8uWbRNzkyArVszXvat49LHL9jU9vgD4ebyuUyr5ntRDTbHrFmJmKmDA6Sd_vXa2pUaXbGt9R_CaOscCzGjzKJXtSNc-1zPHtEZ4ulNPZc_uPBsjQfEpWiAd25dTzlYPnofrvejwNC4DKIahS9m7mES5ruwXc7TVbj6wbohni5cbzrGU_Kuf3xUFg5bhcOWSUDcRMqPL8aRf_PIkF41EatV6UT1fFb4_-unC5eOX5-pftw2hpPAptGhHygOBkS3HEOo",
    "category": "Industries We Serve",
    "badge": "Electronics",
    "status": "ESD Safe",
    "statusClass": "status-badge-blue",
    "title": "Electronics & Technology",
    "description": "Sensitive electronic components require specialized packaging that eliminates electrostatic discharge (ESD) risks throughout the supply chain. Giant Storage ESD-compliant containers, totes, and bins are manufactured from conductive carbon-loaded polypropylene with surface resistivity of 10³–10⁶ Ω, meeting IEC 61340-5-1 standards for complete static protection.",
    "specs": [
      [
        "ESD Standard",
        "IEC 61340-5-1 Compliant"
      ],
      [
        "Surface Resistivity",
        "10³–10⁶ Ω (Conductive)"
      ],
      [
        "Material",
        "Carbon-Loaded Conductive PP"
      ],
      [
        "Cleanroom",
        "ISO Class 5 Options Available"
      ],
      [
        "Certification",
        "ESD Test Certificate Included"
      ]
    ],
    "features": [
      "IEC 61340-5-1 Certified",
      "Continuous ESD Dissipation",
      "No Grounding Strap Needed",
      "Cleanroom Compatible",
      "Particle Count <100/m³",
      "Test Certificate Included"
    ],
    "applications": [
      "PCB Assembly Lines",
      "Semiconductor Handling",
      "Avionics Component Storage",
      "Medical Electronics"
    ],
    "industries": [
      "Semiconductor",
      "Consumer Electronics",
      "Avionics",
      "Medical Devices"
    ],
    "availability": "Standard ESD sizes in stock with compliance certificates. Cleanroom totes 3-week lead time."
  },
  "cert1": {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCtTvzO722tn8uWbRNzkyArVszXvat49LHL9jU9vgD4ebyuUyr5ntRDTbHrFmJmKmDA6Sd_vXa2pUaXbGt9R_CaOscCzGjzKJXtSNc-1zPHtEZ4ulNPZc_uPBsjQfEpWiAd25dTzlYPnofrvejwNC4DKIahS9m7mES5ruwXc7TVbj6wbohni5cbzrGU_Kuf3xUFg5bhcOWSUDcRMqPL8aRf_PIkF41EatV6UT1fFb4_-unC5eOX5-pftw2hpPAptGhHygOBkS3HEOo",
    "category": "Certification",
    "badge": "ISO Certified",
    "status": "Active 2024–2027",
    "statusClass": "status-badge-green",
    "title": "ISO 9001:2015",
    "description": "ISO 9001:2015 is the international benchmark for Quality Management Systems. Our certification demonstrates systematic quality control throughout product design, material procurement, manufacturing, and post-delivery support. Annual third-party surveillance audits by Bureau Veritas ensure continuous compliance and improvement.",
    "specs": [
      [
        "Certifying Body",
        "Bureau Veritas International"
      ],
      [
        "Scope",
        "Design, Manufacture & Supply"
      ],
      [
        "Audit Frequency",
        "Annual + Triennial Recertification"
      ],
      [
        "Standard",
        "ISO 9001:2015 (Latest Edition)"
      ],
      [
        "Certificate Valid",
        "2024–2027"
      ]
    ],
    "features": [
      "Bureau Veritas Certified",
      "Full Design Scope",
      "Annual Audits",
      "Customer Satisfaction Focus",
      "Continuous Improvement",
      "Document Control System"
    ],
    "applications": [
      "All Product Lines",
      "Global Export Markets",
      "EU Procurement Programs",
      "Government Tenders"
    ],
    "industries": [
      "All Industries Served"
    ],
    "availability": "Certificate copies available to procurement teams upon request."
  },
  "cert2": {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAn3q-Nk20XbLS5aA6OdmG4diVlqJnNo0Qt-h6nAFwUv40ugziQYHoTZ1joDdwCKc2SQ3uNP9nfNq4Z98cRWwEAKBmp6yC3fSXMYWaptx8W6GkrVLbUtQDlyr-1Kj4od6nhOTx2osPF6p0Crha1jMwEV0Ir-SKbtGsUTTtmQRKZXEb99H14kZvu7NW2LMplnJwQzIq1qNxCc5KvjxNc9IVjiVhDZu37IkSY4Z7mno8kDmvq2gg8xvswHDkPP9zBuPSO_uBAu7gHdWnF",
    "category": "Certification",
    "badge": "Environmental",
    "status": "Active Certified",
    "statusClass": "status-badge-green",
    "title": "ISO 14001",
    "description": "ISO 14001 certification confirms Giant Storage commitment to reducing environmental impact through systematic monitoring and control of production processes. We track carbon emissions, water consumption, polymer waste rates, and recycled material usage across all operations, with year-on-year improvement targets.",
    "specs": [
      [
        "Certifying Body",
        "SGS Group"
      ],
      [
        "Scope",
        "Environmental Impact of Manufacturing"
      ],
      [
        "Targets",
        "YoY Carbon & Waste Reduction"
      ],
      [
        "Recycled Content",
        "Up to 40% PCR Available"
      ],
      [
        "Renewable Energy",
        "35% Solar Power in Facility"
      ]
    ],
    "features": [
      "Carbon Footprint Monitoring",
      "Waste Reduction Program",
      "Recycled Content Options",
      "35% Solar Energy Use",
      "Zero-Landfill Target",
      "Annual Environmental Report"
    ],
    "applications": [
      "Green Procurement Programs",
      "EU Sustainable Packaging",
      "FMCG ESG Supply Chains",
      "Government Tenders"
    ],
    "industries": [
      "All Industries — Sustainability Track"
    ],
    "availability": "Environmental performance report available annually. PCR certification on request."
  },
  "cert3": {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCa9xG4AOLYtNF6EeqxOIyGlrwnGXVZUlh95ADhGQ5AGSP8iESn5u-6v9g6KADSN3RpjfF6GSiDeK_wNYUVdHIn8wKBxZo_D4u9W7UgkZA4jTj8gm6koZL_FxEZ09iCcpCZPIXctcf8iSUoqEetfgp8MdJ_j2BULAwR3iDzEF6mOP0MVLDYrXY-U0epKLARtpzAZ9k7HEDlc-6_7ehjbIBA8VuQ5uUQMbtKDSe1MNKu1hOQNMOmYz0K1x0EiDW25D-yKgCj4LWADIk",
    "category": "Certification",
    "badge": "Health & Safety",
    "status": "Zero LTI Record",
    "statusClass": "status-badge-green",
    "title": "OHSAS 18001",
    "description": "OHSAS 18001 certifies that Giant Storage operates with world-class occupational health and safety management. Our 14,000m² facility maintains a zero Lost Time Injury (LTI) record for 7+ consecutive years, supported by automated material handling, mandatory PPE systems, and daily safety briefings integrated into all production shifts.",
    "specs": [
      [
        "Standard",
        "OHSAS 18001 / ISO 45001 Transition"
      ],
      [
        "LTI Record",
        "Zero Lost Time Injuries — 7+ Years"
      ],
      [
        "Facility Area",
        "14,000 m² Certified"
      ],
      [
        "Training",
        "Annual HSE Training All Staff"
      ],
      [
        "Inspection",
        "Monthly Internal + Annual External"
      ]
    ],
    "features": [
      "7+ Year Zero LTI Record",
      "Automated Material Handling",
      "PPE Compliance Systems",
      "Daily Safety Briefings",
      "Emergency Response Plans",
      "Monthly Safety Audits"
    ],
    "applications": [
      "High-Risk Manufacturing",
      "Heavy Machine Operation",
      "Chemical Material Handling",
      "Logistics & Dispatch"
    ],
    "industries": [
      "All Production Environments"
    ],
    "availability": "Safety performance record available to procurement and compliance teams."
  },
  "cert4": {
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCM_sssouJ-7lR-75qrCH_N_dXlpZGqep2zgxU4Ee-BlJNfQB8LrAKdb-Ejqw9gVNbW_SLrF3PU_h9kqYcP-x9-NLypDQNPfipDNBQFymdhdxGr4-g7noecTfeH6dpilDB8J3Hb2TlpSNk7-qz7HBb-P4bHLuAvij-0UA1dvyQxuV8rUopRZck9yzMHtXr0pvhFos_i_mUAgOUK0eTCRjqMCkFhqlq_VA4HdTsyrYNdFN6sh2SLhsCfLakfnHzoKQxMzm7y_rb2uDYS",
    "category": "Certification",
    "badge": "European Quality",
    "status": "EU Market Ready",
    "statusClass": "status-badge-blue",
    "title": "CE Compliant",
    "description": "CE marking confirms that Giant Storage products exported to the European Economic Area meet all applicable EU health, safety, and environmental protection requirements. Our CE self-declaration covers RoHS Directive 2011/65/EU and REACH substance restrictions, supported by full technical file documentation available to EU import partners.",
    "specs": [
      [
        "Directives",
        "RoHS 2011/65/EU, REACH SVHC"
      ],
      [
        "Market",
        "EU + EEA Countries"
      ],
      [
        "Documentation",
        "Technical File Available"
      ],
      [
        "REACH",
        "No SVHC above 0.1% wt/wt"
      ],
      [
        "Update Cycle",
        "Annual Declaration Review"
      ]
    ],
    "features": [
      "Full EU Market Access",
      "RoHS Compliant Materials",
      "REACH SVHC <0.1%",
      "Technical File Available",
      "Annual Declaration Update",
      "Import Partner Support"
    ],
    "applications": [
      "EU Distribution Channels",
      "EU Retailer Programs",
      "European Pharma Logistics",
      "EU Government Procurement"
    ],
    "industries": [
      "All EU Export Markets"
    ],
    "availability": "CE documentation pack provided to all EU import partners with first shipment."
  }
};
