/**
 * Indian Railway Stations Database
 * ~100 major stations with codes matching Indian Railways format
 */

export interface Station {
  code: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  zone: string;
}

export const stations: Station[] = [
  // Delhi NCR
  { code: 'NDLS', name: 'New Delhi', city: 'New Delhi', state: 'Delhi', lat: 28.6429, lng: 77.2195, zone: 'NR' },
  { code: 'DLI', name: 'Old Delhi Junction', city: 'New Delhi', state: 'Delhi', lat: 28.6614, lng: 77.2281, zone: 'NR' },
  { code: 'NZM', name: 'Hazrat Nizamuddin', city: 'New Delhi', state: 'Delhi', lat: 28.5893, lng: 77.2507, zone: 'NR' },
  { code: 'ANND', name: 'Anand Vihar Terminal', city: 'New Delhi', state: 'Delhi', lat: 28.6468, lng: 77.3152, zone: 'NR' },
  { code: 'GZB', name: 'Ghaziabad Junction', city: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6603, lng: 77.4380, zone: 'NR' },
  // Mumbai
  { code: 'BCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', lat: 18.9690, lng: 72.8194, zone: 'WR' },
  { code: 'CSTM', name: 'Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai', state: 'Maharashtra', lat: 18.9398, lng: 72.8355, zone: 'CR' },
  { code: 'LTT', name: 'Lokmanya Tilak Terminus', city: 'Mumbai', state: 'Maharashtra', lat: 19.0688, lng: 72.8888, zone: 'CR' },
  { code: 'BVI', name: 'Borivali', city: 'Mumbai', state: 'Maharashtra', lat: 19.2290, lng: 72.8567, zone: 'WR' },
  { code: 'TNA', name: 'Thane', city: 'Thane', state: 'Maharashtra', lat: 19.1860, lng: 72.9753, zone: 'CR' },
  // Bengaluru
  { code: 'SBC', name: 'KSR Bengaluru City Junction', city: 'Bengaluru', state: 'Karnataka', lat: 12.9784, lng: 77.5710, zone: 'SWR' },
  { code: 'YPR', name: 'Yesvantpur Junction', city: 'Bengaluru', state: 'Karnataka', lat: 13.0285, lng: 77.5535, zone: 'SWR' },
  { code: 'BNCE', name: 'Bengaluru Cantonment', city: 'Bengaluru', state: 'Karnataka', lat: 12.9996, lng: 77.5877, zone: 'SWR' },
  // Chennai
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, zone: 'SR' },
  { code: 'MS', name: 'Chennai Egmore', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0748, lng: 80.2612, zone: 'SR' },
  { code: 'TBM', name: 'Chennai Beach', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0941, lng: 80.2911, zone: 'SR' },
  // Hyderabad
  { code: 'SC', name: 'Secunderabad Junction', city: 'Hyderabad', state: 'Telangana', lat: 17.4344, lng: 78.5013, zone: 'SCR' },
  { code: 'HYB', name: 'Hyderabad Deccan (Nampally)', city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4713, zone: 'SCR' },
  { code: 'KCG', name: 'Kacheguda', city: 'Hyderabad', state: 'Telangana', lat: 17.3775, lng: 78.4868, zone: 'SCR' },
  // Kolkata
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal', lat: 22.5836, lng: 88.3427, zone: 'ER' },
  { code: 'SDAH', name: 'Sealdah', city: 'Kolkata', state: 'West Bengal', lat: 22.5654, lng: 88.3707, zone: 'ER' },
  { code: 'KOAA', name: 'Kolkata (Chitpur)', city: 'Kolkata', state: 'West Bengal', lat: 22.6009, lng: 88.3652, zone: 'ER' },
  // Jaipur
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan', lat: 26.9196, lng: 75.7878, zone: 'NWR' },
  // Ahmedabad
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.6006, zone: 'WR' },
  // Pune
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra', lat: 18.5285, lng: 73.8743, zone: 'CR' },
  // Lucknow
  { code: 'LKO', name: 'Lucknow Charbagh NR', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8306, lng: 80.9228, zone: 'NR' },
  { code: 'LJN', name: 'Lucknow Junction NER', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8580, lng: 80.9552, zone: 'NER' },
  // Kanpur
  { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4537, lng: 80.3501, zone: 'NCR' },
  // Varanasi
  { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3214, lng: 83.0079, zone: 'NER' },
  // Agra
  { code: 'AGC', name: 'Agra Cantt', city: 'Agra', state: 'Uttar Pradesh', lat: 27.1547, lng: 78.0102, zone: 'NCR' },
  // Bhopal
  { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2684, lng: 77.4122, zone: 'WCR' },
  // Nagpur
  { code: 'NGP', name: 'Nagpur Junction', city: 'Nagpur', state: 'Maharashtra', lat: 21.1473, lng: 79.0880, zone: 'CR' },
  // Patna
  { code: 'PNBE', name: 'Patna Junction', city: 'Patna', state: 'Bihar', lat: 25.6083, lng: 85.1335, zone: 'ECR' },
  // Guwahati
  { code: 'GHY', name: 'Guwahati', city: 'Guwahati', state: 'Assam', lat: 26.1740, lng: 91.7510, zone: 'NFR' },
  // Chandigarh
  { code: 'CDG', name: 'Chandigarh Junction', city: 'Chandigarh', state: 'Punjab', lat: 30.6901, lng: 76.7869, zone: 'NR' },
  // Trivandrum
  { code: 'TVC', name: 'Thiruvananthapuram Central', city: 'Thiruvananthapuram', state: 'Kerala', lat: 8.4908, lng: 76.9499, zone: 'SR' },
  // Kochi
  { code: 'ERS', name: 'Ernakulam Junction', city: 'Kochi', state: 'Kerala', lat: 9.9816, lng: 76.2999, zone: 'SR' },
  // Coimbatore
  { code: 'CBE', name: 'Coimbatore Junction', city: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0022, lng: 76.9667, zone: 'SR' },
  // Madurai
  { code: 'MDU', name: 'Madurai Junction', city: 'Madurai', state: 'Tamil Nadu', lat: 9.9271, lng: 78.1195, zone: 'SR' },
  // Mangalore
  { code: 'MAQ', name: 'Mangaluru Junction', city: 'Mangaluru', state: 'Karnataka', lat: 12.8660, lng: 74.8900, zone: 'SR' },
  // Mysore
  { code: 'MYS', name: 'Mysuru Junction', city: 'Mysuru', state: 'Karnataka', lat: 12.2968, lng: 76.6362, zone: 'SWR' },
  // Visakhapatnam
  { code: 'VSKP', name: 'Visakhapatnam Junction', city: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.7203, lng: 83.2263, zone: 'ECoR' },
  // Vijayawada
  { code: 'BZA', name: 'Vijayawada Junction', city: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5185, lng: 80.6224, zone: 'SCR' },
  // Tirupati
  { code: 'TPTY', name: 'Tirupati', city: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6333, lng: 79.4193, zone: 'SCR' },
  // Goa
  { code: 'MAO', name: 'Madgaon Junction', city: 'Margao', state: 'Goa', lat: 15.2720, lng: 73.9569, zone: 'KR' },
  { code: 'THVM', name: 'Thivim', city: 'Thivim', state: 'Goa', lat: 15.5336, lng: 73.9309, zone: 'KR' },
  // Dehradun
  { code: 'DDN', name: 'Dehradun', city: 'Dehradun', state: 'Uttarakhand', lat: 30.3198, lng: 78.0323, zone: 'NR' },
  // Jodhpur
  { code: 'JU', name: 'Jodhpur Junction', city: 'Jodhpur', state: 'Rajasthan', lat: 26.2886, lng: 73.0229, zone: 'NWR' },
  // Udaipur
  { code: 'UDZ', name: 'Udaipur City', city: 'Udaipur', state: 'Rajasthan', lat: 24.5810, lng: 73.6854, zone: 'NWR' },
  // Indore
  { code: 'INDB', name: 'Indore Junction', city: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8012, zone: 'WR' },
  // Ranchi
  { code: 'RNC', name: 'Ranchi Junction', city: 'Ranchi', state: 'Jharkhand', lat: 23.3495, lng: 85.3189, zone: 'SER' },
  // Raipur
  { code: 'R', name: 'Raipur Junction', city: 'Raipur', state: 'Chhattisgarh', lat: 21.2474, lng: 81.6327, zone: 'SECR' },
  // Bhubaneswar
  { code: 'BBS', name: 'Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', lat: 20.2716, lng: 85.8398, zone: 'ECoR' },
  // Puri
  { code: 'PURI', name: 'Puri', city: 'Puri', state: 'Odisha', lat: 19.8048, lng: 85.8318, zone: 'ECoR' },
  // Gorakhpur
  { code: 'GKP', name: 'Gorakhpur Junction', city: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.7500, lng: 83.3749, zone: 'NER' },
  // Allahabad (Prayagraj)
  { code: 'ALD', name: 'Prayagraj Junction', city: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4565, lng: 81.8458, zone: 'NCR' },
  // Amritsar
  { code: 'ASR', name: 'Amritsar Junction', city: 'Amritsar', state: 'Punjab', lat: 31.6386, lng: 74.8714, zone: 'NR' },
  // Jammu
  { code: 'JAT', name: 'Jammu Tawi', city: 'Jammu', state: 'Jammu & Kashmir', lat: 32.7340, lng: 74.8583, zone: 'NR' },
  // Surat
  { code: 'ST', name: 'Surat', city: 'Surat', state: 'Gujarat', lat: 21.2062, lng: 72.8409, zone: 'WR' },
  // Vadodara
  { code: 'BRC', name: 'Vadodara Junction', city: 'Vadodara', state: 'Gujarat', lat: 22.3102, lng: 73.1812, zone: 'WR' },
];

/** Search stations by query (name, city, code) */
export function searchStations(query: string): Station[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  return stations
    .filter(
      (s) =>
        s.code.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q)
    )
    .slice(0, 10);
}

/** Get station by code */
export function getStationByCode(code: string): Station | undefined {
  return stations.find((s) => s.code === code.toUpperCase());
}

/** Indian train classes */
export const trainClasses = [
  { code: '1A', name: 'First AC', description: 'Air-conditioned first class, 2-4 berth coupe' },
  { code: '2A', name: 'Second AC', description: 'Air-conditioned 2-tier, curtained berths' },
  { code: '3A', name: 'Third AC', description: 'Air-conditioned 3-tier, open berths' },
  { code: '3E', name: 'Third AC Economy', description: 'AC 3-tier economy, no side curtains' },
  { code: 'SL', name: 'Sleeper', description: 'Non-AC sleeper class, 3-tier berths' },
  { code: 'CC', name: 'Chair Car AC', description: 'Air-conditioned chair car (Shatabdi)' },
  { code: '2S', name: 'Second Sitting', description: 'Non-AC seated class' },
  { code: 'EA', name: 'Executive AC', description: 'Executive anubhuti class (Vande Bharat)' },
] as const;

/** Famous Indian trains */
export const famousTrains = [
  { number: '12301', name: 'Rajdhani Express', from: 'NDLS', to: 'HWH', type: 'Rajdhani' },
  { number: '12302', name: 'Rajdhani Express', from: 'HWH', to: 'NDLS', type: 'Rajdhani' },
  { number: '12951', name: 'Mumbai Rajdhani', from: 'BCT', to: 'NDLS', type: 'Rajdhani' },
  { number: '12001', name: 'Bhopal Shatabdi', from: 'NDLS', to: 'BPL', type: 'Shatabdi' },
  { number: '12002', name: 'Bhopal Shatabdi', from: 'BPL', to: 'NDLS', type: 'Shatabdi' },
  { number: '22691', name: 'Rajdhani Express', from: 'SBC', to: 'NDLS', type: 'Rajdhani' },
  { number: '12627', name: 'Karnataka Express', from: 'SBC', to: 'NDLS', type: 'Superfast' },
  { number: '12839', name: 'Chennai Mail', from: 'HWH', to: 'MAS', type: 'Mail' },
  { number: '22436', name: 'Vande Bharat Express', from: 'NDLS', to: 'BSB', type: 'Vande Bharat' },
  { number: '22439', name: 'Vande Bharat Express', from: 'NDLS', to: 'ADI', type: 'Vande Bharat' },
  { number: '12431', name: 'Trivandrum Rajdhani', from: 'NDLS', to: 'TVC', type: 'Rajdhani' },
  { number: '12621', name: 'Tamil Nadu Express', from: 'NDLS', to: 'MAS', type: 'Superfast' },
  { number: '12259', name: 'Duronto Express', from: 'SDAH', to: 'NDLS', type: 'Duronto' },
  { number: '12309', name: 'Rajdhani Express', from: 'PNBE', to: 'NDLS', type: 'Rajdhani' },
  { number: '12049', name: 'Gatimaan Express', from: 'NDLS', to: 'AGC', type: 'Gatimaan' },
];
