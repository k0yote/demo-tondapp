# Ston.Fi Demo dapp

This is testing for ston.fi

## Prerequisite

1. ston-fi dex core, build and deploy

```shell
 git clone git@github.com:ston-fi/dex-core.git
```

2. toncenter testnet endpoint and api key

- https://testnet.toncenter.com/

## Installation

1. Clone repository

```shell
git clone git@github.com:k0yote/demo-tondapp.git
```

2. Copy env

```shell
### enter required enviroments
cd demo-tondapp
cp .env.sample .env

## VITE_TONCLIENT_ENDPOINT=<Enter toncenter endpoint>
## VITE_TONCLIENT_API_KEY=<Enter ton api key>
## VITE_STONEFI_ROUTER_ADDRESS=<Enter stone.fi router address>

```

3. Build and Run

```shell
### enter required enviroments
cd demo-tondapp
npm install
npm run dev
```

4. Features

- **Create Jetton & Mint**
- **Faucet Specific Jetton**
- **Liquidity:** Jetton/Jetton pool deposit (ston.fi)
- **Liquidity:** Ton/Jetton pool deposit (ston.fi)
- **Swap:** Swap jetton to pTON (ston.fi)
- **Swap:** Swap jetton to jetton (ston.fi)
- **Swap:** Swap pTON to jetton (ston.fi)
