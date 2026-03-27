require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const bcrypt = require('bcryptjs');

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'Administrator',
    },
  });

  console.log('Admin user created:', admin.username);

  // Default Couple data
  const couple = await prisma.couple.upsert({
    where: { id: '00000000-0000-4000-8000-000000000000' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000000',
      groomName: 'Pandiwa',
      groomAlias: 'Pandiwa',
      groomBio: 'The groom description here.',
      brideName: 'Alvia',
      brideAlias: 'Alvia',
      brideBio: 'The bride description here.',
    },
  });

  console.log('Default couple data created');

  // Default Story / Journey milestones
  const storyCount = await prisma.story.count();
  if (storyCount === 0) {
    const stories = [
      {
        date: "January 2022",
        title: "The First Meet",
        description: "It all started with a simple hello at a local coffee shop. Little did we know it was the beginning of forever.",
        icon: "Star",
        image: "/hero-bg.png",
        order: 0
      },
      {
        date: "July 2023",
        title: "First Date",
        description: "A beautiful dinner under the stars. We talked for hours and realized how much we had in common.",
        icon: "Heart",
        image: "/bride.png",
        order: 1
      },
      {
        date: "December 2024",
        title: "The Proposal",
        description: "On a snowy evening, he got down on one knee and she said YES! A moment we will never forget.",
        icon: "MapPin",
        image: "/groom.png",
        order: 2
      },
      {
        date: "September 2026",
        title: "Our Wedding Day",
        description: "The beginning of our new chapter together as husband and wife. We can't wait to celebrate with you!",
        icon: "Calendar",
        image: "/hero-bg.png",
        order: 3
      }
    ];

    for (const s of stories) {
      await prisma.story.create({ data: s });
    }
    console.log('Default story milestones seeded');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
