import { NetworkConfiguration } from '@shared/storage/types';

export const networkConfigurations: { [name: string]: NetworkConfiguration } = {
    testnet: {
        genesisHash: '84a81b2bea39d18ba3da486bf2c44013b7850836d68cb53562971e6994d2ca4f',
        name: 'Identity Testnet',
        jsonRpcUrl: 'http://localhost:9900/',
        explorerUrl: 'http://localhost:3000',
    },
};

export const defaultNetwork = networkConfigurations.testnet;
