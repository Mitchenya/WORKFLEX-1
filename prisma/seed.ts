import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.employee.deleteMany();

  await prisma.employee.createMany({
    data: [
      {
        name: "Anna",
        surname: "Kowalska",
        position: "Frontend Developer",
        project: "Acme Portal",
        hourlyRate: 85,
        hoursWorked: 120,
        status: "active",
      },
      {
        name: "Piotr",
        surname: "Nowak",
        position: "Backend Developer",
        project: "Acme Portal",
        hourlyRate: 90,
        hoursWorked: 140,
        status: "active",
      },
      {
        name: "Maria",
        surname: "Wisniewska",
        position: "QA Engineer",
        project: "Beta Mobile",
        hourlyRate: 70,
        hoursWorked: 80,
        status: "on_leave",
      },
      {
        name: "Jan",
        surname: "Zielinski",
        position: "DevOps Engineer",
        project: "Beta Mobile",
        hourlyRate: 95,
        hoursWorked: 60,
        status: "active",
      },
      {
        name: "Ewa",
        surname: "Lewandowska",
        position: "Project Manager",
        project: "Gamma Analytics",
        hourlyRate: 75,
        hoursWorked: 100,
        status: "inactive",
      },
      {
        name: "Tomasz",
        surname: "Wojcik",
        position: "Full Stack Developer",
        project: "Acme Portal",
        hourlyRate: 88,
        hoursWorked: 110,
        status: "active",
      },
      {
        name: "Katarzyna",
        surname: "Kaminska",
        position: "UX Designer",
        project: "Beta Mobile",
        hourlyRate: 72,
        hoursWorked: 90,
        status: "active",
      },
      {
        name: "Michal",
        surname: "Krawczyk",
        position: "Data Engineer",
        project: "Gamma Analytics",
        hourlyRate: 92,
        hoursWorked: 130,
        status: "active",
      },
      {
        name: "Agnieszka",
        surname: "Piotrowska",
        position: "Business Analyst",
        project: "Gamma Analytics",
        hourlyRate: 68,
        hoursWorked: 75,
        status: "on_leave",
      },
      {
        name: "Lukasz",
        surname: "Grabowski",
        position: "Security Engineer",
        project: "Acme Portal",
        hourlyRate: 98,
        hoursWorked: 50,
        status: "inactive",
      },
    ],
  });

  console.log("Seeded 10 employees");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });