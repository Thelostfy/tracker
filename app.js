const totalIncome = document.getElementById("totalIncome");
const totalExpencive = document.getElementById("totalExpencive");
const balance = document.getElementById("Balance");
const tablebody = document.getElementById("table-body");
const expenseModal = new bootstrap.Modal('#addExpense');
const expenciveForm = document.getElementById("expenciveForm");
const incomeModal = new bootstrap.Modal('#addIncome');
const incomeform = document.getElementById("incomeform");
const search = document.getElementById("search");

const AllTransactions = "https://mooni-expense.azurewebsites.net/api/v1/Transactions/";
const ExpencePost = "https://mooni-expense.azurewebsites.net/api/v1/Transactions/expense";
const IncomePost = "https://mooni-expense.azurewebsites.net/api/v1/Transactions/income";

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
const Delete = async function (ID) {

    if (confirm("are you sure ?")) {
        const response = await fetch(AllTransactions + ID, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        await fetchdata();
        render(Transactions)
    }
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


        // Define row for data
        const card = document.createElement("tr");
        card.innerHTML = `
                <td> ${row.type}</td>
                <td>${row.name}</td>                
                <td> ${row.category || row.source}</td>
                <td>${row.amount}</td>
                <td><button onclick = "Delete(row.type)">    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" >
        <path d="M13.39 17.36L10.64 14.61" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"
            stroke-linecap="round" stroke-linejoin="round" />
        <path d="M13.36 14.64L10.61 17.39" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"
            stroke-linecap="round" stroke-linejoin="round" />
        <path d="M8.81 2L5.19 5.63" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"
            stroke-linecap="round" stroke-linejoin="round" />
        <path d="M15.19 2L18.81 5.63" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"
            stroke-linecap="round" stroke-linejoin="round" />
        <path
            d="M2 7.84998C2 5.99998 2.99 5.84998 4.22 5.84998H19.78C21.01 5.84998 22 5.99998 22 7.84998C22 9.99998 21.01 9.84998 19.78 9.84998H4.22C2.99 9.84998 2 9.99998 2 7.84998Z"
            stroke="currentColor" stroke-width="1.5" />
        <path d="M3.5 10L4.91 18.64C5.23 20.58 6 22 8.86 22H14.89C18 22 18.46 20.64 18.82 18.76L20.5 10"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg></button></td>
                
                `;

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
};



// Call Data from API
window.addEventListener("load",
    async function () {
        await fetchdata();
        render(Transactions)

    }
)



// //expence post
expenciveForm.addEventListener("submit", function (event) {

    event.preventDefault();
    const expenciveData = new FormData(event.target);
    const submitedExpForm = Object.fromEntries(expenciveData.entries());

    fetch(ExpencePost, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(submitedExpForm)
    })
        .then((response) => response.json())
        .then(async (data) => {
            console.log("Expencive Added : " + data);

            expenciveForm.reset();
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

