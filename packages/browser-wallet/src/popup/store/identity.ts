import {
    ChromeStorageKey,
    ConfirmedIdentity,
    CreationStatus,
    Identity,
    IdentityProvider,
    RecoveryPayload,
    RecoveryStatus,
    SessionPendingIdentity,
} from '@shared/storage/types';
import { Atom, atom } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { atomFamily, AtomFamily } from 'jotai/utils/atomFamily';
import { credentialsAtom } from './account';
import { atomWithChromeStorage } from './utils';

export const identitiesAtom = atomWithChromeStorage<Identity[]>(ChromeStorageKey.Identities, [], false);
export const pendingIdentityAtom = atomWithChromeStorage<SessionPendingIdentity | undefined>(
    ChromeStorageKey.PendingIdentity,
    undefined
);
// The index here refers to the position in the list.
export const selectedIdentityIndexAtom = atomWithChromeStorage<number>(ChromeStorageKey.SelectedIdentity, 0);
export const selectedIdentityAtom = atom<Identity | undefined, Identity | undefined>(
    (get) => {
        const identities = get(identitiesAtom);
        const selectedIndex = get(selectedIdentityIndexAtom);
        return identities[selectedIndex];
    },
    (get, set, selectedIdentity) => {
        // Also update the identities atom.
        if (selectedIdentity) {
            const identities = get(identitiesAtom);
            const selectedIndex = get(selectedIdentityIndexAtom);
            const newIdentities = [...identities];
            newIdentities[selectedIndex] = selectedIdentity;
            set(identitiesAtom, newIdentities);
        }
    }
);

export const identityProvidersAtom = atomWithChromeStorage<IdentityProvider[]>(ChromeStorageKey.IdentityProviders, []);

export const identityNamesAtom = selectAtom(identitiesAtom, (identities) => {
    const map = {} as Record<number, Record<number, string>>;
    identities.forEach((identity) => {
        if (!map[identity.providerIndex]) {
            map[identity.providerIndex] = {} as Record<number, string>;
        }
        map[identity.providerIndex][identity.index] = identity.name;
    });
    return map;
});

export const isRecoveringAtom = atomWithChromeStorage<boolean>(ChromeStorageKey.IsRecovering, false, true);
const recoveryStatusAtom = atomWithChromeStorage<RecoveryStatus | undefined>(
    ChromeStorageKey.RecoveryStatus,
    undefined,
    true
);
export const setRecoveryPayloadAtom = atom<null, RecoveryPayload, Promise<void>>(null, (_, set, payload) =>
    set(recoveryStatusAtom, { payload })
);

export const identityByAddressAtomFamily: AtomFamily<string, Atom<ConfirmedIdentity | undefined>> = atomFamily(
    (address) =>
        atom((get) => {
            const cred = get(credentialsAtom).find((c) => c.address === address);
            return get(identitiesAtom)
                .filter((i) => i.status === CreationStatus.Confirmed)
                .find((i) => i.providerIndex === cred?.providerIndex && i.index === cred.identityIndex) as
                | ConfirmedIdentity
                | undefined;
        })
);
