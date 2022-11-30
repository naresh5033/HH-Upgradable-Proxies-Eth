const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { network, deployments, deployer } = require("hardhat")
const { verify } = require("../helper-functions")

async function main() {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------")

    const boxV2 = await deploy("BoxV2", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(boxV2.address, [])
    }

    // Upgrade!
    // Not "the hardhat-deploy way"
    const boxProxyAdmin = await ethers.getContract("BoxProxyAdmin")
    const transparentProxy = await ethers.getContract("Box_Proxy")
    const upgradeTx = await boxProxyAdmin.upgrade(transparentProxy.address, boxV2.address) //We'll call the upgrade() on our boxProxyAdmin  which calls it on our transparent proxy which will change the impl from box1 to box2
    await upgradeTx.wait(1)
    const proxyBox = await ethers.getContractAt("BoxV2", transparentProxy.address)// this box porxy has the abi of box2 but call all the fns on the transparent proxy addr
    const version = await proxyBox.version()
    console.log(version.toString())
    log("----------------------------------------------------")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
