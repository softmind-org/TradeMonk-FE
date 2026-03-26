import * as Yup from 'yup'

/**
 * Product Validation Schema
 * Matches backend enum requirements
 */
export const productValidationSchema = Yup.object({
    cardName: Yup.string().required('Card Name is required'),
    gameCategory: Yup.string().required('Game Category is required'),
    setName: Yup.string().required('Set Name is required'),
    setNumber: Yup.string().required('Set Number is required'),
    rarity: Yup.string().required('Rarity is required'),
    condition: Yup.string().required('Condition is required'),
    price: Yup.number().positive('Price must be positive').required('Price is required'),
    quantity: Yup.number().integer().min(1, 'Quantity must be at least 1').required('Quantity is required'),
    description: Yup.string(),
})

/**
 * Form Field Configurations
 */
export const PRODUCT_FORM_FIELDS = {
    LEFT_COLUMN: [
        {
            name: 'cardName',
            label: 'Card Name',
            placeholder: 'e.g. Charizard VMAX',
            type: 'input'
        },
        {
            name: 'setName',
            label: 'Set Name',
            placeholder: 'e.g. Shining Fates',
            type: 'input',
            gridSpan: 1
        },
        {
            name: 'setNumber',
            label: 'Set Number',
            placeholder: 'POK-001',
            type: 'input',
            gridSpan: 1
        },
        {
            name: 'condition',
            label: 'Condition',
            type: 'select',
            options: [
                { label: 'Mint (M)', value: 'MINT' },
                { label: 'Near Mint (NM)', value: 'NM' },
                { label: 'Lightly Played (LP)', value: 'LP' },
                { label: 'Moderately Played (MP)', value: 'MP' },
                { label: 'Heavily Played (HP)', value: 'HP' },
                { label: 'Damaged (DMG)', value: 'DMG' }
            ]
        }
    ],
    RIGHT_COLUMN: [
        {
            name: 'gameCategory',
            label: 'Game Category',
            type: 'select',
            options: [] // To be populated dynamically
        },
        {
            name: 'rarity',
            label: 'Rarity',
            type: 'select',
            options: [
                { label: 'Common', value: 'COMMON' },
                { label: 'Uncommon', value: 'UNCOMMON' },
                { label: 'Rare', value: 'RARE' },
                { label: 'Holo Rare', value: 'HOLO RARE' },
                { label: 'Ultra Rare', value: 'ULTRA RARE' },
                { label: 'Secret Rare', value: 'SECRET RARE' }
            ]
        },
        {
            name: 'price',
            label: 'Price (€)',
            placeholder: '0.00',
            type: 'number',
            gridSpan: 1
        },
        {
            name: 'quantity',
            label: 'Quantity',
            placeholder: '1',
            type: 'number',
            gridSpan: 1
        }
    ]
}
