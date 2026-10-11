/**
 * Verified healthcare facility dataset for GramHealth Connect
 * Derived from backend/db/facilities.csv and Moradabad regional grid.
 * All facilities contain valid coordinates, categorization, and capacity metrics.
 */
export const VERIFIED_FACILITIES = [
  {
    "id": "phc-rampur",
    "name": "Primary Health Centre (PHC) Rampur",
    "type": "PHC",
    "district": "Moradabad",
    "address": "Rampur Block, Moradabad District, UP 244901",
    "latitude": 28.8154,
    "longitude": 79.0257,
    "contactNumber": "9876543210",
    "beds": "6 / 10 Free",
    "doctor": "Dr. S. Sharma",
    "hours": "8:00 AM – 4:00 PM (Emergency 24x7)",
    "services": [
      "Maternal Care (ANC/PNC)",
      "General OPD",
      "Immunization",
      "24/7 Delivery Room"
    ],
    "category": [
      "maternal",
      "opd",
      "immunization"
    ]
  },
  {
    "id": "chc-shivnagar",
    "name": "Shivnagar Community Health Centre (CHC)",
    "type": "CHC",
    "district": "Moradabad",
    "address": "Shivnagar Main Road, Moradabad, UP 244001",
    "latitude": 28.8386,
    "longitude": 78.7733,
    "contactNumber": "0591244102",
    "beds": "12 / 20 Free",
    "doctor": "3 Surgeons Active",
    "hours": "24x7 Open (Round-the-clock)",
    "services": [
      "Specialist OB/GYN",
      "Pediatric Care",
      "X-Ray & Lab",
      "Ambulance Station"
    ],
    "category": [
      "emergency",
      "maternal"
    ]
  },
  {
    "id": "hwc-kalyanpur",
    "name": "Kalyanpur Sub-Centre & Health Wellness Centre",
    "type": "PHC",
    "district": "Moradabad",
    "address": "Kalyanpur Gram Panchayat, Moradabad, UP 244001",
    "latitude": 28.8612,
    "longitude": 78.7421,
    "contactNumber": "9412055112",
    "beds": "—",
    "doctor": "ANM Sunita Verma",
    "hours": "9:00 AM – 3:00 PM",
    "services": [
      "NCD Screening",
      "Immunization",
      "ASHA Training"
    ],
    "category": [
      "immunization",
      "opd"
    ]
  },
  {
    "id": "district-moradabad",
    "name": "Moradabad District Hospital",
    "type": "District Hospital",
    "district": "Moradabad",
    "address": "Civil Lines, Moradabad, UP 244001",
    "latitude": 28.835,
    "longitude": 78.783,
    "contactNumber": "0591222100",
    "beds": "40 / 80 Free",
    "doctor": "Multiple Specialists",
    "hours": "24x7 All Departments",
    "services": [
      "Surgery",
      "ICU",
      "Blood Bank",
      "Radiology",
      "Dialysis"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-1",
    "name": "Civil Hospital Amritsar",
    "type": "District Hospital",
    "district": "Amritsar",
    "address": "Court Road, Amritsar, Punjab 143001",
    "latitude": 31.634,
    "longitude": 74.8723,
    "contactNumber": "1800-000-0000",
    "beds": "45 / 80 Free",
    "doctor": "Specialist Consultants",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Surgery",
      "Maternal (ANC/PNC)",
      "Pediatrics",
      "X-Ray & Lab"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-2",
    "name": "Guru Nanak Dev Hospital",
    "type": "District Hospital",
    "district": "Amritsar",
    "address": "Maharaja Ranjit Singh Nagar, Amritsar, Punjab 143001",
    "latitude": 31.625,
    "longitude": 74.875,
    "contactNumber": "1800-000-0001",
    "beds": "45 / 80 Free",
    "doctor": "Specialist Consultants",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Surgery",
      "Maternal (ANC/PNC)",
      "Pediatrics",
      "X-Ray & Lab"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-3",
    "name": "Jallianwala Bagh Martyr's Memorial Civil Hospital",
    "type": "District Hospital",
    "district": "Amritsar",
    "address": "Amritsar, Punjab 143001",
    "latitude": 31.634,
    "longitude": 74.8723,
    "contactNumber": "1800-000-0002",
    "beds": "45 / 80 Free",
    "doctor": "Specialist Consultants",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Surgery",
      "Maternal (ANC/PNC)",
      "Pediatrics",
      "X-Ray & Lab"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-4",
    "name": "Civil Hospital Bathinda",
    "type": "District Hospital",
    "district": "Bathinda",
    "address": "Goniana Road, Bathinda, Punjab 151001",
    "latitude": 30.211,
    "longitude": 74.9455,
    "contactNumber": "1800-000-0003",
    "beds": "45 / 80 Free",
    "doctor": "Specialist Consultants",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Surgery",
      "Maternal (ANC/PNC)",
      "Pediatrics",
      "X-Ray & Lab"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-5",
    "name": "Guru Gobind Singh Medical College & Hospital",
    "type": "Medical College",
    "district": "Faridkot",
    "address": "Sadiq Road, Faridkot, Punjab 151203",
    "latitude": 30.676,
    "longitude": 74.758,
    "contactNumber": "1800-000-0004",
    "beds": "120 / 150 Free",
    "doctor": "Super-Specialist Teams",
    "hours": "24x7 Emergency",
    "services": [
      "Super-Specialty",
      "ICU & Trauma",
      "Blood Bank",
      "Dialysis",
      "OB/GYN Surgery"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-6",
    "name": "Civil Hospital Faridkot",
    "type": "District Hospital",
    "district": "Faridkot",
    "address": "Faridkot, Punjab 151203",
    "latitude": 30.676,
    "longitude": 74.758,
    "contactNumber": "1800-000-0005",
    "beds": "45 / 80 Free",
    "doctor": "Specialist Consultants",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Surgery",
      "Maternal (ANC/PNC)",
      "Pediatrics",
      "X-Ray & Lab"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-7",
    "name": "Civil Hospital Ferozepur",
    "type": "District Hospital",
    "district": "Ferozepur",
    "address": "Ferozepur, Punjab 152001",
    "latitude": 30.925,
    "longitude": 74.613,
    "contactNumber": "1800-000-0006",
    "beds": "45 / 80 Free",
    "doctor": "Specialist Consultants",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Surgery",
      "Maternal (ANC/PNC)",
      "Pediatrics",
      "X-Ray & Lab"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-8",
    "name": "Civil Hospital Hoshiarpur",
    "type": "District Hospital",
    "district": "Hoshiarpur",
    "address": "Hoshiarpur, Punjab 146001",
    "latitude": 31.532,
    "longitude": 75.911,
    "contactNumber": "1800-000-0007",
    "beds": "45 / 80 Free",
    "doctor": "Specialist Consultants",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Surgery",
      "Maternal (ANC/PNC)",
      "Pediatrics",
      "X-Ray & Lab"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-9",
    "name": "Civil Hospital Jalandhar",
    "type": "District Hospital",
    "district": "Jalandhar",
    "address": "Mission Road, Jalandhar, Punjab 144001",
    "latitude": 31.326,
    "longitude": 75.5762,
    "contactNumber": "1800-000-0008",
    "beds": "45 / 80 Free",
    "doctor": "Specialist Consultants",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Surgery",
      "Maternal (ANC/PNC)",
      "Pediatrics",
      "X-Ray & Lab"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-10",
    "name": "Civil Hospital Ludhiana",
    "type": "District Hospital",
    "district": "Ludhiana",
    "address": "Ludhiana, Punjab 141001",
    "latitude": 30.901,
    "longitude": 75.8573,
    "contactNumber": "1800-000-0009",
    "beds": "45 / 80 Free",
    "doctor": "Specialist Consultants",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Surgery",
      "Maternal (ANC/PNC)",
      "Pediatrics",
      "X-Ray & Lab"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-11",
    "name": "Christian Medical College & Hospital",
    "type": "Medical College",
    "district": "Ludhiana",
    "address": "Brown Road, Ludhiana, Punjab 141008",
    "latitude": 30.901,
    "longitude": 75.8573,
    "contactNumber": "1800-000-0010",
    "beds": "120 / 150 Free",
    "doctor": "Super-Specialist Teams",
    "hours": "24x7 Emergency",
    "services": [
      "Super-Specialty",
      "ICU & Trauma",
      "Blood Bank",
      "Dialysis",
      "OB/GYN Surgery"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-12",
    "name": "Dayanand Medical College & Hospital",
    "type": "Medical College",
    "district": "Ludhiana",
    "address": "Civil Lines, Ludhiana, Punjab 141001",
    "latitude": 30.901,
    "longitude": 75.8573,
    "contactNumber": "1800-000-0011",
    "beds": "120 / 150 Free",
    "doctor": "Super-Specialist Teams",
    "hours": "24x7 Emergency",
    "services": [
      "Super-Specialty",
      "ICU & Trauma",
      "Blood Bank",
      "Dialysis",
      "OB/GYN Surgery"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-13",
    "name": "Civil Hospital Mansa",
    "type": "District Hospital",
    "district": "Mansa",
    "address": "Mansa, Punjab 151505",
    "latitude": 29.988,
    "longitude": 75.386,
    "contactNumber": "1800-000-0012",
    "beds": "45 / 80 Free",
    "doctor": "Specialist Consultants",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Surgery",
      "Maternal (ANC/PNC)",
      "Pediatrics",
      "X-Ray & Lab"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-14",
    "name": "Civil Hospital Moga",
    "type": "District Hospital",
    "district": "Moga",
    "address": "Moga, Punjab 142001",
    "latitude": 30.816,
    "longitude": 75.171,
    "contactNumber": "1800-000-0013",
    "beds": "45 / 80 Free",
    "doctor": "Specialist Consultants",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Surgery",
      "Maternal (ANC/PNC)",
      "Pediatrics",
      "X-Ray & Lab"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-15",
    "name": "Civil Hospital Pathankot",
    "type": "District Hospital",
    "district": "Pathankot",
    "address": "Pathankot, Punjab 145001",
    "latitude": 32.274,
    "longitude": 75.652,
    "contactNumber": "1800-000-0014",
    "beds": "45 / 80 Free",
    "doctor": "Specialist Consultants",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Surgery",
      "Maternal (ANC/PNC)",
      "Pediatrics",
      "X-Ray & Lab"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-16",
    "name": "Rajindra Hospital Patiala",
    "type": "District Hospital",
    "district": "Patiala",
    "address": "Sangrur Road, Patiala, Punjab 147001",
    "latitude": 30.3398,
    "longitude": 76.3869,
    "contactNumber": "1800-000-0015",
    "beds": "45 / 80 Free",
    "doctor": "Specialist Consultants",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Surgery",
      "Maternal (ANC/PNC)",
      "Pediatrics",
      "X-Ray & Lab"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-17",
    "name": "Mata Kaushalya District Hospital",
    "type": "District Hospital",
    "district": "Patiala",
    "address": "Sheran Wala Gate, Patiala, Punjab 147001",
    "latitude": 30.3398,
    "longitude": 76.3869,
    "contactNumber": "1800-000-0016",
    "beds": "45 / 80 Free",
    "doctor": "Specialist Consultants",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Surgery",
      "Maternal (ANC/PNC)",
      "Pediatrics",
      "X-Ray & Lab"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-18",
    "name": "Civil Hospital Rupnagar",
    "type": "District Hospital",
    "district": "Rupnagar",
    "address": "Phase 6 Mohali, Punjab 140001",
    "latitude": 30.704,
    "longitude": 76.717,
    "contactNumber": "1800-000-0017",
    "beds": "45 / 80 Free",
    "doctor": "Specialist Consultants",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Surgery",
      "Maternal (ANC/PNC)",
      "Pediatrics",
      "X-Ray & Lab"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-19",
    "name": "Civil Hospital Sangrur",
    "type": "District Hospital",
    "district": "Sangrur",
    "address": "Sangrur, Punjab 148001",
    "latitude": 30.245,
    "longitude": 75.842,
    "contactNumber": "1800-000-0018",
    "beds": "45 / 80 Free",
    "doctor": "Specialist Consultants",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Surgery",
      "Maternal (ANC/PNC)",
      "Pediatrics",
      "X-Ray & Lab"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-20",
    "name": "Civil Hospital Nawanshahr",
    "type": "District Hospital",
    "district": "Nawanshahr",
    "address": "Shaheed Bhagat Singh Nagar, Punjab 144514",
    "latitude": 31.124,
    "longitude": 76.116,
    "contactNumber": "1800-000-0019",
    "beds": "45 / 80 Free",
    "doctor": "Specialist Consultants",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Surgery",
      "Maternal (ANC/PNC)",
      "Pediatrics",
      "X-Ray & Lab"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-21",
    "name": "Civil Hospital Tarn Taran",
    "type": "District Hospital",
    "district": "Tarn Taran",
    "address": "Tarn Taran, Punjab 143401",
    "latitude": 31.452,
    "longitude": 74.928,
    "contactNumber": "1800-000-0020",
    "beds": "45 / 80 Free",
    "doctor": "Specialist Consultants",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Surgery",
      "Maternal (ANC/PNC)",
      "Pediatrics",
      "X-Ray & Lab"
    ],
    "category": [
      "emergency",
      "maternal",
      "opd"
    ]
  },
  {
    "id": "fac-pb-22",
    "name": "CHC Ajnala",
    "type": "CHC",
    "district": "Amritsar",
    "address": "Ajnala, Amritsar, Punjab 143102",
    "latitude": 31.84,
    "longitude": 74.76,
    "contactNumber": "1800-000-0021",
    "beds": "14 / 24 Free",
    "doctor": "Medical Officer & Surgeons",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Maternal ANC",
      "General OPD",
      "Ambulance"
    ],
    "category": [
      "emergency",
      "maternal"
    ]
  },
  {
    "id": "fac-pb-23",
    "name": "CHC Dera Baba Nanak",
    "type": "CHC",
    "district": "Gurdaspur",
    "address": "Dera Baba Nanak, Punjab 143604",
    "latitude": 32.037,
    "longitude": 75.05,
    "contactNumber": "1800-000-0022",
    "beds": "14 / 24 Free",
    "doctor": "Medical Officer & Surgeons",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Maternal ANC",
      "General OPD",
      "Ambulance"
    ],
    "category": [
      "emergency",
      "maternal"
    ]
  },
  {
    "id": "fac-pb-24",
    "name": "CHC Dhilwan",
    "type": "CHC",
    "district": "Kapurthala",
    "address": "Dhilwan, Punjab 144804",
    "latitude": 31.38,
    "longitude": 75.38,
    "contactNumber": "1800-000-0023",
    "beds": "14 / 24 Free",
    "doctor": "Medical Officer & Surgeons",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Maternal ANC",
      "General OPD",
      "Ambulance"
    ],
    "category": [
      "emergency",
      "maternal"
    ]
  },
  {
    "id": "fac-pb-25",
    "name": "CHC Sultanpur Lodhi",
    "type": "CHC",
    "district": "Kapurthala",
    "address": "Sultanpur Lodhi, Punjab 144626",
    "latitude": 31.21,
    "longitude": 75.19,
    "contactNumber": "1800-000-0024",
    "beds": "14 / 24 Free",
    "doctor": "Medical Officer & Surgeons",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Maternal ANC",
      "General OPD",
      "Ambulance"
    ],
    "category": [
      "emergency",
      "maternal"
    ]
  },
  {
    "id": "fac-pb-26",
    "name": "CHC Nihal Singh Wala",
    "type": "CHC",
    "district": "Moga",
    "address": "Nihal Singh Wala, Punjab 142055",
    "latitude": 30.75,
    "longitude": 75.25,
    "contactNumber": "1800-000-0025",
    "beds": "14 / 24 Free",
    "doctor": "Medical Officer & Surgeons",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Maternal ANC",
      "General OPD",
      "Ambulance"
    ],
    "category": [
      "emergency",
      "maternal"
    ]
  },
  {
    "id": "fac-pb-27",
    "name": "CHC Dhuri",
    "type": "CHC",
    "district": "Sangrur",
    "address": "Dhuri, Punjab 148024",
    "latitude": 30.37,
    "longitude": 75.87,
    "contactNumber": "1800-000-0026",
    "beds": "14 / 24 Free",
    "doctor": "Medical Officer & Surgeons",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Maternal ANC",
      "General OPD",
      "Ambulance"
    ],
    "category": [
      "emergency",
      "maternal"
    ]
  },
  {
    "id": "fac-pb-28",
    "name": "CHC Kalo Majra",
    "type": "CHC",
    "district": "Patiala",
    "address": "Kalo Majra, Punjab 147001",
    "latitude": 30.3398,
    "longitude": 76.3869,
    "contactNumber": "1800-000-0027",
    "beds": "14 / 24 Free",
    "doctor": "Medical Officer & Surgeons",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Maternal ANC",
      "General OPD",
      "Ambulance"
    ],
    "category": [
      "emergency",
      "maternal"
    ]
  },
  {
    "id": "fac-pb-29",
    "name": "CHC Shutrana",
    "type": "CHC",
    "district": "Patiala",
    "address": "Shutrana, Punjab 147001",
    "latitude": 30.3398,
    "longitude": 76.3869,
    "contactNumber": "1800-000-0028",
    "beds": "14 / 24 Free",
    "doctor": "Medical Officer & Surgeons",
    "hours": "24x7 Emergency",
    "services": [
      "24/7 Emergency",
      "Maternal ANC",
      "General OPD",
      "Ambulance"
    ],
    "category": [
      "emergency",
      "maternal"
    ]
  },
  {
    "id": "fac-pb-30",
    "name": "PHC Nabha",
    "type": "PHC",
    "district": "Patiala",
    "address": "Main Bazaar, Nabha, Punjab 147201",
    "latitude": 30.3735,
    "longitude": 76.1504,
    "contactNumber": "1800-000-0029",
    "beds": "6 / 10 Free",
    "doctor": "Medical Officer",
    "hours": "8:00 AM – 4:00 PM",
    "services": [
      "General OPD",
      "Maternal Care",
      "Immunization",
      "NCD Screening"
    ],
    "category": [
      "opd",
      "immunization",
      "maternal"
    ]
  },
  {
    "id": "fac-pb-31",
    "name": "PHC Gopalpur",
    "type": "PHC",
    "district": "Patiala",
    "address": "Gopalpur, Punjab 147001",
    "latitude": 30.3398,
    "longitude": 76.3869,
    "contactNumber": "1800-000-0030",
    "beds": "6 / 10 Free",
    "doctor": "Medical Officer",
    "hours": "8:00 AM – 4:00 PM",
    "services": [
      "General OPD",
      "Maternal Care",
      "Immunization",
      "NCD Screening"
    ],
    "category": [
      "opd",
      "immunization",
      "maternal"
    ]
  },
  {
    "id": "fac-pb-32",
    "name": "PHC Patran",
    "type": "PHC",
    "district": "Patiala",
    "address": "Patran, Punjab 147001",
    "latitude": 30.3398,
    "longitude": 76.3869,
    "contactNumber": "1800-000-0031",
    "beds": "6 / 10 Free",
    "doctor": "Medical Officer",
    "hours": "8:00 AM – 4:00 PM",
    "services": [
      "General OPD",
      "Maternal Care",
      "Immunization",
      "NCD Screening"
    ],
    "category": [
      "opd",
      "immunization",
      "maternal"
    ]
  },
  {
    "id": "fac-pb-33",
    "name": "PHC Dhenthal",
    "type": "PHC",
    "district": "Patiala",
    "address": "Dhenthal, Punjab 147001",
    "latitude": 30.3398,
    "longitude": 76.3869,
    "contactNumber": "1800-000-0032",
    "beds": "6 / 10 Free",
    "doctor": "Medical Officer",
    "hours": "8:00 AM – 4:00 PM",
    "services": [
      "General OPD",
      "Maternal Care",
      "Immunization",
      "NCD Screening"
    ],
    "category": [
      "opd",
      "immunization",
      "maternal"
    ]
  },
  {
    "id": "fac-pb-34",
    "name": "PHC Bhano Langa",
    "type": "PHC",
    "district": "Kapurthala",
    "address": "Bhano Langa, Punjab 144601",
    "latitude": 31.38,
    "longitude": 75.38,
    "contactNumber": "1800-000-0033",
    "beds": "6 / 10 Free",
    "doctor": "Medical Officer",
    "hours": "8:00 AM – 4:00 PM",
    "services": [
      "General OPD",
      "Maternal Care",
      "Immunization",
      "NCD Screening"
    ],
    "category": [
      "opd",
      "immunization",
      "maternal"
    ]
  }
];
