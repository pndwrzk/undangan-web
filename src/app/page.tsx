import { prisma } from "@/lib/prisma";
import InvitationContent from "@/components/invitation/InvitationMain";
import { Couple, Guest, Event, Gift, Gallery, Song } from "@/types";

// Enable ISR - Revalidate every 60 seconds
export const revalidate = 60;

// Generate static params for common guest codes (optional)
export async function generateStaticParams() {
  // Pre-generate pages for VIP guests or common codes
  // This is optional - remove if you have too many guests
  const vipGuests = await prisma.guest.findMany({
    take: 10, // Only pre-generate top 10
    orderBy: { createdAt: 'desc' }
  });

  return vipGuests.map((guest) => ({
    guest_code: guest.code,
  }));
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const guestCode = params.guest_code as string | undefined;
  const to = params.to as string | undefined;

  const [couple, events, gifts, gallery, song] = await Promise.all([
    prisma.couple.findFirst() as Promise<Couple | null>,
    prisma.event.findMany({ orderBy: { createdAt: 'asc' } }) as Promise<Event[]>,
    prisma.gift.findMany({ orderBy: { createdAt: 'asc' } }) as Promise<Gift[]>,
    prisma.gallery.findMany({ 
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ] 
    }) as Promise<Gallery[]>,
    prisma.song.findFirst({ where: { isActive: true } }) as Promise<Song | null>
  ]);

  const guest = await (async () => {
    if (!guestCode) return null;
    return await prisma.guest.findUnique({ 
      where: { code: guestCode.toUpperCase() },
      include: { rsvp: true }
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
    song={song}
  />;
}
