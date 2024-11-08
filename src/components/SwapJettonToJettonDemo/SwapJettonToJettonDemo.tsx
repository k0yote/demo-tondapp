import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import React, { useState } from "react";
import ReactJson from "react-json-view";
import "./style.scss";
import { SwapJettonToJettonRequestDto } from "../../server/dto/swap-jetton-to-jetton-request-dto"; // Updated DTO
import { TonProofDemoApi } from "../../TonProofDemoApi";

export const JettonSwapJettonDemo = () => {
  const [data, setData] = useState({});
  const [showForm, setShowForm] = useState(false); // State to control modal visibility
  const [minAskAmount, setMinAskAmount] = useState("");
  const [offerJettonAddress, setOfferJettonAddress] = useState("");
  const [offerAmount, setOfferAmount] = useState("");
  const [askJettonAddress, setAskJettonAddress] = useState("");

  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  const handleGetJettonSwapJettonFormClick = () => {
    setShowForm(true);
  };

  // Handler function to close the modal form
  const handleCloseModal = () => {
    setShowForm(false);
  };

  const handleJettonSwapJettonSubmitClick = async () => {
    // Prepare faucet request DTO
    const swapJettonToJetton: SwapJettonToJettonRequestDto = {
      offerJettonAddress: offerJettonAddress,
      offerAmount: offerAmount,
      askJettonAddress: askJettonAddress,
      minAskAmount: minAskAmount,
    };

    try {
      // Make the API request to the faucet endpoint
      const response = await TonProofDemoApi.swapJettonToJetton(
        swapJettonToJetton
      );

      setData(response);

      // Send the transaction using TonConnectUI if no errors are present
      if (!("error" in response)) {
        await tonConnectUI.sendTransaction(response);
      }

      // Close the modal after submission
      handleCloseModal();
    } catch (error) {
      console.error("Error while making jetton deposit pool request:", error);
    }
  };

  return (
    <div className="swap-jetton-to-jetton-demo">
      <h3>Swap jetton to jetton</h3>
      {wallet ? (
        <>
          <button onClick={handleGetJettonSwapJettonFormClick}>
            Send Swap
          </button>
          {showForm && (
            <div className="modal">
              <div className="modal-content">
                <span className="close-button" onClick={handleCloseModal}>
                  &times;
                </span>
                <h4>Swap Jetton Form</h4>
                <div className="form-group">
                  <label>Offer Jetton Address:</label>
                  <input
                    type="text"
                    value={offerJettonAddress}
                    onChange={(e) => setOfferJettonAddress(e.target.value)}
                    placeholder="Enter the Offer Jetton Address"
                  />
                </div>
                <div className="form-group">
                  <label>Offer Amount:</label>
                  <input
                    type="text"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder="Enter the Offer Amount to Swap"
                  />
                </div>
                <div className="form-group">
                  <label>Ask Jetton Address:</label>
                  <input
                    type="text"
                    value={askJettonAddress}
                    onChange={(e) => setAskJettonAddress(e.target.value)}
                    placeholder="Enter the Ask Jetton Address"
                  />
                </div>
                <div className="form-group">
                  <label>Minimal Ask Amount:</label>
                  <input
                    type="text"
                    value={minAskAmount}
                    onChange={(e) => setMinAskAmount(e.target.value)}
                    placeholder="Enter Jetton Address of the Amount to Swap"
                  />
                </div>
                <div className="button-container">
                  <button onClick={handleJettonSwapJettonSubmitClick}>
                    Submit Swap Jetton to Jetton Request
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
