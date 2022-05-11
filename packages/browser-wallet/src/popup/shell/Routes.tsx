import React, { useEffect, useRef } from 'react';
import { Route, Routes as ReactRoutes, useLocation, useNavigate } from 'react-router-dom';
import { ExtensionMessageHandler, EventType, createEventTypeFilter } from '@concordium/browser-wallet-message-hub';

import { absoluteRoutes, relativeRoutes } from '@popup/constants/routes';
import MainLayout from '@popup/page-layouts/MainLayout';
import FullscreenPromptLayout from '@popup/page-layouts/FullscreenPromptLayout';
import Account from '@popup/pages/Account';
import SignMessage from '@popup/pages/SignMessage';
import SendTransaction from '@popup/pages/SendTransaction';
import Setup from '@popup/pages/Setup';
import ConnectionRequest from '@popup/pages/ConnectionRequest';
import { popupMessageHandler } from '@popup/shared/message-handler';

function useEventRoute<R>(eventType: EventType, route: string) {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const eventResponseRef = useRef<(response: R) => void>();
    const handleResponse = (response: R) => {
        eventResponseRef.current?.(response);
    };

    useEffect(() => {
        const handleEvent: ExtensionMessageHandler = (msg, _sender, respond) => {
            // TODO resolve route based on incoming message.
            eventResponseRef.current = (res) => {
                eventResponseRef.current = undefined;
                respond(res);
                navigate(-1);
            };

            const replace = pathname === route;
            navigate(route, { state: msg, replace });

            return true;
        };

        const unsub = popupMessageHandler.handleMessage(createEventTypeFilter(eventType), handleEvent);

        // Let bg script now that I'm ready to handle requests.
        popupMessageHandler.sendInternalEvent(EventType.PopupReady);

        return unsub;
    }, [pathname]);

    return handleResponse;
}

export default function Routes() {
    const handleConnectionResponse = useEventRoute<boolean>(EventType.Connect, absoluteRoutes.connectionRequest.path);
    const handleSendTransactionResponse = useEventRoute<void>(
        EventType.SendTransaction,
        absoluteRoutes.sendTransaction.path
    );

    useEffect(() => {
        popupMessageHandler.sendInternalEvent(EventType.PopupReady);
    }, []);

    return (
        <ReactRoutes>
            <Route path={relativeRoutes.home.path} element={<MainLayout />}>
                <Route index element={<Account />} />
            </Route>
            <Route element={<FullscreenPromptLayout />}>
                <Route path={relativeRoutes.signMessage.path} element={<SignMessage />} />
                <Route
                    path={relativeRoutes.sendTransaction.path}
                    element={<SendTransaction onSubmit={handleSendTransactionResponse} />}
                />
                <Route
                    path={relativeRoutes.connectionRequest.path}
                    element={
                        <ConnectionRequest
                            onAllow={() => handleConnectionResponse(true)}
                            onReject={() => handleConnectionResponse(false)}
                        />
                    }
                />
            </Route>
            <Route path={relativeRoutes.setup.path} element={<Setup />} />
        </ReactRoutes>
    );
}
