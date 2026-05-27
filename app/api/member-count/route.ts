export const runtime = "edge";
export const revalidate = 300;

export async function GET() {
  try {
    const guildId = "1488597128329822369";
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/preview`,
      { headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` }, next: { revalidate: 300 } }
    );
    if (!res.ok) return Response.json({ count: 64 });
    const data = await res.json();
    return Response.json({ count: data.approximate_member_count || 64 });
  } catch {
    return Response.json({ count: 64 });
  }
}
