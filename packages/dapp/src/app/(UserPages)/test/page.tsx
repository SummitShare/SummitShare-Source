import { testData } from "@/testData";
import React, { useState } from "react";

function Test() {
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [filteredItems, setfilteredItems] = useState(testData);

  const filters = ["museum", "art galleys"];

  return (
    <div>
      <div>
        {filters.map((category) => (
          <button className="bg-slate-950 text-slate-50 px-4 py-3">
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Test;
