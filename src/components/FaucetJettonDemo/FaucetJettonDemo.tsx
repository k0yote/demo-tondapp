import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import React, { useState } from "react";
import ReactJson from "react-json-view";
import "./style.scss";
import { FaucetJettonRequestDto } from "../../server/dto/faucet-jetton-request-dto"; // Updated DTO
import { TonProofDemoApi } from "../../TonProofDemoApi";
import { toNano } from "@ton/core";

export const FaucetJettonDemo = () => {
  const [data, setData] = useState({});
  const [jettonMasterAddress, setJettonMasterAddress] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [showForm, setShowForm] = useState(false); // State to control modal visibility
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  // Handler function to show the modal form
  const handleGetFaucetFormClick = () => {
    setShowForm(true);
  };

  // Handler function to close the modal form
  const handleCloseModal = () => {
    setShowForm(false);
  };

  // Handler function to initiate the faucet request
  const handleFaucetSubmitClick = async () => {
    // Prepare faucet request DTO
    const faucetJetton: FaucetJettonRequestDto = {
      jettonMasterAddress: jettonMasterAddress,
      amount: toNano(amount).toString(),
    };

    try {
      // Make the API request to the faucet endpoint
      const response = await TonProofDemoApi.faucetJetton(faucetJetton);

      setData(response);

      // Send the transaction using TonConnectUI if no errors are present
      if (!("error" in response)) {
        await tonConnectUI.sendTransaction(response);
      }

      // Close the modal after submission
      handleCloseModal();
    } catch (error) {
      console.error("Error while making faucet request:", error);
    }
  };

  return (
    <div className="faucet-jetton-demo">
      <h3>Faucet Jetton</h3>
      {wallet ? (
        <>
          <button onClick={handleGetFaucetFormClick}>Get Faucet Form</button>
          {showForm && (
            <div className="modal">
              <div className="modal-content">
                <span className="close-button" onClick={handleCloseModal}>
                  &times;
                </span>
                <h4>Faucet Jetton Form</h4>
                <div className="form-group">
                  <label>Jetton Master Address:</label>
                  <input
                    type="text"
                    value={jettonMasterAddress}
                    onChange={(e) => setJettonMasterAddress(e.target.value)}
                    placeholder="Enter the Jetton Master Address"
                  />
                </div>
                {/* <div className="form-group">
                  <label>Receiver Address:</label>
                  <input
                    type="text"
                    value={receiverAddress}
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    placeholder="Enter the Receiver Address"
                  />
                </div> */}
                <div className="form-group">
                  <label>Amount:</label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter the Amount to Mint"
                  />
                </div>
                <div className="button-container">
                  <button onClick={handleFaucetSubmitClick}>
                    Submit Faucet Request
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="faucet-jetton-demo__error">
          Connect wallet to send transaction
        </div>
      )}
      <ReactJson src={data} name="response" theme="ocean" />
    </div>
  );
};

// CSS Styles
const modalStyles = `
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 400px;
  position: relative;
  color: #000;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 1.5em;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.8);
}

.form-group input {
  width: calc(100% - 10px);
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button-container {
  text-align: center; /* Centering the submit button */
}

.button-container button {
  background-color: rgba(102, 170, 238, 0.91);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-size: 1em;
  line-height: 20px;
  transition: transform 0.1s ease-in-out;
}

.button-container button:hover {
  transform: scale(1.03);
}

.button-container button:active {
  transform: scale(0.97);
}
`;

// Inject styles
const styleElement = document.createElement("style");
styleElement.innerHTML = modalStyles;
document.head.appendChild(styleElement);
