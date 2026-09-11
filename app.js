const totalIncome = document.querySelector("#totalIncome");
const totalExpencive = document.querySelector("#totalExpencive");
const balance = document.querySelector("#Balance");
const tablebody = document.querySelector("#table-body");
const expenseModal = new bootstrap.Modal('#addExpense');
const expenseForm = document.querySelector("#expenciveForm");
const incomeModal = new bootstrap.Modal('#addIncome');
const incomeform = document.querySelector("#incomeform");
const search = document.querySelector("#search");
const editIncomeAmount = document.querySelector("#editIncomeAmount");
const editExpenseAmount = document.querySelector("#editExpenseAmount");
const editExpenseName = document.querySelector("#editExpenseName");

const AllTransactions = "https://mooni-expense.azurewebsites.net/api/v1/Transactions/";
const ExpensePost = "https://mooni-expense.azurewebsites.net/api/v1/Transactions/expense/";
const IncomePost = "https://mooni-expense.azurewebsites.net/api/v1/Transactions/income/";

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
function render(inputArray) {

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
        editIncomeAmount.value = row.amount;
        editExpenseAmount.value = row.amount;
        editExpenseName.value = row.name;

        // Define row for data
        const card = document.createElement("tr");
        card.innerHTML = `
                <td> ${row.type}</td>
                <td>${row.name}</td>                
                <td> ${row.category || row.source}</td>
                <td>${row.amount}</td>
                <td>
                <button class="delete-btn btn btn-danger" data-id="${row.id}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13.39 17.36L10.64 14.61" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.36 14.64L10.61 17.39" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.81 2L5.19 5.63" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.19 2L18.81 5.63" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 7.84998C2 5.99998 2.99 5.84998 4.22 5.84998H19.78C21.01 5.84998 22 5.99998 22 7.84998C22 9.99998 21.01 9.84998 19.78 9.84998H4.22C2.99 9.84998 2 9.99998 2 7.84998Z" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 10L4.91 18.64C5.23 20.58 6 22 8.86 22H14.89C18 22 18.46 20.64 18.82 18.76L20.5 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
                    <button class="edit-btn btn btn-danger" data-type="${row.type}" data-bs-toggle="modal" data-bs-target="#${IsExpence}">EDIT</button>
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

    defineDeleteBtn();
    defineEditBtn();

};



// Call Data from API
let a = window.addEventListener("load",
    async function () {
        await fetchdata();
        await render(Transactions)


    }
)
a


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


            const editData = new FormData(event.target);
            const submitedEditForm = Object.fromEntries(editData.entries());


            const id = event.target.getAttribute("data-id");
            const type = event.target.getAttribute("data-type");

            if (type == "Expense") {
                await fetch(ExpensePost + `${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(submitedEditForm)
                })
                    .then((response) => response.json())
                    .then(async (data) => {
                        expenseForm.reset();
                        expenseModal.hide();
                        await fetchdata();
                        render(Transactions);
                    })
            }
            // else {
            //     await fetch(IncomePost + `${id}`, {
            //         method: "PUT",
            //         headers: {
            //             "Content-Type": "application/json"
            //         },
            //         body: JSON.stringify(submitedEditForm)
            //     })
            //         .then((response) => response.json())
            //         .then(async (data) => {
            //             expenseForm.reset();
            //             expenseModal.hide();
            //             await fetchdata();
            //             render(Transactions);
            //         })
            // }


        }
        );
    }

}

