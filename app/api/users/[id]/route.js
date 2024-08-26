import connectMongo from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(request) {
  await connectMongo();
  const users = await User.find({});
  return new Response(JSON.stringify(users), { status: 200 });
}