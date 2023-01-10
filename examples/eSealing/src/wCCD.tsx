/* eslint-disable no-console */
/* eslint-disable no-alert */

import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import Switch from 'react-switch';
import {
    toBuffer,
    deserializeReceiveReturnValue,
    serializeUpdateContractParameters,
    JsonRpcClient,
} from '@concordium/web-sdk';
import sha256 from 'sha256';

import { register } from './utils';
import {
    E_SEALING_CONTRACT_NAME,
    E_SEALING_CONTRACT_INDEX,
    E_SEALING_RAW_SCHEMA,
    CONTRACT_SUB_INDEX,
} from './constants';

import { withJsonRpcClient } from './wallet/WalletConnection';
import { WalletConnectionProps } from './wallet/WithWalletConnection';
import { WalletConnectionTypeButton } from './WalletConnectorTypeButton';

const blackCardStyle = {
    backgroundColor: 'black',
    color: 'white',
    width: '484px',
    borderRadius: 10,
    margin: '10px 0px 10px 0px',
    padding: '10px 18px',
    border: '1px solid #308274',
};

const ButtonStyle = {
    color: 'white',
    borderRadius: 10,
    margin: '7px 0px 7px 0px',
    padding: '10px',
    width: '100%',
    border: '1px solid #26685D',
    backgroundColor: '#308274',
    cursor: 'pointer',
    fontWeight: 300,
    fontSize: '14px',
};

const ButtonStyleDisabled = {
    color: 'white',
    borderRadius: 10,
    margin: '7px 0px 7px 0px',
    padding: '10px',
    width: '100%',
    border: '1px solid #4B4A4A',
    backgroundColor: '#979797',
    cursor: 'pointer',
    fontWeight: 300,
    fontSize: '14px',
};

const InputFieldStyle = {
    backgroundColor: '#181817',
    color: 'white',
    borderRadius: 10,
    width: '100%',
    border: '1px solid #308274',
    margin: '7px 0px 7px 0px',
    padding: '10px 20px',
};

async function viewFile(rpcClient: JsonRpcClient, fileHash: string) {
    const fileHashByteArray = fileHash.split(',').map((s) => parseInt(s, 10));

    const param = serializeUpdateContractParameters(
        E_SEALING_CONTRACT_NAME,
        'getFile',
        fileHashByteArray,
        toBuffer(E_SEALING_RAW_SCHEMA, 'base64')
    );
    const res = await rpcClient.invokeContract({
        method: `${E_SEALING_CONTRACT_NAME}.getFile`,
        contract: { index: E_SEALING_CONTRACT_INDEX, subindex: CONTRACT_SUB_INDEX },
        parameter: param,
    });
    if (!res || res.tag === 'failure' || !res.returnValue) {
        throw new Error(
            `RPC call 'invokeContract' on method '${E_SEALING_CONTRACT_NAME}.view' of contract '${E_SEALING_CONTRACT_INDEX}' failed`
        );
    }
    const returnValues = deserializeReceiveReturnValue(
        toBuffer(res.returnValue, 'hex'),
        toBuffer(E_SEALING_RAW_SCHEMA, 'base64'),
        E_SEALING_CONTRACT_NAME,
        'getFile',
        2
    );
    console.log(`TODO: display values at front-end${returnValues}`);
    /* return returnValues.admin.Account[0]; */
}

export default function wCCD(props: WalletConnectionProps) {
    const {
        network,
        activeConnectorType,
        activeConnector,
        isActiveConnectorWaitingForUser,
        activeConnection,
        activeConnectionGenesisHash,
        activeConnectedAccount,
        activeConnectorError,
        connect,
    } = props;
    //  const [fileRecord, setFileRecord] = useState<string>();
    const [getFileError, setGetFileError] = useState('');
    const [fileHash, setFileHash] = useState('None');

    const [selectedFile, setSelectedFile] = useState<File>();

    // const [isFilePicked, setIsFilePicked] = useState(false);

    const changeHandler = (event: ChangeEvent) => {
        const test = event.target as HTMLInputElement;
        if (test.files) {
            const file = test.files[0];
            setSelectedFile(file);
        }
    };

    useEffect(() => {
        // Update admin contract.
        if (activeConnection && activeConnectedAccount) {
            withJsonRpcClient(activeConnection, (rpcClient) => viewFile(rpcClient, fileHash))
                .then((a) => {
                    console.log(`TODO:${a}`);
                    console.log(`TODO display this value somewhere:${getFileError}`);
                    //   setAdmin(a);
                    //  setAdminError('');
                })
                .catch((e) => setGetFileError((e as Error).message));
        }
    }, [activeConnection, activeConnectedAccount, fileHash]);

    const [isRegisterFilePage, setIsRegisterFilePage] = useState(true);
    const [hash, setHash] = useState('');
    const [transactionError, setTransactionError] = useState('');
    const file = useRef<HTMLInputElement | null>(null);

    const [isWaitingForTransaction, setWaitingForUser] = useState(false);
    return (
        <>
            <h1 className="header">Register a file on the Concordium Testnet</h1>
            <div style={blackCardStyle}>
                <div>
                    <WalletConnectionTypeButton
                        buttonStyle={ButtonStyle}
                        disabledButtonStyle={ButtonStyleDisabled}
                        connectorType="BrowserWallet"
                        connectorName="Browser Wallet"
                        setWaitingForUser={setWaitingForUser}
                        {...props}
                    />
                    <WalletConnectionTypeButton
                        buttonStyle={ButtonStyle}
                        disabledButtonStyle={ButtonStyleDisabled}
                        connectorType="WalletConnect"
                        connectorName="Wallet Connect"
                        setWaitingForUser={setWaitingForUser}
                        {...props}
                    />
                </div>
                <div>
                    {activeConnectorError && <p style={{ color: 'red' }}>Connector Error: {activeConnectorError}.</p>}
                    {!activeConnectorError && !isWaitingForTransaction && activeConnectorType && !activeConnector && (
                        <p>
                            <i>Loading connector...</i>
                        </p>
                    )}
                    {!activeConnection && !isWaitingForTransaction && activeConnectorType && activeConnector && (
                        <p>
                            <button style={ButtonStyle} type="button" onClick={connect}>
                                {isActiveConnectorWaitingForUser && 'Connecting...'}
                                {!isActiveConnectorWaitingForUser &&
                                    activeConnectorType === 'BrowserWallet' &&
                                    'Connect Browser Wallet'}
                                {!isActiveConnectorWaitingForUser &&
                                    activeConnectorType === 'WalletConnect' &&
                                    'Connect Mobile Wallet'}
                            </button>
                        </p>
                    )}
                    {activeConnectedAccount && (
                        <>
                            <div className="text">Connected to</div>
                            <button
                                className="link"
                                type="button"
                                onClick={() => {
                                    window.open(
                                        `https://testnet.ccdscan.io/?dcount=1&dentity=account&daddress=${activeConnectedAccount}`,
                                        '_blank',
                                        'noopener,noreferrer'
                                    );
                                }}
                            >
                                {activeConnectedAccount}
                            </button>
                            <br />
                            <br />
                            <div className="containerSpaceBetween">
                                <button
                                    style={
                                        activeConnectedAccount === undefined || isRegisterFilePage === false
                                            ? ButtonStyleDisabled
                                            : ButtonStyle
                                    }
                                    type="button"
                                    disabled={activeConnectedAccount === undefined}
                                    onClick={() => {
                                        setIsRegisterFilePage(true);
                                    }}
                                >
                                    Register File Hash
                                </button>
                                <Switch
                                    onChange={() => setIsRegisterFilePage(!isRegisterFilePage)}
                                    onColor="#979797"
                                    offColor="#979797"
                                    onHandleColor="#308274"
                                    offHandleColor="#308274"
                                    checked={!isRegisterFilePage}
                                    checkedIcon={false}
                                    uncheckedIcon={false}
                                />
                                <button
                                    style={
                                        activeConnectedAccount === undefined || isRegisterFilePage === true
                                            ? ButtonStyleDisabled
                                            : ButtonStyle
                                    }
                                    type="button"
                                    disabled={activeConnectedAccount === undefined}
                                    onClick={() => {
                                        setIsRegisterFilePage(false);
                                    }}
                                >
                                    Display File Hash Record
                                </button>
                            </div>
                        </>
                    )}
                    {activeConnectionGenesisHash && activeConnectionGenesisHash !== network.genesisHash && (
                        <p style={{ color: 'red' }}>
                            Unexpected genesis hash: Please ensure that your wallet is connected to network{' '}
                            <code>{network.name}</code>.
                        </p>
                    )}
                </div>

                <label>
                    {activeConnectedAccount !== undefined && (
                        <>
                            <p style={{ marginBottom: 0 }}>Upload a file:</p>
                            <input
                                className="input"
                                style={InputFieldStyle}
                                type="file"
                                onChange={changeHandler}
                                ref={file}
                            />
                            <button
                                style={ButtonStyle}
                                type="button"
                                onClick={async () => {
                                    if (selectedFile !== undefined) {
                                        const arrayBuffer = await selectedFile.arrayBuffer();
                                        const byteArray = new Uint8Array(arrayBuffer as ArrayBuffer);
                                        const newFileHash = sha256(byteArray.toString(), { asBytes: true });
                                        setFileHash(newFileHash.toString());
                                    } else {
                                        alert('Choose a file before uploading');
                                    }
                                }}
                            >
                                Upload File
                            </button>
                            <p style={{ marginBottom: 0 }}>File hash of uploaded file:</p>
                            <div className="loadingText">{fileHash}</div>
                            <br />
                        </>
                    )}
                    {!activeConnection ? (
                        <button style={ButtonStyleDisabled} type="button" disabled>
                            Waiting for connection...
                        </button>
                    ) : (
                        <button
                            style={
                                activeConnectedAccount === undefined || fileHash === 'None'
                                    ? ButtonStyleDisabled
                                    : ButtonStyle
                            }
                            type="button"
                            disabled={activeConnectedAccount === undefined || fileHash === 'None'}
                            onClick={() => {
                                if (activeConnection && activeConnectedAccount) {
                                    setHash('');
                                    setTransactionError('');
                                    setWaitingForUser(true);
                                    const tx = (isRegisterFilePage ? register : register)(
                                        activeConnection,
                                        activeConnectedAccount,
                                        fileHash,
                                        E_SEALING_CONTRACT_INDEX,
                                        CONTRACT_SUB_INDEX
                                    );
                                    tx.then(setHash)
                                        .catch((err) => setTransactionError((err as Error).message))
                                        .finally(() => setWaitingForUser(false));
                                }
                            }}
                        >
                            {isRegisterFilePage ? 'Register File Hash' : 'Display File Hash Record'}
                        </button>
                    )}
                </label>
                {activeConnection && (
                    <p>
                        {isRegisterFilePage ? (
                            <div>Transaction status{hash === '' ? '' : ' (May take a moment to finalize)'}</div>
                        ) : (
                            <div>On-chain Record: {hash === '' ? '' : ' (May take a moment to finalize)'}</div>
                        )}
                        {!hash && transactionError && <div style={{ color: 'red' }}>Error: {transactionError}.</div>}
                        {!hash && !transactionError && <div className="loadingText">None</div>}
                        {hash && (
                            <>
                                <button
                                    className="link"
                                    type="button"
                                    onClick={() => {
                                        window.open(
                                            `https://testnet.ccdscan.io/?dcount=1&dentity=transaction&dhash=${hash}`,
                                            '_blank',
                                            'noopener,noreferrer'
                                        );
                                    }}
                                >
                                    {hash}
                                </button>
                                <br />
                            </>
                        )}
                    </p>
                )}
            </div>
        </>
    );
}
