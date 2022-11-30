## Upgradable Smart contracts

This repo we ve upgradable smart contracts, although the SCs are immutable, but there are certain ways we can make upgradable SCs. However these upgrades are not directly into the impl SCs. The change are impl thru some type of proxy contracts.\
Then we can mention on the proxies to point the newly implemented one instead of the old contract(using "delegate() call"). \

This proxies ve their own cons such as 1. storage clashes and 2. function selecter clashes(its possible that the fn in impl contract has the same fn selector as the admin fn in the proxy contract).\

## 1.Transparant Proxy Pattern

In this pattern admins can't call impl contract fns (admin fns are fns that governs the upgrades).\

## 2. Universal Upgradable Proxies (UPPS)

Admin only upgrading fns that are only in the impl contracts, instead of the proxy.\

## 3. Diamond Pattern 

which does number of things, one of the important things it does is, it actually allows for the multiple implementation contracts. so we can make granular(chunks) upgrades 

## Delegatecall

delegatecall is a low fn sim to call{}().\
When a contract A execs delegatecall to the contract B, B's code is executed with the contract A's storage, msg.sender and msg.value

## small proxy (SmallProxy.sol)
in dir(contracts/subdir/) we'll find a minimal proxy ex, that shows how contracts can be used as a singular addr but the underlying code can actually change.\

## EIP-1967: Standard proxy storage slots 
Refer the eip 1967 standardise where the proxies stores the addr of the logic contract they delegate to, as well as other proxy specific info .\

## Transparent Upgadable proxy contracts 

we gon use transparent upgradable proxy from the openzeppelin (TransparentUpgradableProxy.sol)
The Box.sol is impl(logic contract) version 1, and the Box2.sol is version 2 with additional fn called increment.\

Upgrade Box  --> BoxV2 (ve to upgrade from box to box v2 )
    - we ve to make a proxy contract that will point to box and then later on it will point to BoxV2 .\
    - Proxy --> (Box)
            - -->(BoxV2).

In the template-ethereum-contracts git repo (example/openzeppelin-proxies)ve all the deploy scripts for diff proxies
## ToDo 

1. For this first we ve to deploy the proxy by usin the hardhad deploy and upgrading proxies(Hardhat-deploy built in proxies)'\
2. The openzeppelin also comes with upgrades plugins, we can use them to deploy the proxy. --> "upgrades.deployProxy()" \

The Scripts manual-upgradable-proxy.js ve the manual way of upgrading the proxy and we'll ve the exact same fns(manual) that we called to deploy proxy.\
```yarn hh run scripts/upgrade-box-manual.js --network localhost``` --> can see our box goes from v1 to v2 thru proxy