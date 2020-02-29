export default {
    admin: {
        target: {'credentials:role': 'admin'},
        apply: 'deny-overrides',
        rules: [
            {
                effect: 'permit'
            }
        ]
    },
    product_admin: {
        target: {'credentials:role': 'product_admin'},
        apply: 'deny-overrides',
        rules: [
            {
                effect: 'permit'
            }
        ]
    }
};
