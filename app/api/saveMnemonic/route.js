import connectMongo from '@/lib/dbConnect';
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';


export async function POST(req, res)
{

    const {mnemonic} = await req.json();

    try{

        console.log("Connecting to MongoDB...");
        await connectMongo();
        console.log("Connected to MongoDB.");

        // Extract the token from the request
        console.log("Extracting token from request...");
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        console.log("Token extracted:", token);

        // Check if the token exists
        if (!token) {
        console.log("No token found. Unauthorized access.");
        return new Response("Unauthorized", { status: 401 });
        }

        // Find the user in the database by email
        console.log("Finding user with email:", token.email);
        const user = await User.findOne({ email: token.email });
        console.log("User found:", user);

        // Check if the user exists
        if (!user) {
        console.log("User not found.");
        return new Response("User not found", { status: 404 });
        }

        user.mnemonic = mnemonic;
        await user.save();

        return new Response(JSON.stringify(mnemonic), { status: 200, headers: { "Content-Type": "application/json" } });

    }catch(err){
        console.error("Error occurred:", err);
        return new Response(err.toString(), { status: 500 });
    }


}