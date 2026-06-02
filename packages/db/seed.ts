import { prisma } from './src/index';

const citySeeds = [
  { key: 'delhi', name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.209 },
  { key: 'mumbai', name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.8777 },
  { key: 'bangalore', name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { key: 'chennai', name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { key: 'hyderabad', name: 'Hyderabad', state: 'Telangana', lat: 17.385, lng: 78.4867 },
] as const;

const operatorSeeds = [
  {
    key: 'dmrc',
    name: 'Delhi Metro Rail Corporation',
    shortName: 'DMRC',
    type: 'METRO_CORP',
    state: 'Delhi',
  },
  {
    key: 'best',
    name: 'Brihanmumbai Electric Supply and Transport',
    shortName: 'BEST',
    type: 'STATE_RTC',
    state: 'Maharashtra',
  },
  {
    key: 'bmtc',
    name: 'Bangalore Metropolitan Transport Corporation',
    shortName: 'BMTC',
    type: 'STATE_RTC',
    state: 'Karnataka',
  },
  {
    key: 'cmrl',
    name: 'Chennai Metro Rail Limited',
    shortName: 'CMRL',
    type: 'METRO_CORP',
    state: 'Tamil Nadu',
  },
  {
    key: 'hmrl',
    name: 'Hyderabad Metro Rail',
    shortName: 'HMRL',
    type: 'METRO_CORP',
    state: 'Telangana',
  },
] as const;

const stopSeeds = {
  delhi: [
    {
      key: 'delhi-rajiv-chowk',
      name: 'Rajiv Chowk',
      lat: 28.6328,
      lng: 77.2197,
      type: 'METRO',
      code: 'RC',
    },
    {
      key: 'delhi-kashmere-gate',
      name: 'Kashmere Gate',
      lat: 28.6675,
      lng: 77.228,
      type: 'METRO',
      code: 'KG',
    },
    {
      key: 'delhi-new-delhi',
      name: 'New Delhi Railway Station',
      lat: 28.6429,
      lng: 77.2195,
      type: 'RAILWAY',
      code: 'NDLS',
    },
    { key: 'delhi-aiims', name: 'AIIMS', lat: 28.5672, lng: 77.21, type: 'METRO', code: 'AIIMS' },
    {
      key: 'delhi-airport',
      name: 'Indira Gandhi International Airport',
      lat: 28.5562,
      lng: 77.1,
      type: 'AIRPORT',
      code: 'DEL',
    },
  ],
  mumbai: [
    {
      key: 'mumbai-cst',
      name: 'Chhatrapati Shivaji Maharaj Terminus',
      lat: 18.94,
      lng: 72.8355,
      type: 'RAILWAY',
      code: 'CSMT',
    },
    {
      key: 'mumbai-dadar',
      name: 'Dadar',
      lat: 19.0176,
      lng: 72.8298,
      type: 'RAILWAY',
      code: 'DDR',
    },
    {
      key: 'mumbai-andheri',
      name: 'Andheri',
      lat: 19.1197,
      lng: 72.8464,
      type: 'METRO',
      code: 'AND',
    },
    {
      key: 'mumbai-ghatkopar',
      name: 'Ghatkopar',
      lat: 19.0865,
      lng: 72.908,
      type: 'METRO',
      code: 'GHT',
    },
    {
      key: 'mumbai-airport',
      name: 'Chhatrapati Shivaji Maharaj International Airport',
      lat: 19.09,
      lng: 72.8656,
      type: 'AIRPORT',
      code: 'BOM',
    },
  ],
  bangalore: [
    {
      key: 'blr-majestic',
      name: 'Majestic',
      lat: 12.9767,
      lng: 77.5713,
      type: 'METRO',
      code: 'MJS',
    },
    {
      key: 'blr-vidhana',
      name: 'Vidhana Soudha',
      lat: 12.9797,
      lng: 77.5907,
      type: 'METRO',
      code: 'VDS',
    },
    {
      key: 'blr-indiranagar',
      name: 'Indiranagar',
      lat: 12.9784,
      lng: 77.6408,
      type: 'METRO',
      code: 'IDN',
    },
    {
      key: 'blr-silk-board',
      name: 'Silk Board',
      lat: 12.9177,
      lng: 77.6238,
      type: 'BUS',
      code: 'SLK',
    },
    {
      key: 'blr-airport',
      name: 'Kempegowda International Airport',
      lat: 13.1986,
      lng: 77.7066,
      type: 'AIRPORT',
      code: 'BLR',
    },
  ],
  chennai: [
    {
      key: 'chn-central',
      name: 'Chennai Central',
      lat: 13.0827,
      lng: 80.2755,
      type: 'RAILWAY',
      code: 'MAS',
    },
    { key: 'chn-egmore', name: 'Egmore', lat: 13.0732, lng: 80.2609, type: 'RAILWAY', code: 'MS' },
    {
      key: 'chn-airport',
      name: 'Chennai Airport',
      lat: 12.9808,
      lng: 80.1642,
      type: 'AIRPORT',
      code: 'MAA',
    },
    { key: 'chn-guindy', name: 'Guindy', lat: 13.0067, lng: 80.2206, type: 'METRO', code: 'GUI' },
    { key: 'chn-tnagar', name: 'T. Nagar', lat: 13.0418, lng: 80.2341, type: 'BUS', code: 'TNG' },
  ],
  hyderabad: [
    {
      key: 'hyd-ameerpet',
      name: 'Ameerpet',
      lat: 17.4375,
      lng: 78.4483,
      type: 'METRO',
      code: 'AMP',
    },
    { key: 'hyd-mgbs', name: 'MGBS', lat: 17.3791, lng: 78.4838, type: 'BUS', code: 'MGBS' },
    {
      key: 'hyd-secunderabad',
      name: 'Secunderabad Junction',
      lat: 17.4337,
      lng: 78.5016,
      type: 'RAILWAY',
      code: 'SC',
    },
    {
      key: 'hyd-hitech-city',
      name: 'HITEC City',
      lat: 17.4435,
      lng: 78.3772,
      type: 'METRO',
      code: 'HTC',
    },
    {
      key: 'hyd-airport',
      name: 'Rajiv Gandhi International Airport',
      lat: 17.2403,
      lng: 78.4294,
      type: 'AIRPORT',
      code: 'HYD',
    },
  ],
} as const;

const routeSeeds = [
  {
    key: 'delhi-blue',
    city: 'delhi',
    operator: 'dmrc',
    name: 'Delhi Metro Blue Line',
    shortName: 'BLUE',
    type: 'METRO',
    color: '#2563eb',
    baseFare: '10.00',
    farePerKm: '2.00',
    stops: ['delhi-rajiv-chowk', 'delhi-new-delhi', 'delhi-kashmere-gate'],
  },
  {
    key: 'mumbai-metro-1',
    city: 'mumbai',
    operator: 'best',
    name: 'Versova Andheri Ghatkopar Corridor',
    shortName: 'M1',
    type: 'METRO',
    color: '#0ea5e9',
    baseFare: '10.00',
    farePerKm: '2.50',
    stops: ['mumbai-andheri', 'mumbai-ghatkopar'],
  },
  {
    key: 'bangalore-purple',
    city: 'bangalore',
    operator: 'bmtc',
    name: 'Majestic Indiranagar Connector',
    shortName: 'P1',
    type: 'METRO',
    color: '#7c3aed',
    baseFare: '10.00',
    farePerKm: '2.25',
    stops: ['blr-majestic', 'blr-vidhana', 'blr-indiranagar'],
  },
  {
    key: 'chennai-blue',
    city: 'chennai',
    operator: 'cmrl',
    name: 'Airport Central Metro',
    shortName: 'CB',
    type: 'METRO',
    color: '#0284c7',
    baseFare: '10.00',
    farePerKm: '2.00',
    stops: ['chn-airport', 'chn-guindy', 'chn-central'],
  },
  {
    key: 'hyderabad-red',
    city: 'hyderabad',
    operator: 'hmrl',
    name: 'Miyapur LB Nagar Corridor',
    shortName: 'RED',
    type: 'METRO',
    color: '#dc2626',
    baseFare: '10.00',
    farePerKm: '2.00',
    stops: ['hyd-ameerpet', 'hyd-mgbs'],
  },
] as const;

async function clearDatabase() {
  await prisma.notification.deleteMany();
  await prisma.ticketMessage.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.journeyHistory.deleteMany();
  await prisma.savedPlace.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.routeStop.deleteMany();
  await prisma.route.deleteMany();
  await prisma.stop.deleteMany();
  await prisma.operator.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();
}

async function seed() {
  console.log('Seeding Moon database...');
  await clearDatabase();

  const cities = new Map<string, string>();
  for (const city of citySeeds) {
    const created = await prisma.city.create({
      data: {
        name: city.name,
        state: city.state,
        lat: city.lat,
        lng: city.lng,
      },
    });
    cities.set(city.key, created.id);
  }

  const operators = new Map<string, string>();
  for (const operator of operatorSeeds) {
    const created = await prisma.operator.create({
      data: {
        name: operator.name,
        shortName: operator.shortName,
        type: operator.type,
        state: operator.state,
        supportEmail: `support@${operator.shortName.toLowerCase()}.example`,
      },
    });
    operators.set(operator.key, created.id);
  }

  const stops = new Map<string, string>();
  for (const [cityKey, cityStops] of Object.entries(stopSeeds)) {
    const cityId = cities.get(cityKey);
    if (!cityId) throw new Error(`Missing city for ${cityKey}`);

    for (const stop of cityStops) {
      const created = await prisma.stop.create({
        data: {
          name: stop.name,
          lat: stop.lat,
          lng: stop.lng,
          cityId,
          type: stop.type,
          code: stop.code,
        },
      });
      stops.set(stop.key, created.id);
    }
  }

  for (const route of routeSeeds) {
    const cityId = cities.get(route.city);
    const operatorId = operators.get(route.operator);
    if (!cityId || !operatorId) throw new Error(`Missing references for route ${route.key}`);

    const created = await prisma.route.create({
      data: {
        name: route.name,
        shortName: route.shortName,
        type: route.type,
        cityId,
        operatorId,
        color: route.color,
        baseFare: route.baseFare,
        farePerKm: route.farePerKm,
      },
    });

    for (const [index, stopKey] of route.stops.entries()) {
      const stopId = stops.get(stopKey);
      if (!stopId) throw new Error(`Missing stop ${stopKey}`);

      await prisma.routeStop.create({
        data: {
          routeId: created.id,
          stopId,
          sequence: index + 1,
          distanceKm: (index * 4.5).toFixed(2),
          travelTimeMins: index * 8,
        },
      });
    }

    await prisma.trip.createMany({
      data: [
        {
          routeId: created.id,
          departTime: '06:00',
          arrivalTime: '07:00',
          days: '1,2,3,4,5,6,7',
          seatsTotal: 400,
          seatsAvail: 280,
        },
        {
          routeId: created.id,
          departTime: '18:00',
          arrivalTime: '19:00',
          days: '1,2,3,4,5,6,7',
          seatsTotal: 400,
          seatsAvail: 180,
        },
      ],
    });
  }

  const demoUser = await prisma.user.create({
    data: {
      clerkId: 'demo_user_seed',
      phone: '+919999999999',
      email: 'demo@moon.local',
      name: 'Demo Rider',
      preferredLang: 'en',
    },
  });

  await prisma.user.createMany({
    data: [
      {
        clerkId: 'demo_admin_seed',
        phone: '+918888888888',
        email: 'admin@moon.local',
        name: 'Moon Admin',
        role: 'ADMIN',
        preferredLang: 'en',
      },
      {
        clerkId: 'demo_operator_seed',
        phone: '+917777777777',
        email: 'operator@moon.local',
        name: 'Metro Operator',
        role: 'OPERATOR',
        preferredLang: 'en',
      },
    ],
  });

  await prisma.savedPlace.createMany({
    data: [
      {
        userId: demoUser.id,
        label: 'Home',
        address: 'Connaught Place, Delhi',
        lat: 28.6328,
        lng: 77.2197,
        icon: 'home',
      },
      {
        userId: demoUser.id,
        label: 'Work',
        address: 'New Delhi Railway Station',
        lat: 28.6429,
        lng: 77.2195,
        icon: 'briefcase',
      },
    ],
  });

  const counts = {
    cities: await prisma.city.count(),
    operators: await prisma.operator.count(),
    stops: await prisma.stop.count(),
    routes: await prisma.route.count(),
    trips: await prisma.trip.count(),
  };

  console.log('Seed complete:', counts);
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
