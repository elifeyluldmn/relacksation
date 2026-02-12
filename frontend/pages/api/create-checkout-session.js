import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { name, email, address, products, totalPrice } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Rental: ${products.join(", ")}`,
            },
            unit_amount: totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        customer_name: name,
        delivery_address: address,
        selected_products: products.join(", "),
      },
      success_url: `${req.headers.origin}/payment-success`,
      cancel_url: `${req.headers.origin}/payment-cancel`,
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Payment session creation failed" });
  }
}
