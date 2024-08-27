import connectMongo from '@/lib/dbConnect';
import User from '@/models/User.js';
import { getToken } from 'next-auth/jwt';

export async function GET(req) {
  try {
    // Connect to the MongoDB database
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

    // Log current values of the fields before incrementing
    console.log("Current solanaWallets:", user.solanaWallets);
    console.log("Current ethWallets:", user.ethWallets);
    console.log("Current wallets:", user.wallets);

    // Ensure the fields are numbers before incrementing
    // user.solanaWallets = user.solanaWallets || 0;
    user.ethWallets = user.ethWallets || 0;
    user.wallets = user.wallets || 0;

    // Increment the solanaWallets and wallets fields
    console.log("Incrementing solanaWallets and wallets fields.");
    user.ethWallets++;
    user.wallets++;
    await user.save();
    console.log("User updated and saved:", user);

    // Return the updated user as the response
    return new Response(JSON.stringify(user), { status: 200, headers: { "Content-Type": "application/json" } });

  } catch (err) {
    // Handle any errors
    console.error("Error occurred:", err);
    return new Response(err.toString(), { status: 500 });
  }
}
