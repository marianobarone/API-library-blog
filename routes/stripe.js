// const express = require('express');

const stripeRouter = require('express').Router();
const stripe = require('stripe')('sk_test_51Mp5ZnLxXZ2dcM1tDkJFnQRY4nPjDp4GfDQrhEIbWsoTkVfeMJlG1nSGux8458HKP0onktA1wHgOmdLIfql5IErA00Q7m08ggK')

// const dataSales = require('../data/usersDB')

stripeRouter.get('/', async (request, response) => {
    try {
        const products = await stripe.prices.list({
            expand: ['data.product'],
        })
        response.status(200).send(products);
    } catch (error) {
        response.status(404).send(error);
    }
})

stripeRouter.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        shipping_address_collection: { allowed_countries: ['US', 'CA', 'ES'] },
        shipping_options: [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: { amount: 10, currency: 'eur' },
                    display_name: 'Free shipping',
                    delivery_estimate: {
                        minimum: { unit: 'business_day', value: 5 },
                        maximum: { unit: 'business_day', value: 7 },
                    },
                },
            },
        ],
        line_items: [
            {
                price_data: { currency: 'eur', product_data: { name: 'T-shirt' }, unit_amount: 2000 },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'https://example.com/success',
        cancel_url: 'http://localhost:3000/#shop',
        // const session = await stripe.checkout.sessions.create({

        //     shipping_address_collection: { allowed_countries: ['US', 'CA'] },
        //     shipping_options: [
        //         {
        //             shipping_rate_data: {
        //                 type: 'fixed_amount',
        //                 fixed_amount: { amount: 0, currency: 'usd' },
        //                 display_name: 'Free shipping',
        //                 delivery_estimate: {
        //                     minimum: { unit: 'business_day', value: 5 },
        //                     maximum: { unit: 'business_day', value: 7 },
        //                 },
        //             },
        //         },
        //     ],
        //     line_items: [
        //         {
        //             price_data: {
        //                 currency: 'eur',
        //                 product_data: {
        //                     name: 'T-shirt',
        //                 },
        //                 unit_amount: 2000,
        //             },
        //             quantity: 1,
        //         },
        //     ],
        //     mode: 'payment',
        //     success_url: 'http://localhost:4242/success',
        //     cancel_url: 'http://localhost:4242/cancel',
    });
    // console.log(session.url);
    res.send({ url: session.url });
});

module.exports = stripeRouter;