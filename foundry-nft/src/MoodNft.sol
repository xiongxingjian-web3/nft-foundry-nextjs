// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
contract MoodNft is ERC721 {
    error MoodNft_CantFilpMoodIfNotOwner();
    uint256 private s_tokenCounter;
    string private s_sadSvg;
    string private s_happySvg;
    enum Mood {
        Happy,
        Sad
    }
    mapping(uint256 => Mood) private s_tokenIdToMood;
    constructor(
        string memory sadSvgImageUri,
        string memory happySvgImageUri
    ) ERC721("Mood NFT", "MN") {
        s_tokenCounter = 0;
        s_sadSvg = sadSvgImageUri;
        s_happySvg = happySvgImageUri;
    }
    function mintNft() public {
        if (s_tokenCounter % 2 == 0) {
            s_tokenIdToMood[s_tokenCounter] = Mood.Happy;
        } else {
            s_tokenIdToMood[s_tokenCounter] = Mood.Sad;
        }
        _mint(msg.sender, s_tokenCounter);
        s_tokenCounter++;
    }
    function _baseURI() internal view override returns (string memory) {
        return "data:application/json;base64,";
    }
    function flipMood(uint256 _tokenId) public {
        if (
            ownerOf(_tokenId) != msg.sender &&
            getApproved(_tokenId) != msg.sender
        ) {
            revert MoodNft_CantFilpMoodIfNotOwner();
        }
        if (s_tokenIdToMood[_tokenId] == Mood.Happy) {
            s_tokenIdToMood[_tokenId] = Mood.Sad;
        } else {
            s_tokenIdToMood[_tokenId] = Mood.Happy;
        }
    }
    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        string memory imageURI;
        if (s_tokenIdToMood[_tokenId] == Mood.Happy) {
            imageURI = s_happySvg;
        } else {
            imageURI = s_sadSvg;
        }
        return
            string(
                abi.encodePacked(
                    _baseURI(),
                    Base64.encode(
                        bytes( // bytes casting actually unnecessary as 'abi.encodePacked()' returns a bytes
                            abi.encodePacked(
                                '{"name":"',
                                name(), // You can add whatever name here
                                '", "description":"An NFT that reflects the mood of the owner, 100% on Chain!", ',
                                '"attributes": [{"trait_type": "moodiness", "value": 100}], "image":"',
                                imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }
}
