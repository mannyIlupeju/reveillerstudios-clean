"use client"
import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { TEAM } from "./team-data";

export default function TeamInfo() {

  return (
    <div className="p-8 flex flex-col gap-8">
      <h2 className="text-3xl font-semibold">Core Team</h2>

      <div className="flex flex-wrap gap-10">
        {TEAM.map((m) => (
          <Link
            key={m.slug}
            href={`/about/teamInfo/${m.slug}`}
            className="group block"
          >
            <div className="cursor-pointer">
              <Image
                src={m.image}
                alt={`${m.name} portrait`}
                width={400}
                height={400}
                className="rounded-2xl object-cover"
                priority={false}
              />
              <div className="mt-3">
                <p className="text-lg font-medium group-hover:underline">
                  {m.name}
                </p>
                <p className="text-sm text-neutral-500">{m.role}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

