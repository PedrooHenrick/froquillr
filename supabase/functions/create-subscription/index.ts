import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const body = await req.json();

    if (!body.email) {
      return new Response(JSON.stringify({
        error: "Email é obrigatório"
      }), { status: 400 });
    }

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("MP_ACCESS_TOKEN")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            title: "Plano Pro",
            quantity: 1,
            unit_price: 29,
          },
        ],
        payer: {
          email: body.email,
        },
        back_urls: {
          success: "https://quillrpdf.site/payment-success",
          failure: "https://quillrpdf.site/payment-failure",
          pending: "https://quillrpdf.site/payment-pending",
        },
        auto_return: "approved",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({
        error: data
      }), { status: 500 });
    }

    const init_point = data.init_point || data.sandbox_init_point;

    if (!init_point) {
      return new Response(JSON.stringify({
        error: "Link não gerado"
      }), { status: 500 });
    }

    return new Response(JSON.stringify({
      init_point
    }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (err) {
    return new Response(JSON.stringify({
      error: err.message,
    }), { status: 500 });
  }
});
