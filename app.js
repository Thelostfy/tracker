const totalIncome = document.getElementById("totalIncome");
const totalExpencive = document.getElementById("totalExpencive");
const balance = document.getElementById("Balance");
const tablebody = document.getElementById("table-body");
const expenseModal = new bootstrap.Modal('#addExpense');
const expenciveForm = document.getElementById("expenciveForm");
const incomeModal = new bootstrap.Modal('#addIncome');
const incomeform = document.getElementById("incomeform");
const search = document.getElementById("search");

const AllTransactions = "https://mooni-expense.azurewebsites.net/api/v1/Transactions";
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

// Get Data From API Function
function GetData(inputArray) {

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
        GetData(Transactions)
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
            GetData(Transactions);
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
            GetData(Transactions);
        }
        )
}
)

// search
search.addEventListener("input", (inputUser) => {
    const inp = inputUser.target.value.toLowerCase();
    if (!inp) {
        GetData(Transactions);
        return;
    }
    const filteredData = Transactions.filter(item =>
        (item.name && item.name.toLowerCase().includes(inp)) ||
        (item.category && item.category.toLowerCase().includes(inp))||
        (item.amount.toString().includes(inp))
    );
    GetData(filteredData)
}
);

