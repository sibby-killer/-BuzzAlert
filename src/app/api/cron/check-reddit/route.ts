import { NextResponse } from "next/server";
import { sendMentionAlert } from "@/emails";

const FIVE_MINUTES = 5 * 60 * 1000;

function getSupabase() {
  const { createClient } = require("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabase();

    const { data: keywords, error: kwError } = await supabase
      .from("keywords")
      .select("id, keyword, user_id");

    if (kwError) {
      console.error("Failed to fetch keywords:", kwError);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    if (!keywords || keywords.length === 0) {
      return NextResponse.json({ message: "No keywords to monitor" });
    }

    const now = Date.now();
    let totalNew = 0;

    for (const kw of keywords) {
      try {
        const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(kw.keyword)}&sort=new&t=hour&limit=25`;
        const response = await fetch(url, {
          headers: {
            "User-Agent": "BuzzAlert/1.0",
          },
        });

        if (!response.ok) {
          console.error(`Reddit API error for "${kw.keyword}": ${response.status}`);
          continue;
        }

        const data = await response.json();
        const posts = data?.data?.children || [];

        for (const post of posts) {
          const postData = post.data;
          if (!postData) continue;

          const createdUtc = postData.created_utc * 1000;
          if (now - createdUtc > FIVE_MINUTES) continue;

          const redditId = postData.id;
          if (!redditId) continue;

          const { data: existing } = await supabase
            .from("mentions")
            .select("id")
            .eq("reddit_id", redditId)
            .maybeSingle();

          if (existing) continue;

          const title = postData.title || "Untitled";
          const body = postData.selftext || null;
          const postUrl = `https://reddit.com${postData.permalink}`;
          const subreddit = postData.subreddit || "unknown";

          const { error: insertError } = await supabase
            .from("mentions")
            .insert({
              user_id: kw.user_id,
              keyword_id: kw.id,
              reddit_id: redditId,
              title,
              body,
              url: postUrl,
              subreddit,
            });

          if (insertError) {
            console.error("Failed to insert mention:", insertError);
            continue;
          }

          const { data: profile } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", kw.user_id)
            .single();

          if (profile?.email) {
            await sendMentionAlert({
              email: profile.email,
              keyword: kw.keyword,
              title,
              body: body || undefined,
              url: postUrl,
              subreddit,
            });
          }

          totalNew++;
        }
      } catch (err) {
        console.error(`Error processing keyword "${kw.keyword}":`, err);
      }
    }

    return NextResponse.json({
      message: "Check complete",
      keywords_checked: keywords.length,
      new_mentions: totalNew,
    });
  } catch (err) {
    console.error("Cron error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
