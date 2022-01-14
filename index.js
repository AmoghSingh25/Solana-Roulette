const { getReturnAmount, totalAmtToBePaid, randomNumber } = require("./helper");
const { getWalletBalance, transferSOL, airDropSol } = require("./solana");
const { Keypair } = require("@solana/web3.js");

const inquirer = require("inquirer");
const inquire = require("inquirer");

//Treasury
const treasurySecret = [
  89, 51, 249, 147, 185, 25, 129, 146, 201, 18, 81, 117, 155, 150, 138, 108, 49,
  36, 228, 166, 166, 15, 28, 151, 199, 48, 236, 219, 113, 78, 247, 80, 73, 179,
  158, 22, 217, 213, 47, 82, 166, 105, 103, 79, 21, 240, 230, 226, 32, 92, 112,
  97, 163, 16, 5, 129, 216, 174, 79, 93, 28, 154, 252, 123,
];

const userSecret = [
  232, 111, 179, 73, 50, 44, 71, 215, 157, 121, 10, 75, 198, 59, 239, 108, 36,
  212, 140, 178, 212, 205, 147, 23, 13, 225, 99, 63, 150, 244, 34, 233, 42, 183,
  53, 186, 20, 100, 150, 165, 69, 142, 85, 80, 57, 66, 76, 112, 200, 132, 170,
  137, 197, 101, 15, 31, 212, 170, 206, 215, 20, 29, 26, 229,
];

const userWallet = Keypair.fromSecretKey(Uint8Array.from(userSecret));
const treasuryWallet = Keypair.fromSecretKey(Uint8Array.from(treasurySecret));

async function promptUser() {
  console.log("Maximum SOL that can be staked is 2.5");
  let questions = [
    {
      name: "stake",
      message: "How much SOL would you like to stake? ",
    },
    {
      name: "ratio",
      message: "Choose a stake ratio: ",
      type: "rawlist",
      choices: ["1:1.25", "1:1.5", "1:1.75", "1:2"],
    },
    {
      name: "guess",
      message: "Guess a random number from 1 to 5: ",
    },
  ];

  return inquirer.prompt(questions);
}

async function main() {
  let answers = await promptUser();
  let stake = parseInt(answers.stake);
  let ratio = parseFloat(answers.ratio.split(":")[1]);
  let guess = parseInt(answers.guess);
  if (stake > 2.5 || stake <= 0 || guess < 1 || guess > 5) {
    console.log("Invalid Input");
    return;
  }
  const investment = totalAmtToBePaid(stake);
  const winAmt = getReturnAmount(stake, ratio);
  const userBalance = await getWalletBalance(userWallet.publicKey.toString());
  console.log(`You will be paying ${investment} SOL`);
  console.log(`Your wallet balance currently is ${userBalance}`);
  console.log(`If you win, you will be getting ${winAmt}`);
  if (userBalance < investment) {
    console.log("Insufficient funds");
    return;
  }
  confirmation = [
    {
      name: "confirm",
      message: "Are you sure you want to proceed with the stake?",
      choices: ["Yes", "No"],
      type: "rawlist",
    },
  ];
  let choice = await inquirer.prompt(confirmation);
  if (choice.confirm === "No") return;

  const random_generated = randomNumber();
  let userToTreasury = await transferSOL(
    userWallet,
    treasuryWallet,
    investment
  );
  console.log("Payment signature is ,", userToTreasury);
  if (guess === random_generated) {
    console.log("You won!!!");
    let signature = await transferToUser(winAmt);
    console.log("Payment sigature is,", signature);
  } else {
    console.log("Wrong number, Better luck next time ");
  }
}

async function transferToUser(winAmt) {
  let confirmation = await transferSOL(treasuryWallet, userWallet, winAmt);
  return confirmation;
}


main();
