import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { displayAsCcd } from 'wallet-common-helpers';

import { absoluteRoutes } from '@popup/constants/routes';
import TabBar from '@popup/shared/TabBar';
import PlusIcon from '@assets/svg/plus.svg';
import CcdIcon from '@assets/svg/concordium.svg';
import { useAccountInfo } from '@popup/shared/AccountInfoListenerContext';
import { useSelectedCredential } from '@popup/shared/utils/account-helpers';
import { TokenIdAndMetadata, WalletCredential } from '@shared/storage/types';
import { contractBalancesFamily, tokensAtom } from '@popup/store/token';
import Button from '@popup/shared/Button';

import { useAtomValue } from 'jotai';
import AtomValue from '@popup/store/AtomValue';
import { tokensRoutes, detailsRoute } from './routes';
import TokenDetails from './TokenDetails';
import { useFlattenedAccountTokens } from './utils';
import TokenBalance from './TokenBalance';

type FtProps = {
    accountAddress: string;
    contractIndex: string;
    token: TokenIdAndMetadata;
    onClick(): void;
};

function Ft({ accountAddress, contractIndex: contractAddress, token, onClick }: FtProps) {
    const { [token.id]: balance } = useAtomValue(contractBalancesFamily(accountAddress, contractAddress));

    return (
        <Button clear className="token-list__item" onClick={onClick}>
            <img className="token-list__icon" src={token.metadata.thumbnail?.url} alt={token.metadata.name} />
            <TokenBalance balance={balance} decimals={token.metadata.decimals ?? 0} />{' '}
            {token.metadata.symbol || token.metadata.name || ''}
        </Button>
    );
}

function useFilteredTokens(account: WalletCredential, unique: boolean) {
    const tokens = useFlattenedAccountTokens(account);
    return tokens.filter((t) => (t.metadata.unique ?? false) === unique);
}

type ListProps = {
    account: WalletCredential;
    toDetails: (contractIndex: string, id: string) => void;
};

function Fungibles({ account, toDetails }: ListProps) {
    const accountInfo = useAccountInfo(account);
    const tokens = useFilteredTokens(account, false);

    if (accountInfo === undefined) {
        return null;
    }

    return (
        <>
            <div className="token-list__item">
                <CcdIcon className="token-list__icon token-list__icon--ccd" />
                <div className="token-list__balance">{displayAsCcd(accountInfo.accountAmount)} CCD</div>
            </div>
            {tokens.map((t) => (
                <Ft
                    key={`${t.contractIndex}.${t.id}`}
                    accountAddress={account.address}
                    contractIndex={t.contractIndex}
                    token={t}
                    onClick={() => toDetails(t.contractIndex, t.id)}
                />
            ))}
        </>
    );
}

function Collectibles({ account, toDetails }: ListProps) {
    const tokens = useFilteredTokens(account, true);
    const { t } = useTranslation('account', { keyPrefix: 'tokens' });

    return (
        <>
            {tokens.map((token) => (
                <Button
                    clear
                    key={`${token.contractIndex}.${token.id}`}
                    onClick={() => toDetails(token.contractIndex, token.id)}
                    className="token-list__item"
                >
                    <img
                        className="token-list__icon"
                        src={token.metadata.thumbnail?.url ?? ''}
                        alt={token.metadata.name}
                    />
                    <div className="token-list__unique-name">
                        {token.metadata.name}
                        <AtomValue atom={contractBalancesFamily(account.address, token.contractIndex)}>
                            {({ [token.id]: b }) => (
                                <>
                                    {b === 0n && <div className="token-list__ownership">{t('unownedUnique')}</div>}
                                    {(b > 1n || (b > 0n && token.metadata.decimals)) && (
                                        <div className="token-list__ownership">
                                            <TokenBalance balance={b} decimals={token.metadata.decimals ?? 0} />
                                        </div>
                                    )}
                                </>
                            )}
                        </AtomValue>
                    </div>
                </Button>
            ))}
        </>
    );
}

function Tokens() {
    const { t } = useTranslation('account', { keyPrefix: 'tokens.tabBar' });
    return (
        <div className="tokens">
            <TabBar className="tokens__actions">
                <TabBar.Item className="tokens__link" to="" end>
                    {t('ft')}
                </TabBar.Item>
                <TabBar.Item className="tokens__link" to={tokensRoutes.collectibles}>
                    {t('nft')}
                </TabBar.Item>
                <TabBar.Item className="tokens__link" to={absoluteRoutes.home.account.tokens.add.path}>
                    <div className="tokens__add">
                        {t('new')}
                        <PlusIcon />
                    </div>
                </TabBar.Item>
            </TabBar>
            <div className="tokens__scroll">
                <Outlet />
            </div>
        </div>
    );
}

type Props = {
    setDetailsExpanded(expanded: boolean): void;
};

export default function TokensRoutes({ setDetailsExpanded }: Props) {
    const account = useSelectedCredential();
    const nav = useNavigate();
    useAtomValue(tokensAtom); // Ensure tokens are kept in memory

    if (account === undefined) {
        return null;
    }

    const goToDetails = (contractIndex: string, id: string) => {
        nav(detailsRoute(contractIndex, id));
    };

    return (
        <Routes>
            <Route path={tokensRoutes.details} element={<TokenDetails setDetailsExpanded={setDetailsExpanded} />} />
            <Route element={<Tokens />}>
                <Route index element={<Fungibles account={account} toDetails={goToDetails} />} />
                <Route
                    path={tokensRoutes.collectibles}
                    element={<Collectibles account={account} toDetails={goToDetails} />}
                />
            </Route>
        </Routes>
    );
}
