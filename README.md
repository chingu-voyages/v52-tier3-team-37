# Voyage Tasks

Welcome to the `voyage-tasks` project! This README serves as the central guide for understanding, running, and contributing to the project. A well-maintained README is as crucial to a project's success as the code itself, so we encourage you to treat this document with the same care.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [How to Run the Application](#how-to-run-the-application)
3. [Environment Setup](#environment-setup)
4. [Database Setup and Prisma Migrations](#database-setup-and-prisma-migrations)
5. [Team Documents](#team-documents)
6. [Our Team](#our-team)

---

## Project Overview

<img src='public/assets/images/coverSippy.png' with='auto' />

preview on [figma](https://www.figma.com/proto/WXv61LBeFxIKHLu8qH2EVp/Sippy?node-id=229-2860&node-type=frame&t=g7scVLUxAPK4Gljo-1&scaling=min-zoom&content-scaling=fixed&page-id=1%3A37893&starting-point-node-id=223%3A1089)

The `voyage-tasks` project is developed by a collaborative team within the Chingu Community. This project aims to streamline task management with features for scheduling appointments, tracking progress, and managing user information. The project is structured using Docker and Prisma for database management, with a backend API developed in Next.js to handle user requests and appointments.

For more insights into writing a great README, refer to this article by an experienced Chingu member: [Keys to a well-written README](https://tinyurl.com/yk3wubft).


### How to Run the Application
---

Follow these steps to set up and run the application locally:

1. **Install Dependencies**

   First, install the required dependencies by running:
   ```bash
   npm install
   ```

2. **Run Docker Compose**

   Ensure Docker is installed and running on your machine. Navigate to the root of the project directory and execute:
   ```bash
   docker-compose up -d
   ```
   This command will start a PostgreSQL database as defined in `docker-compose.yml` with persistent storage, ensuring data retention across restarts.

3. **Set Up Environment Variables**

   In the root directory, create a `.env` file with the following content:
   ```env
   DATABASE_URL="postgresql://docker:docker@localhost:5432/apisippy"
   ```
   Ensure that `DATABASE_URL` matches the credentials and database settings configured in `docker-compose.yml`.

4. **Generate Prisma Client**

   To generate the Prisma client based on the defined schema, run:
   ```bash
   npm run prisma:generate
   ```

5. **Run Prisma Migrations**

   Apply migrations to the PostgreSQL database to set up the initial schema:
   ```bash
   npm run prisma:migrate
   ```
   This command will create tables and relationships as specified in `prisma/schema.prisma`.

6. **Start the Development Server**

   Finally, start the Next.js development server:
   ```bash
   npm run dev
   ```
   The application should now be running locally. Visit [http://localhost:3000](http://localhost:3000) to view the project in your browser.


## Environment Setup

To ensure a consistent development experience, configure the following:

1. **Node.js & npm**: Make sure Node.js and npm are installed on your machine.
2. **Docker**: Required for containerizing the PostgreSQL database.
3. **Environment Variables**: Configure the `.env` file as described above.

---

## Database Setup and Prisma Migrations

This project uses **Prisma** as the ORM and **PostgreSQL** as the database. Here are the main steps:

1. **Define Services** in `docker-compose.yml` for containerized environments, with PostgreSQL setup using the Bitnami PostgreSQL image and persistent storage.
2. **Prisma Scripts**: Scripts for Prisma (`prisma:generate`, `prisma:migrate`, and `prisma:deploy`) are added to the `package.json` for easy schema management and migrations.
3. **Database Schema**: The schema includes tables like `users`, `resident_requests`, `addresses`, and `time_slots`, all with defined relationships and constraints.

---

## Team Documents

To facilitate team collaboration, use these documents available in the `/docs` directory:

- [Team Project Ideas](./docs/team_project_ideas.md): Brainstorming and idea documentation.
- [Team Decision Log](./docs/team_decision_log.md): Log of team decisions for reference.

### Meeting Agenda Templates

| Meeting Agenda Templates                             | Link                                                              |
| ---------------------------------------------------- | ----------------------------------------------------------------- |
| Voyage Kickoff                                       | [Link](./docs/meeting-voyage_kickoff.docx)                        |
| App Vision & Feature Planning                        | [Link](./docs/meeting-vision_and_feature_planning.docx)           |
| Sprint Retrospective, Review, and Planning           | [Link](./docs/meeting-sprint_retrospective_review_and_planning.docx) |
| Sprint Open Topic Session                            | [Link](./docs/meeting-sprint_open_topic_session.docx)             |

---

## Our Team

Meet our awesome team! Everyone has added their GitHub and LinkedIn profiles for easy access.

- **Suruchi Patki**: [GitHub](https://github.com/Supatki) / [LinkedIn](https://www.linkedin.com/in/suruchi-patki-b0710b195/)
- **David Eastmond**: [GitHub](https://github.com/davideastmond) / [LinkedIn](https://www.linkedin.com/in/david-eastmond-2783ab18a/)
- **Mahyar Erfanian**: [GitHub](https://github.com/Mahyar-98) / [LinkedIn](https://www.linkedin.com/in/mahyar-erfanian-67968279/)
- **Franklin Macedo**: [GitHub](https://github.com/frankdias92) / [LinkedIn](https://linkedin.com/in/franklin-md)
- **Nandor Nagy**: [GitHub](https://github.com/n3ndor) / [LinkedIn](https://www.linkedin.com/in/nandornagylinked/)
- **Eoin McDonnell**: [GitHub](https://github.com/oldmcdonnell) / [LinkedIn](https://www.linkedin.com/in/mcdonnell-eoin/)

---

## Additional Notes

This project is built and maintained as part of the Chingu Community. We're constantly learning, adapting, and collaborating, so expect more updates and enhancements as we progress. We welcome feedback, contributions, and suggestions.

---

## Future Contributions

As the project evolves, additional features, components, and updates will be documented here. Stay tuned for more detailed posts as we continue building together!
