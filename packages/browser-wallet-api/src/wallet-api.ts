import {
    HandlerTypeEnum,
    InjectedMessageHandler,
    Message,
    MessageTypeEnum,
} from '@concordium/browser-wallet-message-hub';
import { EventEmitter } from 'eventemitter3';
import { logger } from '@concordium/browser-wallet-message-hub/src/message-handlers/logger';
import { Payload } from '@concordium/browser-wallet-message-hub/src/message-handlers/types';
import { PromiseInfo } from './promiseInfo';

export interface IWalletApi {
    sendTransaction(): Promise<string>;
    signMessage(): Promise<Message>;
    getAccounts(): Promise<Message>;
}

class WalletApi extends EventEmitter implements IWalletApi {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly promises: Map<string, PromiseInfo<any>> = new Map<string, PromiseInfo<any>>();

    public constructor(private injectedMessageHandler: InjectedMessageHandler) {
        super();

        // Listens for events raised by InjectedScript
        this.injectedMessageHandler.on('message', this.resolvePromiseOrFireEvent.bind(this));
    }

    private resolvePromiseOrFireEvent(message: Message): void {
        const promiseInfo = this.promises.get(message.correlationId);
        if (message.messageType !== MessageTypeEnum.Event) {
            if (!promiseInfo) {
                throw Error('Message received without corresponding PromiseInfo');
            }

            this.promises.delete(message.correlationId);

            promiseInfo.resolver(message.payload);
        } else {
            // Raise event
            this.emit('event', message.payload);
        }
    }

    private sendMessage<T>(messageType: MessageTypeEnum, payload: Payload): Promise<T> {
        logger.log(`Sending message ${messageType}, Payload: ${JSON.stringify(payload)}`);

        return new Promise((resolver, reject) => {
            // publish the message to the wallet extension
            const { correlationId } = this.injectedMessageHandler.publishMessage(
                HandlerTypeEnum.PopupScript,
                messageType,
                payload
            );
            this.promises.set(correlationId, { resolver, reject });
        });
    }

    /**
     * Sends a sign request to the Concordium Wallet and awaits the users action
     */
    public signMessage(): Promise<Message> {
        return this.sendMessage(MessageTypeEnum.SignMessage, {});
    }

    /**
     * Requests list of accounts from the current connected network
     */
    public getAccounts(): Promise<Message> {
        return this.sendMessage(MessageTypeEnum.GetAccounts, {});
    }

    /**
     * Sends a transaction to the Concordium Wallet and awaits the users action
     */
    public sendTransaction(): Promise<string> {
        return this.sendMessage<string>(MessageTypeEnum.SendTransaction, {});
    }
}

export const walletApi = new WalletApi(new InjectedMessageHandler());
