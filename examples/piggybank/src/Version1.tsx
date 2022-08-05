/* eslint-disable no-console */
import React, { useEffect, useState, useContext, useRef } from 'react';
import { JsonRpcClient, toBuffer } from '@concordium/web-sdk';
import { smash, deposit, state, CONTRACT_NAME } from './utils';

import PiggyIcon from './assets/piggy-bank-solid.svg';
import HammerIcon from './assets/hammer-solid.svg';

// V1 Module reference on testnet: 12362dd6f12fabd95959cafa27e512805161467b3156c7ccb043318cd2478838
const CONTRACT_INDEX = 81n; // V1 instance

/** If you want to test smashing the piggy bank,
 * it will be necessary to instantiate your own piggy bank using an account available in the browser wallet,
 * and change this constant to match the index of the instance.
 */
/** Should match the subindex of the instance targeted. */
const CONTRACT_SUB_INDEX = 0n;

interface Props {
    client: JsonRpcClient;
}

function updateState(client: JsonRpcClient, setSmashed: (x: boolean) => void, setAmount: (x: bigint) => void) {
    client
        .invokeContract({
            method: `${CONTRACT_NAME}.view`,
            contract: { index: CONTRACT_INDEX, subindex: CONTRACT_SUB_INDEX },
        })
        .then((res) => {
            if (!res || res.tag === 'failure' || !res.returnValue) {
                throw new Error(`Expected succesful invocation`);
            }
            setSmashed(!!Number(res.returnValue.substring(0, 2)));
            setAmount(toBuffer(res.returnValue.substring(2), 'hex').readBigUInt64LE(0) as bigint);
        });
}

export default function PiggyBank({ client }: Props) {
    const { account, isConnected, jsonRpcUrl } = useContext(state);
    const [owner, setOwner] = useState<string>();
    const [smashed, setSmashed] = useState<boolean>();
    const [amount, setAmount] = useState<bigint>(0n);
    const input = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Get piggy bank owner.
        client.getInstanceInfo({ index: CONTRACT_INDEX, subindex: CONTRACT_SUB_INDEX }).then((info) => {
            if (info?.name !== `init_${CONTRACT_NAME}`) {
                // Check that we have the expected instance.
                throw new Error(`Expected instance of PiggyBank: ${info?.name}`);
            }

            setOwner(info.owner.address);
        });
    }, []);

    // The internal state of the piggy bank, which is either intact or smashed.
    useEffect(() => {
        updateState(client, setSmashed, setAmount);
    }, []);

    // Disable use if we're not connected or if piggy bank has already been smashed.
    const canUse = isConnected && smashed !== undefined && !smashed;

    return (
        <main className="piggybank">
            <div className={`connection-banner ${isConnected ? 'connected' : ''}`}>
                {isConnected ? `Connected: ${account}` : 'No wallet connection'}
            </div>
            <div>{jsonRpcUrl ? `JSON-RPC Url: ${jsonRpcUrl}` : 'No JSON-RPC Url yet'}</div>
            <br />
            {owner === undefined ? (
                <div>Loading piggy bank...</div>
            ) : (
                <>
                    <h1 className="stored">{Number(amount) / 1000000} CCD</h1>
                    <div>
                        Owned by
                        <br />
                        {owner}
                    </div>
                    <br />
                    <div>State: {smashed ? 'Smashed' : 'Intact'}</div>
                    <button type="button" onClick={() => updateState(client, setSmashed, setAmount)}>
                        ↻
                    </button>
                </>
            )}
            <br />
            <label>
                <div className="container">
                    <input className="input" type="number" placeholder="Deposit amount" ref={input} />
                    <button
                        className="deposit"
                        type="button"
                        onClick={() => deposit(CONTRACT_INDEX, CONTRACT_SUB_INDEX, input.current?.valueAsNumber)}
                        disabled={!canUse}
                    >
                        <PiggyIcon height="20" />
                    </button>
                </div>
            </label>
            <br />
            <br />
            <button
                className="smash"
                type="button"
                onClick={() => smash(CONTRACT_INDEX, CONTRACT_SUB_INDEX)}
                disabled={account === undefined || account !== owner || !canUse} // The smash button is only active for the contract owner.
            >
                <HammerIcon width="40" />
            </button>
        </main>
    );
}
