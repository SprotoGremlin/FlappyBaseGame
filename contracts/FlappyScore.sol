// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FlappyScore {
    address public owner;
    mapping(address => uint256) public highScores;
    uint256 public totalPlays;

    event NewHighScore(address player, uint256 score);
    event GamePlayed(address player, uint256 score);

    constructor() {
        owner = msg.sender;
    }

    function submitScore(uint256 _score) external {
        totalPlays++;
        
        if (_score > highScores[msg.sender]) {
            highScores[msg.sender] = _score;
            emit NewHighScore(msg.sender, _score);
        }
        
        emit GamePlayed(msg.sender, _score);
    }

    function getHighScore(address player) external view returns (uint256) {
        return highScores[player];
    }

    function getTotalPlays() external view returns (uint256) {
        return totalPlays;
    }
}
