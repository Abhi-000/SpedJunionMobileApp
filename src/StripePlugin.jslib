mergeInto(LibraryManager.library, {
    InitializeStripe: function(publishableKey) {
        var script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.onload = function() {
            window.stripe = Stripe(UTF8ToString(publishableKey));
        };
        document.head.appendChild(script);
    },

    CreatePaymentSession: function(priceId, successUrl, cancelUrl) {
        fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priceId: UTF8ToString(priceId),
                successUrl: UTF8ToString(successUrl),
                cancelUrl: UTF8ToString(cancelUrl),
            }),
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(session) {
            return window.stripe.redirectToCheckout({ sessionId: session.id });
        })
        .then(function(result) {
            if (result.error) {
                alert(result.error.message);
            }
        })
        .catch(function(error) {
            console.error('Error:', error);
        });
    },
});
