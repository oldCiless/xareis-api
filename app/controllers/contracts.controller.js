const Contract = require('../models/contract.model');

exports.all = async (req, res, next) => {
    const contracts = req.user.contracts;
    const sendingContracts = [];

    for (contract of contracts) {
        let searchContract = await Contract.findOne({ id: contract.id });
        const namedContract = Object.assign({ naming: contract.name }, searchContract._doc);
        sendingContracts.push(namedContract);
    }
    res.status(200).json({ contracts: sendingContracts });
};

exports.one = async (req, res, next) => {
    const contracts = req.user.contracts;
    const contractId = req.params.id;
    for (contract of contracts) {
        if (contract.id === Number(contractId)) {
            const searchContract = await Contract.findOne({ id: contract.id });
            const namedContract = Object.assign({ naming: contract.name }, searchContract._doc);
            return res.status(200).json({ contract: namedContract });
        }
    }
    return res.status(403).json({ message: 'Вы не имеете права доступа к этому объекту' });
};
