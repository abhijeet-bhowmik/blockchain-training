// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

interface IHouseRegistry {
    event Transfer(address indexed from, address indexed to, uint256 indexed houseId);
    event Lease(address indexed from, address indexed to, uint256 indexed houseId);
    event Modify(uint256 indexed modId, uint256 houseId);
    // returns owner of the house
    function ownerOf(uint256 houseId) external view returns (address owner);
    // returns houseIds owned by address
    function getHouseIds(address owner) external view returns (uint256 [] memory houseIds);
    // transfer ownership
    function transfer(address to, uint256 houseId) external;
    // transfer the lease
    function lease(address to, uint256 houseId) external;

}