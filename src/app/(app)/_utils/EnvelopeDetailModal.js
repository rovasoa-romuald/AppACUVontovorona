'use client';

import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { Fragment, useState } from 'react';
import EnvelopeForm from './EnvelopeForm';
import SmsSenderForm from './SmsSenderForm';
import TemplateSmsList from '../template-sms/TemplateSmsList';

export default function ElderInfoModal({
    isOpen = false,
    onClose,
    envelope,
    isReadOnly = false,
    statusOptions,
    meanDeliveryOptions,
    paymentMethodOptions,
}) {
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const handleSelectTemplate = template => {
        setSelectedTemplate(template);
    };
    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={onClose}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-yellow-700/25" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95">
                                <DialogPanel className="w-full max-w-6xl p-6 overflow-hidden text-left align-middle transition-all transform shadow-xl bg-sky-50 rounded-2xl">
                                    <DialogTitle
                                        as="h3"
                                        className="text-lg font-bold leading-6 text-blue-900">
                                        Modification des informations de
                                        l'enveloppe
                                    </DialogTitle>
                                    <div className="max-h-screen mt-2 overflow-auto">
                                        <EnvelopeForm
                                            {...envelope}
                                            onUpdatedSuccessfully={onClose}
                                            onSkip={onClose}
                                            isReadOnly={isReadOnly}
                                            skipText="Annuler"
                                            statusOptions={statusOptions}
                                            meanDeliveryOptions={
                                                meanDeliveryOptions
                                            }
                                            paymentMethodOptions={
                                                paymentMethodOptions
                                            }
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3">
                                        <div className="max-h-full md:col-span-2">
                                            <SmsSenderForm
                                                receiver={
                                                    envelope.recipient_phone
                                                }
                                                toUserId={envelope.recipient_id}
                                                content={
                                                    selectedTemplate?.content
                                                }
                                                templateId={
                                                    selectedTemplate?.id
                                                }
                                            />
                                        </div>
                                        <div className="overflow-auto max-h-96">
                                            <TemplateSmsList
                                                handleSelectTemplate={
                                                    handleSelectTemplate
                                                }
                                                selectedTemplate={
                                                    selectedTemplate
                                                }
                                            />
                                        </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
