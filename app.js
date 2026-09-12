const totalIncome = document.querySelector("#totalIncome");
const totalExpencive = document.querySelector("#totalExpencive");
const balance = document.querySelector("#Balance");
const tablebody = document.querySelector("#table-body");

const expenseModal = new bootstrap.Modal('#addExpense');
const incomeModal = new bootstrap.Modal('#addIncome');
const editExpenseModal = new bootstrap.Modal('#editExpenseModal');
const editIncomeModal = new bootstrap.Modal('#editIncomeModal');


const expenseForm = document.querySelector("#expenciveForm");
const incomeform = document.querySelector("#incomeform");
const editExpenseForm = document.querySelector("#editExpenseForm");
const editIncomeForm = document.querySelector("#editIncomeForm");

const search = document.querySelector("#search");

const editIncomeAmount = document.querySelector("#editIncomeAmount");
const editIncomeSource = document.querySelector("#editIncomeSource");

const editExpenseAmount = document.querySelector("#editExpenseAmount");
const editExpenseName = document.querySelector("#editExpenseName");
const editExpenseCategory = document.querySelector("#editExpenseCategory");

const AllTransactions = "https://mooni-expense.azurewebsites.net/api/v1/Transactions/";
const ExpensePost = "https://mooni-expense.azurewebsites.net/api/v1/Transactions/expense/";
const IncomePost = "https://mooni-expense.azurewebsites.net/api/v1/Transactions/income/";

let idVariable;

let Transactions = [];

//get all transaction from api and fill the array or return arrayo
async function fetchdata() {
    try {
        const response = await fetch(AllTransactions);
        const data = await response.json();
        Transactions = data;
    }
    catch (error) {
        console.error("خطا در دریافت اطلاعات : ", error.message);
        return [];

    }

}

const deleteDataById = async function (ID) {

    const response = await fetch(AllTransactions + ID, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })

    await fetchdata();
    render(Transactions);




}



// Get Data From API Function
async function render(inputArray) {

    //clear table content

    tablebody.innerHTML = "";
    balance.innerHTML = "";
    totalExpencive.innerHTML = "";
    totalIncome.innerHTML = "";


    // define variable 
    let SumDarAmadHa = 0;
    let SumHazineHa = 0;
    let sum = 0;



    inputArray.forEach(row => {
        // ----------------------Calculate Sum

        try {
            if (row.type === "Expense") {
                sum -= row.amount;
                SumHazineHa += row.amount;
            }
            else {
                sum += row.amount;
                SumDarAmadHa += row.amount;
            }
        }
        catch (error) {
            console.error("خطا در محاسبه مقادیر:", error);
        }
        let IsExpence = (row.type == "Expense") ? "editExpenseModal" : "editIncomeModal";


        // Define row for data
        const card = document.createElement("tr");
        card.innerHTML = `
                <td> ${row.type}</td>
                <td>${row.name}</td>                
                <td> ${row.category || row.source}</td>
                <td>${row.amount}</td>
                <td>
                <button class="delete-btn btn btn-light" data-id="${row.id}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.33 16.5H13.66" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.5 12.5H14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
                <button class="edit-btn btn btn-light" data-id="${row.id}" data-type="${row.type}" data-name="${row.name}" data-category="${row.category}" data-source="${row.source}" data-amount="${row.amount}">    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M16 2H8C4 2 2 4 2 8V21C2 21.55 2.45 22 3 22H16C20 22 22 20 22 16V8C22 4 20 2 16 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.91 7.83991L7.72004 13.0299C7.52004 13.2299 7.33004 13.6199 7.29004 13.8999L7.01004 15.8799C6.91004 16.5999 7.41004 17.0999 8.13004 16.9999L10.11 16.7199C10.39 16.6799 10.78 16.4899 10.98 16.2899L16.17 11.0999C17.06 10.2099 17.49 9.16991 16.17 7.84991C14.85 6.51991 13.81 6.93991 12.91 7.83991Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.17 8.57983C12.61 10.1498 13.84 11.3898 15.42 11.8298" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg> </button>
                </td>`;

        tablebody.appendChild(card);
    });

    // define span for exp and income and balance
    const spanB = document.createElement("span");
    const spanE = document.createElement("span");
    const spanI = document.createElement("span");

    // ---------------------------Balance
    spanB.innerHTML = `
            Balance: <strong> ${sum}</strong>`;

    // ---------------------------Income
    spanI.innerHTML = `
        Income: <strong> ${SumDarAmadHa}</strong>`;

    // ---------------------------expencive
    spanE.innerHTML = `
            total expencive: <strong> ${SumHazineHa}</strong>`;


    // add to html
    balance.appendChild(spanB);
    totalIncome.appendChild(spanI);
    totalExpencive.appendChild(spanE);

    await defineDeleteBtn();
    await defineEditBtn();

};

// Call Data from API
window.addEventListener("load",
    async function () {
        await fetchdata();
        await render(Transactions)


    }
)

// //expence post
expenseForm.addEventListener("submit", function (event) {

    event.preventDefault();
    const expenciveData = new FormData(event.target);
    const submitedExpForm = Object.fromEntries(expenciveData.entries());

    fetch(ExpensePost, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(submitedExpForm)
    })
        .then((response) => response.json())
        .then(async (data) => {
            console.log("Expencive Added : " + data);

            expenseForm.reset();
            expenseModal.hide();
            await fetchdata();
            render(Transactions);
        }
        )

})


// //income post
incomeform.addEventListener("submit", function (event) {

    event.preventDefault();
    const incomeData = new FormData(event.target);
    const submitedExpForm = Object.fromEntries(incomeData.entries());
    fetch(IncomePost, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(submitedExpForm)
    })
        .then((response) => response.json())
        .then(async (data) => {
            console.log("Income Added : " + data);
            incomeform.reset();
            incomeModal.hide();
            await fetchdata();
            render(Transactions);
        }
        )
}
)

// search
search.addEventListener("input", (inputUser) => {
    const inp = inputUser.target.value.toLowerCase();
    if (!inp) {
        render(Transactions);
        return;
    }
    const filteredData = Transactions.filter(item =>
        (item.name && item.name.toLowerCase().includes(inp)) ||
        (item.category && item.category.toLowerCase().includes(inp)) ||
        (item.amount.toString().includes(inp))
    );
    render(filteredData)
}
);
4

editExpenseForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const editData = new FormData(event.target);
    const submitededitForm = Object.fromEntries(editData.entries());
    await fetch(ExpensePost + `${idVariable}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(submitededitForm)
    })

    editExpenseForm.reset();
    editExpenseModal.hide();
    await fetchdata();
    render(Transactions);
}
)


editIncomeForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const editData = new FormData(event.target);
    const submitededitForm = Object.fromEntries(editData.entries());
    await fetch(IncomePost + `${idVariable}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(submitededitForm)
    })

    editIncomeForm.reset();
    editIncomeModal.hide();
    await fetchdata();
    render(Transactions);
}
)



const defineDeleteBtn = function () {
    const DeleteBtns = document.getElementsByClassName("delete-btn");
    for (const btn of DeleteBtns) {
        btn.addEventListener("click", async function (event) {
            const id = event.target.getAttribute("data-id");
            if (confirm(`آیا مطمئنی برای حذف کردن این تراکنش؟`)) {
                if (id) {
                    await deleteDataById(id);
                }
            }
        });
    }

}


const defineEditBtn = function () {
    const EditBtn = document.getElementsByClassName("edit-btn");

    for (const btn of EditBtn) {

        btn.addEventListener("click", async function (event) {

            event.preventDefault();

            const type = event.target.getAttribute("data-type");
            const id = event.target.getAttribute("data-id");
            const category = event.target.getAttribute("data-category");
            const amount = event.target.getAttribute("data-amount");
            const source = event.target.getAttribute("data-source");

            idVariable = id;
            if (type == "Expense") {

                const currentName = event.target.getAttribute("data-name");
                editExpenseName.value = currentName;
                editExpenseAmount.value = amount;
                editExpenseCategory.value = category;
                await editExpenseModal.show();
            }

            else {
                editIncomeAmount.value = amount;
                editIncomeSource.value = source;

                await editIncomeModal.show();

            }
        })
    }
}

