import { MentionAlertEmail } from "./mention-alert";

export async function sendMentionAlert({
  email,
  keyword,
  title,
  body,
  url,
  subreddit,
}: {
  email: string;
  keyword: string;
  title: string;
  body?: string;
  url: string;
  subreddit: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set, skipping email");
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "BuzzAlert <alerts@buzzalert.io>",
    to: email,
    subject: `New Reddit mention: "${keyword}"`,
    react: MentionAlertEmail({ keyword, title, body, url, subreddit }),
  });

  if (error) {
    console.error("Failed to send email:", error);
  }
}
