import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";
import { checkUser } from "@/lib/checkUser"; // Assuming checkUser is still needed and will be fixed

export default async function AddTransactionPage({ searchParams }) {
  await checkUser(); // Ensure checkUser is awaited if it does async work

  // FIX: Await searchParams before accessing its properties
  const awaitedSearchParams = await searchParams;
  const accounts = await getUserAccounts();
  const editId = awaitedSearchParams?.edit; // Access .edit after awaiting searchParams

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-3xl mx-auto px-5">
      <div className="flex justify-center md:justify-normal mb-8">
        {/* FIX: Correct syntax for ternary operator in JSX */}
        <h1 className="text-5xl gradient-title ">{editId ? "Edit" : "Add"} Transaction</h1>
      </div>
      <AddTransactionForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />
    </div>
  );
}
