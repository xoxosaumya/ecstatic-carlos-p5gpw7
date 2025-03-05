import React, { useState, useEffect } from "react";

const meals = {
  breakfast: ["Oatmeal", "Smoothie", "Pancakes", "Eggs & Toast"],
  lunch: ["Salad", "Sandwich", "Pasta", "Stir Fry"],
  dinner: ["Soup", "Grilled Veggies", "Curry & Rice", "Tacos"],
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function MealPlanner() {
  const [planner, setPlanner] = useState(() => {
    const savedPlanner = localStorage.getItem("mealPlanner");
    return savedPlanner
      ? JSON.parse(savedPlanner)
      : days.reduce((acc, day) => {
          acc[day] = { breakfast: "", lunch: "", dinner: "" };
          return acc;
        }, {});
  });

  useEffect(() => {
    localStorage.setItem("mealPlanner", JSON.stringify(planner));
  }, [planner]);

  const handleMealSelection = (day, mealType, meal) => {
    setPlanner((prev) => ({
      ...prev,
      [day]: { ...prev[day], [mealType]: meal },
    }));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Weekly Meal Planner</h1>
      <div className="grid grid-cols-3 gap-4">
        {Object.keys(meals).map((mealType) => (
          <div key={mealType} className="border p-2 rounded-lg">
            <h2 className="font-semibold capitalize">{mealType}</h2>
            {meals[mealType].map((meal) => (
              <button
                key={meal}
                className="bg-blue-500 text-white px-2 py-1 m-1 rounded cursor-pointer"
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData(
                    "meal",
                    JSON.stringify({ mealType, meal })
                  )
                }
              >
                {meal}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-bold">Weekly Planner</h2>
        <table className="w-full border mt-2">
          <thead>
            <tr>
              <th className="border px-2 py-1">Day</th>
              <th className="border px-2 py-1">Breakfast</th>
              <th className="border px-2 py-1">Lunch</th>
              <th className="border px-2 py-1">Dinner</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td className="border px-2 py-1 font-bold">{day}</td>
                {Object.keys(planner[day]).map((mealType) => (
                  <td
                    key={mealType}
                    className="border px-2 py-1"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const { mealType: droppedMealType, meal } = JSON.parse(
                        e.dataTransfer.getData("meal")
                      );
                      handleMealSelection(day, droppedMealType, meal);
                    }}
                  >
                    {planner[day][mealType] || "Drop here"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
