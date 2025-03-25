// Initialisierung von Stripe mit minimaler Caching-Einstellung
const stripePromise = loadStripe('your_publishable_key', {
  betas: ['payment_intent_beta_3'],
  apiVersion: '2020-08-27',
  stripeAccount: 'your_account', // falls anwendbar
  locale: 'auto',
  // Reduziere Caching
  disableHostedCheckout: false, 
  // Reduziere sessionStorage-Nutzung
  disableCookies: true  
}); 