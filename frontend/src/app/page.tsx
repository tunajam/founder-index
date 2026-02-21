"use client";

import dynamic from "next/dynamic";

const App = dynamic(() => import("./app-client"), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center text-neutral-500">Loading...</div>,
});

export default function Home() {
  return <App />;
}
