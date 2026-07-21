import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { refreshMentorEmbedding } from "../modules/matching/matching.service.js";

const DEFAULT_PASSWORD = "password123";

const mentors = [
  {
    name: "Ritika Sharma",
    email: "ritika.mentor@mentorque.com",
    domain: "Frontend Engineering",
    tags: ["tech", "big-tech", "senior-developer", "good-communication"],
    description:
      "Senior frontend engineer at a big tech company in India, has helped over 40 candidates rework their resumes for FAANG-style interviews.",
  },
  {
    name: "Alan Fitzgerald",
    email: "alan.mentor@mentorque.com",
    domain: "Backend Engineering",
    tags: ["tech", "ireland", "senior-developer", "good-communication"],
    description:
      "Backend engineer based in Ireland, focuses on system design mock interviews and is known for calm, structured communication with mentees.",
  },
  {
    name: "Priya Nair",
    email: "priya.mentor@mentorque.com",
    domain: "Data Science",
    tags: ["tech", "big-tech", "public-company", "senior-developer"],
    description:
      "Data scientist at a large public tech company, enjoys walking candidates through job market positioning for analytics and ML roles.",
  },
  {
    name: "Karan Mehta",
    email: "karan.mentor@mentorque.com",
    domain: "Non-tech",
    tags: ["non-tech", "good-communication", "public-company"],
    description:
      "Product marketing lead with a background in career coaching, specializes in job market guidance and communication-heavy interview prep.",
  },
  {
    name: "Neha Verma",
    email: "neha.mentor@mentorque.com",
    domain: "Frontend Engineering",
    tags: ["tech", "senior-developer", "india", "good-communication"],
    description:
      "Frontend architect who mentors early career developers on resume storytelling and mock technical interviews for product companies.",
  },
];

const users = [
  {
    name: "Aditya Rao",
    email: "aditya.user@mentorque.com",
    domain: "Frontend Engineering",
    tags: ["tech", "asks-a-lot-of-questions"],
    description: "Frontend developer with two years of experience, preparing to apply to bigger product companies.",
  },
  {
    name: "Sneha Kapoor",
    email: "sneha.user@mentorque.com",
    domain: "Backend Engineering",
    tags: ["tech", "good-communication"],
    description: "Backend developer looking for guidance on system design interviews and resume positioning.",
  },
  {
    name: "Rohan Iyer",
    email: "rohan.user@mentorque.com",
    domain: "Data Science",
    tags: ["tech", "asks-a-lot-of-questions"],
    description: "Data analyst transitioning into a data scientist role, wants mock interview practice.",
  },
  {
    name: "Divya Menon",
    email: "divya.user@mentorque.com",
    domain: "Non-tech",
    tags: ["non-tech", "good-communication"],
    description: "Marketing associate exploring product marketing roles, needs job market guidance.",
  },
  {
    name: "Farhan Sheikh",
    email: "farhan.user@mentorque.com",
    domain: "Frontend Engineering",
    tags: ["tech", "good-communication"],
    description: "Frontend developer wanting a resume revamp before applying to larger companies.",
  },
  {
    name: "Ananya Das",
    email: "ananya.user@mentorque.com",
    domain: "Backend Engineering",
    tags: ["tech", "asks-a-lot-of-questions"],
    description: "Backend developer preparing for mock interviews in distributed systems.",
  },
  {
    name: "Vikram Singh",
    email: "vikram.user@mentorque.com",
    domain: "Non-tech",
    tags: ["non-tech"],
    description: "Business analyst looking for job market guidance while switching industries.",
  },
  {
    name: "Meera Pillai",
    email: "meera.user@mentorque.com",
    domain: "Data Science",
    tags: ["tech", "good-communication"],
    description: "Data science student who wants a resume revamp before internship applications.",
  },
  {
    name: "Ishaan Kohli",
    email: "ishaan.user@mentorque.com",
    domain: "Frontend Engineering",
    tags: ["tech", "asks-a-lot-of-questions"],
    description: "Frontend developer preparing for mock interviews at product-based companies.",
  },
  {
    name: "Tanvi Joshi",
    email: "tanvi.user@mentorque.com",
    domain: "Non-tech",
    tags: ["non-tech", "good-communication"],
    description: "Operations associate looking for job market guidance for a career pivot.",
  },
];

const weeklySlots = [
  { dayOfWeek: 1, startTime: "10:00", endTime: "13:00" },
  { dayOfWeek: 3, startTime: "15:00", endTime: "18:00" },
  { dayOfWeek: 5, startTime: "09:00", endTime: "11:00" },
];

async function main() {
  const hashedDefault = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const hashedAdmin = await bcrypt.hash(env.ADMIN_PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: env.ADMIN_EMAIL },
    update: {},
    create: {
      name: env.ADMIN_NAME,
      email: env.ADMIN_EMAIL,
      password: hashedAdmin,
      role: "ADMIN",
    },
  });

  for (const mentor of mentors) {
    const created = await prisma.user.upsert({
      where: { email: mentor.email },
      update: {},
      create: {
        name: mentor.name,
        email: mentor.email,
        password: hashedDefault,
        role: "MENTOR",
        domain: mentor.domain,
        tags: mentor.tags,
        description: mentor.description,
      },
    });

    for (const slot of weeklySlots) {
      await prisma.availabilitySlot.upsert({
        where: {
          ownerId_dayOfWeek_startTime: {
            ownerId: created.id,
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
          },
        },
        update: {},
        create: { ownerId: created.id, ...slot },
      });
    }

    await refreshMentorEmbedding(created.id);
    console.log(`Seeded mentor: ${mentor.name}`);
  }

  for (const user of users) {
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: hashedDefault,
        role: "USER",
        domain: user.domain,
        tags: user.tags,
        description: user.description,
      },
    });

    for (const slot of weeklySlots) {
      await prisma.availabilitySlot.upsert({
        where: {
          ownerId_dayOfWeek_startTime: {
            ownerId: created.id,
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
          },
        },
        update: {},
        create: { ownerId: created.id, ...slot },
      });
    }

    console.log(`Seeded user: ${user.name}`);
  }

  console.log("Seed complete. Default password for everyone except admin: password123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
