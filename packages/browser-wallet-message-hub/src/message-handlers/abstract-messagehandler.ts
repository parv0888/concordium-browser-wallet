/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-syntax */
import { v4 as uuidv4 } from 'uuid';
import EventEmitter from 'eventemitter3';
import { filterMarkerGuid, Message } from './message';
import { logger } from './logger';
import { HandlerTypeEnum } from './handlertype-enum';
import { MessageTypeEnum } from './messagetype-enum';

export interface Subscription {
    id: string;
    messageType: MessageTypeEnum;
}
/**
 * Abstract class for message handlers
 */
export abstract class AbstractMessageHandler extends EventEmitter {
    // Map of all registered event handlers
    protected mapOfEventHandlers: Map<
        MessageTypeEnum,
        Map<string, (payload: any, respond: (payload: any) => void, metadata?: chrome.runtime.MessageSender) => void>
    > = new Map<
        MessageTypeEnum,
        Map<string, (payload: any, respond: (payload: any) => void, metadata?: chrome.runtime.MessageSender) => void>
    >();

    // Only in play if inheritor wants to be a conversation starter vs being a "listener,responder".
    private publisherPort$?: chrome.runtime.Port;

    protected constructor(protected me: HandlerTypeEnum) {
        super();
    }

    // Event listener for port messages
    protected async onPortMessage(message: Message, port: chrome.runtime.Port): Promise<void> {
        logger.log('::PortMessage received');
        if (this.canHandleMessage(message)) {
            await this.handlePortMessageCore(message, port);
        }
    }

    // Event listener for window messages
    protected async onWindowPostMessage(event: MessageEvent<Message>): Promise<void> {
        if (this.canHandleMessage(event.data)) {
            await this.handleWindowPostMessageCore(event.data);
        }
    }

    private onPublisherPortDisconnect() {
        if (this.publisherPort$) {
            this.publisherPort$.onDisconnect.removeListener(this.onPublisherPortDisconnect.bind(this));
            this.publisherPort$ = undefined;
        }

        // Create a new Port
        this.createPortAndSetupEventListeners();
    }

    // Protected
    protected get publisherPort(): chrome.runtime.Port {
        if (!this.publisherPort$) {
            throw new Error('MessageHandler has not been configured as Port publisher initiator');
        }

        return this.publisherPort$;
    }

    protected canHandleMessage(message: Message): boolean {
        // Get rid of messages received from other websites or extensions
        if (message?.ccFilterMarker !== filterMarkerGuid) {
            // Ignore the message it doesnt seem to be a Concordium message
            return false;
        }

        // Handlers are not expected to act on messages sent by themselves
        if (message.from === this.me) {
            return false;
        }

        // This is a Concordium message, ask inheritors if are interesting int the message
        return this.canHandleMessageCore(message);
    }

    /**
     * Adds event listener for window.postmessages
     * @protected
     */
    protected addWindowPostMessageEventListener() {
        window.addEventListener('message', this.onWindowPostMessage.bind(this));
    }

    /**
     * Creates a runtime port and configures event listeners
     * @protected
     */
    protected createPortAndSetupEventListeners(): void {
        this.publisherPort$ = chrome.runtime.connect({ name: uuidv4() });
        this.publisherPort$.onDisconnect.addListener(this.onPublisherPortDisconnect.bind(this));
        this.publisherPort$.onMessage.addListener(this.onPortMessage.bind(this));
    }

    // Template method operations to be implemented by all inheritors.

    /**
     * Implemented by all inheritors which determines what messages they are interested in.
     * @param message
     * @protected
     */
    protected abstract canHandleMessageCore(message: Message): boolean;

    /**
     * Implemented by inheritors who are interested in messages sent using window.postMessage
     * @param message
     * @protected
     */
    protected abstract handleWindowPostMessageCore(message: Message): Promise<void>;

    /**
     * Implemented by inheritors who are interested in mesages sent using chrome.runtime.sendMessage.
     * @param message
     * @param port - The port through which the message arrived
     * @protected
     */
    protected abstract handlePortMessageCore(message: Message, port: chrome.runtime.Port): Promise<void>;

    /**
     * Adds event handler for the specified messageType
     * @param messageType - The message type to listen for
     * @param eventHandler - The event handler that gets executed when the given message arrives
     */
    public subscribe(
        messageType: MessageTypeEnum,
        eventHandler: (payload: any, respond: (payload: any) => void, metadata?: chrome.runtime.MessageSender) => void
    ): Subscription {
        let eventHandlers = this.mapOfEventHandlers.get(messageType);
        if (eventHandlers === undefined) {
            eventHandlers = new Map<
                string,
                (payload: any, respond: (payload: any) => void, metadata?: chrome.runtime.MessageSender) => void
            >();
            this.mapOfEventHandlers.set(messageType, eventHandlers);
        }

        // Add eventHandler and return subscription
        const subscription: Subscription = { id: uuidv4(), messageType };
        eventHandlers.set(subscription.id, eventHandler);

        return subscription;
    }

    /**
     * Removes event handler from map of event handlers for the given subscription
     * @param subscription
     */
    public unsubscribe(subscription: Subscription): void {
        const handlers = this.mapOfEventHandlers.get(subscription.messageType);

        if (handlers !== undefined) {
            if (handlers.get(subscription.id) !== undefined) {
                handlers.delete(subscription.id);
                logger.log(
                    `successfully delete message handler with subscriptionId ${subscription.id}, and MessageType: ${subscription.messageType}`
                );
            }
        } else {
            logger.log(
                `Could not find message handler with subscriptionId ${subscription.id}, and MessageType: ${subscription.messageType} in Handler map`
            );
        }
    }

    /**
     * Implemented by inheritors who exposes functionality for publishing messages.
     * @param message
     * @protected
     */
    // public abstract publishMessage(message: Message): void;
}
