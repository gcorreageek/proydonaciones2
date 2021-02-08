import DonacionesContract from "../build/contracts/DonacionesContract.json";
import contract from "truffle-contract";

export default async(provider) => {
    const donaciones = contract(DonacionesContract);
    donaciones.setProvider(provider);

    let instance = await  donaciones.deployed();
    return instance;
};