// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./ERC721Tradable.sol";
/**
 * @title Creature
 * Creature - a contract for my non-fungible creatures.
 */
contract Creature is ERC721Tradable {
    constructor(address _proxyRegistryAddress)
        ERC721Tradable("MarslandNFT", "MLC", _proxyRegistryAddress)
    {}
   function baseTokenURI() override public pure returns (string memory) {
        //return "https://api.npoint.io/dd78f9c6f5b242266ed4"; //gold 1st row
        //return "https://api.npoint.io/a4dae0b489eaf8241adf"; //gold 2nd
        //return "https://api.npoint.io/4f52cf0feba256bd9fe9"; //gold 3rd
        //return "https://api.npoint.io/054861bc81131df7d68b"; //standard sec1
        //return "https://api.npoint.io/24bf70eed0c4bd5b68c4"; //standard sec2
        //return "https://api.npoint.io/5186f831a3921394df49"; //standard sec3
        //return "https://api.npoint.io/b38c9ac88e30622e7c9e"; //standard sec4
        return "https://api.npoint.io/7cf6fe5994115b163478"; //standard sec5
    }


    function contractURI() public pure returns (string memory) {
        return "https://api.npoint.io/89994527bad2feac3172";
    }
    


}
