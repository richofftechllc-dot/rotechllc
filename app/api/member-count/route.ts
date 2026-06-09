export const runtime = "edge";
export const revalidate = 300;

export async function GET() {
  try {
    const guildId = "1488597128329822369";
    // with_counts returns approximate_member_count reliably for a bot that's in the guild.
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}?with_counts=true`,
      { headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` }, next: { revalidate: 300 } }
    );
    if (!res.ok) return Response.json({ count: 72 });
    const data = await res.json();
    return Response.json({ count: data.approximate_member_count || 72 });
  } catch {
    return Response.json({ count: 72 });
  }
}
