import { prisma } from "@/lib/prisma";
import InvitationContent from "@/components/invitation/InvitationMain";
import { Couple, Guest, Event, Gift, Gallery, Story, Song } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const guestCode = params.guest_code as string | undefined;
  const guestId = (params.id as string | undefined) || guestCode;
  const to = params.to as string | undefined;

  const [couple, events, gifts, gallery, stories, song] = await Promise.all([
    prisma.couple.findFirst() as Promise<Couple | null>,
    prisma.event.findMany({ orderBy: { createdAt: 'asc' } }) as Promise<Event[]>,
    prisma.gift.findMany({ orderBy: { createdAt: 'asc' } }) as Promise<Gift[]>,
    prisma.gallery.findMany({ 
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ] 
    }) as Promise<Gallery[]>,
    prisma.story.findMany({ orderBy: { order: 'asc' } }).catch((e: Error) => {
      console.error("Error fetching stories:", e);
      return [];
    }) as Promise<Story[]>,
    prisma.song.findFirst({ where: { isActive: true } }) as Promise<Song | null>
  ]);

  const guest = await (async () => {
    if (!guestId) return null;
    
    // Try as UUID first (for backward compatibility)
    if (guestId.length > 20) {
      try {
        const g = await prisma.guest.findUnique({ where: { id: guestId } });
        if (g) return g as unknown as Guest;
      } catch (e) {}
    }

    // Try as Short Code
    return await prisma.guest.findUnique({ 
      where: { code: guestId.toUpperCase() } 
    }) as unknown as Guest;
  })();

  const guestName = guest ? guest.name : (to || null);

  return <InvitationContent
    couple={couple}
    guestName={guestName}
    guest={guest}
    events={events}
    gifts={gifts}
    gallery={gallery}
    stories={stories}
    song={song}
  />;
}
