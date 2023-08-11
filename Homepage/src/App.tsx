import React, { useState } from "react"; // Don't forget to import useState
import { useAccount } from "wagmi";
import { Test } from "./components/EventsForm";
import Pages from "./components/pages";

export function App() {
  return (
    <div>
      <Pages />
    </div>
  );
}
