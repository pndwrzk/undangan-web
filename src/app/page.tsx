import { prisma } from "@/lib/prisma";
import InvitationContent from "@/components/invitation/InvitationContent";
import { Couple, Guest, Event, Gift, Gallery, Story, Song } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const guestId = params.id as string | undefined;
  const to = params.to as string | undefined;

  const [couple, guest, events, gifts, gallery, stories, song] = await Promise.all([
    prisma.couple.findFirst() as Promise<Couple | null>,
    guestId ? prisma.guest.findUnique({ where: { id: guestId } }) as Promise<Guest | null> : null,
    prisma.event.findMany({ orderBy: { createdAt: 'asc' } }) as Promise<Event[]>,
    prisma.gift.findMany({ orderBy: { createdAt: 'asc' } }) as Promise<Gift[]>,
    prisma.gallery.findMany({ orderBy: { createdAt: 'asc' } }) as Promise<Gallery[]>,
    prisma.story.findMany({ orderBy: { order: 'asc' } }).catch((e: Error) => {
      console.error("Error fetching stories:", e);
      return [];
    }) as Promise<Story[]>,
    prisma.song.findFirst({ where: { isActive: true } }) as Promise<Song | null>
  ]);

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
