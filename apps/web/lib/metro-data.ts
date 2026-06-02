/**
 * Indian Metro Systems Data
 * Complete data for Delhi, Bangalore, Mumbai, Hyderabad, Chennai metros
 */

export interface MetroLine {
  id: string;
  name: string;
  color: string;
  colorHex: string;
  stations: MetroStation[];
  firstTrain: string;
  lastTrain: string;
}

export interface MetroStation {
  id: string;
  name: string;
  nameHindi?: string;
  lat: number;
  lng: number;
  interchange?: string[];
}

export interface MetroCity {
  id: string;
  name: string;
  fullName: string;
  lines: MetroLine[];
  baseFare: number;
  farePerKm: number;
  fareSlabs: { maxKm: number; fare: number }[];
}

export const metroCities: MetroCity[] = [
  {
    id: 'delhi',
    name: 'Delhi',
    fullName: 'Delhi Metro Rail Corporation (DMRC)',
    baseFare: 10,
    farePerKm: 1.8,
    fareSlabs: [
      { maxKm: 2, fare: 10 },
      { maxKm: 5, fare: 20 },
      { maxKm: 12, fare: 30 },
      { maxKm: 21, fare: 40 },
      { maxKm: 32, fare: 50 },
      { maxKm: 999, fare: 60 },
    ],
    lines: [
      {
        id: 'red',
        name: 'Red Line',
        color: 'red',
        colorHex: '#e21b22',
        firstTrain: '05:30',
        lastTrain: '23:30',
        stations: [
          { id: 'rl-1', name: 'Shaheed Sthal (New Bus Adda)', lat: 28.7226, lng: 77.3257 },
          { id: 'rl-2', name: 'Hindon River', lat: 28.7136, lng: 77.3221 },
          { id: 'rl-3', name: 'Arthala', lat: 28.7054, lng: 77.3172 },
          { id: 'rl-4', name: 'Mohan Nagar', lat: 28.6934, lng: 77.3080 },
          { id: 'rl-5', name: 'Shyam Park', lat: 28.6842, lng: 77.2975 },
          { id: 'rl-6', name: 'Major Mohit Sharma Rajendra Nagar', lat: 28.6741, lng: 77.2815 },
          { id: 'rl-7', name: 'Raj Bagh', lat: 28.6714, lng: 77.2698 },
          { id: 'rl-8', name: 'Shaheed Nagar', lat: 28.6702, lng: 77.2569 },
          { id: 'rl-9', name: 'Dilshad Garden', lat: 28.6754, lng: 77.3187 },
          { id: 'rl-10', name: 'Jhilmil', lat: 28.6736, lng: 77.3083 },
          { id: 'rl-11', name: 'Mansarovar Park', lat: 28.6719, lng: 77.2875 },
          { id: 'rl-12', name: 'Shahdara', lat: 28.6739, lng: 77.2395 },
          { id: 'rl-13', name: 'Welcome', lat: 28.6756, lng: 77.2268 },
          { id: 'rl-14', name: 'Seelampur', lat: 28.6773, lng: 77.2151 },
          { id: 'rl-15', name: 'Shastri Park', lat: 28.6710, lng: 77.2228 },
          { id: 'rl-16', name: 'Kashmere Gate', lat: 28.6674, lng: 77.2286, interchange: ['Yellow Line', 'Violet Line'] },
          { id: 'rl-17', name: 'Tis Hazari', lat: 28.6659, lng: 77.2167 },
          { id: 'rl-18', name: 'Pul Bangash', lat: 28.6613, lng: 77.2044 },
          { id: 'rl-19', name: 'Pratap Nagar', lat: 28.6569, lng: 77.1937 },
          { id: 'rl-20', name: 'Shastri Nagar', lat: 28.6533, lng: 77.1809 },
          { id: 'rl-21', name: 'Inderlok', lat: 28.6530, lng: 77.1712, interchange: ['Green Line'] },
          { id: 'rl-22', name: 'Kanhaiya Nagar', lat: 28.6630, lng: 77.1636 },
          { id: 'rl-23', name: 'Keshav Puram', lat: 28.6727, lng: 77.1556 },
          { id: 'rl-24', name: 'Netaji Subhash Place', lat: 28.6849, lng: 77.1527, interchange: ['Pink Line'] },
          { id: 'rl-25', name: 'Kohat Enclave', lat: 28.6933, lng: 77.1428 },
          { id: 'rl-26', name: 'Pitampura', lat: 28.7001, lng: 77.1316 },
          { id: 'rl-27', name: 'Rohini East', lat: 28.7063, lng: 77.1178 },
          { id: 'rl-28', name: 'Rohini West', lat: 28.7096, lng: 77.1056 },
          { id: 'rl-29', name: 'Rithala', lat: 28.7206, lng: 77.1072 },
        ],
      },
      {
        id: 'yellow',
        name: 'Yellow Line',
        color: 'yellow',
        colorHex: '#f5c518',
        firstTrain: '05:30',
        lastTrain: '23:30',
        stations: [
          { id: 'yl-1', name: 'Samaypur Badli', lat: 28.7448, lng: 77.1371 },
          { id: 'yl-2', name: 'Rohini Sector 18/19', lat: 28.7371, lng: 77.1365 },
          { id: 'yl-3', name: 'Haiderpur Badli Mor', lat: 28.7264, lng: 77.1392 },
          { id: 'yl-4', name: 'Jahangirpuri', lat: 28.7251, lng: 77.1628 },
          { id: 'yl-5', name: 'Adarsh Nagar', lat: 28.7157, lng: 77.1697 },
          { id: 'yl-6', name: 'Azadpur', lat: 28.7064, lng: 77.1771, interchange: ['Pink Line'] },
          { id: 'yl-7', name: 'Model Town', lat: 28.6998, lng: 77.1896 },
          { id: 'yl-8', name: 'GTB Nagar', lat: 28.6895, lng: 77.2005 },
          { id: 'yl-9', name: 'Vishwavidyalaya', lat: 28.6828, lng: 77.2102 },
          { id: 'yl-10', name: 'Vidhan Sabha', lat: 28.6762, lng: 77.2203 },
          { id: 'yl-11', name: 'Civil Lines', lat: 28.6722, lng: 77.2295 },
          { id: 'yl-12', name: 'Kashmere Gate', lat: 28.6674, lng: 77.2286, interchange: ['Red Line', 'Violet Line'] },
          { id: 'yl-13', name: 'Chandni Chowk', lat: 28.6565, lng: 77.2306 },
          { id: 'yl-14', name: 'Chawri Bazar', lat: 28.6498, lng: 77.2260 },
          { id: 'yl-15', name: 'New Delhi', lat: 28.6429, lng: 77.2195, interchange: ['Airport Express'] },
          { id: 'yl-16', name: 'Rajiv Chowk', lat: 28.6328, lng: 77.2197, interchange: ['Blue Line'] },
          { id: 'yl-17', name: 'Patel Chowk', lat: 28.6227, lng: 77.2144 },
          { id: 'yl-18', name: 'Central Secretariat', lat: 28.6146, lng: 77.2113, interchange: ['Violet Line'] },
          { id: 'yl-19', name: 'Udyog Bhawan', lat: 28.6090, lng: 77.2097 },
          { id: 'yl-20', name: 'Lok Kalyan Marg', lat: 28.5991, lng: 77.2001 },
          { id: 'yl-21', name: 'Jor Bagh', lat: 28.5892, lng: 77.2088 },
          { id: 'yl-22', name: 'INA', lat: 28.5790, lng: 77.2095 },
          { id: 'yl-23', name: 'AIIMS', lat: 28.5689, lng: 77.2081 },
          { id: 'yl-24', name: 'Green Park', lat: 28.5593, lng: 77.2068 },
          { id: 'yl-25', name: 'Hauz Khas', lat: 28.5432, lng: 77.2065, interchange: ['Magenta Line'] },
          { id: 'yl-26', name: 'Malviya Nagar', lat: 28.5277, lng: 77.2079 },
          { id: 'yl-27', name: 'Saket', lat: 28.5213, lng: 77.2128 },
          { id: 'yl-28', name: 'Qutab Minar', lat: 28.5134, lng: 77.1854 },
          { id: 'yl-29', name: 'Chhatarpur', lat: 28.5067, lng: 77.1751 },
          { id: 'yl-30', name: 'Sultanpur', lat: 28.4969, lng: 77.1614 },
          { id: 'yl-31', name: 'Ghitorni', lat: 28.4881, lng: 77.1500 },
          { id: 'yl-32', name: 'Arjan Garh', lat: 28.4777, lng: 77.1392 },
          { id: 'yl-33', name: 'Guru Dronacharya', lat: 28.4681, lng: 77.1034 },
          { id: 'yl-34', name: 'Sikanderpur', lat: 28.4572, lng: 77.0896 },
          { id: 'yl-35', name: 'MG Road', lat: 28.4483, lng: 77.0758 },
          { id: 'yl-36', name: 'IFFCO Chowk', lat: 28.4398, lng: 77.0693 },
          { id: 'yl-37', name: 'HUDA City Centre', lat: 28.4593, lng: 77.0723 },
        ],
      },
      {
        id: 'blue',
        name: 'Blue Line',
        color: 'blue',
        colorHex: '#0043a5',
        firstTrain: '05:30',
        lastTrain: '23:30',
        stations: [
          { id: 'bl-1', name: 'Noida Electronic City', lat: 28.5653, lng: 77.3705 },
          { id: 'bl-2', name: 'Noida Sector 62', lat: 28.6154, lng: 77.3636 },
          { id: 'bl-3', name: 'Noida Sector 59', lat: 28.6067, lng: 77.3601 },
          { id: 'bl-4', name: 'Noida Sector 61', lat: 28.6023, lng: 77.3572 },
          { id: 'bl-5', name: 'Noida Sector 52', lat: 28.5945, lng: 77.3365 },
          { id: 'bl-6', name: 'Noida Sector 34', lat: 28.5779, lng: 77.3291 },
          { id: 'bl-7', name: 'Noida City Centre', lat: 28.5721, lng: 77.3218 },
          { id: 'bl-8', name: 'Noida Golf Course', lat: 28.5611, lng: 77.3356 },
          { id: 'bl-9', name: 'Botanical Garden', lat: 28.5628, lng: 77.3400, interchange: ['Magenta Line'] },
          { id: 'bl-10', name: 'Yamuna Bank', lat: 28.6227, lng: 77.2789 },
          { id: 'bl-11', name: 'Indraprastha', lat: 28.6179, lng: 77.2465 },
          { id: 'bl-12', name: 'Pragati Maidan', lat: 28.6207, lng: 77.2389 },
          { id: 'bl-13', name: 'Mandi House', lat: 28.6259, lng: 77.2336, interchange: ['Violet Line'] },
          { id: 'bl-14', name: 'Barakhamba Road', lat: 28.6318, lng: 77.2294 },
          { id: 'bl-15', name: 'Rajiv Chowk', lat: 28.6328, lng: 77.2197, interchange: ['Yellow Line'] },
          { id: 'bl-16', name: 'RK Ashram Marg', lat: 28.6392, lng: 77.2126 },
          { id: 'bl-17', name: 'Jhandewalan', lat: 28.6444, lng: 77.2012 },
          { id: 'bl-18', name: 'Karol Bagh', lat: 28.6517, lng: 77.1901 },
          { id: 'bl-19', name: 'Rajendra Place', lat: 28.6424, lng: 77.1774 },
          { id: 'bl-20', name: 'Patel Nagar', lat: 28.6505, lng: 77.1617 },
          { id: 'bl-21', name: 'Shadipur', lat: 28.6528, lng: 77.1553 },
          { id: 'bl-22', name: 'Kirti Nagar', lat: 28.6538, lng: 77.1461 },
          { id: 'bl-23', name: 'Moti Nagar', lat: 28.6547, lng: 77.1375 },
          { id: 'bl-24', name: 'Ramesh Nagar', lat: 28.6518, lng: 77.1276 },
          { id: 'bl-25', name: 'Rajouri Garden', lat: 28.6490, lng: 77.1191 },
          { id: 'bl-26', name: 'Tagore Garden', lat: 28.6438, lng: 77.1064 },
          { id: 'bl-27', name: 'Subhash Nagar', lat: 28.6403, lng: 77.0936 },
          { id: 'bl-28', name: 'Tilak Nagar', lat: 28.6389, lng: 77.0868 },
          { id: 'bl-29', name: 'Janakpuri East', lat: 28.6342, lng: 77.0786, interchange: ['Magenta Line'] },
          { id: 'bl-30', name: 'Janakpuri West', lat: 28.6301, lng: 77.0635 },
          { id: 'bl-31', name: 'Uttam Nagar East', lat: 28.6253, lng: 77.0489 },
          { id: 'bl-32', name: 'Uttam Nagar West', lat: 28.6222, lng: 77.0408 },
          { id: 'bl-33', name: 'Nawada', lat: 28.6165, lng: 77.0352 },
          { id: 'bl-34', name: 'Dwarka Mor', lat: 28.6070, lng: 77.0320 },
          { id: 'bl-35', name: 'Dwarka', lat: 28.5939, lng: 77.0286 },
          { id: 'bl-36', name: 'Dwarka Sector 14', lat: 28.5880, lng: 77.0316 },
          { id: 'bl-37', name: 'Dwarka Sector 13', lat: 28.5770, lng: 77.0366 },
          { id: 'bl-38', name: 'Dwarka Sector 9', lat: 28.5778, lng: 77.0619 },
          { id: 'bl-39', name: 'Dwarka Sector 8', lat: 28.5678, lng: 77.0714 },
          { id: 'bl-40', name: 'Dwarka Sector 21', lat: 28.5523, lng: 77.0589 },
        ],
      },
    ],
  },
  {
    id: 'bangalore',
    name: 'Bengaluru',
    fullName: 'Bangalore Metro Rail Corporation Limited (BMRCL)',
    baseFare: 10,
    farePerKm: 1.5,
    fareSlabs: [
      { maxKm: 2, fare: 10 },
      { maxKm: 5, fare: 20 },
      { maxKm: 10, fare: 30 },
      { maxKm: 15, fare: 40 },
      { maxKm: 20, fare: 50 },
      { maxKm: 999, fare: 60 },
    ],
    lines: [
      {
        id: 'purple',
        name: 'Purple Line',
        color: 'purple',
        colorHex: '#7b1fa2',
        firstTrain: '05:00',
        lastTrain: '23:00',
        stations: [
          { id: 'pl-1', name: 'Whitefield (Kadugodi)', lat: 12.9960, lng: 77.7543 },
          { id: 'pl-2', name: 'Hopefarm Channasandra', lat: 12.9902, lng: 77.7383 },
          { id: 'pl-3', name: 'Kadugodi Tree Park', lat: 12.9871, lng: 77.7197 },
          { id: 'pl-4', name: 'Pattandur Agrahar', lat: 12.9842, lng: 77.7065 },
          { id: 'pl-5', name: 'Sri Sathya Sai Hospital', lat: 12.9802, lng: 77.6895 },
          { id: 'pl-6', name: 'Nallurhalli', lat: 12.9790, lng: 77.6710 },
          { id: 'pl-7', name: 'Kundalahalli', lat: 12.9769, lng: 77.6578 },
          { id: 'pl-8', name: 'Sitharama Palya', lat: 12.9742, lng: 77.6440 },
          { id: 'pl-9', name: 'Hoodi Junction', lat: 12.9710, lng: 77.6310 },
          { id: 'pl-10', name: 'Garudacharpalya', lat: 12.9690, lng: 77.6140 },
          { id: 'pl-11', name: 'Mahadevapura', lat: 12.9670, lng: 77.5960 },
          { id: 'pl-12', name: 'Krishnarajapura', lat: 12.9660, lng: 77.5830 },
          { id: 'pl-13', name: 'Benniganahalli', lat: 12.9641, lng: 77.5698 },
          { id: 'pl-14', name: 'Baiyappanahalli', lat: 12.9909, lng: 77.6428 },
          { id: 'pl-15', name: 'Swami Vivekananda Road', lat: 12.9857, lng: 77.6076 },
          { id: 'pl-16', name: 'Indiranagar', lat: 12.9781, lng: 77.6408 },
          { id: 'pl-17', name: 'Halasuru', lat: 12.9784, lng: 77.6139 },
          { id: 'pl-18', name: 'Trinity', lat: 12.9719, lng: 77.6085 },
          { id: 'pl-19', name: 'Mahatma Gandhi Road', lat: 12.9757, lng: 77.6070 },
          { id: 'pl-20', name: 'Cubbon Park', lat: 12.9748, lng: 77.5913 },
          { id: 'pl-21', name: 'Dr. B.R. Ambedkar Station (Vidhana Soudha)', lat: 12.9724, lng: 77.5823 },
          { id: 'pl-22', name: 'Sir M. Visveshwaraya Station (Central College)', lat: 12.9768, lng: 77.5753 },
          { id: 'pl-23', name: 'Nadaprabhu Kempegowda Station (Majestic)', lat: 12.9776, lng: 77.5726, interchange: ['Green Line'] },
          { id: 'pl-24', name: 'KSR City Railway Station', lat: 12.9784, lng: 77.5710 },
          { id: 'pl-25', name: 'Magadi Road', lat: 12.9806, lng: 77.5494 },
          { id: 'pl-26', name: 'Hosahalli', lat: 12.9850, lng: 77.5220 },
          { id: 'pl-27', name: 'Vijayanagar', lat: 12.9712, lng: 77.5299 },
          { id: 'pl-28', name: 'Attiguppe', lat: 12.9613, lng: 77.5343 },
          { id: 'pl-29', name: 'Deepanjali Nagar', lat: 12.9518, lng: 77.5198 },
          { id: 'pl-30', name: 'Mysuru Road', lat: 12.9458, lng: 77.5168 },
          { id: 'pl-31', name: 'Nayandahalli', lat: 12.9569, lng: 77.4948 },
          { id: 'pl-32', name: 'Rajarajeshwari Nagar', lat: 12.9288, lng: 77.5111 },
          { id: 'pl-33', name: 'Jnana Bharati', lat: 12.9139, lng: 77.5025 },
          { id: 'pl-34', name: 'Pattanagere', lat: 12.9172, lng: 77.4866 },
          { id: 'pl-35', name: 'Kengeri Bus Terminal', lat: 12.9117, lng: 77.4822 },
          { id: 'pl-36', name: 'Kengeri', lat: 12.9071, lng: 77.4700 },
          { id: 'pl-37', name: 'Challaghatta', lat: 12.9019, lng: 77.4586 },
        ],
      },
      {
        id: 'green',
        name: 'Green Line',
        color: 'green',
        colorHex: '#4caf50',
        firstTrain: '05:00',
        lastTrain: '23:00',
        stations: [
          { id: 'gl-1', name: 'Nagasandra', lat: 13.0429, lng: 77.5143 },
          { id: 'gl-2', name: 'Dasarahalli', lat: 13.0326, lng: 77.5180 },
          { id: 'gl-3', name: 'Jalahalli', lat: 13.0259, lng: 77.5337 },
          { id: 'gl-4', name: 'Peenya Industry', lat: 13.0182, lng: 77.5208 },
          { id: 'gl-5', name: 'Peenya', lat: 13.0122, lng: 77.5228 },
          { id: 'gl-6', name: 'Goraguntepalya', lat: 13.0101, lng: 77.5302 },
          { id: 'gl-7', name: 'Yeshwanthpur', lat: 13.0093, lng: 77.5494 },
          { id: 'gl-8', name: 'Sandal Soap Factory', lat: 13.0013, lng: 77.5549 },
          { id: 'gl-9', name: 'Mahalakshmi', lat: 12.9954, lng: 77.5572 },
          { id: 'gl-10', name: 'Rajajinagar', lat: 12.9909, lng: 77.5597 },
          { id: 'gl-11', name: 'Kuvempu Road', lat: 12.9893, lng: 77.5705 },
          { id: 'gl-12', name: 'Srirampura', lat: 12.9855, lng: 77.5637 },
          { id: 'gl-13', name: 'Mantri Square Sampige Road', lat: 12.9842, lng: 77.5700 },
          { id: 'gl-14', name: 'Nadaprabhu Kempegowda Station (Majestic)', lat: 12.9776, lng: 77.5726, interchange: ['Purple Line'] },
          { id: 'gl-15', name: 'Chickpete', lat: 12.9689, lng: 77.5781 },
          { id: 'gl-16', name: 'Krishna Rajendra Market', lat: 12.9619, lng: 77.5787 },
          { id: 'gl-17', name: 'National College', lat: 12.9570, lng: 77.5780 },
          { id: 'gl-18', name: 'Lalbagh', lat: 12.9504, lng: 77.5766 },
          { id: 'gl-19', name: 'South End Circle', lat: 12.9423, lng: 77.5759 },
          { id: 'gl-20', name: 'Jayanagar', lat: 12.9298, lng: 77.5821 },
          { id: 'gl-21', name: 'RV Road', lat: 12.9253, lng: 77.5813 },
          { id: 'gl-22', name: 'Banashankari', lat: 12.9177, lng: 77.5734 },
          { id: 'gl-23', name: 'JP Nagar', lat: 12.9068, lng: 77.5820 },
          { id: 'gl-24', name: 'Yelachenahalli', lat: 12.8977, lng: 77.5713 },
          { id: 'gl-25', name: 'Konanakunte Cross', lat: 12.8770, lng: 77.5763 },
          { id: 'gl-26', name: 'Doddakallasandra', lat: 12.8641, lng: 77.5666 },
          { id: 'gl-27', name: 'Vajarahalli', lat: 12.8493, lng: 77.5694 },
          { id: 'gl-28', name: 'Thalaghattapura', lat: 12.8350, lng: 77.5610 },
          { id: 'gl-29', name: 'Silk Institute', lat: 12.8268, lng: 77.5528 },
        ],
      },
    ],
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    fullName: 'Mumbai Metro Rail Corporation (MMRC)',
    baseFare: 10,
    farePerKm: 2.0,
    fareSlabs: [
      { maxKm: 3, fare: 10 },
      { maxKm: 6, fare: 20 },
      { maxKm: 9, fare: 30 },
      { maxKm: 12, fare: 40 },
      { maxKm: 999, fare: 50 },
    ],
    lines: [
      {
        id: 'line1',
        name: 'Line 1 (Blue)',
        color: 'blue',
        colorHex: '#0277bd',
        firstTrain: '05:30',
        lastTrain: '23:30',
        stations: [
          { id: 'ml1-1', name: 'Versova', lat: 19.1271, lng: 72.8181 },
          { id: 'ml1-2', name: 'D.N. Nagar', lat: 19.1278, lng: 72.8311 },
          { id: 'ml1-3', name: 'Azad Nagar', lat: 19.1266, lng: 72.8434 },
          { id: 'ml1-4', name: 'Andheri', lat: 19.1197, lng: 72.8468 },
          { id: 'ml1-5', name: 'Western Express Highway', lat: 19.1082, lng: 72.8575 },
          { id: 'ml1-6', name: 'Chakala (J.B. Nagar)', lat: 19.1033, lng: 72.8652 },
          { id: 'ml1-7', name: 'Airport Road', lat: 19.0996, lng: 72.8726 },
          { id: 'ml1-8', name: 'Marol Naka', lat: 19.1019, lng: 72.8846 },
          { id: 'ml1-9', name: 'Saki Naka', lat: 19.0910, lng: 72.8872 },
          { id: 'ml1-10', name: 'Asalpha', lat: 19.0847, lng: 72.8937 },
          { id: 'ml1-11', name: 'Jagruti Nagar', lat: 19.0805, lng: 72.8981 },
          { id: 'ml1-12', name: 'Ghatkopar', lat: 19.0860, lng: 72.9082 },
        ],
      },
    ],
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    fullName: 'Hyderabad Metro Rail Limited (HMRL)',
    baseFare: 10,
    farePerKm: 1.5,
    fareSlabs: [
      { maxKm: 2, fare: 10 },
      { maxKm: 5, fare: 20 },
      { maxKm: 10, fare: 30 },
      { maxKm: 15, fare: 40 },
      { maxKm: 999, fare: 55 },
    ],
    lines: [
      {
        id: 'red-hyd',
        name: 'Red Line',
        color: 'red',
        colorHex: '#e53935',
        firstTrain: '06:00',
        lastTrain: '22:00',
        stations: [
          { id: 'hrl-1', name: 'Miyapur', lat: 17.4966, lng: 78.3579 },
          { id: 'hrl-2', name: 'JNTU College', lat: 17.4931, lng: 78.3803 },
          { id: 'hrl-3', name: 'KPHB Colony', lat: 17.4884, lng: 78.3924 },
          { id: 'hrl-4', name: 'Kukatpally', lat: 17.4834, lng: 78.4047 },
          { id: 'hrl-5', name: 'Balanagar', lat: 17.4779, lng: 78.4323 },
          { id: 'hrl-6', name: 'Moosapet', lat: 17.4661, lng: 78.4378 },
          { id: 'hrl-7', name: 'Bharat Nagar', lat: 17.4578, lng: 78.4393 },
          { id: 'hrl-8', name: 'Erragadda', lat: 17.4459, lng: 78.4413 },
          { id: 'hrl-9', name: 'ESI Hospital', lat: 17.4359, lng: 78.4413 },
          { id: 'hrl-10', name: 'SR Nagar', lat: 17.4351, lng: 78.4479 },
          { id: 'hrl-11', name: 'Ameerpet', lat: 17.4375, lng: 78.4482, interchange: ['Blue Line'] },
          { id: 'hrl-12', name: 'Punjagutta', lat: 17.4301, lng: 78.4499 },
          { id: 'hrl-13', name: 'Irrum Manzil', lat: 17.4251, lng: 78.4534 },
          { id: 'hrl-14', name: 'Khairatabad', lat: 17.4219, lng: 78.4620 },
          { id: 'hrl-15', name: 'Lakdi Ka Pul', lat: 17.4100, lng: 78.4617 },
          { id: 'hrl-16', name: 'Assembly', lat: 17.4028, lng: 78.4726 },
          { id: 'hrl-17', name: 'Nampally', lat: 17.3892, lng: 78.4722 },
          { id: 'hrl-18', name: 'Gandhi Bhavan', lat: 17.3819, lng: 78.4749 },
          { id: 'hrl-19', name: 'Osmania Medical College', lat: 17.3708, lng: 78.4733 },
          { id: 'hrl-20', name: 'MG Bus Station', lat: 17.3608, lng: 78.4808, interchange: ['Green Line'] },
          { id: 'hrl-21', name: 'Malakpet', lat: 17.3734, lng: 78.4966 },
          { id: 'hrl-22', name: 'New Market', lat: 17.3711, lng: 78.5086 },
          { id: 'hrl-23', name: 'Musarambagh', lat: 17.3705, lng: 78.5167 },
          { id: 'hrl-24', name: 'Dilsukh Nagar', lat: 17.3681, lng: 78.5289 },
          { id: 'hrl-25', name: 'Chaitanyapuri', lat: 17.3681, lng: 78.5401 },
          { id: 'hrl-26', name: 'Victoria Memorial', lat: 17.3624, lng: 78.5508 },
          { id: 'hrl-27', name: 'L.B. Nagar', lat: 17.3490, lng: 78.5525 },
        ],
      },
    ],
  },
  {
    id: 'chennai',
    name: 'Chennai',
    fullName: 'Chennai Metro Rail Limited (CMRL)',
    baseFare: 10,
    farePerKm: 2.0,
    fareSlabs: [
      { maxKm: 2, fare: 10 },
      { maxKm: 5, fare: 20 },
      { maxKm: 10, fare: 40 },
      { maxKm: 15, fare: 50 },
      { maxKm: 999, fare: 60 },
    ],
    lines: [
      {
        id: 'blue-chn',
        name: 'Blue Line',
        color: 'blue',
        colorHex: '#1565c0',
        firstTrain: '05:30',
        lastTrain: '23:00',
        stations: [
          { id: 'cbl-1', name: 'Wimco Nagar', lat: 13.1669, lng: 80.3073 },
          { id: 'cbl-2', name: 'Tiruvottiyur', lat: 13.1562, lng: 80.3001 },
          { id: 'cbl-3', name: 'Tiruvottiyur Theradi', lat: 13.1473, lng: 80.2939 },
          { id: 'cbl-4', name: 'Tollgate', lat: 13.1245, lng: 80.2823 },
          { id: 'cbl-5', name: 'New Washermenpet', lat: 13.1130, lng: 80.2811 },
          { id: 'cbl-6', name: 'Tondiarpet', lat: 13.1078, lng: 80.2873 },
          { id: 'cbl-7', name: 'Sir Theagaraya College', lat: 13.1021, lng: 80.2860 },
          { id: 'cbl-8', name: 'Washermenpet', lat: 13.0998, lng: 80.2847 },
          { id: 'cbl-9', name: 'Mannadi', lat: 13.0908, lng: 80.2851 },
          { id: 'cbl-10', name: 'High Court', lat: 13.0828, lng: 80.2838 },
          { id: 'cbl-11', name: 'Chennai Central', lat: 13.0827, lng: 80.2707 },
          { id: 'cbl-12', name: 'Government Estate', lat: 13.0667, lng: 80.2688 },
          { id: 'cbl-13', name: 'LIC', lat: 13.0563, lng: 80.2613 },
          { id: 'cbl-14', name: 'Thousand Lights', lat: 13.0501, lng: 80.2523 },
          { id: 'cbl-15', name: 'AG-DMS', lat: 13.0524, lng: 80.2549 },
          { id: 'cbl-16', name: 'Teynampet', lat: 13.0372, lng: 80.2478 },
          { id: 'cbl-17', name: 'Nandanam', lat: 13.0291, lng: 80.2406 },
          { id: 'cbl-18', name: 'Saidapet', lat: 13.0221, lng: 80.2232 },
          { id: 'cbl-19', name: 'Little Mount', lat: 13.0186, lng: 80.2152 },
          { id: 'cbl-20', name: 'Guindy', lat: 13.0099, lng: 80.2117 },
          { id: 'cbl-21', name: 'Alandur', lat: 13.0020, lng: 80.2007, interchange: ['Green Line'] },
          { id: 'cbl-22', name: 'Nanganallur Road', lat: 12.9842, lng: 80.1933 },
          { id: 'cbl-23', name: 'Meenambakkam', lat: 12.9798, lng: 80.1831 },
          { id: 'cbl-24', name: 'Chennai Airport', lat: 12.9941, lng: 80.1709 },
        ],
      },
    ],
  },
];

/** Calculate fare between two stations based on distance */
export function calculateMetroFare(city: MetroCity, distanceKm: number): number {
  for (const slab of city.fareSlabs) {
    if (distanceKm <= slab.maxKm) return slab.fare;
  }
  return city.fareSlabs[city.fareSlabs.length - 1]?.fare ?? 10;
}

/** Get metro city by ID */
export function getMetroCity(cityId: string): MetroCity | undefined {
  return metroCities.find((c) => c.id === cityId);
}

/** Search stations across all lines in a city */
export function searchMetroStations(
  cityId: string,
  query: string
): { station: MetroStation; line: MetroLine }[] {
  const city = getMetroCity(cityId);
  if (!city) return [];
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  const results: { station: MetroStation; line: MetroLine }[] = [];
  for (const line of city.lines) {
    for (const station of line.stations) {
      if (station.name.toLowerCase().includes(q)) {
        results.push({ station, line });
      }
    }
  }
  return results.slice(0, 10);
}

/** Estimate distance between two lat/lng points in km */
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
