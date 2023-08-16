//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

interface ICredentialRegistry {

    struct Signature {
        bytes32 r;
        bytes32 s;
        uint8 v;
    }

    struct CredentialMetadata {
        address issuer;
        address subject;
        uint256 validFrom;
        uint256 validTo;
        Signature[] signatures;
        bool status;
    }

    function registerCredential(address issuer, address subject, bytes32 credentialHash, uint256 from, uint256 exp, bytes calldata signature) external returns (bool);

    function revokeCredential(bytes32 credentialHash) external returns (bool);

    function status(address issuer, bytes32 _credentialHash) external view returns (bool);

    function exist(bytes32 credentialHash, address issuer) external view returns (bool);

    event CredentialRegistered(bytes32 indexed credentialHash, address by, address id, uint iat);
    event CredentialRevoked(bytes32 indexed credentialHash, address by, uint256 date);
}