// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "./interfaces/IHouseRegistry.sol";


contract HouseRegistry is IHouseRegistry {
    string private _state;
    mapping(uint256 => address) house_registry;
    mapping(address => uint256[]) ownership_registry;
    mapping(uint256=> address) lease_registry;
    mapping(address => uint256) leasee_registry;

    constructor(string memory state_){
        _state  = state_;
    }

    function _houseIsOwned(uint256 houseId) private view returns(bool)  {
        return house_registry[houseId] != address(0);
    }

    function _ownerOf(uint256 houseId) private view returns(address) {
        return house_registry[houseId];
    }

    modifier onlyOwnerOfHouse(uint256 houseId) {
        require(_houseIsOwned(houseId), 'house is not owned');
        require(_ownerOf(houseId) == msg.sender, 'only house owner allowed');
        _;
    }

    function transfer(address to, uint256 houseId) public onlyOwnerOfHouse(houseId) {
        require(to  != address(0), 'invalid to address');
        for (uint i=0; i < ownership_registry[msg.sender].length; i++) {
            if (ownership_registry[msg.sender][i] == houseId) {
                delete ownership_registry[msg.sender][i];
                break;
            }
        }
        house_registry[houseId] = to;
        emit Transfer(msg.sender, to, houseId);
    }
}