import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import type { DraftExpense, Value } from "../types";
import { categories } from "../data/categories";
import DatePicker from "react-date-picker";
import "react-calendar/dist/Calendar.css";
import "react-date-picker/dist/DatePicker.css";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {



  const [expense, setExpense] = useState<DraftExpense>({
    amount: 0,
    expenseName: "",
    category: "",
    date: new Date(),
  });
  const [error, setError] = useState("")
  const [previuosAmount, setPreviousAmount] = useState(0)

  const {dispatch, state, remainingBudget,} = useBudget()

  useEffect(() => {
    if (state.editingId) {
      const editingExpense = state.expenses.filter(exp => exp.id === state.editingId)[0]
      setExpense(editingExpense)
      setPreviousAmount(editingExpense.amount)
    }
  }, [state.editingId])
  

  const handleChange = (e : ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    //Verificamos que estemos escribiendo en input amount
    const {name, value} = e.target
    const isAmountField = ["amount"].includes(name)
    //Seteamos, si estamos en amount, convierte value a numero, si no, lo mantiene
    setExpense({
      ...expense,
      [name] : isAmountField ? +value : value
    })
  }

  const handleChangeDate = (value : Value) => {
    setExpense({
      ...expense,
      date: value
    })
  }

  const handleSubmit = (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    //Validar
    if (Object.values(expense).includes("")) {
      setError("Todos los campos son obligatorios")
      return
    }
    //Validar que no me pase del limite de presupuesto
    if ((expense.amount - previuosAmount) > remainingBudget) {
      setError("Ese gasto se sale del presupuesto")
      return
    }
    //Agregar o actualizar Gasto
    if (state.editingId) {
      dispatch({type: "update-expense", payload: {expense: { id: state.editingId, ...expense}}})
    } else {
      dispatch({type: "add-expense", payload: {expense}})
    }

    //Reiniciar el state
    setExpense({
      amount: 0,
      expenseName: "",
      category: "",
      date: new Date(),
    })
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <legend className="uppercase text-center text-2xl font-black border-b-4 py-2 border-blue-500">
        {state.editingId ? "Editar Gasto" : "Nuevo Gasto"}
      </legend>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div className="flex flex-col gap-2">
        <label htmlFor="expenseName" className="text-xl">
          Gasto:
        </label>
        <input
          type="text"
          name="expenseName"
          id="expenseName"
          placeholder="Añade el nombre del gasto"
          className=" bg-slate-100 p-2"
          value={expense.expenseName}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-xl">
          Cantidad:
        </label>
        <input
          type="number"
          name="amount"
          id="amount"
          placeholder="Añade la cantidad del gast: Ej. 300"
          className=" bg-slate-100 p-2"
          value={expense.amount}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-xl">
          Categoría:
        </label>
        <select name="category" id="category" className=" bg-slate-100 p-2" value={expense.category} onChange={handleChange}>
          <option value="">--- Seleccione ---</option>
          {categories.map((category) => (
            <option value={category.id} key={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-xl">
          Fecha:
        </label>
        <DatePicker className="bg-slate-100 p-2 border-0" value={expense.date}
        onChange={handleChangeDate}
        />
      </div>

      <input
        type="submit"
        value={state.editingId ? "Guardar Cambios" : "Nuevo Gasto"}
        className=" bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
      />
    </form>
  );
}
