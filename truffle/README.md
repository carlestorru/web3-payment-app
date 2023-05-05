# Truffle
This project has been created with **Truffle**, a development environment that allows smartcontracts to be compiled and deployed on an EVM-compatible blockchain. In the case of this project, it has been linked to **Ganache**.

The smartcontracts are developed using **Solidity**.

The project structure have the following items:
- **contracts/**: Directory for Solidity contracts
- **migrations/**: Directory for scriptable deployment files
- **test/**: Directory for test files for testing your application and contracts
- **truffle-config.js**: Truffle configuration file
- **../client/contracts**: Directory for compiled smartcontracts which contains the artifacts (.json files)

## Commands

> Note: install Truffle and use the commands is optional. This section is just as documentation and general information on how it works. The blockchain already has deployed the necessary smartcontracts for 3Pay application. This is just in case that you want to create, test or deploy smartcontracts.
### Install

In order to use the available Truffle commands you need to install it locally.
### `npm install -g truffle`

### Init 
### `truffle init`
This command create a bare project with no smart contracts included. Optionaly you can use `--force ` to initialize the project in the current directory regardless of its state.

### Create new smartcontract
### `truffle create contract YourContractName `
This command create a new smartcontract in *contracts* folder. 

### Compile
### `truffle compile`
This command compile all smartcontracts in *contracts*  folder and the files generated after the compilations (.json) are in* ./client/contracts*. By default, these files go to build/contracts relative to project root. But in my case I have modified *truffle-config.js* for change the default directory.

### Migrate
### `truffle migrate`
This command run all migrations located in*migrations* directory. In my case I also have modified the *truffle-config.js* for choose to deploy smartcontracts to Ganache.
You can create different files (.js) with different number prefixes to ensure that the migration of different contracts is done correctly.

