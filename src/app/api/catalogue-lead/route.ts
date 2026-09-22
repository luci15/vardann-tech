import { NextResponse } from "next/server";

export async function GET() {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhookUrl || webhookUrl.trim() === "") {
    return NextResponse.json({
      configured: false,
      message: "GOOGLE_SHEET_WEBHOOK_URL is not configured in .env.local",
    });
  }

  try {
    const res = await fetch(webhookUrl.trim(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Diagnostic Test",
        email: "test@example.com",
        phone: "+91 0000000000",
        company: "Vardann Tech Diagnostic",
      }),
      redirect: "follow",
    });

    const text = await res.text();
    const hasMissingDoPost = text.includes("Script function not found: doPost");
    const isSuccess = res.ok && !hasMissingDoPost;

    return NextResponse.json({
      configured: true,
      webhookUrl: webhookUrl.trim(),
      status: res.status,
      success: isSuccess,
      missingDoPost: hasMissingDoPost,
      responsePreview: text.slice(0, 300),
    });
  } catch (error: any) {
    return NextResponse.json({
      configured: true,
      error: error.message || String(error),
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company } = body;

    // Basic validation
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone number are required." },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    let sheetSynced = false;

    if (webhookUrl && webhookUrl.trim() !== "") {
      try {
        // Google Apps Script requires follow redirects
        const res = await fetch(webhookUrl.trim(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            company: (company || "").trim(),
          }),
          redirect: "follow",
        });

        const resText = await res.text();
        if (!res.ok || resText.includes("Script function not found")) {
          console.error(
            "Google Apps Script webhook error or missing doPost:",
            resText.slice(0, 300)
          );
        } else {
          sheetSynced = true;
          console.log("Catalogue lead successfully sent to Google Sheet.");
        }
      } catch (err) {
        console.error("Failed to forward lead to Google Sheet webhook:", err);
      }
    } else {
      console.warn(
        "GOOGLE_SHEET_WEBHOOK_URL not configured. Lead recorded locally in server logs:",
        { name, email, phone, company }
      );
    }

    return NextResponse.json({
      success: true,
      sheetSynced,
      downloadUrl: "/vardann-tech-brochure.pdf",
    });
  } catch (error) {
    console.error("Error processing catalogue lead:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
