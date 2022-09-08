const t = {
    intro: {
        welcome: "Welcome to Concordium's official browser extension wallet.",
        description:
            'On the following pages you will be guided through the process of optaining a new account or restoring old ones.',
        form: {
            termsAndConditionsRequired: 'You must read and accept the terms and conditions',
            termsAndConditionsDescription: 'I have read and agree to the',
            termsAndConditionsLinkDescription: 'Terms and Conditions',
        },
    },
    setupPasscode: {
        title: 'Setup passcode',
        description: 'The first step is to set up a passcode. Please enter one below.',
        form: {
            enterPasscode: 'Enter passcode',
            enterPasscodeAgain: 'Enter passcode again',
            passcodeRequired: 'A passcode must be entered',
            passcodeMismatch: 'Passcode does not match',
            passcodeMinLength: 'Passcode must be at least 6 characters',
        },
    },
    createRestore: {
        description:
            'You now have the option create a new wallet or restore an existing one. How do you want to proceed?',
        create: 'Create',
        restore: 'Restore',
    },
    recoveryPhrase: {
        title: 'Your recovery phrase',
        description: 'Write down your 24 word recovery phrase. Remember that the order is important.',
    },
    recoverSeedPhrase: {
        title: 'Restore your wallet',
    },
    performRecovery: {
        title: 'Restoring your wallet',
        description: {
            during: 'Searching for your IDs and accounts. Please wait.',
            after: 'The following identities and accounts were recovered.',
            error: 'Recovery has failed. You can try again. \n Reason for failure:',
            noneFound: 'No identities were found.',
        },
    },
    confirmRecoveryPhrase: {
        description:
            'Please enter your 24 words in the correct order and separated by spaces, to confirm your secret recovery phrase.',
    },
    enterRecoveryPhrase: {
        form: {
            required: 'A seed phrase must be provided',
            error: 'Incorrect secret recovery phrase',
        },
        seedPhrase: {
            required: 'Please specify a 24 word BIP 39 seed phrase',
            validate: 'Invalid secret recovery phrase',
        },
    },
    chooseNetwork: {
        create: {
            descriptionP1: 'Here you can choose whether to connect to the Concordium Mainnet or Testnet.',
            descriptionP2: 'If you are unsure what to choose, choose Concordium Mainnet.',
            descriptionP3: 'You can choose another network via the Settings menu later.',
        },
        restore: {
            descriptionP1:
                'Here you can choose whether to recover your identities and accounts on the Concordium Mainnet or Testnet.',
            descriptionP2: 'If you are unsure what to choose, choose Concordium Mainnet.',
            descriptionP3: 'You can use another network via the Settings menu later',
        },
    },
    continue: 'Continue',
    retry: 'Retry',
};

export default t;
