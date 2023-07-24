export async function createPaymentIntent(amount, currency) {
  const STRIPE_BASE_URL = process.env.REACT_APP_STRIPE_BASE_URL;
  const STRIPE_SECRET_KEY = process.env.REACT_APP_STRIPE_SECRET_KEY;
  const url = `${STRIPE_BASE_URL}/v1/payment_intents`;
  const auth = `Bearer ${STRIPE_SECRET_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: auth,
      },
      body: new URLSearchParams({
        amount,
        currency,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error("Failed to create PaymentIntent");
    }

    const data = await response.json();
    return data.client_secret;
  } catch (error) {
    // Handle error
    console.error("Error creating PaymentIntent:", error);
    throw error;
  }
}
export async function createCheckoutSession(
  amount,
  priceId,
  connectedAccountId
) {
  const STRIPE_BASE_URL = process.env.REACT_APP_STRIPE_BASE_URL;
  const STRIPE_SECRET_KEY = process.env.REACT_APP_STRIPE_SECRET_KEY;
  const url = `${STRIPE_BASE_URL}/v1/checkout/sessions`;
  const auth = `Bearer ${STRIPE_SECRET_KEY}`;
  const data = new URLSearchParams();
  data.append("mode", "payment");
  data.append("line_items[0][price]", priceId);
  data.append("line_items[0][quantity]", "1");
  data.append("payment_intent_data[application_fee_amount]", amount);
  data.append(
    "payment_intent_data[transfer_data][destination]",
    connectedAccountId
  );
  data.append("payment_intent_data[on_behalf_of]", connectedAccountId);
  // data.append("success_url", "http://localhost:3000/dashboard/success");
  // data.append("cancel_url", "http://localhost:3000/dashboard/cancel");
  data.append("success_url",`${window.location.origin}/dashboard/success`);
  data.append("cancel_url", `${window.location.origin}/dashboard/cancel`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const responseData = await response.json();
    console.log("responseData", responseData);
    return responseData;
  } catch (error) {
    console.error(error);
  }
}
