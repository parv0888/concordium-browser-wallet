import type en from './en';

const t: typeof en = {
    noAccounts: 'Du har ingen konti i din wallet.',
    removeAccount: 'Fjern konto (kun lokalt)',
    resetConnections: 'Fjern forbindelser',
    accountAddress: 'Konto adresse',
    siteConnected: 'Forbundet',
    siteNotConnected: 'Ikke forbundet',
    accountBalanceError: 'Fejl ved hentning af kontoens balance',
    actions: {
        log: 'Transaktionslog',
        send: 'Send CCD',
        receive: 'Modtag CCD',
        settings: 'Kontoindstillinger',
        tokens: 'Tokens',
    },
    details: {
        total: 'Offentligt total',
        atDisposal: 'Offentligt til rådighed',
        stakeAmount: 'Stake',
    },
    settings: {
        connectedSites: {
            title: 'Forbundne hjemmesider',
            noConnected: 'Den valgte konto er ikke forbundet til nogen hjemmeside.',
            connect: 'Forbind',
            disconnect: 'Fjern',
        },
        exportPrivateKey: {
            title: 'Eksportér privatnøgle',
            description: 'Indtast venligst din adgangskode for at vise din private nøgle.',
            copyDescription: 'Tryk på knappen for at kopiere din private nøgle.',
            show: 'Vis privatnøgle',
            done: 'Færdig',
            export: 'Eksporter',
        },
    },
    sendCcd: {
        labels: {
            ccd: 'Indtast et beløb at overføre',
            recipient: 'Indtast modtager addresse',
        },
        buttons: {
            back: 'tilbage',
            send: 'Send',
            finish: 'Færdigør',
            continue: 'Fortsæt',
        },
        title: 'Send CCD',
        currentBalance: 'Nuværende saldo',
        unableToCoverCost: 'Utilstrækkelig antal CCD til at dække omkostninger',
        transferInvokeFailed: 'Simulering af overførsel fejlede. Det er derfor ikke muligt at estimere omkostninger.',
        fee: 'Estimerede transaktionsomkostninger',
    },
    tokens: {
        tabBar: {
            ft: 'Ombyttelige',
            nft: 'Samlerobjekter',
            new: 'Tilføj ny',
        },
        indexRequired: 'Kontrakt indeks er påkrævet',
        chooseContract: 'Vælg kontrakt',
        contractIndex: 'Kontrakt indeks',
        contractName: 'Kontrakt navn',
        tokenId: 'Token ID',
        addToken: 'Tilføj token',
        duplicateId: 'Token er allerede i listen',
        updateTokens: 'Opdater tokens',
        unownedUnique: 'Ikke ejet',
        hexId: 'Id skal være HEX encodet',
    },
    accountPending: 'Denne konto er stadig ved at blive oprettet.',
    request: 'Opret konto',
    unknown: 'Ukendt',
};

export default t;
