import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import React, { useState } from "react";
import ReactJson from "react-json-view";
import "./style.scss";
import { CreateJettonRequestDto } from "../../server/dto/create-jetton-request-dto";
import { TonProofDemoApi } from "../../TonProofDemoApi";
import { toNano } from "@ton/core";

const JETTON_IMAGE_URL =
  "https://res.cloudinary.com/dezu3jzic/image/upload/v1730858434/token_img/mncawi9jxdoebxxwrsfc.png";

const JETTON_IMAGE_DATA =
  "data:image/png;base64,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";

const jetton: CreateJettonRequestDto = {
  name: "Joint Photographic Experts Group",
  description:
    "JPEG is a commonly used method of lossy compression for digital images, particularly for those images produced by digital photography. The degree of compression can be adjusted, allowing a selectable tradeoff between storage size and image quality.",
  image:
    "https://res.cloudinary.com/dezu3jzic/image/upload/v1730858434/token_img/mncawi9jxdoebxxwrsfc.png",
  image_data:
    "data:image/png;base64,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",
  symbol: "CXON",
  decimals: 9,
  amount: "1000000000000000",
};

export const CreateJettonDemo = () => {
  const [data, setData] = useState({});
  const [showForm, setShowForm] = useState(false); // State to control modal visibility
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  const handleGetCreateJettonFormClick = () => {
    setShowForm(true);
  };

  // Handler function to close the modal form
  const handleCloseModal = () => {
    setShowForm(false);
  };

  const handleCreateJettonSubmitClick = async () => {
    // Prepare faucet request DTO
    const createJetton: CreateJettonRequestDto = {
      name: name,
      description: description,
      image: JETTON_IMAGE_URL,
      image_data: JETTON_IMAGE_URL,
      symbol: symbol,
      decimals: 9,
      amount: toNano(amount).toString(),
    };

    try {
      // Make the API request to the faucet endpoint
      const response = await TonProofDemoApi.createJetton(createJetton);

      setData(response);

      // Send the transaction using TonConnectUI if no errors are present
      if (!("error" in response)) {
        await tonConnectUI.sendTransaction(response);
      }

      // Close the modal after submission
      handleCloseModal();
    } catch (error) {
      console.error("Error while creating jetton request:", error);
    }
  };

  // const handleClick = async () => {
  //   const response = await TonProofDemoApi.createJetton(jetton);

  //   setData(response);

  //   if (!("error" in response)) {
  //     await tonConnectUI.sendTransaction(response);
  //   }
  // };

  // return (
  //   <div className="create-jetton-demo">
  //     <h3>Create Jetton</h3>
  //     {wallet ? (
  //       <button onClick={handleClick}>Send create jetton</button>
  //     ) : (
  //       <div className="ton-proof-demo__error">
  //         Connect wallet to send transaction
  //       </div>
  //     )}
  //     <ReactJson src={data} name="response" theme="ocean" />
  //   </div>
  // );

  return (
    <div className="create-jetton-demo">
      <h3>Create Jetton</h3>
      {wallet ? (
        <>
          <button onClick={handleGetCreateJettonFormClick}>
            Send Create Jetton
          </button>
          {showForm && (
            <div className="modal">
              <div className="modal-content">
                <span className="close-button" onClick={handleCloseModal}>
                  &times;
                </span>
                <h4>Create Jetton Form</h4>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter the Jetton Name"
                  />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter the Jetton Description"
                  />
                </div>
                <div className="form-group">
                  <label>Symbol:</label>
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="Enter the Jetton Symbol"
                  />
                </div>
                <div className="form-group">
                  <label>Amount:</label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter the Jetton Mint Amount"
                  />
                </div>
                <div className="button-container">
                  <button onClick={handleCreateJettonSubmitClick}>
                    Submit Create Jetton Request
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
