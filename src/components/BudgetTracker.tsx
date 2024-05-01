import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useBudget } from "../hooks/useBudget";
import AmountDisplay from "./AmountDisplay";
import "react-circular-progressbar/dist/styles.css"

export default function BudgetTracker() {

  const {state, dispatch, totalExpenses, remainingBudget} = useBudget()

  const percentage = +((totalExpenses*100) / state.budget).toFixed(2)

  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className=" flex justify-center">
        <CircularProgressbar
          value={percentage}
          styles={buildStyles({
            pathColor: percentage === 100 ? "#DC2626" : percentage >= 75 ? "orange" : "#3b82f6",
            trailColor: "#F5F5F5",
            textSize: 10,
            textColor: percentage === 100 ? "#DC2626" : percentage >= 75 ? "orange" : "#3b82f6"
          })}
          text={`${percentage}% Gastado`}
        />
      </div>

      <div className="flex flex-col justify-center items-center gap-8">
        <button type="button" className=" bg-pink-600 w-full p-2 text-white uppercase font-bold rounded-lg" onClick={() => dispatch({type: "reset-app"})}>Resetear App</button>

        <AmountDisplay 
            label="Presupuesto"
            amount={state.budget}
        />

        <AmountDisplay 
            label="Gastado"
            amount={totalExpenses}
        />

        <AmountDisplay 
            label="Disponible"
            amount={remainingBudget}
        />

      </div>
    </div>
  );
}
