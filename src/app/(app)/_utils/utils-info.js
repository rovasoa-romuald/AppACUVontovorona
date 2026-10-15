export const statusOptions = [
    { value: 'to_be_delivered', label: 'A envoyer vers le destinataire' },
    { value: 'contacted', label: 'Destinataire contacté' },
    { value: 'printed', label: 'Enveloppe imprimée' },
    { value: 'delivered', label: 'Livré au destinataire' },
    { value: 'money_ok', label: 'Argent OK' },
    { value: 'lost', label: 'Perdu' },
    { value: 'not_reachable', label: 'Téléphone injoignable' },
    { value: 'invalid_phone', label: 'Numéro téléphone invalide' },
];

export const meanDeliveryOptions = [
    { value: 'one_to_one', label: 'A la main' },
    { value: 'email', label: 'Par email' },
];

export const paymentMethodOptions = [
    { value: 'mobile_money', label: 'Mobile money' },
    { value: 'cash', label: 'Cash' },
];
