import React from "react";

const EntityCard = ({ name, score, rank }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md bg-white w-64 text-center">
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-gray-700">Score: {score}</p>
      <p className="text-gray-500">Rank: #{rank}</p>
    </div>
  );
};

export default EntityCard;
