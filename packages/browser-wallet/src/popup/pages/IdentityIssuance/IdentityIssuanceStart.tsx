import React, { useState, useEffect } from 'react';
import { useAtomValue, useAtom, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { jsonRpcUrlAtom, seedPhraseAtom } from '@popup/store/settings';
import { pendingIdentityAtom, identitiesAtom, identityProvidersAtom } from '@popup/store/identity';
import { popupMessageHandler } from '@popup/shared/message-handler';
import { getIdentityProviders, IdentityProvider } from '@shared/utils/wallet-proxy';
import { InternalMessageType } from '@concordium/browser-wallet-message-hub';
import { JsonRpcClient, HttpProvider } from '@concordium/web-sdk';
import { IdentityStatus, Network } from '@shared/storage/types';
import Button from '@popup/shared/Button';
import IdentityProviderIcon from '@popup/shared/IdentityProviderIcon';
import PendingArrows from '@assets/svg/pending-arrows.svg';

interface InnerProps {
    onStart: () => void;
}

function IdentityIssuanceStart({ onStart }: InnerProps) {
    const { t } = useTranslation('identityIssuance');
    const [providers, setProviders] = useAtom(identityProvidersAtom);
    const jsonRrcUrl = useAtomValue(jsonRpcUrlAtom);
    const updatePendingIdentity = useSetAtom(pendingIdentityAtom);
    const identities = useAtomValue(identitiesAtom);
    const masterSeed = useAtomValue(seedPhraseAtom);

    useEffect(() => {
        // TODO only load once per session?
        getIdentityProviders().then((loadedProviders) => setProviders(loadedProviders));
    }, []);

    const startIssuance = async (provider: IdentityProvider) => {
        if (!jsonRrcUrl) {
            throw new Error('no json rpc url');
        }
        if (!masterSeed) {
            throw new Error('no master seed');
        }

        // TODO: Maybe we should not create the client for each page
        const client = new JsonRpcClient(new HttpProvider(jsonRrcUrl));
        const global = await client.getCryptographicParameters();

        if (!global) {
            throw new Error('no global fetched');
        }

        // TODO Find a better way to assign indices
        const identityIndex = identities.length ? identities[identities.length - 1].index + 1 : 0;
        // TODO Get this from settings, when we store the chosen net
        const net = 'Testnet';

        onStart();

        updatePendingIdentity({
            id: identities.length,
            status: IdentityStatus.Pending,
            index: identityIndex,
            name: `Identity ${identityIndex + 1}`,
            network: Network[net],
            provider: provider.ipInfo.ipIdentity,
        });

        popupMessageHandler.sendInternalMessage(InternalMessageType.StartIdentityIssuance, {
            globalContext: global.value,
            ipInfo: provider.ipInfo,
            arsInfos: provider.arsInfos,
            seed: masterSeed,
            net,
            identityIndex,
            arThreshold: Math.min(Object.keys(provider.arsInfos).length - 1, 255),
            baseUrl: provider.metadata.issuanceStart,
        });
    };

    return (
        <div className="identity-issuance__start">
            <p className="identity-issuance__start-text">{t('startText')}</p>
            <div>
                {providers.map((p) => (
                    <Button
                        className="identity-issuance__provider-button flex justify-space-between align-center"
                        width="wide"
                        key={p.ipInfo.ipIdentity + p.ipInfo.ipDescription.name}
                        onClick={() => startIssuance(p)}
                    >
                        <IdentityProviderIcon provider={p} />
                        {p.ipInfo.ipDescription.name}
                    </Button>
                ))}
            </div>
        </div>
    );
}

export default function IdentityIssuanceStartGuard() {
    const { t } = useTranslation('identityIssuance');
    const [pendingIdentity, setPendingidentity] = useAtom(pendingIdentityAtom);
    const [blocked, setBlocked] = useState(false);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (pendingIdentity && !started) {
            setBlocked(true);
        }
    }, [pendingIdentity]);

    if (blocked) {
        return (
            <div className="identity-issuance__start">
                <p className="identity-issuance__start-text">{t('alreadyPending')}</p>
                <Button
                    width="wide"
                    onClick={() => {
                        setPendingidentity(undefined);
                        setBlocked(false);
                    }}
                >
                    {t('reset')}
                </Button>
            </div>
        );
    }
    if (started) {
        return (
            <div className="identity-issuance__start">
                <p className="identity-issuance__start-text">{t('startText')}</p>
                <PendingArrows className="identity-issuance__start__loading-arrows" />
                <p className="identity-issuance__text m-t-40">{t('startWaitingText')}</p>
            </div>
        );
    }
    return <IdentityIssuanceStart onStart={() => setStarted(true)} />;
}
