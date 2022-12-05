import en from './en';

const da: typeof en = {
    header: '{{dappName}} anmoder om følgende information om dig:',
    accept: 'Godkend',
    reject: 'Afvis',
    displayStatement: {
        requirementsMet: 'Du opfylder kravet',
        requirementsNotMet: 'Du opfylder ikke kravet',
        revealDescription:
            '<1>Vigtigt:</1> {{dappName}} får adgang til alt information der står ovenfor. Du skal kun acceptere at afsløre informationen, hvis du har tillid til servicen og hvis du er bekendt med deres privathedspolitik.',
        revealTooltip: {
            header: 'Afslører information <1 />',
            body: 'Når du afslører information til en tredjepart, kan de beholde denne information. Dette betyder, at du kun bør afsløre information til dem hvis du stoler på dem, og er bekendt med deres databrugs- samt databeskyttelses-procedurer.\n\n Du kan læse mere på\n\ndeveloper.concordium.software',
        },
        secretTooltip: {
            header: 'Hemmelige beviser',
            body: 'Hemmelige beviser er en måde at bevise noget overfor en service eller dApp, uden at afsløre den underliggende personlige information. Et eksempel kan være, at du beviser at du er over 18 år gammel, uden at bevise din specifikke fødselsdato. Et andet eksemple kan være, at du bor i ét ud af en række lande, uden at afsløre hvilket bestemt land du bor i.\n\nDu kan læse mere på\n\ndeveloper.concordum.software',
        },
        headers: {
            reveal: 'Information der afsløres',
            age: 'Hemmeligt bevis for alder',
            dob: 'Hemmeligt bevis for fødselsdato',
            idValidity: 'Hemmeligt bevis for ID validitet',
            nationality: 'Hemmeligt bevis for nationalitet',
            residence: 'Hemmeligt bevis for bopælsland',
            idDocType: 'Hemmeligt bevis for identitetsdokumenttype',
            idDocIssuer: 'Hemmeligt bevis for identitetsdokumentudsteder',
        },
        names: {
            age: 'Alder',
            dob: 'F.D',
            idValidTo: 'ID gyldigt indtil tidligst',
            idValidFrom: 'ID gyldigt fra',
            nationality: 'Nationalitet',
            residence: 'Bopælsland',
            docType: 'Dokumenttype',
            docIssuer: 'Dokumentudsteder',
        },
        proofs: {
            ageMin: 'Mere end {{age}} år gammel',
            ageMax: 'Mindre end {{age}} år gammel',
            ageBetween: 'Mellem {{ageMin}} og {{ageMax}} år gammel',
            dobMin: 'Efter {{dobString}}',
            dobMax: 'Før {{dobString}}',
            dobBetween: 'Mellem {{minDobString}} og {{maxDobString}}',
            idValidity: '{{dateString}}',
            nationalityEU: 'EU',
            nationalityNotEU: 'Udenfor EU',
            nationality: '1 af {{n}} lande',
            notNationality: 'Ingen af {{n}} lande',
            docType: '1 af {{n}} typer',
            notDocType: 'Ingen af {{n}} typer',
            docIssuer: '1 af {{n}} udstedere',
            notDocIssuer: 'Ingen af {{n}} udstedere',
        },
        descriptions: {
            ageMin: 'Din fødselsdato er før {{dateString}}',
            ageMax: 'Din fødselsdato er efter {{dateString}}',
            ageBetween: 'Din fødselsdato er mellem {{minDateString}} og {{maxDateString}}',
            nationalityEU: 'Du er statsborger i et EU land',
            nationalityNotEU: 'Du er IKKE statsborger i et EU land',
            nationality: 'Du er statsborger i et af følgende lande:\n{{countryNamesString}}',
            notNationality: 'Du er IKKE statsborger i et af følgende lande:\n{{countryNamesString}}',
            residence: 'Dit bopælsland er et af følgende:\n{{countryNamesString}}',
            notResidence: 'Dit bopælsland er IKKE et af følgende:\n{{countryNamesString}}',
            docType: 'Typen af dit identitetsdokument er en af følgende:\n{{typeNamesString}}',
            notDocType: 'Typen af dit identitetsdokument er IKKE en af følgende:\n{{typeNamesString}}',
            docIssuer: 'Udstederen af dit identitetsdokument er en af følgende:\n{{issuerNamesString}}',
            notDocIssuer: 'Udstederen af dit identitetsdokument er IKKE en af følgende:\n{{issuerNamesString}}',
            missingAttribute:
                'Attributten der anmodes om til beviset kan ikke findes på identiteten "{{identityName}}"',
        },
    },
    failedProof: 'Bevis kunne ikke oprettes: {{ reason }}',
};

export default da;
