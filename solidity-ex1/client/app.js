require("dotenv").config();

const NETWORK_URL = process.env.NETWORK_URL;

// loading command line arguments
const CONTRACT_ADDRESS = process.env["CONTRACT_ADDRESS"].toString();
const ROOT_ACCOUNT = process.env["ROOT_ACCOUNT"];
const ROOT_ACCOUNT_PK = process.env["ROOT_ACCOUNT_PK"];
const CONTRACT_ABI_FILE = process.env["CONTRACT_ABI_FILE"];
const fs = require("fs");
const Web3 = require("web3");
const path = require("path");
const transaction = require("./transactionHelper");

// creating web3 object with infura url
const web3 = new Web3(new Web3.providers.HttpProvider(NETWORK_URL));

const processTransaction = async () => {
  // loading the token contract ABI
  const fileContent = await fs.readFileSync(
    path.resolve(CONTRACT_ABI_FILE),
    "utf-8"
  );
  const ContractABI = JSON.parse(fileContent).abi;

  // getting the nonce
  let ROOT_TX_COUNT = await web3.eth.getTransactionCount(ROOT_ACCOUNT);

  console.log(`-> Current Transaction Count: ${ROOT_TX_COUNT}`);

  const Contract = new web3.eth.Contract(ContractABI, CONTRACT_ADDRESS);
  const currentValue = await getValue(Contract);

  console.log("-> Value Before Txn: ", currentValue);

  const gasEstimation = await Contract.methods.set(123).estimateGas({});

  console.log("-> Gas Estimation : ", gasEstimation);

  await transaction(
    web3,
    ROOT_TX_COUNT++,
    gasEstimation + parseInt(gasEstimation * 0.25), // 25% extra limit that what's estimated
    process.env.GAS_PRICE,
    ROOT_ACCOUNT_PK,
    CONTRACT_ADDRESS
  );

  console.log(
    "\n <---------------------------X--------------------------->\n\n"
  );
};

const getValue = async function (contract) {
  return await contract.methods.get().call();
};

processTransaction()
  .then(() => console.log("Success"))
  .catch((err) => console.log("failure" + err));
