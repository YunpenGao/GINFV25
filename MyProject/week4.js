import prompt from 'prompt-sync';
const input = prompt();

console.log("Welcome to my Bank Analyzer");
const count = Number(input("How many random transactions to generate?"));

function createRandomTransaction() {
    const randomDays =  Math.floor(Math.random() * 365);
    const date = new Date("2025-01-01");
    date.setDate(date.getDate() + randomDays);

    const type = Math.random() >= 0.5 ? "income" : "expense"; //if larger than 0.5 income else (:) expense

    const amount = Math.random() * 1_000;

    return { date, type, amount}
}


const transactions = [];
for (let i = 0; i < count; i++) {
    transactions.push(createRandomTransaction());
}
console.log(`${count} transactions have been generated`);


theloop:
while (true) {
console.log(
  `Select from the menu:
    1- Add a new transaction manually
    2- Monthly summary
    3- Exit `
);

const choice = Number(input("Your choice: "));

switch (choice) {
    case 1:
        const date = new Date(input("Give me a date (YYYY-MM-DD) "));
        const type = input("Income or expense (I/E)") === 'I' ? "income" : "expense";
        const amount = Number(input("Amount? "));
        transactions.push({date, type, amount});
        break;
    case 2:
        let income = new Array(12).fill(0);
        let expense = new Array(12).fill(0);

        for (const tr of transactions) {
            const month = tr.date.getMonth();
            if (tr.type === 'income'){
                income[month] += tr.amount;

            } else {
                expense[month] += tr.amount;
            }
        }
        console.log("Month | Income | Expense | Balance");
        for (let i = 0; i < 12; i++) {
            console.log(`${i+1}  | ${income[i]} | ${expense[i]} | ${income[i]-expense[i]}`)
        }
        break;
    case 3:
        break theloop;
    default: console.log("Invalid choice")
}

}