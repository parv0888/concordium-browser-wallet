export default {
    header: '{{dappName}} requests the following information about you:',
    accept: 'Accept',
    reject: 'Reject',
    displayStatement: {
        requirementsMet: 'You meet this requirement',
        requirementsNotMet: "You don't meet this requirement",
        revealDescription:
            '<1>Important:</1> {{dappName}} will be given all the information above. You should only accept to do so, if you have absolute trust in the service, and if you are familiar with their privacy policiy.',
        revealTooltip: {
            header: 'Revealing information <1 />',
            body: 'When you reveal information for a third party, you effectlively hand over the information to them. This means that you should only do this if you have absolute trust in them, and if you are familiar with their data usage and protection procedures.\n\nYou can read more in on\n\ndeveleoper.concordium.software',
        },
        secretTooltip: {
            header: 'Secret proofs',
            body: 'Secret proofs are a way of proving something to a service or dApp without revealing the exact personal information. One example can be that you prove that you are over 18 years old without revealing your exact date of birth. Another example could be that you live in one of a range of countries without revealing exactly which country you live in.\n\nYou can read more on\n\n developer.concordium.software',
        },
        headers: {
            reveal: 'Information to reveal',
            age: 'Secret proof of age',
            dob: 'Secret proof of date of birth',
            idValidity: 'Secret proof of ID validity',
            nationality: 'Secret proof of nationality',
            residence: 'Secret proof of country of residence',
            idDocType: 'Secret proof of identity document type',
            idDocIssuer: 'Secret proof of identity document issuer',
        },
        names: {
            age: 'Age',
            dob: 'D.O.B',
            idDocExpiresAt: 'ID valid until at least',
            idDocIssuedAt: 'ID valid from',
            nationality: 'Nationality',
            countryOfResidence: 'Country of residence',
            idDocType: 'Document type',
            idDocIssuer: 'Document issuer',
        },
        proofs: {
            ageMin: 'More than {{age}} years old',
            ageMax: 'Less than {{age}} years old',
            ageBetween: 'Between {{ageMin}} and {{ageMax}} years old',
            dobMin: 'After {{dobString}}',
            dobMax: 'Before {{dobString}}',
            dobBetween: 'Between {{minDobString}} and {{maxDobString}}',
            idValidity: '{{dateString}}',
            nationalityEU: 'EU',
            nationalityNotEU: 'Outside EU',
            nationality: '1 of {{n}} countries',
            notNationality: 'None of {{n}} countries',
            docType: '1 of {{n}} types',
            notDocType: 'None of {{n}} types',
            docIssuer: '1 of {{n}} issuers',
            notDocIssuer: 'None of {{n}} issuers',
        },
        descriptions: {
            ageMin: 'Your date of birth is before {{dateString}}',
            ageMax: 'Your date of birth is after {{dateString}}',
            ageBetween: 'Your date of birth is between {{minDateString}} and {{maxDateString}}',
            nationalityEU: 'You are a national of an EU country',
            nationalityNotEU: 'You are NOT a national of an EU country',
            nationality: 'You are a national of one of these countries:\n{{countryNamesString}}',
            notNationality: 'You are NOT a national of one of these countries:\n{{countryNamesString}}',
            residence: 'Your country of residence is one of the following:\n{{countryNamesString}}',
            notResidence: 'Your country of residence is NOT one of the following:\n{{countryNamesString}}',
            residenceEU: 'Your country of residence is an EU country',
            residenceNotEU: 'Your country of residence is NOT an EU country',
            docType: 'Your identity document type is one of the following:\n{{typeNamesString}}',
            notDocType: 'Your identity document type is NOT one of the following:\n{{typeNamesString}}',
            docIssuer: 'Your identity document issuer is one of the following:\n{{issuerNamesString}}',
            notDocIssuer: 'Your identity document issuer is NOT one of the following:\n{{issuerNamesString}}',
            missingAttribute: 'The attribute cannot be found on the identity "{{identityName}}"',
        },
    },
    failedProof: 'Unable to create proof due to: {{ reason }}',
};
