import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const FoodSearchSchema = z.object({
  city: z.string().optional(),
  query: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

const POPULAR_RESTAURANTS = [
  {
    id: 'rest-1',
    name: 'Biryani By Kilo',
    cuisine: 'Mughlai, Biryani, Kebabs',
    rating: 4.5,
    deliveryTimeMins: 35,
    costForTwo: 600,
    famousFor: 'Hyderabadi Dum Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60',
    zomatoLink: 'https://www.zomato.com/',
    swiggyLink: 'https://www.swiggy.com/',
  },
  {
    id: 'rest-2',
    name: "Haldiram's",
    cuisine: 'North Indian, Street Food, Sweets',
    rating: 4.3,
    deliveryTimeMins: 25,
    costForTwo: 350,
    famousFor: 'Chole Bhature & Raj Kachori',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=60',
    zomatoLink: 'https://www.zomato.com/',
    swiggyLink: 'https://www.swiggy.com/',
  },
  {
    id: 'rest-3',
    name: 'Sagar Ratna',
    cuisine: 'South Indian, Udupi',
    rating: 4.4,
    deliveryTimeMins: 30,
    costForTwo: 400,
    famousFor: 'Mysore Masala Dosa',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=60',
    zomatoLink: 'https://www.zomato.com/',
    swiggyLink: 'https://www.swiggy.com/',
  },
  {
    id: 'rest-4',
    name: 'Wow! Momo',
    cuisine: 'Tibetan, Chinese, Fast Food',
    rating: 4.1,
    deliveryTimeMins: 20,
    costForTwo: 300,
    famousFor: 'Darjeeling Steam Momos',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=60',
    zomatoLink: 'https://www.zomato.com/',
    swiggyLink: 'https://www.swiggy.com/',
  },
  {
    id: 'rest-5',
    name: 'Moti Mahal Delux',
    cuisine: 'North Indian, Tandoori',
    rating: 4.6,
    deliveryTimeMins: 40,
    costForTwo: 800,
    famousFor: 'Original Butter Chicken & Dal Makhani',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=60',
    zomatoLink: 'https://www.zomato.com/',
    swiggyLink: 'https://www.swiggy.com/',
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const params = FoodSearchSchema.parse(body);

    const query = (params.query || '').toLowerCase();
    let filtered = POPULAR_RESTAURANTS;

    if (query) {
      filtered = POPULAR_RESTAURANTS.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.cuisine.toLowerCase().includes(query) ||
          r.famousFor.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      success: true,
      data: filtered,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid parameters', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to search restaurants' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const query = (sp.get('query') || '').toLowerCase();

  let filtered = POPULAR_RESTAURANTS;
  if (query) {
    filtered = POPULAR_RESTAURANTS.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.cuisine.toLowerCase().includes(query) ||
        r.famousFor.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    success: true,
    data: filtered,
  });
}
