/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { MockSwap, MockSwapInterface } from "../MockSwap";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balanceByUser",
    outputs: [
      {
        internalType: "uint256",
        name: "usdc",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "weth",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "operatorByUser",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "setOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "buy",
        type: "bool",
      },
    ],
    name: "swap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506104bb806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c806338a6fe511461005c57806347e7ef24146100a2578063919722bb146100b7578063b3ab15fb146100ca578063cff9f11214610107575b600080fd5b61008561006a36600461038c565b6001602052600090815260409020546001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b6100b56100b03660046103ae565b610143565b005b6100b56100c53660046103d8565b610204565b6100b56100d836600461038c565b33600090815260016020526040902080546001600160a01b0319166001600160a01b0392909216919091179055565b61012e61011536600461038c565b6000602081905290815260409020805460019091015482565b60408051928352602083019190915201610099565b336001600160a01b038316148061017357506001600160a01b038281166000908152600160205260409020541633145b6101c05760405162461bcd60e51b8152602060048201526019602482015278135bd8dad4ddd85c0b9cddd85c081b9bdd08185b1b1bddd959603a1b60448201526064015b60405180910390fd5b6001600160a01b0382166000908152602081905260409020546101e4908290610433565b6001600160a01b0390921660009081526020819052604090209190915550565b336001600160a01b038416148061023457506001600160a01b038381166000908152600160205260409020541633145b61027c5760405162461bcd60e51b8152602060048201526019602482015278135bd8dad4ddd85c0b9cddd85c081b9bdd08185b1b1bddd959603a1b60448201526064016101b7565b6001600160a01b038316600090815260208190526040902060018215151480156102a857506001810154155b806102bb5750811580156102bb57508054155b6103075760405162461bcd60e51b815260206004820181905260248201527f4d6f636b537761702e737761702077726f6e6720636f6e66696720747261646560448201526064016101b7565b8115610336578054839061031e906127109061044c565b6103289190610463565b60018201556000815561036a565b805460018201546127109061034c90869061044c565b6103569190610463565b6103609190610433565b8155600060018201555b50505050565b80356001600160a01b038116811461038757600080fd5b919050565b60006020828403121561039e57600080fd5b6103a782610370565b9392505050565b600080604083850312156103c157600080fd5b6103ca83610370565b946020939093013593505050565b6000806000606084860312156103ed57600080fd5b6103f684610370565b9250602084013591506040840135801515811461041257600080fd5b809150509250925092565b634e487b7160e01b600052601160045260246000fd5b808201808211156104465761044661041d565b92915050565b80820281158282048414176104465761044661041d565b60008261048057634e487b7160e01b600052601260045260246000fd5b50049056fea2646970667358221220c3fa3ec8d1afc8833a66e5255e5df2e4482192bed8b95b4b7dbc9b47856aaae864736f6c63430008120033";

type MockSwapConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockSwapConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockSwap__factory extends ContractFactory {
  constructor(...args: MockSwapConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MockSwap> {
    return super.deploy(overrides || {}) as Promise<MockSwap>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): MockSwap {
    return super.attach(address) as MockSwap;
  }
  override connect(signer: Signer): MockSwap__factory {
    return super.connect(signer) as MockSwap__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockSwapInterface {
    return new utils.Interface(_abi) as MockSwapInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockSwap {
    return new Contract(address, _abi, signerOrProvider) as MockSwap;
  }
}