/**
 * Indian Airports Database
 * ~60 major airports with IATA codes, city names, and coordinates
 */

export interface Airport {
  iata: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export const airports: Airport[] = [
  // Tier 1
  { iata: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', state: 'Delhi', lat: 28.5562, lng: 77.1000 },
  { iata: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', state: 'Maharashtra', lat: 19.0896, lng: 72.8656 },
  { iata: 'BLR', name: 'Kempegowda International Airport', city: 'Bengaluru', state: 'Karnataka', lat: 13.1986, lng: 77.7066 },
  { iata: 'MAA', name: 'Chennai International Airport', city: 'Chennai', state: 'Tamil Nadu', lat: 12.9941, lng: 80.1709 },
  { iata: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', state: 'Telangana', lat: 17.2403, lng: 78.4294 },
  { iata: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', state: 'West Bengal', lat: 22.6547, lng: 88.4467 },
  // Tier 2
  { iata: 'COK', name: 'Cochin International Airport', city: 'Kochi', state: 'Kerala', lat: 10.1520, lng: 76.4019 },
  { iata: 'GOI', name: 'Goa International Airport (Dabolim)', city: 'Goa', state: 'Goa', lat: 15.3808, lng: 73.8314 },
  { iata: 'PNQ', name: 'Pune Airport', city: 'Pune', state: 'Maharashtra', lat: 18.5822, lng: 73.9197 },
  { iata: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', state: 'Gujarat', lat: 23.0772, lng: 72.6347 },
  { iata: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur', state: 'Rajasthan', lat: 26.8242, lng: 75.8122 },
  { iata: 'LKO', name: 'Chaudhary Charan Singh International Airport', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.7606, lng: 80.8893 },
  { iata: 'GAU', name: 'Lokpriya Gopinath Bordoloi International Airport', city: 'Guwahati', state: 'Assam', lat: 26.1061, lng: 91.5858 },
  { iata: 'TRV', name: 'Trivandrum International Airport', city: 'Thiruvananthapuram', state: 'Kerala', lat: 8.4821, lng: 76.9200 },
  { iata: 'VTZ', name: 'Visakhapatnam Airport', city: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.7212, lng: 83.2245 },
  { iata: 'IXC', name: 'Chandigarh Airport', city: 'Chandigarh', state: 'Punjab', lat: 30.6735, lng: 76.7885 },
  { iata: 'PAT', name: 'Jay Prakash Narayan International Airport', city: 'Patna', state: 'Bihar', lat: 25.5913, lng: 85.0880 },
  { iata: 'BBI', name: 'Biju Patnaik International Airport', city: 'Bhubaneswar', state: 'Odisha', lat: 20.2444, lng: 85.8177 },
  { iata: 'IXB', name: 'Bagdogra Airport', city: 'Siliguri', state: 'West Bengal', lat: 26.6812, lng: 88.3286 },
  { iata: 'NAG', name: 'Dr. Babasaheb Ambedkar International Airport', city: 'Nagpur', state: 'Maharashtra', lat: 21.0922, lng: 79.0472 },
  { iata: 'IDR', name: 'Devi Ahilyabai Holkar Airport', city: 'Indore', state: 'Madhya Pradesh', lat: 22.7217, lng: 75.8011 },
  { iata: 'SXR', name: 'Srinagar Airport', city: 'Srinagar', state: 'Jammu & Kashmir', lat: 33.9871, lng: 74.7742 },
  { iata: 'IXA', name: 'Agartala Airport', city: 'Agartala', state: 'Tripura', lat: 23.8870, lng: 91.2404 },
  { iata: 'RPR', name: 'Swami Vivekananda Airport', city: 'Raipur', state: 'Chhattisgarh', lat: 21.1804, lng: 81.7388 },
  { iata: 'VNS', name: 'Lal Bahadur Shastri Airport', city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.4524, lng: 82.8593 },
  { iata: 'IXR', name: 'Birsa Munda Airport', city: 'Ranchi', state: 'Jharkhand', lat: 23.3143, lng: 85.3217 },
  { iata: 'UDR', name: 'Maharana Pratap Airport', city: 'Udaipur', state: 'Rajasthan', lat: 24.6177, lng: 73.8961 },
  { iata: 'CJB', name: 'Coimbatore International Airport', city: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0300, lng: 77.0434 },
  { iata: 'IXM', name: 'Madurai Airport', city: 'Madurai', state: 'Tamil Nadu', lat: 9.8345, lng: 78.0934 },
  { iata: 'TRZ', name: 'Tiruchirappalli International Airport', city: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.7654, lng: 78.7097 },
  { iata: 'MYQ', name: 'Mysore Airport', city: 'Mysuru', state: 'Karnataka', lat: 12.2303, lng: 76.6555 },
  { iata: 'HBX', name: 'Hubli Airport', city: 'Hubballi', state: 'Karnataka', lat: 15.3617, lng: 75.0849 },
  { iata: 'IXE', name: 'Mangalore International Airport', city: 'Mangaluru', state: 'Karnataka', lat: 12.9614, lng: 74.8901 },
  { iata: 'RAJ', name: 'Rajkot Airport', city: 'Rajkot', state: 'Gujarat', lat: 22.3092, lng: 70.7795 },
  { iata: 'BDQ', name: 'Vadodara Airport', city: 'Vadodara', state: 'Gujarat', lat: 22.3362, lng: 73.2264 },
  { iata: 'STV', name: 'Surat Airport', city: 'Surat', state: 'Gujarat', lat: 21.1141, lng: 72.7418 },
  { iata: 'IXJ', name: 'Jammu Airport', city: 'Jammu', state: 'Jammu & Kashmir', lat: 32.6891, lng: 74.8374 },
  { iata: 'IXL', name: 'Kushok Bakula Rimpochee Airport', city: 'Leh', state: 'Ladakh', lat: 34.1359, lng: 77.5465 },
  { iata: 'DED', name: 'Jolly Grant Airport', city: 'Dehradun', state: 'Uttarakhand', lat: 30.1897, lng: 78.1803 },
  { iata: 'KUU', name: 'Kullu–Manali Airport', city: 'Kullu', state: 'Himachal Pradesh', lat: 31.8767, lng: 77.1544 },
  { iata: 'IMF', name: 'Imphal Airport', city: 'Imphal', state: 'Manipur', lat: 24.7600, lng: 93.8967 },
  { iata: 'DIB', name: 'Dibrugarh Airport', city: 'Dibrugarh', state: 'Assam', lat: 27.4839, lng: 95.0169 },
  { iata: 'JLR', name: 'Jabalpur Airport', city: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1778, lng: 80.0520 },
  { iata: 'BHO', name: 'Raja Bhoj Airport', city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2875, lng: 77.3374 },
  { iata: 'GOP', name: 'Gorakhpur Airport', city: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.7397, lng: 83.4497 },
  { iata: 'AGR', name: 'Agra Airport', city: 'Agra', state: 'Uttar Pradesh', lat: 27.1558, lng: 77.9609 },
  { iata: 'JDH', name: 'Jodhpur Airport', city: 'Jodhpur', state: 'Rajasthan', lat: 26.2511, lng: 73.0489 },
  { iata: 'KLR', name: 'Kalaburagi Airport', city: 'Kalaburagi', state: 'Karnataka', lat: 17.5208, lng: 76.8000 },
  { iata: 'GOX', name: 'Manohar International Airport', city: 'North Goa', state: 'Goa', lat: 15.7383, lng: 73.8317 },
  { iata: 'CCJ', name: 'Calicut International Airport', city: 'Kozhikode', state: 'Kerala', lat: 11.1368, lng: 75.9553 },
  { iata: 'CNN', name: 'Kannur International Airport', city: 'Kannur', state: 'Kerala', lat: 11.9187, lng: 75.5474 },
];

/** Search airports by query (name, city, IATA code) */
export function searchAirports(query: string): Airport[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  return airports
    .filter(
      (a) =>
        a.iata.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.state.toLowerCase().includes(q)
    )
    .slice(0, 10);
}

/** Get airport by IATA code */
export function getAirportByIata(iata: string): Airport | undefined {
  return airports.find((a) => a.iata === iata.toUpperCase());
}
