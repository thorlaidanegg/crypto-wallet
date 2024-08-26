import connectMongo from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request) {
  await connectMongo();
  const body = await request.json();
  const user = new User(body);
  await user.save();
  return new Response(JSON.stringify(user), { status: 200 });
}

