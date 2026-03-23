import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN")!;
const SITE_URL = Deno.env.get("SITE_URL") || "quillrpdf.site";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  try {
    const { user_id, email, plan } = await req.json();

    let body: any;
    let mpUrl: string;

    if (plan === "starter") {
      // Pagamento único — R$5 / 5 PDFs
      mpUrl = "https://api.mercadopago.com/checkout/preferences";
      body = {
        items: [
          {
            title: "Quillr Pro Starter - 5 PDFs",
            quantity: 1,
            unit_price: 5.0,
            currency_id: "BRL",
          },
        ],
        payer: { email },
        back_urls: {
          success: `${SITE_URL}/payment/success?plan=starter`,
          failure: `${SITE_URL}/payment/failure`,
          pending: `${SITE_URL}/payment/success?plan=starter`,
        },
        auto_return: "approved",
        metadata: { user_id, plan: "starter" },
      };
    } else {
      // Assinatura recorrente — R$29/mês
      mpUrl = "https://api.mercadopago.com/preapproval";
      body = {
        reason: "Quillr Pro - Assinatura Mensal",
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 29,
          currency_id: "BRL",
        },
        payer_email: email,
        back_url: `${SITE_URL}/payment/success?plan=pro`,
        status: "authorized",
        metadata: { user_id, plan: "pro" },
      };
    }

    const mpRes = await fetch(mpUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    const mpData = await mpRes.json();

    const init_point = mpData.init_point || mpData.sandbox_init_point;

    if (!init_point) {
      console.error("MP error:", mpData);
      throw new Error("Link de pagamento não gerado.");
    }

    return new Response(JSON.stringify({ init_point }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});