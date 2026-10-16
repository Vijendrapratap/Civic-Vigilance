-- Seed Data: Major Indian Civic Authorities
-- This provides a starting set of authorities for testing
-- You can expand this based on your target cities

-- ============================================================================
-- NATIONAL LEVEL AUTHORITIES
-- ============================================================================

INSERT INTO public.authorities (
  name, name_local, social_media, jurisdiction_type, jurisdiction_level,
  country, issue_categories, priority, contact_info, status
) VALUES
-- Ministry of Road Transport and Highways
(
  'Ministry of Road Transport and Highways',
  'सड़क परिवहन और राजमार्ग मंत्रालय',
  '{"twitter": {"handle": "@MORTHIndia", "verified": true, "active": true}}'::jsonb,
  'national', 1, 'IN',
  ARRAY['pothole', 'traffic_signal', 'encroachment']::issue_category[],
  3,
  '{"website": "https://morth.nic.in", "email": "morth@gov.in"}'::jsonb,
  'active'
),
-- Ministry of Housing and Urban Affairs
(
  'Ministry of Housing and Urban Affairs',
  'आवास और शहरी कार्य मंत्रालय',
  '{"twitter": {"handle": "@MoHUA_India", "verified": true, "active": true}}'::jsonb,
  'national', 1, 'IN',
  ARRAY['garbage', 'drainage', 'water_supply', 'sewage', 'parks']::issue_category[],
  3,
  '{"website": "https://mohua.gov.in"}'::jsonb,
  'active'
);

-- ============================================================================
-- KARNATAKA STATE AUTHORITIES
-- ============================================================================

INSERT INTO public.authorities (
  name, name_local, social_media, jurisdiction_type, jurisdiction_level,
  country, state, geohashes, issue_categories, priority, contact_info, status
) VALUES
-- Karnataka State Pollution Control Board
(
  'Karnataka State Pollution Control Board',
  'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಮಾಲಿನ್ಯ ನಿಯಂತ್ರಣ ಮಂಡಳಿ',
  '{"twitter": {"handle": "@KSPCB_Official", "verified": false, "active": true}}'::jsonb,
  'state', 2, 'IN', 'Karnataka',
  ARRAY['t', 'te', 'tdr']::text[], -- All Karnataka
  ARRAY['garbage', 'sewage', 'drainage', 'water_supply']::issue_category[],
  2,
  '{"website": "https://kspcb.gov.in", "phone": "080-25589472"}'::jsonb,
  'active'
);

-- ============================================================================
-- BANGALORE (BENGALURU) AUTHORITIES
-- ============================================================================

INSERT INTO public.authorities (
  name, name_local, social_media, jurisdiction_type, jurisdiction_level,
  country, state, city, geohashes, issue_categories, priority, contact_info, status
) VALUES
-- BBMP (Bruhat Bengaluru Mahanagara Palike)
(
  'BBMP',
  'ಬೃಹತ್ ಬೆಂಗಳೂರು ಮಹಾನಗರ ಪಾಲಿಕೆ',
  '{
    "twitter": {"handle": "@BBMPCOMM", "verified": true, "active": true},
    "facebook": {"handle": "BBMPOfficial", "verified": true},
    "whatsapp": {"number": "+918025589472", "businessVerified": false}
  }'::jsonb,
  'city', 3, 'IN', 'Karnataka', 'Bangalore',
  ARRAY['tdr1', 'tdr3', 'tdr4', 'tdr6']::text[], -- Bangalore geohash prefixes
  ARRAY['pothole', 'garbage', 'streetlight', 'drainage', 'parks', 'encroachment', 'stray_animals']::issue_category[],
  1, -- Primary authority
  '{
    "website": "https://bbmp.gov.in",
    "phone": "080-22660000",
    "tollFree": "1533",
    "email": "contact@bbmp.gov.in"
  }'::jsonb,
  'active'
),
-- Bangalore Traffic Police
(
  'Bangalore Traffic Police',
  'ಬೆಂಗಳೂರು ಟ್ರಾಫಿಕ್ ಪೊಲೀಸ್',
  '{
    "twitter": {"handle": "@BlrCityTraffic", "verified": true, "active": true},
    "instagram": {"handle": "bangaloretrafficpolice", "verified": true},
    "facebook": {"handle": "BangaloreTrafficPolice", "verified": true}
  }'::jsonb,
  'city', 3, 'IN', 'Karnataka', 'Bangalore',
  ARRAY['tdr1', 'tdr3', 'tdr4', 'tdr6']::text[],
  ARRAY['pothole', 'traffic_signal', 'encroachment']::issue_category[],
  1,
  '{
    "website": "https://traffic.bangalorepolice.gov.in",
    "phone": "080-22381111",
    "tollFree": "103"
  }'::jsonb,
  'active'
),
-- BWSSB (Bangalore Water Supply and Sewerage Board)
(
  'BWSSB',
  'ಬೆಂಗಳೂರು ನೀರು ಪೂರೈಕೆ ಮತ್ತು ಒಳಚರಂಡಿ ಮಂಡಳಿ',
  '{
    "twitter": {"handle": "@BWSSB_Official", "verified": true, "active": true}
  }'::jsonb,
  'city', 3, 'IN', 'Karnataka', 'Bangalore',
  ARRAY['tdr1', 'tdr3', 'tdr4', 'tdr6']::text[],
  ARRAY['water_supply', 'sewage', 'drainage']::issue_category[],
  1,
  '{
    "website": "https://bwssb.gov.in",
    "phone": "080-22205678",
    "tollFree": "1916"
  }'::jsonb,
  'active'
),
-- BESCOM (Bangalore Electricity Supply Company)
(
  'BESCOM',
  'ಬೆಂಗಳೂರು ವಿದ್ಯುತ್ ಪೂರೈಕೆ ಕಂಪನಿ',
  '{
    "twitter": {"handle": "@BESCOM_Official", "verified": true, "active": true}
  }'::jsonb,
  'city', 3, 'IN', 'Karnataka', 'Bangalore',
  ARRAY['tdr1', 'tdr3', 'tdr4', 'tdr6']::text[],
  ARRAY['streetlight']::issue_category[],
  1,
  '{
    "website": "https://bescom.karnataka.gov.in",
    "phone": "1912"
  }'::jsonb,
  'active'
);

-- ============================================================================
-- MUMBAI AUTHORITIES
-- ============================================================================

INSERT INTO public.authorities (
  name, name_local, social_media, jurisdiction_type, jurisdiction_level,
  country, state, city, geohashes, issue_categories, priority, contact_info, status
) VALUES
-- BMC (Brihanmumbai Municipal Corporation)
(
  'BMC',
  'बृहन्मुंबई महानगरपालिका',
  '{
    "twitter": {"handle": "@mybmc", "verified": true, "active": true},
    "facebook": {"handle": "mcgmofficial", "verified": true}
  }'::jsonb,
  'city', 3, 'IN', 'Maharashtra', 'Mumbai',
  ARRAY['te7', 'te6', 'tdr']::text[], -- Mumbai geohash prefixes
  ARRAY['pothole', 'garbage', 'streetlight', 'drainage', 'sewage', 'water_supply', 'parks']::issue_category[],
  1,
  '{
    "website": "https://portal.mcgm.gov.in",
    "phone": "022-22694727",
    "tollFree": "1916"
  }'::jsonb,
  'active'
),
-- Mumbai Traffic Police
(
  'Mumbai Traffic Police',
  'मुंबई वाहतूक पोलीस',
  '{
    "twitter": {"handle": "@MTPHereToHelp", "verified": true, "active": true}
  }'::jsonb,
  'city', 3, 'IN', 'Maharashtra', 'Mumbai',
  ARRAY['te7', 'te6', 'tdr']::text[],
  ARRAY['pothole', 'traffic_signal', 'encroachment']::issue_category[],
  1,
  '{
    "website": "https://traffic.mumbaicity police.gov.in",
    "phone": "022-22621855"
  }'::jsonb,
  'active'
);

-- ============================================================================
-- DELHI AUTHORITIES
-- ============================================================================

INSERT INTO public.authorities (
  name, name_local, social_media, jurisdiction_type, jurisdiction_level,
  country, state, city, geohashes, issue_categories, priority, contact_info, status
) VALUES
-- MCD (Municipal Corporation of Delhi)
(
  'Municipal Corporation of Delhi',
  'दिल्ली नगर निगम',
  '{
    "twitter": {"handle": "@MCD_Delhi", "verified": true, "active": true}
  }'::jsonb,
  'city', 3, 'IN', 'Delhi', 'Delhi',
  ARRAY['tt']::text[], -- Delhi geohash prefix
  ARRAY['pothole', 'garbage', 'streetlight', 'drainage', 'parks', 'stray_animals']::issue_category[],
  1,
  '{
    "website": "https://mcdonline.nic.in",
    "phone": "011-23378787",
    "tollFree": "311"
  }'::jsonb,
  'active'
),
-- Delhi Traffic Police
(
  'Delhi Traffic Police',
  'दिल्ली यातायात पुलिस',
  '{
    "twitter": {"handle": "@dtptraffic", "verified": true, "active": true}
  }'::jsonb,
  'city', 3, 'IN', 'Delhi', 'Delhi',
  ARRAY['tt']::text[],
  ARRAY['pothole', 'traffic_signal', 'encroachment']::issue_category[],
  1,
  '{
    "website": "https://delhitrafficpolice.nic.in",
    "phone": "1095"
  }'::jsonb,
  'active'
),
-- Delhi Jal Board
(
  'Delhi Jal Board',
  'दिल्ली जल बोर्ड',
  '{
    "twitter": {"handle": "@DelhiJalBoard", "verified": true, "active": true}
  }'::jsonb,
  'city', 3, 'IN', 'Delhi', 'Delhi',
  ARRAY['tt']::text[],
  ARRAY['water_supply', 'sewage', 'drainage']::issue_category[],
  1,
  '{
    "website": "https://www.djb.gov.in",
    "phone": "1916"
  }'::jsonb,
  'active'
);

-- ============================================================================
-- CHENNAI AUTHORITIES
-- ============================================================================

INSERT INTO public.authorities (
  name, name_local, social_media, jurisdiction_type, jurisdiction_level,
  country, state, city, geohashes, issue_categories, priority, contact_info, status
) VALUES
-- Greater Chennai Corporation
(
  'Greater Chennai Corporation',
  'பெரும் சென்னை மாநகராட்சி',
  '{
    "twitter": {"handle": "@chennaicorp", "verified": true, "active": true}
  }'::jsonb,
  'city', 3, 'IN', 'Tamil Nadu', 'Chennai',
  ARRAY['tdm']::text[], -- Chennai geohash prefix
  ARRAY['pothole', 'garbage', 'streetlight', 'drainage', 'sewage', 'water_supply', 'parks']::issue_category[],
  1,
  '{
    "website": "https://www.chennaicorporation.gov.in",
    "phone": "044-25619452",
    "tollFree": "1913"
  }'::jsonb,
  'active'
),
-- Chennai Traffic Police
(
  'Chennai Traffic Police',
  'சென்னை போக்குவரத்து காவல்துறை',
  '{
    "twitter": {"handle": "@ChennaiTraffic", "verified": false, "active": true}
  }'::jsonb,
  'city', 3, 'IN', 'Tamil Nadu', 'Chennai',
  ARRAY['tdm']::text[],
  ARRAY['pothole', 'traffic_signal', 'encroachment']::issue_category[],
  1,
  '{
    "phone": "103"
  }'::jsonb,
  'active'
);

-- Add more authorities as needed for your target cities
