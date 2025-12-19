"use client";

import React from "react";
import { Navigation } from "./navigation";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen bg-[hsl(var(--background))] overflow-hidden">
      <Navigation />
      <main className="flex-1 ml-64 overflow-y-auto overflow-x-hidden w-0">
        <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(var(--background))] to-[hsl(var(--muted))]">
          <div className="p-8 pt-20 w-full box-border">{children}</div>
        </div>
      </main>
    </div>
  );
}
