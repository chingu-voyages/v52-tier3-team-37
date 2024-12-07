"use client";

import Image from "next/image";
import teamMembers from "@/lib/data/AboutTeamMembers.json";

export default function AboutUs() {
  return (
    <div className="bg-gray-50">
      <header className="text-center py-12 px-4 flex flex-col items-center">
        <p className="text-gray-600">The team</p>
        <h2 className="text-4xl font-bold text-gray-800 mt-2">
          Meet the team behind <span className="text-simmpy-green">Sippy</span>
        </h2>
        <p className="text-gray-600 mt-4 max-w-xl text-center">
          We&apos;re a small team that loves to create great experiences and
          make meaningful connections between builders and customers. Join our
          remote team!
        </p>
      </header>

      <section className="py-12 px-4 md:px-16">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-8">
          Meet our team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 text-center"
            >
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150}
                  height={150}
                  className="rounded-full mx-auto"
                />
              ) : (
                <div className="w-36 h-36 bg-gray-200 rounded-full mx-auto"></div>
              )}
              <h3 className="mt-4 text-xl font-semibold text-gray-800">
                {member.name}
              </h3>
              <p className="text-simmpy-green text-sm font-medium">
                {member.role}
              </p>
              <p className="text-gray-600 text-sm mt-2">{member.description}</p>
              <div className="flex justify-center space-x-4 mt-4">
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noreferrer">
                    <Image
                      src="/assets/images/icons/linkedin.svg"
                      alt="LinkedIn"
                      width={24}
                      height={24}
                    />
                  </a>
                )}
                {member.github && (
                  <a href={member.github} target="_blank" rel="noreferrer">
                    <Image
                      src="/assets/images/icons/github2.svg"
                      alt="GitHub"
                      width={24}
                      height={24}
                    />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
