import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export function MentionAlertEmail({
  keyword,
  title,
  body,
  url,
  subreddit,
}: {
  keyword: string;
  title: string;
  body?: string;
  url: string;
  subreddit: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>New Reddit mention found for "{keyword}"</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>BuzzAlert</Heading>
          <Text style={h2}>
            🔔 New mention found for "<strong>{keyword}</strong>"
          </Text>

          <Section style={card}>
            <Heading style={h3}>{title}</Heading>
            {body && (
              <Text style={paragraph}>
                {body.slice(0, 500)}
                {body.length > 500 ? "..." : ""}
              </Text>
            )}
            <Text style={subredditText}>r/{subreddit}</Text>
            <Link href={url} style={button}>
              View on Reddit
            </Link>
          </Section>

          <Text style={footer}>
            🔔 BuzzAlert found this conversation for you. Upgrade to track more
            keywords at{" "}
            <Link href="https://buzzalert.io">buzzalert.io</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e6e6e6",
  borderRadius: "8px",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 20px",
};

const h2 = {
  color: "#333",
  fontSize: "18px",
  lineHeight: "24px",
  margin: "0 0 20px",
};

const h3 = {
  color: "#1a1a1a",
  fontSize: "16px",
  fontWeight: "bold",
  lineHeight: "22px",
  margin: "0 0 10px",
};

const card = {
  backgroundColor: "#f9f9f9",
  borderRadius: "6px",
  padding: "20px",
  marginBottom: "20px",
};

const paragraph = {
  color: "#555",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 10px",
};

const subredditText = {
  color: "#888",
  fontSize: "12px",
  margin: "0 0 15px",
};

const button = {
  backgroundColor: "#0066ff",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "10px 20px",
};

const footer = {
  color: "#888",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  margin: "0",
};
