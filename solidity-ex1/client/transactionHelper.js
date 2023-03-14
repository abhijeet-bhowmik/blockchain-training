const Tx = require("ethereumjs-tx").Transaction;

const transaction = (
  web3,
  nonce,
  gasLimit,
  gasPrice,
  account_pk,
  contractAddress,
  data
) => {
  return new Promise(async (resolve, reject) => {
    const txObject = {
      nonce: web3.utils.toHex(nonce),
      gasLimit: web3.utils.toHex(gasLimit),
      gasPrice: web3.utils.toHex(web3.utils.toWei(gasPrice, "gwei")),
      from: process.env.ROOT_ACCOUNT,
      to: contractAddress,
      data: data,
    };

    const tx = new Tx(txObject);
    account_pk = Buffer.from(
      "e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109",
      "hex"
    );
    console.log(account_pk);
    tx.sign(account_pk);

    const serializedTx = tx.serialize();
    const raw = "0x" + serializedTx.toString("hex");

    web3.eth
      .sendSignedTransaction(raw, (err, tx_receipt) => {
        if (err) {
          console.log(`x_x x_x Something went wrong...`, err);
          return reject(err);
        }
        console.log(`-> Transaction Hash: ${tx_receipt}`);
      })
      .on("receipt", (receipt) => {
        console.log(`-> Transaction Receipt Received`);
        return resolve(receipt);
      })
      .on("error", (error) => {
        console.log("x_x x_x Something went wrong ...");
        return reject(error);
      });
  });
};

module.exports = transaction;
