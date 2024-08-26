import connectMongo from '@/lib/dbConnect';
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';

// export async function POST(request) {
//   await connectMongo();
//   const body = await request.json();
//   const user = new User(body);
//   await user.save();
//   return new Response(JSON.stringify(user), { status: 200 });
// }

export async function GET(request) {
  try {
    await connectMongo();
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await User.findOne({ email: token.email });
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify(e), { status: 500 });
  }
}
